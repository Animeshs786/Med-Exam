const Subject = require("../../../models/subject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createSubject = catchAsync(async (req, res, next) => {
  let thumbImage;
  if (req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  const { name, slug } = req.body;

  if (!slug) {
    return next(new AppError("Slug is required", 400));
  }

  const existingSlug = await Subject.findOne({ slug });

  if (existingSlug) {
    return next(new AppError("Slug already exists", 400));
  }

  const newSubject = await Subject.create({
    name,
    slug,
    thumbImage,
  });

  res.status(201).json({
    status: true,
    message: "Subject created successfully",
    data: {
      subject: newSubject,
    },
  });
});
