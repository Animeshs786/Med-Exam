const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllUsers = catchAsync(async (req, res) => {
  const {
    page: currentPage,
    limit: currentLimit,
    name,
    startDate,
    endDate,
    exam,
  } = req.query;
  const filterObj = {};

  if (name) {
    filterObj.name = { $regex: name, $options: "i" };
  }

  if (startDate || endDate) {
    filterObj.createdAt = {};
    if (startDate) {
      filterObj.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filterObj.createdAt.$lte = new Date(endDate);
    }
  }
  if (exam) {
    filterObj.exam = exam;
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    User,
    null,
    filterObj
  );

  const users = await User.find(filterObj)
    .sort("-createdAt")
    .populate("exam", "name")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    totalResult,
    totalPage,
    results: users.length,
    data: {
      users,
    },
  });
});
