const Note = require("../../../models/notes");
const NoteSubject = require("../../../models/notesSubject");
const Transaction = require("../../../models/transaction");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllNotes = catchAsync(async (req, res,next) => {
  const { search, exam, type, course } = req.query;
  const userId = req.user._id;
  if(!course) return next(new AppError("Please provide a course", 400));

  const filter = { course };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (exam) {
    filter.exam = { $in: exam };
  }

  if (type === "Premium") {
    filter.isPremium = true;
  }
  if (type === "Free") {
    filter.isPremium = false;
  }

  const notes = await Note.find(filter);

  const coursePromises = notes.map(async (note) => {
    const transaction = await Transaction.findOne({
      user: userId,
      item: note._id,
      onModel: "Note",
      orderStatus: "success",
    });

    const practiceSetCount = await NoteSubject.countDocuments({
      note: note._id,
    });

    return {
      ...note.toObject(),
      isPurchased: !!transaction,
      practiceSet: practiceSetCount,
    };
  });

  const notesWithPurchaseInfo = await Promise.all(coursePromises);

  res.status(200).json({
    status: true,
    results: notesWithPurchaseInfo.length,
    message: "notes retrieved successfully",
    data: {
      notes: notesWithPurchaseInfo,
    },
  });
});
