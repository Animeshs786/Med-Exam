const MockTest = require("../../../models/mockTest");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllMockTests = catchAsync(async (req, res) => {
  const { testSeries, testType, search } = req.query;
  let query = {};
  if (testSeries) query.testSeries = testSeries;
  if (testType) query.testType = testType;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const mockTests = await MockTest.find(query)

  res.status(200).json({
    status: true,
    results: mockTests.length,
    data: {
      mockTests,
    },
  });
});
