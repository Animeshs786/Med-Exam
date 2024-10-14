const Class = require("../../../models/class");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllClasses = catchAsync(async (req, res) => {
  const {
    course,
    page: currentPage,
    limit: currentLimit,
    search,
    subject,
    startDate,
    endDate,
  } = req.query;
  const filterObj = {};
  if (course) filterObj.course = course;
  if (search) filterObj.title = { $regex: search, $options: "i" };
  if (subject) filterObj.subject = subject;
  if (startDate) {
    filterObj.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    filterObj.createdAt = { $lte: new Date(endDate) };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    Class,
    null,
    filterObj
  );
  const classes = await Class.find(filterObj)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    totalResult,
    totalPage,
    results: classes.length,
    data: {
      classes,
    },
  });
});
