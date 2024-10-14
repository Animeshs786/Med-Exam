const catchAsync = require("../../../utils/catchAsync");
const AttemptTest = require("../../../models/attemtTest");
const Question = require("../../../models/question");
const TestTime = require("../../../models/testTime");
const SubmittedAnswer = require("../../../models/submittedAnswer");

exports.attemptTest = catchAsync(async (req, res) => {
  const {
    mockTest,
    preparationTest,
    questionBank,
    customQueBank,
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
  const modifyTotalTime = totalTime.split(":")[0];

  const questionData = await Question.findById(question);

  const filterObj = {
    userId,
    question,
  };

  const testTimeFilterObj = { user: userId };

  const createObj = {
    userId,
    timeTaken,
    givenAnswerIndex,
    isSubmitted,
    isMarkedForReview,
    questionLanguage,
    question,
    accessQuestion: questionData?.queGivenTime > timeTaken ? true : false,
  };

  const testTimeCreateObj = {
    testTime: +modifyTotalTime,
    user: userId,
  };

  if (mockTest) {
    filterObj.mockTest = mockTest;
    createObj.mockTest = mockTest;
    testTimeFilterObj.mockTest = mockTest;
    testTimeCreateObj.mockTest = mockTest;
  }

  if (preparationTest) {
    filterObj.preparationTest = preparationTest;
    createObj.preparationTest = preparationTest;
    testTimeFilterObj.preparationTest = preparationTest;
    testTimeCreateObj.preparationTest = preparationTest;
  }

  if (questionBank) {
    filterObj.questionBank = questionBank;
    createObj.questionBank = questionBank;
    testTimeFilterObj.questionBank = questionBank;
    testTimeCreateObj.questionBank = questionBank;
  }
  if (customQueBank) {
    filterObj.customQueBank = customQueBank;
    createObj.customQueBank = customQueBank;
    testTimeFilterObj.customQueBank = customQueBank;
    testTimeCreateObj.customQueBank = customQueBank;
  }

  let attemptTest = await AttemptTest.findOne(filterObj);

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
    attemptTest = await AttemptTest.create(createObj);
  }

  let testTime = await TestTime.findOne(testTimeFilterObj);
  if (!testTime) {
    await TestTime.create(testTimeCreateObj);
  } else {
    testTime.testTime = +modifyTotalTime;
    await testTime.save();
  }

  let isCorrect = false;
  if (questionLanguage === "English") {
    isCorrect =
      questionData.correctAnswerEnglish === givenAnswerIndex.toString();
  } else if (questionLanguage === "Hindi") {
    isCorrect = questionData.correctAnswerHindi === givenAnswerIndex.toString();
  }

  if (preparationTest) {
    await SubmittedAnswer.create({
      question: questionData._id,
      answer: givenAnswerIndex,
      user: userId,
      language: questionLanguage,
      isCorrect,
      isPreparation: true,
      isTemp: true,
      type: "Submit",
    });
  }

  res.status(201).json({
    status: true,
    message: "Test submitted successfully",
    data: {
      attemptTest,
    },
  });
});
