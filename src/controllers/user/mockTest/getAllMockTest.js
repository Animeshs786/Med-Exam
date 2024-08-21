const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllMockTest = catchAsync(async (req, res, next) => {
  const { testSeries, testType, search,subject } = req.query;
  if (!testSeries) return next(new AppError("Please provide test series", 400));
  if (!testType) return next(new AppError("Please provide test type", 400));

  let query = {};
  if (testSeries) query.testSeries = testSeries;
  if (testType) query.testType = testType;
  if (subject) query.subject = subject;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const mockTests = await MockTest.find(query).select(
    "name thumbImage minute isPaid language"
  );

  res.status(200).json({
    status: true,
    results: mockTests.length,
    data: {
      mockTests,
    },
  });
});
