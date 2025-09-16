const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = {};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 5 * 60 * 1000; 

    otpStore[email] = { otp, expiresAt };

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: "Your OTP for Expense Manager",
      text: `Your OTP is: ${otp}\n\nThis OTP is valid for 5 minutes.`,
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: "OTP sent! Please check your inbox or spam folder.",
    });
  } catch (error) {
    console.error("OTP Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};


const verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpData = otpStore[email];

    if (!otpData) {
      return res.status(400).json({ success: false, message: "OTP expired or not sent" });
    }

    if (Date.now() > otpData.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (parseInt(otp) === otpData.otp) {
      delete otpStore[email];
      return res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      return res.status(400).json({ success: false, message: "Wrong OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };