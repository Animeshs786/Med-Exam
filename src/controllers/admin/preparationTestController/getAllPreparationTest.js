const PreparationTest = require("../../../models/preparationTest");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllPreparationTest = catchAsync(async (req, res) => {
  const {
    course,
    testType,
    search,
    page: currentPage,
    limit: currentLimit,
    startDate,
    endDate,
    exam,
    subject,
  } = req.query;

  let query = {};

  if (course) query.course = course;
  if (testType) query.testType = testType;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (startDate) {
    query.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    query.createdAt = { $lte: new Date(endDate) };
  }
  if (exam) {
    query.exam = exam;
  }
  if (subject) {
    query.subject = subject;
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    PreparationTest,
    null,
    query
  );
  const preparationTest = await PreparationTest.find(query)
    .select("name thumbImage minute")
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    results: preparationTest.length,
    totalPage,
    totalResult,
    data: {
      preparationTest,
    },
  });
});
