const Class = require("../../../models/class");
const Course = require("../../../models/course");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const extractVideoId = require("../../../utils/extractVideoId");

exports.updateClass = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    type,
    url,
    schedule,
    course,
    duration,
    subject,
    classEnd,
    mentor,
    slug,
  } = req.body;

  if (course) {
    const courseData = await Course.findById(course);
    if (!courseData) {
      return next(new AppError("Course not found", 404));
    }
  }

  let thumbnailUrl = "";
  if (url) {
    const videoId = extractVideoId(url);
    if (!videoId) {
      return next(new AppError("Invalid YouTube URL", 400));
    }
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  const updateObj = {};
  if (req.files?.thumbImage) {
    updateObj.thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  if (req.files?.pdf) {
    updateObj.pdf = `${req.files.pdf[0].destination}/${req.files.pdf[0].filename}`;
  }

  const existingClass = await Class.findById(id);

  if (slug && slug !== existingClass.slug) {
    const existingSlug = await Class.findOne({ slug });
    if (existingSlug) {
      return next(new AppError("Slug already exists", 400));
    }
    updateObj.slug = slug;
  }

  if (title) updateObj.title = title;
  if (type) updateObj.type = type;
  if (url) updateObj.url = url;
  if (schedule) updateObj.schedule = schedule;
  if (course) updateObj.course = course;
  if (mentor) updateObj.mentor = mentor;
  if (thumbnailUrl) updateObj.thumbnailUrl = thumbnailUrl;
  if (duration) updateObj.duration = duration;
  if (subject) updateObj.subject = subject;
  if (classEnd) updateObj.classEnd = classEnd;
  if (mentor) updateObj.mentor = mentor;

  const updatedClass = await Class.findByIdAndUpdate(id, updateObj, {
    new: true,
    runValidators: true,
  });

  if (!updatedClass) {
    return next(new AppError("Class not found", 404));
  }

  res.status(200).json({
    status: true,
    message: "Class updated successfully",
    data: {
      class: updatedClass,
    },
  });
});
