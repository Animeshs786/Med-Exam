const Exam = require("../../../models/exam");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllExam = catchAsync(async (req, res) => {
  const {
    search,
    page: currentPage,
    limit: currentLimit,
    startDate,
    endDate,
  } = req.query;

  let query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
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
    Exam,
    null,
    query
  );
  const exams = await Exam.find(query)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    results: exams.length,
    totalResult,
    totalPage,
    page: currentPage || 1,
    data: {
      exams,
    },
  });
});
