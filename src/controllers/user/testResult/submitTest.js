const MockTest = require("../../../models/mockTest");
const Question = require("../../../models/question");
const SubmittedAnswer = require("../../../models/submittedAnswer");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const TestResult = require("../../../models/testResult");
const TestTime = require("../../../models/testTime");
const AttemptTest = require("../../../models/attemtTest");
const PreparationTest = require("../../../models/preparationTest");
const QuestionBank = require("../../../models/questionBank");
const CustomQueBank = require("../../../models/customQueBank");

exports.submitTest = catchAsync(async (req, res, next) => {
  const {
    mockTestId,
    submittedAnswers,
    preparationTestId,
    questionBankId,
    customQueBankId,
    timeTaken,
  } = req.body;
  const userId = req.user._id;
  const modifyTotalTime = timeTaken.split(":")[0];

  let testModule;

  if (mockTestId) {
    const mockTest = await MockTest.findById(mockTestId);
    if (!mockTest) return next(new AppError("Mock test not found", 404));
    testModule = mockTest;
  }

  if (customQueBankId) {
    const customQueBank = await CustomQueBank.findById(customQueBankId);
    if (!customQueBank)
      return next(new AppError(" Custom Question bank not found", 404));
    testModule = customQueBank;
  }

  if (preparationTestId) {
    const preparationTest = await PreparationTest.findById(preparationTestId);
    if (!preparationTest)
      return next(new AppError("Preparation test not found", 404));
    testModule = preparationTest;
  }

  if (questionBankId) {
    const questionBank = await QuestionBank.findById(questionBankId);
    if (!questionBank)
      return next(new AppError("Question bank not found", 404));
    testModule = questionBank;
  }

  const correctMark = testModule?.correctMark || 1;
  const wrongMark = testModule?.wrongMark || 0;

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalMarks = 0;
  let skip = 0;
  let totalAttempted = 0;

  const answerResults = await Promise.all(
    submittedAnswers.map(async (submittedAnswer) => {
      const {
        question: questionId,
        answer,
        language,
        type,
        bookmarked,
      } = submittedAnswer;
      const question = await Question.findById(questionId);
      if (!question) {
        return null;
      }

      let isCorrect = false;
      if (language === "English") {
        isCorrect = question.correctAnswerEnglish === answer.toString();
      } else if (language === "Hindi") {
        isCorrect = question.correctAnswerHindi === answer.toString();
      }

      if (answer !== null && answer !== undefined && type === "Submit") {
        totalCorrect += isCorrect ? 1 : 0;
        totalIncorrect += !isCorrect ? 1 : 0;
        totalMarks += isCorrect ? correctMark : wrongMark;
        totalAttempted += 1;
      } else if (type === "Mark") {
        totalAttempted += 1;
        skip += 1;
      } else {
        totalAttempted += 1;
      }

      const newSubmittedAnswer = await SubmittedAnswer.create({
        question: question._id,
        answer,
        user: userId,
        language,
        bookmarked: bookmarked || false,
        isCorrect,
        type,
        isPreparation: preparationTestId ? true : false,
      });

      return newSubmittedAnswer._id;
    })
  );

  console.log(+modifyTotalTime, submittedAnswers.length, totalCorrect, "sldfj");

  const accuracy = (totalCorrect / submittedAnswers.length) * 100;
  // const speed = totalCorrect / (Number(modifyTotalTime) / 60);
  const speed = +modifyTotalTime > 0 ? totalCorrect / +modifyTotalTime : 0;
  console.log(accuracy, speed, "accuracy, speed");

  const testResult = await TestResult.create({
    user: userId,
    mockTest: mockTestId || null,
    preparationTest: preparationTestId || null,
    questionBank: questionBankId || null,
    customQueBank: customQueBankId || null,
    submittedAnswers: answerResults.filter((result) => result !== null),
    totalCorrect,
    totalIncorrect,
    totalUnattempted: testModule?.totalQuestions - totalAttempted,
    skip,
    totalAttempted,
    totalMarks,
    accuracy: accuracy.toFixed(2),
    speed: speed.toFixed(2),
    timeTaken: +modifyTotalTime,
  });

  await AttemptTest.deleteMany({
    userId,
    mockTest: mockTestId || null,
    questionBank: questionBankId || null,
    preparationTest: preparationTestId || null,
    customQueBank: customQueBankId || null,
  });

  if (preparationTestId) {
    await SubmittedAnswer.deleteMany({
      user: userId,
      isTemp: true,
    });
  }

  await TestTime.findOneAndDelete({
    user: userId,
    mockTest: mockTestId || null,
    questionBank: questionBankId || null,
    preparationTest: preparationTestId || null,

    customQueBank: customQueBankId || null,
  });

  // Send success response
  res.status(201).json({
    status: true,
    message: "Test submitted successfully",
    data: {
      testResult,
    },
  });
});
