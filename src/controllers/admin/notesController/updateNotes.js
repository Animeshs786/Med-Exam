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
  let logo;

  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
    if (note.thumbImage) {
      await deleteOldFiles(note.thumbImage).catch((err) =>
        console.error("Failed to delete thumb image", err)
      );
    }
  }

  if (req.files.logo) {
    logo = `${req.files.logo[0].destination}/${req.files.logo[0].filename}`;
    if (note.logo) {
      await deleteOldFiles(note.logo).catch((err) =>
        console.error("Failed to delete logo", err)
      );
    }
  }

  const {
    name,
    description,
    price,
    isPremium,
    topNotes,
    exam,
    language,
    detail,
  } = req.body;
  const updatedData = {};

  if (name) updatedData.name = name;
  if (description) updatedData.description = description;
  if (price) updatedData.price = price;
  if (isPremium) updatedData.isPremium = isPremium;
  if (topNotes) updatedData.topNotes = topNotes;
  if (exam) updatedData.exam = JSON.parse(exam);
  if (language) updatedData.language = JSON.parse(language);
  if (detail) updatedData.detail = JSON.parse(detail);
  if (thumbImage) updatedData.thumbImage = thumbImage;
  if (logo) updatedData.logo = logo;

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
