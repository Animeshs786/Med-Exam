const NoteBook = require("../../../models/notebook");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteNoteBook = catchAsync(async (req, res, next) => {
    const { id } = req.params;
  
    const notebook = await NoteBook.findByIdAndDelete(id);
  
    if (!notebook) {
      return next(new AppError('No NoteBook found with that ID', 404));
    }
  
    if (notebook.image) {
      await deleteOldFiles(notebook.image).catch((err) => {
        console.error('Failed to delete image:', err);
      });
    }
  
    res.status(200).json({
      status: true,
      message: 'NoteBook deleted successfully.',
    });
  });