const ChatMessage = require("../../../models/chatMessage");
const catchAsync = require("../../../utils/catchAsync");

exports.getClassMessages = catchAsync(async (req, res) => {
  const { classId } = req.params;

  const messages = await ChatMessage.find({ classId })
    .populate("userId", "name profileImage")
    // .sort({ createdAt: -1 });

  res.status(200).json({
    status: true,
    data: {
      messages,
    },
  });
});
