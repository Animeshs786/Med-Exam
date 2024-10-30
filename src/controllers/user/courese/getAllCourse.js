const Course = require("../../../models/course");
const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllCourse = catchAsync(async (req, res) => {
  const { search, exam, type } = req.query;
  const userId = req.user._id;
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

  const purchasedCourses = await Transaction.find({
    user: userId,
    onModel: "Course",
    orderStatus: "success",
    expiryAt: { $gt: new Date() },
  }).select("item");

  const purchasedCourseIds = purchasedCourses.map(
    (transaction) => transaction.item
  );

  filter._id = { $nin: purchasedCourseIds };

  let courses;
  if (type === "Popular") {
    courses = await Course.find(filter)
      .select(
        "name price duration rating ratingNumber thumbImage lesson logo slug subHeading bannerImage"
      )
      .sort({ purchaseNumber: -1 });
  } else {
    courses = await Course.find(filter).select(
      "name price duration rating ratingNumber thumbImage lesson logo slug subHeading bannerImage"
    );
  }

  res.status(200).json({
    status: true,
    results: courses.length,
    message: "Courses retrieved successfully",
    data: {
      courses,
    },
  });
});
