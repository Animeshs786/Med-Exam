const mongoose = require("mongoose");

const testTimeSchema = new mongoose.Schema({
  testTime: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mockTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MockTest",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TestTime = mongoose.model("TestTime", testTimeSchema);
module.exports = TestTime;
