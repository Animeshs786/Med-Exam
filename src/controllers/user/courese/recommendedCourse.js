const Course = require("../../../models/course");
const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");

exports.getRecommendedCourses = catchAsync(async (req, res) => {
  const { courseId } = req.query;
  const userId = req.user._id;
  const userExam = req.user.exam;

  const recommendedCoursesSet = new Set();
  let combinedRecommendedCourses = [];

  const queryType = req.query.type || "id";
  let course;

  // Fetch purchased courses for the user
  const purchasedCourses = await Transaction.find({
    user: userId,
    onModel: "Course",
    orderStatus: "success",
  }).select("item");

  // Get the IDs of purchased courses
  const purchasedCourseIds = purchasedCourses.map(
    (transaction) => transaction.item
  );

  if (courseId) {
    if (queryType === "slug") {
      course = await Course.findOne({ slug: courseId });
    } else {
      course = await Course.findById(courseId);
    }

    if (!course) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }

    const examIds = course.exam.map((exam) => exam._id);

    let recommendedCoursesByExam = await Course.find({
      _id: { $ne: course._id, $nin: purchasedCourseIds },
      exam: { $in: examIds },
    }).select("name price duration rating ratingNumber thumbImage lesson logo");

    recommendedCoursesByExam.forEach((course) => {
      if (!recommendedCoursesSet.has(course._id.toString())) {
        recommendedCoursesSet.add(course._id.toString());
        combinedRecommendedCourses.push(course);
      }
    });
  } else {
    combinedRecommendedCourses = await Course.find({
      exam: { $in: userExam },
      _id: { $nin: purchasedCourseIds },
    }).select("name price duration rating ratingNumber thumbImage lesson logo");
  }

  res.status(200).json({
    status: true,
    results: combinedRecommendedCourses.length,
    message: "Recommended courses retrieved successfully",
    data: {
      courses: combinedRecommendedCourses,
    },
  });
});
