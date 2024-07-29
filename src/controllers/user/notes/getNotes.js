const Note = require("../../../models/notes");
const NoteSubject = require("../../../models/notesSubject");
const Transaction = require("../../../models/transaction");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getNote = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new AppError("No note found with that ID", 404));
  }

  const transaction = await Transaction.findOne({
    user: userId,
    item: note._id,
    onModel: "Note",
    orderStatus: "success",
  });

  const practiceSetCount = await NoteSubject.countDocuments({ note: note._id });

  const noteWithPurchaseInfo = {
    ...note.toObject(),
    isPurchased: !!transaction,
    practiceSet: practiceSetCount,
  };

  res.status(200).json({
    status: true,
    message: "Note retrieved successfully",
    data: {
      note: noteWithPurchaseInfo,
    },
  });
});
