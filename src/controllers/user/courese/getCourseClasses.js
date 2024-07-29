const Class = require("../../../models/class");
const Course = require("../../../models/course");
const Subject = require("../../../models/subject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getCourseClasses = catchAsync(async (req, res, next) => {
  const { course, subject } = req.query;
  const dataObj = { type: "Recorded" };
  const queryType = req.query.type || "id";
  let courseId;
  let subjectId;

  if (!course || !subject)
    return next(new AppError("Please provide course or subject", 400));

  if (queryType === "id") {
    courseId = course;
    subjectId = subject;
  }

  if (queryType === "slug") {
    if (course) {
      const courseData = await Course.findOne({ slug: course });
      courseId = courseData._id;
    }

    if (subject) {
      const subjectData = await Subject.findOne({ slug: subject });
      subjectId = subjectData._id;
    }
  }

  if (course) dataObj.course = courseId;
  if (subject) dataObj.subject = subjectId;

  const classes = await Class.find(dataObj);

  res.status(200).json({
    status: true,
    size: classes.length,
    message: "Classes fetched successfully",
    content: {
      data: classes,
    },
  });
});
