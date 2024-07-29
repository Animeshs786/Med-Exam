const Transaction = require("../../../models/transaction");
const Course = require("../../../models/course"); // Adjust based on your course model
const catchAsync = require("../../../utils/catchAsync");

exports.getPurchaseCourse = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const transactions = await Transaction.find({
    user: userId,
    onModel: "Course",
    orderStatus: "success",
  });

  const purchasedCourseIds = transactions.map(
    (transaction) => transaction.item
  );

  const purchasedCourses = await Course.find({
    _id: { $in: purchasedCourseIds },
  }).select("name thumbImage logo");

  res.status(200).json({
    status: true,
    results: purchasedCourses.length,
    message: "Purchased courses retrieved successfully",
    data: {
      courses: purchasedCourses,
    },
  });
});
