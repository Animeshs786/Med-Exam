const Class = require("../../../models/class");
const Course = require("../../../models/course");
const catchAsync = require("../../../utils/catchAsync");

exports.getCourseSubject = catchAsync(async (req, res) => {
  const { id } = req.query;
  const queryType = req.query.type || "id";
  const userId = req.user._id;
  let course;

  if (queryType === "slug") {
    course = await Course.findOne({ slug: id });
  } else {
    course = await Course.findById(id);
  }

  if (!course) {
    return res.status(404).json({
      status: false,
      message: "Course not found",
    });
  }

  const classes = await Class.find({ course: course._id })
    .populate("subject", "name thumbImage")
    .populate("watchBy", "_id");

  const subjectMap = new Map();

  classes.forEach((cls) => {
    if (cls.subject) {
      const subjectId = cls.subject._id.toString();
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          _id: cls.subject._id,
          name: cls.subject.name,
          thumbImage: cls.subject.thumbImage || "",
          totalClasses: 0,
          watchedClassesCount: 0,
        });
      }
      const subjectData = subjectMap.get(subjectId);
      subjectData.totalClasses += 1;
      subjectData.watchedClassesCount += cls.watchBy.some((user) =>
        user._id.equals(userId)
      )
        ? 1
        : 0;
    }
  });

  const subjects = Array.from(subjectMap.values());

  res.status(200).json({
    status: true,
    results: subjects?.length,
    message: "Course subjects fetched successfully",
    data: {
      subject: subjects,
    },
  });
});
