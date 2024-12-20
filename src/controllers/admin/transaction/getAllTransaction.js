const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllTransaction = catchAsync(async (req, res) => {
  const {
    page: currentPage,
    limit: currentLimit,
    startDate,
    endDate,
    orederStatus,
    user,
  } = req.query;
  const filterObj = {};

  // Add date range filtering if startDate or endDate are provided
  if (startDate || endDate) {
    filterObj.createdAt = {};
    if (startDate) {
      filterObj.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filterObj.createdAt.$lte = new Date(endDate);
    }
  }

  if (orederStatus) {
    filterObj.orderStatus = orederStatus;
  }

  if (user) {
    filterObj.user = user;
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    Transaction,
    null,
    filterObj
  );
  const transaction = await Transaction.find(filterObj)
    .populate("user onModel")
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: true,
    totalResult,
    totalPage,
    results: transaction.length,
    data: {
      transaction,
    },
  });
});
