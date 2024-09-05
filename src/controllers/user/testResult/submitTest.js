// const MockTest = require("../../../models/mockTest");
// const Question = require("../../../models/question");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");
// const TestResult = require("../../../models/testResult");

// exports.submitTest = catchAsync(async (req, res, next) => {
//   const { mockTestId, submittedAnswers, timeTaken } = req.body;
//   const userId = req.user._id;

//   const mockTest = await MockTest.findById(mockTestId);
//   if (!mockTest) {
//     return next(new AppError("Mock test not found", 404));
//   }

//   const correctMark = mockTest.correctMark || 1;
//   const wrongMark = mockTest.wrongMark || 0;

//   let totalCorrect = 0;
//   let totalIncorrect = 0;
//   let totalMarks = 0;
//   let skip = 0;
//   let totalAttempted = 0;

//   const answerResults = await Promise.all(
//     submittedAnswers.map(async (submittedAnswer) => {
//       const { question: questionId, answer, language } = submittedAnswer;
//       const question = await Question.findById(questionId);
//       if (!question) {
//         return null;
//       }

//       let isCorrect = false;
//       if (language === "English") {
//         isCorrect = question.correctAnswerEnglish === answer;
//       } else if (language === "Hindi") {
//         isCorrect = question.correctAnswerHindi === answer;
//       }

//       if (answer !== null) {
//         totalCorrect += isCorrect ? 1 : 0;
//         totalIncorrect += !isCorrect ? 1 : 0;
//         totalMarks += isCorrect ? correctMark : wrongMark;
//         totalAttempted += 1;
//       } else {
//         skip += 1;
//         totalAttempted += 1;
//       }
//       return {
//         question: question._id,
//         answer,
//         language,
//         bookmarked: submittedAnswer.bookmarked,
//         isCorrect,
//       };
//     })
//   );

//   const accuracy = (totalCorrect / submittedAnswers.length) * 100;
//   const speed = totalCorrect / (timeTaken / 60); // Correct answers per minute

//   const testResult = await TestResult.create({
//     user: userId,
//     mockTest: mockTestId,
//     submittedAnswers: answerResults.filter((result) => result !== null),
//     totalCorrect,
//     totalIncorrect,
//     totalUnattempted: mockTest.totalQuestions - totalAttempted,
//     skip,
//     totalAttempted,
//     totalMarks,
//     accuracy,
//     speed,
//     timeTaken,
//   });

//   res.status(201).json({
//     status: true,
//     message: "Test submitted successfully",
//     data: {
//       testResult,
//     },
//   });
// });

const MockTest = require("../../../models/mockTest");
const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const TestResult = require("../../../models/testResult");

exports.submitTest = catchAsync(async (req, res, next) => {
  const { mockTestId, submittedAnswers, timeTaken } = req.body;
  const userId = req.user._id;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    return next(new AppError("Mock test not found", 404));
  }

  const correctMark = mockTest.correctMark || 1;
  const wrongMark = mockTest.wrongMark || 0;

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalMarks = 0;
  let skip = 0;
  let totalAttempted = 0;

  const answerResults = await Promise.all(
    submittedAnswers.map(async (submittedAnswer) => {
      const { question: questionId, answerIndex, language } = submittedAnswer;
      const question = await Question.findById(questionId);
      if (!question) {
        return null;
      }

      let isCorrect = false;
      if (language === "English") {
        isCorrect = question.correctAnswerEnglish === answerIndex.toString();
      } else if (language === "Hindi") {
        isCorrect = question.correctAnswerHindi === answerIndex.toString();
      }

      if (answerIndex !== null) {
        totalCorrect += isCorrect ? 1 : 0;
        totalIncorrect += !isCorrect ? 1 : 0;
        totalMarks += isCorrect ? correctMark : wrongMark;
        totalAttempted += 1;
      } else {
        skip += 1;
        totalAttempted += 1;
      }
      return {
        question: question._id,
        answerIndex,
        language,
        bookmarked: submittedAnswer.bookmarked,
        isCorrect,
      };
    })
  );

  const accuracy = (totalCorrect / submittedAnswers.length) * 100;
  const speed = totalCorrect / (timeTaken / 60); // Correct answers per minute

  const testResult = await TestResult.create({
    user: userId,
    mockTest: mockTestId,
    submittedAnswers: answerResults.filter((result) => result !== null),
    totalCorrect,
    totalIncorrect,
    totalUnattempted: mockTest.totalQuestions - totalAttempted,
    skip,
    totalAttempted,
    totalMarks,
    accuracy,
    speed,
    timeTaken,
  });

  res.status(201).json({
    status: true,
    message: "Test submitted successfully",
    data: {
      testResult,
    },
  });
});

