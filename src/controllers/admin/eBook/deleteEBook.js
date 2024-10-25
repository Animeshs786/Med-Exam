const eBook = require("../../../models/eBook");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteEBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    const eBookToDelete = await eBook.findById(id);
    if (!eBookToDelete) {
      return next(new AppError("eBook not found", 404));
    }

    if (eBookToDelete.coverImage) {
      await deleteOldFiles(eBookToDelete.coverImage);
    }
    if (eBookToDelete.file) {
      await deleteOldFiles(eBookToDelete.file);
    }

    await eBook.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "eBook deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
});
