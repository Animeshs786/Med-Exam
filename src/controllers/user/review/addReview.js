const Course = require("../../../models/course");
const Review = require("../../../models/review");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.addReview = catchAsync(async (req, res, next) => {
  const user = req.user._id;
  const { course, rating, review } = req.body;

  if (!user || !course || !rating) {
    return next(new AppError(" User, Courese, Rating are required.", 400));
  }
  const courseData = await Course.findById(course);

  if (!courseData) return next(new AppError("Course not found.", 404));

  let existingReview = await Review.findOne({ user, course });
  let newReview;

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.review = review;
    existingReview.createdAt = Date.now();
    await existingReview.save();
  } else {
    newReview = new Review({
      user,
      course,
      rating,
      review,
    });
    await newReview.save();
  }

  const reviews = await Review.find({ course });
  const ratingNumber = reviews.length;
  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
  const ratingAverage = ratingNumber > 0 ? ratingSum / ratingNumber : 0;

  courseData.rating = ratingAverage;
  courseData.ratingNumber = ratingNumber;
  await courseData.save();

  const responseReview = existingReview ? existingReview : newReview;

  return res.status(existingReview ? 200 : 201).json({
    status: true,
    message: existingReview
      ? "Review updated successfully."
      : "Review added successfully.",
    data: responseReview,
  });
});
