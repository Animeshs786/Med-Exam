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

  let courses;
  if (type === "Popular") {
    courses = await Course.find(filter)
      .select(
        "name price duration rating ratingNumber thumbImage lesson logo slug"
      )
      .sort({ purchaseNumber: -1 });
  } else {
    await Course.find(filter).select(
      "name price duration rating ratingNumber thumbImage lesson logo slug"
    );
  }

  const coursePromises = courses.map(async (course) => {
    const transaction = await Transaction.findOne({
      user: userId,
      item: course._id,
      onModel: "Course",
      orderStatus: "success",
    });

    return {
      ...course.toObject(),
      isPurchased: !!transaction,
    };
  });

  const coursesWithPurchaseInfo = await Promise.all(coursePromises);

  res.status(200).json({
    status: true,
    results: coursesWithPurchaseInfo.length,
    message: "Courses retrieved successfully",
    data: {
      courses: coursesWithPurchaseInfo,
    },
  });
});
