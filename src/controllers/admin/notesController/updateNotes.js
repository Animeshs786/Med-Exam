const Note = require("../../../models/notes");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateNote = catchAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new AppError("Note not found", 404));
  }

  let thumbImage;
  let bannerImage;

  if (req.files && req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
    if (note.thumbImage) {
      await deleteOldFiles(note.thumbImage).catch((err) =>
        console.error("Failed to delete thumb image", err)
      );
    }
  }
  if (req.files && req.files?.bannerImage) {
    bannerImage = `${req.files.bannerImage[0].destination}/${req.files.bannerImage[0].filename}`;
    if (note.bannerImage) {
      await deleteOldFiles(note.bannerImage).catch((err) =>
        console.error("Failed to delete banner image", err)
      );
    }
  }

  const { name, price, exam, subHeading,detail,description,course } = req.body;
  const updatedData = {};

  if (name) updatedData.name = name;
  if (price) updatedData.price = price;
  if (exam) updatedData.exam = JSON.parse(exam);
  if (detail) updatedData.detail = JSON.parse(detail);
  if (thumbImage) updatedData.thumbImage = thumbImage;
  if (bannerImage) updatedData.bannerImage = bannerImage;
  if (description) updatedData.description = description;
  if (subHeading) updatedData.subHeading = subHeading;
  if (course) updatedData.course = course;

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    message: "Note updated successfully",
    data: {
      note: updatedNote,
    },
  });
});
