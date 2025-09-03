const mongoose = require('mongoose');
const colors = require('colors');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${mongoose.connection.host}`.bgCyan.white);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`.bgRed);
  }
};


module.exports = connectDb;
