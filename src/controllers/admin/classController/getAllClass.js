const Class = require("../../../models/class");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllClasses = catchAsync(async (req, res) => {
  const { course, page: currentPage, limit: currentLimit, search,subject } = req.query;
  const filterObj = {};
  if (course) filterObj.course = course;
  if (search) filterObj.title = { $regex: search, $options: "i" };
  if (subject) filterObj.subject = subject;

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
