const Exam = require("../../../models/exam");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createExam = catchAsync(async (req, res, next) => {
  const { name, slug } = req.body;
  const obj = { name };
  let thumbImage;

  if (!slug) {
    return next(new AppError("Slug is required", 400));
  }

  const existingSlug = await Exam.findOne({ slug });

  if (existingSlug) {
    return next(new AppError("Slug already exists", 400));
  }
  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
    obj.thumbImage = thumbImage;
  }

  obj.slug = slug;

  const newExam = await Exam.create(obj);

  res.status(201).json({
    status: true,
    message: "Exam created successfully.",
    data: {
      exam: newExam
    },
  });
});
