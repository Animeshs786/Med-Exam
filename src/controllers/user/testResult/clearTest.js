const catchAsync = require("../../../utils/catchAsync");
const AttemptTest = require("../../../models/attemtTest");

exports.clearTest = catchAsync(async (req, res) => {
  const { mockTest, question, questionBank, preparationTest, customQueBank } =
    req.body;

  const userId = req.user._id;

  const filterObj = {
    userId,
    question,
  };

  if (mockTest) {
    filterObj.mockTest = mockTest;
  }

  if (questionBank) {
    filterObj.questionBank = questionBank;
  }

  if (preparationTest) {
    filterObj.preparationTest = preparationTest;
  }

  if (customQueBank) {
    filterObj.customQueBank = customQueBank;
  }

  await AttemptTest.findOneAndDelete(filterObj);

  res.status(201).json({
    status: true,
    message: "Remove successfully",
  });
});
