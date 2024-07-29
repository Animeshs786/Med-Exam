const Class = require("../../../models/class");
const Course = require("../../../models/course");
const Subject = require("../../../models/subject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const extractVideoId = require("../../../utils/extractVideoId");

exports.createClass = catchAsync(async (req, res, next) => {
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

  if (!slug) {
    return next(new AppError("Slug is required", 400));
  }

  const existingCourse = await Course.findById(course);
  if (!existingCourse) {
    return next(new AppError("Course not found", 404));
  }

  const existingSlug = await Class.findOne({ slug });

  if (existingSlug) {
    return next(new AppError("Slug already exists", 400));
  }

  const existingSubject = await Subject.findById(subject);
  if (!existingSubject) {
    return next(new AppError("Subject not found", 404));
  }

  let thumbnailUrl = "";
  let image;
  let pdf;

  if (req.files?.thumbImage) {
    image = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  if (req.files?.pdf) {
    pdf = `${req.files.pdf[0].destination}/${req.files.pdf[0].filename}`;
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return next(new AppError("Invalid YouTube URL", 400));
  }
  thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const newClass = await Class.create({
    title,
    type,
    url,
    schedule: schedule ? schedule : "",
    course,
    thumbnailUrl,
    thumbImage: image,
    duration,
    subject,
    classEnd: classEnd ? classEnd : "",
    pdf,
    mentor,
    slug,
  });

  res.status(201).json({
    status: true,
    message: "Class created successfully",
    data: {
      class: newClass,
    },
  });
});
