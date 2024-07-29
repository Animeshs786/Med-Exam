const Course = require("../../../models/course");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllCourse = catchAsync(async (req, res) => {
  const { search, exam, type } = req.query;
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
  if (type === "Free") {
    filter.isPremium = false;
  }

  const courses = await Course.find(filter).populate(
    "classes"
  );

  res.status(200).json({
    status: true,
    results: courses.length,
    data: {
      courses,
    },
  });
});
