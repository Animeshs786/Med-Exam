// const TestResult = require("../../../models/testResult");
// const Question = require("../../../models/question");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.getTestAnalysis = catchAsync(async (req, res, next) => {
//   const testResultId = req.params.id;

//   // Find the test result by ID
//   const testResult = await TestResult.findById(testResultId)
//     .populate({
//       path: "submittedAnswers.question",
//       populate: { path: "subject" },
//     })
//     .populate("mockTest");

//   if (!testResult) {
//     return next(new AppError("Test result not found", 404));
//   }

//   // Get all questions for the mock test
//   const questions = await Question.find({
//     mockTest: testResult.mockTest._id,
//   }).populate("subject");

//   // Prepare the analysis
//   const analysis = questions.map((question) => {
//     const submittedAnswer = testResult.submittedAnswers.find((sa) =>
//       sa.question._id.equals(question._id)
//     );

//     let questionText, correctAnswer, options, solutionImage;

//     if (submittedAnswer && submittedAnswer.language === "Hindi") {
//       questionText = question.questionNameHindi;
//       correctAnswer = question.correctAnswerHindi;
//       options = question.optionsHindi;
//       solutionImage = question.solutionImageHindi;
//     } else {
//       questionText = question.questionNameEnglish;
//       correctAnswer = question.correctAnswerEnglish;
//       options = question.optionsEnglish;
//       solutionImage = question.solutionImageEnglish;
//     }

//     return {
//       question: {
//         id: question._id,
//         text: questionText,
//         correctAnswer: correctAnswer,
//         options: options,
//         subject: question.subject,
//         solutionImage: solutionImage,
//       },
//       userAnswer: submittedAnswer ? submittedAnswer.answer : null,
//       bookmarked: submittedAnswer ? submittedAnswer.bookmarked : false,
//       isCorrect: submittedAnswer ? submittedAnswer.isCorrect : false,
//     };
//   });

//   // Sort analysis by subject
//   analysis.sort((a, b) => {
//     if (a.question.subject.name < b.question.subject.name) return -1;
//     if (a.question.subject.name > b.question.subject.name) return 1;
//     return 0;
//   });

//   res.status(200).json({
//     status: true,
//     message: "Test analysis fetched successfully",
//     data: {
//       testResult: {
//         user: testResult.user,
//         mockTest: testResult.mockTest,
//         totalCorrect: testResult.totalCorrect,
//         totalIncorrect: testResult.totalIncorrect,
//         totalUnattempted: testResult.totalUnattempted,
//         skip: testResult.skip,
//         totalAttempted: testResult.totalAttempted,
//         totalMarks: testResult.totalMarks,
//         accuracy: testResult.accuracy,
//         timeTaken: testResult.timeTaken,
//         speed: testResult.speed,
//         createdAt: testResult.createdAt,
//       },
//       analysis,
//     },
//   });
// });

// const TestResult = require("../../../models/testResult");
// const Question = require("../../../models/question");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.getTestAnalysis = catchAsync(async (req, res, next) => {
//   const testResultId = req.params.id;

//   // Find the test result by ID
//   const testResult = await TestResult.findById(testResultId)
//     .populate({
//       path: "submittedAnswers.question",
//       populate: { path: "subject" },
//     })
//     .populate("mockTest", "name");

//   if (!testResult) {
//     return next(new AppError("Test result not found", 404));
//   }

//   // Get all questions for the mock test
//   const questions = await Question.find({
//     mockTest: testResult.mockTest._id,
//   }).populate("subject", "name");

//   // Prepare the analysis
//   const analysis = questions.map((question) => {
//     const submittedAnswer = testResult.submittedAnswers.find((sa) =>
//       sa.question._id.equals(question._id)
//     );

//     let questionText,
//       correctAnswerIndex,
//       options,
//       solutionImage,
//       type = "",
//       questionImage,
//       solutionDetail,
//       optionImage,
//       userAnswerIndex;

//     if (submittedAnswer && submittedAnswer.language === "Hindi") {
//       questionText = question.questionNameHindi;
//       correctAnswerIndex = question.correctAnswerHindi;
//       options = question.optionsHindi;
//       solutionImage = question.solutionImageHindi;
//       userAnswerIndex = submittedAnswer ? submittedAnswer.answer : null;
//       type = submittedAnswer ? submittedAnswer.type : "";
//       questionImage = question.questionImageHindi;
//       solutionDetail = question.solutionDetailHind;
//       optionImage = question.optionImageHindi;
//     } else {
//       questionText = question.questionNameEnglish;
//       correctAnswerIndex = question.correctAnswerEnglish;
//       options = question.optionsEnglish;
//       solutionImage = question.solutionImageEnglish;
//       userAnswerIndex = submittedAnswer ? submittedAnswer.answer : null;
//       type = submittedAnswer ? submittedAnswer.type : "";
//       questionImage = question.questionImageEnglish;
//       solutionDetail = question.solutionDetailEnglish;
//       optionImage = question.optionImageEnglish;
//     }

