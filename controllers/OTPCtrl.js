const nodemailer = require("nodemailer");
const otpStore = {}; // In-memory store, replace with DB in production

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Expense Manager",
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("OTP Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP
const verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otpStore[email]) return res.status(400).json({ success: false, message: "OTP expired or not sent" });

    if (parseInt(otp) === otpStore[email]) {
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
