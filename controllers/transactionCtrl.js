const transactionModel = require("../models/transactionModel")
const moment = require('moment')

const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type, userid } = req.body;
    let transactions;

    if (frequency === "all") {
      transactions = await transactionModel.find({
        userid,
        ...(type !== "all" && { type }),
      });
    } else if (frequency !== "custom") {
      transactions = await transactionModel.find({
        userid,
        date: {
          $gt: moment().subtract(Number(frequency), "d").toDate(),
        },
        ...(type !== "all" && { type }),
      });
    } else {
      transactions = await transactionModel.find({
        userid,
        date: {
          $gte: selectedDate[0],
          $lte: selectedDate[1],
        },
        ...(type !== "all" && { type }),
      });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


const addTransaction = async(req,res) => {
    try {
        const newTransaction = new transactionModel(req.body)
        await newTransaction.save()
        res.status(201).send("Transaction Created")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
const editTransaction = async(req,res) => {
    try {
        await transactionModel.findOneAndUpdate({_id:req.body.transactionId},req.body.payload)
        res.status(200).send("Edit Successfully")
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const deleteTransaction = async (req, res) => {
  try {
    await transactionModel.findOneAndDelete({ _id: req.body.transactionId });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

module.exports = {addTransaction, getAllTransaction,  editTransaction, deleteTransaction}