//     return {
//       question: {
//         id: question._id,
//         text: questionText,
//         correctAnswerIndex: parseInt(correctAnswerIndex, 10),
//         options: options,
//         subject: question.subject,
//         solutionImage: solutionImage,
//         type: type,
//         questionImage: questionImage,
//         solutionDetail: solutionDetail,
//         optionImage: optionImage,
//       },
//       userAnswerIndex:
//         userAnswerIndex !== null ? parseInt(userAnswerIndex, 10) : null,
//       bookmarked: submittedAnswer ? submittedAnswer.bookmarked : false,
//       isCorrect: submittedAnswer ? submittedAnswer.isCorrect : false,
//     };
//   });

//   // Sort analysis by subject
//   // analysis.sort((a, b) => {
//   //   if (a.question.subject.name < b.question.subject.name) return -1;
//   //   if (a.question.subject.name > b.question.subject.name) return 1;
//   //   return 0;
//   // });

//   res.status(200).json({
//     status: true,
//     message: "Test analysis fetched successfully",
//     data: {
//       testResult: {
//         user: testResult.user,
//         mockTest: testResult.mockTest,
//         totalCorrect: testResult.totalCorrect,
//         totalIncorrect: testResult.totalIncorrect,
//         totalUnattempted: testResult.totalUnattempted,
//         skip: testResult.skip,
//         totalAttempted: testResult.totalAttempted,
//         totalMarks: testResult.totalMarks,
//         accuracy: testResult.accuracy,
//         timeTaken: testResult.timeTaken,
//         speed: testResult.speed,
//         createdAt: testResult.createdAt,
//       },
//       analysis,
//     },
//   });
// });

// const TestResult = require("../../../models/testResult");
// const Question = require("../../../models/question");
// const SubmittedAnswer = require("../../../models/submittedAnswer");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.getTestAnalysis = catchAsync(async (req, res, next) => {
//   const testResultId = req.params.id;

//   // Find the test result by ID and populate related fields
//   const testResult = await TestResult.findById(testResultId)
//     .populate({
//       path: "submittedAnswers", // Populate submittedAnswers first
//       populate: {
//         path: "question", // Populate the question field within submittedAnswers
//         populate: { path: "subject", select: "name" }, // Populate the subject within question
//       },
//     })
//     .populate("mockTest", "name");

//   if (!testResult) {
//     return next(new AppError("Test result not found", 404));
//   }

//   // Get all questions for the mock test
//   const questions = await Question.find({
//     mockTest: testResult.mockTest._id,
//   }).populate("subject", "name");

//   // Prepare the analysis
//   const analysis = questions.map((question) => {
//     const submittedAnswer = testResult.submittedAnswers.find((sa) =>
//       sa.question._id.equals(question._id)
//     );

//     let questionText,
//       correctAnswerIndex,
//       options,
//       solutionImage,
//       type = "",
//       questionImage,
//       solutionDetail,
//       optionImage,
//       userAnswerIndex;

//     if (submittedAnswer && submittedAnswer.language === "Hindi") {
//       questionText = question.questionNameHindi;
//       correctAnswerIndex = question.correctAnswerHindi;
//       options = question.optionsHindi;
//       solutionImage = question.solutionImageHindi;
//       userAnswerIndex = submittedAnswer ? submittedAnswer.answer : null;
//       type = submittedAnswer ? submittedAnswer.type : "";
//       questionImage = question.questionImageHindi;
//       solutionDetail = question.solutionDetailHind;
//       optionImage = question.optionImageHindi;
//     } else {
//       questionText = question.questionNameEnglish;
//       correctAnswerIndex = question.correctAnswerEnglish;
//       options = question.optionsEnglish;
//       solutionImage = question.solutionImageEnglish;
//       userAnswerIndex = submittedAnswer ? submittedAnswer.answer : null;
//       type = submittedAnswer ? submittedAnswer.type : "";
//       questionImage = question.questionImageEnglish;
//       solutionDetail = question.solutionDetailEnglish;
//       optionImage = question.optionImageEnglish;
//     }

