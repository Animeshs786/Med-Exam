const Course = require("../../../models/course");
const Transaction = require("../../../models/transaction");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getCourse = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const queryType = req.query.type || "id"; 
  let course;

  if (queryType === "slug") {
    course = await Course.findOne({ slug: req.params.id }).populate(
      "exam", "name"
    );
  } else {
    course = await Course.findById(req.params.id).populate(
      "exam", "name"
    );
  }

  if (!course) {
    return next(new AppError("No course found with that ID or Slug", 404));
  }

  const transaction = await Transaction.findOne({
    user: userId,
    item: course._id,
    onModel: "Course",
    orderStatus: "success",
  });

  const courseWithPurchaseInfo = {
    ...course.toObject(),
    isPurchased: !!transaction,
  };

  res.status(200).json({
    status: true,
    message: "Course retrieved successfully",
    data: {
      course: courseWithPurchaseInfo,
    },
  });
});
