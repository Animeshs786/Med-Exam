const catchAsync = require("../../../utils/catchAsync");
const TestTime = require("../../../models/testTime");

exports.setTestTime = catchAsync(async (req, res) => {
  const { mockTest, totalTime } = req.body;

  const userId = req.user._id;

  const modifyTotalTime = totalTime.split(":")[0];
  let testTime = await TestTime.findOne({ user: userId, mockTest });
  if (!testTime) {
    await TestTime.create({
      testTime: +modifyTotalTime,
      user: userId,
      mockTest,
    });
  } else {
    testTime.testTime = +modifyTotalTime;
    await testTime.save();
  }

  res.status(201).json({
    status: true,
    message: "Test time submitted successfully",
  });
});
