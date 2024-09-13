const catchAsync = require("../../../utils/catchAsync");
const AttemptTest = require("../../../models/attemtTest");

exports.clearTest = catchAsync(async (req, res) => {
  const { mockTest, question } = req.body;

  const userId = req.user._id;

  await AttemptTest.findOneAndDelete({
    mockTest,
    userId,
    question,
  });

  res.status(201).json({
    status: true,
    message: "Remove successfully",
  });
});
