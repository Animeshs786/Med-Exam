const Note = require("../../../models/notes");
const NoteSubject = require("../../../models/notesSubject");
const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");


exports.getRecommendedNotes = catchAsync(async (req, res) => {
  const userExam = req.user.exam;
  const userId = req.user._id;

  // Find notes recommended for the user's exams
  let recommendedNotes = await Note.find({
    exam: { $in: userExam },
  });

  // Fetch practice set count for each note
  const noteIds = recommendedNotes.map(note => note._id);
  const practiceSetCounts = await NoteSubject.aggregate([
    { $match: { note: { $in: noteIds } } },
    { $group: { _id: "$note", count: { $sum: 1 } } }
  ]);

  // Map practice set counts to notes
  const practiceSetCountMap = {};
  practiceSetCounts.forEach(item => {
    practiceSetCountMap[item._id] = item.count;
  });

  // Fetch transactions for the user
  const transactions = await Transaction.find({
    user: userId,
    item: { $in: noteIds },
    onModel: "Note",
    orderStatus: "success",
  });

  // Map purchased notes
  const purchasedNotes = transactions.map(transaction => transaction.item.toString());

  // Modify recommendedNotes to include practiceSet and isPurchased
  recommendedNotes = recommendedNotes.map(note => ({
    ...note.toObject(),
    practiceSet: practiceSetCountMap[note._id] || 0,
    isPurchased: purchasedNotes.includes(note._id.toString()),
  }));

  res.status(200).json({
    status: true,
    results: recommendedNotes.length,
    message: "Recommended notes retrieved successfully",
    data: {
      notes: recommendedNotes,
    },
  });
});
