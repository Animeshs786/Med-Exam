const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllTransaction = catchAsync(async (req, res) => {
  const { page: currentPage, limit: currentLimit } = req.query;
  const filterObj = {};

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    Transaction,
    null,
    filterObj
  );
  const transaction = await Transaction.find()
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
