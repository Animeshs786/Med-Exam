const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllTransaction = catchAsync(async (req, res) => {
  const transaction = await Transaction.find().populate("user onModel");

  res.status(200).json({
    status: true,
    results: transaction.length,
    data: {
      transaction,
    },
  });
});
