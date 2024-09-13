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

  let attemptTest = await AttemptTest.findOne({
    mockTest,
    userId,
    question,
  });

  if (attemptTest) {
    attemptTest.givenAnswerIndex = givenAnswerIndex;
    attemptTest.isSubmitted = isSubmitted;
    attemptTest.isMarkedForReview = isMarkedForReview;
    attemptTest.timeTaken = timeTaken;
    attemptTest.questionLanguage = questionLanguage;
    attemptTest.accessQuestion =
      questionData?.queGivenTime > timeTaken ? true : false;
    await attemptTest.save();
  } else {
    attemptTest = await AttemptTest.create({
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
  }
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
    message: "Test submitted successfully",
    data: {
      attemptTest,
    },
  });
});
