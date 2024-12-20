const mongoose = require("mongoose");

const transactionScheama = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "onModel",
  },
  onModel: {
    type: String,
    required: true,
    enum: {
      values: ["Course"],
      message: " Value not supported.",
    },
  },
  price: {
    type: Number,
    default: 0,
  },
  orderId: String,
  paymentId: String,
  orderStatus: {
    type: String,
    default: "pending",
  },
  createAt: { type: Date, default: Date.now },
  expiryAt: {
    type: Date,
  },
});

const Transaction = mongoose.model("Transaction", transactionScheama);
module.exports = Transaction;

//this is
