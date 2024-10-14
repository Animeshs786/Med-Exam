const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    questionNameEnglish,
    questionNameHindi,
    correctAnswerEnglish,
    correctAnswerHindi,
    optionsEnglish,
    optionsHindi,
    subject,
    mockTest,
    preparationTest,
    questionBank,
    difficulty,
    solutionDetailEnglish,
    solutionDetailHindi,
  } = req.body;

  let updateData = {};

  // Find the existing question by ID
  const existingQuestion = await Question.findById(id);
  if (!existingQuestion) {
    return next(new AppError("No question found with that ID", 404));
  }

  if (questionNameEnglish) updateData.questionNameEnglish = questionNameEnglish;
  if (questionNameHindi) updateData.questionNameHindi = questionNameHindi;
  if (correctAnswerEnglish)
    updateData.correctAnswerEnglish = correctAnswerEnglish;
  if (correctAnswerHindi) updateData.correctAnswerHindi = correctAnswerHindi;
  if (solutionDetailEnglish)
    updateData.solutionDetailEnglish = solutionDetailEnglish;
  if (solutionDetailHindi) updateData.solutionDetailHindi = solutionDetailHindi;

  if (optionsEnglish) {
    const optionsEnglishParse = JSON.parse(optionsEnglish);
    updateData.optionsEnglish = optionsEnglishParse;
  }

  if (optionsHindi) {
    const optionsHindiParse = JSON.parse(optionsHindi);
    updateData.optionsHindi = optionsHindiParse;
  }

  if (subject) updateData.subject = subject;
  if (mockTest) updateData.mockTest = mockTest;
  if (difficulty) updateData.difficulty = difficulty;
  if (preparationTest) updateData.preparationTest = preparationTest;
  if (questionBank) updateData.questionBank = questionBank;
  

  const optionImageEnglish = existingQuestion.optionImageEnglish || [];
  const optionImageHindi = existingQuestion.optionImageHindi || [];

  // Handle file updates and old file deletions for English images
  if (req.files?.questionImageEnglish) {
    const oldQuestionImageEnglish = existingQuestion.questionImageEnglish;
    updateData.questionImageEnglish = `${req.files.questionImageEnglish[0].destination}/${req.files.questionImageEnglish[0].filename}`;
    if (oldQuestionImageEnglish) {
      await deleteOldFiles(oldQuestionImageEnglish).catch((err) => {
        console.error("Failed to delete old English question image:", err);
      });
    }
  }

  if (req.files?.solutionImageEnglish) {
    const oldSolutionImageEnglish = existingQuestion.solutionImageEnglish;
    updateData.solutionImageEnglish = `${req.files.solutionImageEnglish[0].destination}/${req.files.solutionImageEnglish[0].filename}`;
    if (oldSolutionImageEnglish) {
      await deleteOldFiles(oldSolutionImageEnglish).catch((err) => {
        console.error("Failed to delete old English solution image:", err);
      });
    }
  }

  // Handle option images for English
  if (req.files?.optionImage1English) {
    const optionImage1English = `${req.files.optionImage1English[0].destination}/${req.files.optionImage1English[0].filename}`;
    optionImageEnglish[0] = optionImage1English;
  }
  if (req.files?.optionImage2English) {
    const optionImage2English = `${req.files.optionImage2English[0].destination}/${req.files.optionImage2English[0].filename}`;
    optionImageEnglish[1] = optionImage2English;
  }
  if (req.files?.optionImage3English) {
    const optionImage3English = `${req.files.optionImage3English[0].destination}/${req.files.optionImage3English[0].filename}`;
    optionImageEnglish[2] = optionImage3English;
  }
  if (req.files?.optionImage4English) {
    const optionImage4English = `${req.files.optionImage4English[0].destination}/${req.files.optionImage4English[0].filename}`;
    optionImageEnglish[3] = optionImage4English;
  }

  updateData.optionImageEnglish = optionImageEnglish;

  // Handle file updates and old file deletions for Hindi images
  if (req.files?.questionImageHindi) {
    const oldQuestionImageHindi = existingQuestion.questionImageHindi;
    updateData.questionImageHindi = `${req.files.questionImageHindi[0].destination}/${req.files.questionImageHindi[0].filename}`;
    if (oldQuestionImageHindi) {
      await deleteOldFiles(oldQuestionImageHindi).catch((err) => {
        console.error("Failed to delete old Hindi question image:", err);
      });
    }
  }

  if (req.files?.solutionImageHindi) {
    const oldSolutionImageHindi = existingQuestion.solutionImageHindi;
    updateData.solutionImageHindi = `${req.files.solutionImageHindi[0].destination}/${req.files.solutionImageHindi[0].filename}`;
    if (oldSolutionImageHindi) {
      await deleteOldFiles(oldSolutionImageHindi).catch((err) => {
        console.error("Failed to delete old Hindi solution image:", err);
      });
    }
  }

  // Handle option images for Hindi
  if (req.files?.optionImage1Hindi) {
    const optionImage1Hindi = `${req.files.optionImage1Hindi[0].destination}/${req.files.optionImage1Hindi[0].filename}`;
    optionImageHindi[0] = optionImage1Hindi;
  }
  if (req.files?.optionImage2Hindi) {
    const optionImage2Hindi = `${req.files.optionImage2Hindi[0].destination}/${req.files.optionImage2Hindi[0].filename}`;
    optionImageHindi[1] = optionImage2Hindi;
  }
  if (req.files?.optionImage3Hindi) {
    const optionImage3Hindi = `${req.files.optionImage3Hindi[0].destination}/${req.files.optionImage3Hindi[0].filename}`;
    optionImageHindi[2] = optionImage3Hindi;
  }
  if (req.files?.optionImage4Hindi) {
    const optionImage4Hindi = `${req.files.optionImage4Hindi[0].destination}/${req.files.optionImage4Hindi[0].filename}`;
    optionImageHindi[3] = optionImage4Hindi;
  }

  updateData.optionImageHindi = optionImageHindi;

  // Update the question in the database
  const updatedQuestion = await Question.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    message: "Question updated successfully.",
    data: {
      question: updatedQuestion,
    },
  });
});
