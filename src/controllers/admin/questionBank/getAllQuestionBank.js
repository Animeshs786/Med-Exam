const QuestionBank = require("../../../models/questionBank");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllQuestionBank = catchAsync(async (req, res, next) => {
  const {
    page: currentPage,
    limit: currentLimit,
    search,
    subject,
    exam,
  } = req.query;
  const filterObj = {};

  if (search) filterObj.name = { $regex: search, $options: "i" };
  if (subject) filterObj.subject = subject;
  if (exam) filterObj.exam = exam;

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    QuestionBank,
    null,
    filterObj
  );

  const questionBank = await QuestionBank.find(filterObj)
    .populate("subject", "name")
    .populate("exam", "name")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  if (!questionBank) {
    return next(new AppError("No Question Bank found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    totalResult,
    totalPage,
    data: {
      questionBank,
    },
  });
});
