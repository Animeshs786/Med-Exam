const TestSeries = require("../../../models/testSeries");
const Transaction = require("../../../models/transaction"); // Assuming the path is correct
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getTestSeries = catchAsync(async (req, res, next) => {
  const testSeries = await TestSeries.findById(req.params.id);

  if (!testSeries) {
    return next(new AppError("No test series found with that ID", 404));
  }

  const transaction = await Transaction.findOne({
    user: req.user._id, 
    item: testSeries._id,
    onModel: "TestSeries",
    orderStatus: "success",
  });

  const isPurchased = !!transaction; 

  res.status(200).json({
    status: true,
    message: "Test Series fetched successfully",
    data: {
      testSeries,
      isPurchased, 
    },
  });
});
