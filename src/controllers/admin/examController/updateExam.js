const Exam = require("../../../models/exam");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateExam = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, status,slug } = req.body;
  let updateData = { name, status };

  const exam = await Exam.findById(id);

  if (!exam) {
    return next(new AppError("No exam found with that ID", 404));
  }

  if (req.files.thumbImage) {
    const oldImage = exam.thumbImage;
    updateData.thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;

    // Delete the old image file
    if (oldImage) {
      await deleteOldFiles(oldImage).catch((err) => {
        console.error("Failed to delete old image:", err);
      });
    }
  }

  if (slug && slug !== exam.slug) {
    const existingSlug = await Exam.findOne({ slug });
    if (existingSlug) {
      return next(new AppError("Slug already exists", 400));
    }
    updateData.slug = slug;
  }

  const updatedExam = await Exam.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    data: {
      exam: updatedExam,
    },
  });
});
