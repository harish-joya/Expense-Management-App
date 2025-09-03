const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userid:{
      type:String,
      required:true
    },
    amount: {
      type: Number,
      required: [true, "Ammount is required"],
    },
    type:{
      type:String,
      required:[true, 'Type is required']
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    discription: {
      type: String,
      required: [true, "discription is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("Transaction", transactionSchema);
module.exports = transactionModel;