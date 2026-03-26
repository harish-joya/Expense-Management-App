// const userModel = require("../models/userModel");

// const login = async (req, res) => {
//   try {
//     const { email, username, password } = req.body;
    
//     const user = await userModel.findOne({ 
//       $or: [{ email }, { username }], 
//       password 
//     });

//     if (!user) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Wrong Password or Email" 
//       });
//     }



//     res.status(200).json({
//       success: true,
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

// const register = async (req, res) => {
//   try {
//     console.log("Register request body:", req.body);
//     const newUser = new userModel(req.body);
//     await newUser.save();
//     res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       newUser
//     });
//   } catch (error) {
//     console.error("Register error:", error.message); 
//     res.status(400).json({
//       success: false,
//       error: error.message, 
//     });
//   }
// };


// module.exports = {
//   login,
//   register,
// };

const userModel = require("../models/userModel")
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body
    
    // Find user by email or username
    const user = await userModel.findOne({ 
      $or: [{ email }, { username }]
    })

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "User not found" 
      })
    }

    // Compare provided password with hashed password
    const isPasswordValid = await user.comparePassword(password)
    
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid password" 
      })
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}

const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body)
    
    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    })
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists"
      })
    }
    
    const newUser = new userModel(req.body)
    await newUser.save()
    
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error) {
    console.error("Register error:", error.message)
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists"
      })
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message)
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      })
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password request received:", req.body);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await userModel.findOne({ email });
    
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: "If your email exists in our system, you will receive a password reset link"
      });
    }

    // Use the built-in crypto module directly
    const crypto = require('crypto');
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log("Generated reset token:", resetToken);
    
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token expiration (1 hour)
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Use the same SendGrid setup as your OTP system
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY); // This should be the same as OTP

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL, // This should be the same as OTP
        subject: 'Password Reset Request - Expense Manager',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #be123c;">Password Reset Request</h2>
            <p>You requested to reset your password for your Expense Manager account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #be123c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">Expense Manager Team</p>
          </div>
        `,
      };

      await sgMail.send(msg);
      console.log('Password reset email sent to:', email);

      res.status(200).json({
        success: true,
        message: "Password reset email sent. Please check your inbox."
      });

    } catch (emailError) {
      console.error("Email sending error:", emailError);
      
      // Check if it's an authentication error (invalid API key)
      if (emailError.response && emailError.response.body && emailError.response.body.errors) {
        console.error("SendGrid errors:", emailError.response.body.errors);
      }
      
      // Even if email fails, we'll still respond successfully (for security)
      // But we'll log the token for development purposes
      console.log('DEV: Password reset token (email failed):', resetToken);
      
      res.status(200).json({
        success: true,
        message: "If your email exists in our system, you will receive a password reset link",
        // Remove this in production - only for development when email fails
        devToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });
    }
    
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }

    // Use the built-in crypto module directly
    const crypto = require('crypto');
    
    // Hash token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword
};