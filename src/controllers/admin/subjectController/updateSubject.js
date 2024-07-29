const Subject = require("../../../models/subject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateSubject = catchAsync(async (req, res, next) => {
  let newThumbImage;
  if (req.files?.thumbImage) {
    newThumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  const { id } = req.params;
  const { name, status, slug } = req.body;

  const existingSubject = await Subject.findById(id);

  if (slug && slug !== existingSubject.slug) {
    const existingSlug = await Subject.findOne({ slug });
    if (existingSlug) {
      return next(new AppError("Slug already exists", 400));
    }
  }

  if (newThumbImage && existingSubject.thumbImage) {
    await deleteOldFiles(existingSubject.thumbImage);
  }

  const updatedSubject = await Subject.findByIdAndUpdate(
    id,
    {
      name,
      status,
      slug,
      thumbImage: newThumbImage ? newThumbImage : existingSubject.thumbImage,
    },
    { new: true, runValidators: true }
  );

  if (!updatedSubject) {
    return next(new AppError("No subject found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "Subject updated successfully",
    data: {
      subject: updatedSubject,
    },
  });
});
