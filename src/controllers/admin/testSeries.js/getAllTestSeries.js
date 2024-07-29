const TestSeries = require("../../../models/testSeries");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllTestSeries = catchAsync(async (req, res) => {
  const testSeries = await TestSeries.find();

  res.status(200).json({
    status: true,
    results: testSeries.length,
    message: "Test Series fetched successfully",
    data: {
        testSeries,
    },
  });
});
