const userModel = require("../models/userModel");

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    const user = await userModel.findOne({ 
      $or: [{ email }, { username }], 
      password 
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Registration successful",
      newUser
    });
  } catch (error) {
    console.error("Register error:", error.message); 
    res.status(400).json({
      success: false,
      error: error.message, 
    });
  }
};


module.exports = {
  login,
  register,
};
