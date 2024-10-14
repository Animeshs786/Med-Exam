const TestSeries = require("../../../models/testSeries");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllTestSeries = catchAsync(async (req, res) => {
  const {
    search,
    exam,
    startDate,
    endDate,
    page: currentPage,
    limit: currentLimit,
    course,
  } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (course) {
    filter.course = course;
  }

  if (exam) {
    filter.exam = { $in: exam };
  }

  if (startDate) {
    filter.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    filter.createdAt = { $lte: new Date(endDate) };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    TestSeries,
    null,
    filter
  );
  const testSeries = await TestSeries.find(filter)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    results: testSeries.length,
    totalPage,
    totalResult,
    message: "Test Series fetched successfully",
    data: {
      testSeries,
    },
  });
});
