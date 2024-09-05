const QuestionImage = require("../../../models/questionImage");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllQuestionImages = catchAsync(async (req, res) => {
  const { page: currentPage, limit: currentLimit, search } = req.query;
  const filterObj = {};

  if (search) filterObj.name = { $regex: search, $options: "i" };

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    QuestionImage,
    null,
    filterObj
  );
  const questionImages = await QuestionImage.find(filterObj)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    results: questionImages.length,
    totalResult,
    totalPage,
    data: {
      questionImages,
    },
  });
});
