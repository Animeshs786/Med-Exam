const Transaction = require("../../../models/transaction");
const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");

exports.getPurchaseNotes = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const transactions = await Transaction.find({
    user: userId,
    onModel: "Note",
    orderStatus: "success",
  });

  const noteIds = transactions.map((transaction) => transaction.item);

  const purchasedNotes = await Note.find({ _id: { $in: noteIds } });

  res.status(200).json({
    status: true,
    results: purchasedNotes.length,
    message: "Purchased notes retrieved successfully",
    data: {
      notes: purchasedNotes,
    },
  });
});
