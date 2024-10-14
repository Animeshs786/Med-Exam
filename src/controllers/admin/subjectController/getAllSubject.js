const Subject = require("../../../models/subject");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllSubject = catchAsync(async (req, res) => {
  const {
    search,
    page: currentPage,
    limit: currentLimit,
    startDate,
    endDate,
  } = req.query;
  let subjects;

  const filter = {};

  if (startDate) {
    filter.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    filter.createdAt = { $lte: new Date(endDate) };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    Subject,
    null,
    filter
  );

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  subjects = await Subject.find(filter)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    totalPage,
    totalResult,
    results: subjects.length,
    data: {
      subjects,
    },
  });
});
