const NoteBook = require("../../../models/notebook");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateNoteBook = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { user, class: classId } = req.body;
    let updateData = { user, class: classId };
  
    const notebook = await NoteBook.findById(id);
  
    if (!notebook) {
      return next(new AppError('No NoteBook found with that ID', 404));
    }
  
    if (req.files.image) {
      // Delete the old image file if it exists
      if (notebook.image) {
        await deleteOldFiles(notebook.image).catch((err) => {
          console.error('Failed to delete image:', err);
        });
      }
      const image = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
      updateData.image = image;
    }
  
    const updatedNoteBook = await NoteBook.findByIdAndUpdate(id, updateData, { new: true });
  
    res.status(200).json({
      status: true,
      message: 'NoteBook updated successfully.',
      data: {
        notebook: updatedNoteBook,
      },
    });
  });