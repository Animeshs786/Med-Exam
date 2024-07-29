const Course = require("../../../models/course");
const Review = require("../../../models/review");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteReview = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const { courseId } = req.params;

  if (!user || !courseId) {
    return next(new AppError("User and Course ID are required.", 400));
  }

  const review = await Review.findOneAndDelete({ user, course: courseId });

  if (!review) {
    return next(new AppError("Review not found.", 404));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found.", 404));
  }

  const reviews = await Review.find({ course: courseId });
  const ratingNumber = reviews.length;
  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
  const ratingAverage = ratingNumber > 0 ? ratingSum / ratingNumber : 0;

  course.rating = ratingAverage;
  course.ratingNumber = ratingNumber;
  await course.save();

  return res.status(200).json({
    status: true,
    message: "Review deleted successfully.",
  });
});
