const Course = require("../../../models/course");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllCourse = catchAsync(async (req, res) => {
  const {
    search,
    exam,
    type = "Premium",
    startDate,
    endDate,
    page: currentPage,
    limit: currentLimit,
  } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (exam) {
    filter.exam = { $in: exam };
  }

  if (type === "Premium") {
    filter.isPremium = true;
  }
  if (type === "Free") {
    filter.isPremium = false;
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
    Course,
    null,
    filter
  );

  const courses = await Course.find(filter)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    totalPage,
    totalResult,
    results: courses.length,
    data: {
      courses,
    },
  });
});
