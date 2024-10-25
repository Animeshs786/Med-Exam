const eBook = require("../../../models/eBook");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateEBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let newCoverImage;
  let newFile;

  if (req.files?.coverImage) {
    newCoverImage = `${req.files.coverImage[0].destination}/${req.files.coverImage[0].filename}`;
  }
  if (req.files?.file) {
    newFile = `${req.files.file[0].destination}/${req.files.file[0].filename}`;
  }

  try {
    const { title, exam, link } = req.body;
    const eBookData = {};

    if (title) eBookData.title = title;
    if (exam) eBookData.exam = exam;
    if (link) eBookData.link = link;

    const existingEBook = await eBook.findById(id);
    if (!existingEBook) {
      if (newCoverImage) await deleteOldFiles(newCoverImage);
      if (newFile) await deleteOldFiles(newFile);
      return next(new AppError("eBook not found", 404));
    }

    if (newCoverImage && existingEBook.coverImage) {
      await deleteOldFiles(existingEBook.coverImage);
      eBookData.coverImage = newCoverImage;
    }

    if (newFile && existingEBook.file) {
      await deleteOldFiles(existingEBook.file);
      eBookData.file = newFile;
    }

    const updatedEBook = await eBook.findByIdAndUpdate(id, eBookData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      message: "eBook updated successfully",
      data: { eBook: updatedEBook },
    });
  } catch (error) {
    if (newCoverImage) await deleteOldFiles(newCoverImage);
    if (newFile) await deleteOldFiles(newFile);
    return next(error);
  }
});
