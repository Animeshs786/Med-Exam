const MockTest = require("../../../models/mockTest");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllMockTests = catchAsync(async (req, res) => {
  const {
    testSeries,
    testType,
    search,
    page: currentPage,
    limit: currentLimit,
    startDate,
    endDate,
    exam,
    subjcet,
  } = req.query;

  let query = {};

  if (testSeries) query.testSeries = testSeries;
  if (testType) query.testType = testType;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (exam) {
    query.exam = exam;
  }
  if (subjcet) {
    query.subject = subjcet;
  }

  if (startDate) {
    query.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    query.createdAt = { $lte: new Date(endDate) };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    MockTest,
    null,
    query
  );

  const mockTests = await MockTest.find(query)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    totalPage,
    totalResult,
    results: mockTests.length,
    data: {
      mockTests,
    },
  });
});
