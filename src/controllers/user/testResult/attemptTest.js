const catchAsync = require("../../../utils/catchAsync");
const AttemptTest = require("../../../models/attemtTest");
const Question = require("../../../models/question");
const TestTime = require("../../../models/testTime");

exports.attemptTest = catchAsync(async (req, res) => {
  const {
    mockTest,
    timeTaken,
    givenAnswerIndex,
    questionLanguage,
    question,
    type,
    totalTime,
  } = req.body;
  const isSubmitted = type === "Submit" ? true : false;
  const isMarkedForReview = type === "Mark" ? true : false;
  const userId = req.user._id;

  const questionData = await Question.findById(question);

  const attemptTest = await AttemptTest.create({
    mockTest,
    userId,
    timeTaken,
    givenAnswerIndex,
    isSubmitted,
    isMarkedForReview,
    questionLanguage,
    question,
    accessQuestion: questionData?.queGivenTime > timeTaken ? true : false,
  });

  let testTime = await TestTime.findOne({ user: userId, mockTest });
  if (!testTime) {
    await TestTime.create({
      testTime: totalTime,
      user: userId,
      mockTest,
    });
  } else {
    testTime.time = totalTime;
    await testTime.save();
  }

  res.status(201).json({
    status: true,
    message: "Test submitted successfully",
    data: {
      attemptTest,
    },
  });
});
