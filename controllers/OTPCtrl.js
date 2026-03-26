const nodemailer = require("nodemailer");

const otpStore = {};
const requestTracker = {}; 

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

    const currentTime = Date.now();

    if (!requestTracker[email]) {
      requestTracker[email] = {
        lastRequestTime: 0,
        count: 0,
      };
    }

    const userTracker = requestTracker[email];

    if (currentTime - userTracker.lastRequestTime < 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP",
      });
    }

    if (userTracker.count >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Try again later.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = currentTime + 5 * 60 * 1000;

    otpStore[email] = { otp, expiresAt };

    userTracker.lastRequestTime = currentTime;
    userTracker.count += 1;

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