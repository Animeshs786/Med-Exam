const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");

exports.getMyPurchase = catchAsync(async (req, res) => {
  const user = req.user._id;

  const transactions = await Transaction.find({
    user,
    orderStatus: "success",
  }).populate({
    path: "item",
    select:"name"
    // populate: {
    //   path: "Course MockTest Note TestSeries PreviousPaper",
    //   select: "field1 field2",
    // },
  });

  res.status(200).json({
    status: true,
    message: "Transactions fetched successfully",
    data: { transactions },
  });
});
