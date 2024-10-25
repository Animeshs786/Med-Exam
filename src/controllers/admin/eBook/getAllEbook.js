const eBook = require("../../../models/eBook");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllEBooks = catchAsync(async (req, res) => {
  const {
    search,
    page: currentPage,
    limit: currentLimit,
    startDate,
    endDate,
  } = req.query;

  let query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
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
    eBook,
    null,
    query
  );

  const eBooks = await eBook
    .find()
    .populate("exam", "name")
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    results: eBooks.length,
    totalResult,
    totalPage,
    page: currentPage || 1,
    data: { eBooks },
  });
});
