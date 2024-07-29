const Banner = require("../../../models/banner");
const Note = require("../../../models/notes");
const NoteSubject = require("../../../models/notesSubject");
const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");

exports.notesApi = catchAsync(async (req, res) => {
  const { search, exam, type } = req.query;
  const userExam = req.user.exam;
  const userId = req.user._id;

  // Fetch Note Banner
  const noteBanner = await Banner.find({ type: "Notes" });

  // Fetch All Notes
  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (exam) filter.exam = { $in: exam };
  if (type === "Premium") filter.isPremium = true;
  if (type === "Free") filter.isPremium = false;

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

  // Fetch Top Notes
  const topNotes = await Note.find({ topNotes: true }).select("logo name");

  // Fetch Recommended Notes
  let recommendedNotes = await Note.find({
    exam: { $in: userExam },
  });

  const noteIds = recommendedNotes.map((note) => note._id);
  const practiceSetCounts = await NoteSubject.aggregate([
    { $match: { note: { $in: noteIds } } },
    { $group: { _id: "$note", count: { $sum: 1 } } },
  ]);

  const practiceSetCountMap = {};
  practiceSetCounts.forEach((item) => {
    practiceSetCountMap[item._id] = item.count;
  });

  const transactions = await Transaction.find({
    user: userId,
    item: { $in: noteIds },
    onModel: "Note",
    orderStatus: "success",
  });

  const purchasedNotes = transactions.map((transaction) =>
    transaction.item.toString()
  );

  recommendedNotes = recommendedNotes.map((note) => ({
    ...note.toObject(),
    practiceSet: practiceSetCountMap[note._id] || 0,
    isPurchased: purchasedNotes.includes(note._id.toString()),
  }));

  res.status(200).json({
    status: true,
    message: "Data fetched successfully",
    data: {
      noteBanner,
      notes: notesWithPurchaseInfo,
      topNotes,
      recommendedNotes,
    },
  });
});