//     return {
//       question: {
//         id: question._id,
//         text: questionText,
//         correctAnswerIndex: parseInt(correctAnswerIndex, 10),
//         options: options,
//         subject: question.subject,
//         solutionImage: solutionImage,
//         type: type,
//         questionImage: questionImage,
//         solutionDetail: solutionDetail,
//         optionImage: optionImage,
//       },
//       userAnswerIndex:
//         userAnswerIndex !== null ? parseInt(userAnswerIndex, 10) : null,
//       bookmarked: submittedAnswer ? submittedAnswer.bookmarked : false,
//       isCorrect: submittedAnswer ? submittedAnswer.isCorrect : false,
//     };
//   });

//   // Sort analysis by subject
//   // analysis.sort((a, b) => {
//   //   if (a.question.subject.name < b.question.subject.name) return -1;
//   //   if (a.question.subject.name > b.question.subject.name) return 1;
//   //   return 0;
//   // });

//   res.status(200).json({
//     status: true,
//     message: "Test analysis fetched successfully",
//     data: {
//       testResult: {
//         user: testResult.user,
//         mockTest: testResult.mockTest,
//         totalCorrect: testResult.totalCorrect,
//         totalIncorrect: testResult.totalIncorrect,
//         totalUnattempted: testResult.totalUnattempted,
//         skip: testResult.skip,
//         totalAttempted: testResult.totalAttempted,
//         totalMarks: testResult.totalMarks,
//         accuracy: testResult.accuracy,
//         timeTaken: testResult.timeTaken,
//         speed: testResult.speed,
//         createdAt: testResult.createdAt,
//       },
//       analysis,
//     },
//   });
// });


const TestResult = require("../../../models/testResult");
const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.getTestAnalysis = catchAsync(async (req, res, next) => {
  const testResultId = req.params.id;

  // Find the test result by ID and populate related fields
  const testResult = await TestResult.findById(testResultId)
    .populate({
      path: "submittedAnswers",
      populate: {
        path: "question",
        populate: { path: "subject", select: "name" },
      },
    })
    .populate("mockTest", "name");

  if (!testResult) {
    return next(new AppError("Test result not found", 404));
  }

  let questions = await Question.find({
    mockTest: testResult.mockTest._id,
  }).populate("subject", "name");

  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

  questions = questions.sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );

  const analysis = questions.map((question) => {
    const submittedAnswer = testResult.submittedAnswers.find((sa) =>
      sa.question._id.equals(question._id)
    );

    let questionText,
      correctAnswerIndex,
      options,
      solutionImage,
      type = "",
      questionImage,
      solutionDetail,
      optionImage,
      userAnswerIndex;

    if (submittedAnswer && submittedAnswer.language === "Hindi") {
      questionText = question.questionNameHindi;
      correctAnswerIndex = question.correctAnswerHindi;
      options = question.optionsHindi;
      solutionImage = question.solutionImageHindi;
      userAnswerIndex = submittedAnswer ? submittedAnswer.answer : null;
      type = submittedAnswer ? submittedAnswer.type : "";
      questionImage = question.questionImageHindi;
      solutionDetail = question.solutionDetailHindi;
      optionImage = question.optionImageHindi;
    } else {
      questionText = question.questionNameEnglish;
      correctAnswerIndex = question.correctAnswerEnglish;
      options = question.optionsEnglish;
      solutionImage = question.solutionImageEnglish;
      userAnswerIndex = submittedAnswer ? submittedAnswer.answer : null;
      type = submittedAnswer ? submittedAnswer.type : "";
      questionImage = question.questionImageEnglish;
      solutionDetail = question.solutionDetailEnglish;
      optionImage = question.optionImageEnglish;
    }

    return {
      question: {
        id: question._id,
        text: questionText,
        correctAnswerIndex: parseInt(correctAnswerIndex, 10),
        options: options,
        subject: question.subject,
        solutionImage: solutionImage,
        type: type,
        questionImage: questionImage,
        solutionDetail: solutionDetail,
        optionImage: optionImage,
      },
      userAnswerIndex:
        userAnswerIndex !== null ? parseInt(userAnswerIndex, 10) : null,
      bookmarked: submittedAnswer ? submittedAnswer.bookmarked : false,
      isCorrect: submittedAnswer ? submittedAnswer.isCorrect : false,
    };
  });

  res.status(200).json({
    status: true,
    message: "Test analysis fetched successfully",
    data: {
      testResult: {
        user: testResult.user,
        mockTest: testResult.mockTest,
        totalCorrect: testResult.totalCorrect,
        totalIncorrect: testResult.totalIncorrect,
        totalUnattempted: testResult.totalUnattempted,
        skip: testResult.skip,
        totalAttempted: testResult.totalAttempted,
        totalMarks: testResult.totalMarks,
        accuracy: testResult.accuracy,
        timeTaken: testResult.timeTaken,
        speed: testResult.speed,
        createdAt: testResult.createdAt,
      },
      analysis,
    },
  });
});
