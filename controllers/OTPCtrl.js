const nodemailer = require("nodemailer");
const otpStore = {}; // temporary in-memory store for OTPs

// send OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    // Configure email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or any SMTP service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Expense Manager",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
};

// verify OTP
const verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otpStore[email]) return res.status(400).json({ success: false, message: "OTP expired or not sent" });

    if (parseInt(otp) === otpStore[email]) {
      delete otpStore[email]; // OTP verified
      return res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      return res.status(400).json({ success: false, message: "Wrong OTP" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };
