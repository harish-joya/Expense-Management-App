const nodemailer = require("nodemailer");

const otpStore = {};

// ✅ Brevo SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore[email] = { otp, expiresAt };

    const mailOptions = {
      from: `"Expense Manager" <expensemanager012@gmail.com>`,
      to: email,
      subject: "OTP for Expense Manager",
      html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    };

    console.log("Sending OTP to:", email);

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

const verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpData = otpStore[email];

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not sent",
      });
    }

    if (Date.now() > otpData.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (parseInt(otp) === otpData.otp) {
      delete otpStore[email];
      return res.status(200).json({
        success: true,
        message: "OTP verified",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Wrong OTP",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { sendOtp, verifyOtp };