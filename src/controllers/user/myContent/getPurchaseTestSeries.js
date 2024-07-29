const Transaction = require("../../../models/transaction");
const TestSeries = require("../../../models/testSeries");
const MockTest = require("../../../models/mockTest");
const TestResult = require("../../../models/testResult");
const catchAsync = require("../../../utils/catchAsync");

exports.getPurchaseTestSeries = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const transactions = await Transaction.find({
    user: userId,
    onModel: "TestSeries",
    orderStatus: "success",
  });

  const purchasedTestSeriesIds = transactions.map(
    (transaction) => transaction.item
  );

  const purchasedTestSeries = await TestSeries.find({
    _id: { $in: purchasedTestSeriesIds },
  });

  const purchasedTestSeriesWithDetails = await Promise.all(
    purchasedTestSeries.map(async (series) => {
      const totalMockTests = await MockTest.countDocuments({
        testSeries: series._id,
      });

      const userSubmittedTests = await TestResult.countDocuments({
        user: userId,
        mockTest: {
          $in: await MockTest.find({ testSeries: series._id }).distinct("_id"),
        },
      });

      return {
        ...series.toObject(),
        totalMockTests,
        userSubmittedTests,
      };
    })
  );

  res.status(200).json({
    status: true,
    results: purchasedTestSeriesWithDetails.length,
    message: "Purchased test series retrieved successfully",
    data: {
      testSeries: purchasedTestSeriesWithDetails,
    },
  });
});
