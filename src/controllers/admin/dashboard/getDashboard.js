const Transaction = require("../../../models/transaction");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

exports.getDashboard = catchAsync(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalUsers = await User.countDocuments();

  const todayUser = await User.countDocuments({
    createdAt: { $gte: startOfToday },
  });

  const totalPurchasedCount = await Transaction.countDocuments({
    orderStatus: "success",
  });

  const todayPurchasedCount = await Transaction.countDocuments({
    orderStatus: "success",
    createAt: { $gte: startOfToday },
  });

  const totalRevenue = await Transaction.aggregate([
    { $match: { orderStatus: "success" } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  const todayRevenue = await Transaction.aggregate([
    {
      $match: {
        orderStatus: "success",
        createAt: { $gte: startOfToday },
      },
    },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  res.status(200).json({
    status: true,
    message: "Admin dashboard data retrieved successfully",
    data: {
      totalUsers,
      todayUser,
      totalPurchasedCount,
      todayPurchasedCount,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      todayRevenue: todayRevenue.length > 0 ? todayRevenue[0].total : 0,
    },
  });
});

