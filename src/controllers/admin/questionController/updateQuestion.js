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

  // Handle file updates and old file deletions for English images
  if (req.files.questionImageEnglish) {
    const oldQuestionImageEnglish = existingQuestion.questionImageEnglish;
    updateData.questionImageEnglish = `${req.files.questionImageEnglish[0].destination}/${req.files.questionImageEnglish[0].filename}`;

    if (oldQuestionImageEnglish) {
      await deleteOldFiles(oldQuestionImageEnglish).catch((err) => {
        console.error("Failed to delete old English question image:", err);
      });
    }
  }

  if (req.files.solutionImageEnglish) {
    const oldSolutionImageEnglish = existingQuestion.solutionImageEnglish;
    updateData.solutionImageEnglish = `${req.files.solutionImageEnglish[0].destination}/${req.files.solutionImageEnglish[0].filename}`;

    if (oldSolutionImageEnglish) {
      await deleteOldFiles(oldSolutionImageEnglish).catch((err) => {
        console.error("Failed to delete old English solution image:", err);
      });
    }
  }

  if (req.files.optionImage1English) {
    const oldOptionImage1English = existingQuestion.optionImage1English;
    updateData.optionImage1English = `${req.files.optionImage1English[0].destination}/${req.files.optionImage1English[0].filename}`;

    if (oldOptionImage1English) {
      await deleteOldFiles(oldOptionImage1English).catch((err) => {
        console.error("Failed to delete old English option image 1:", err);
      });
    }
  }

  if (req.files.optionImage2English) {
    const oldOptionImage2English = existingQuestion.optionImage2English;
    updateData.optionImage2English = `${req.files.optionImage2English[0].destination}/${req.files.optionImage2English[0].filename}`;

    if (oldOptionImage2English) {
      await deleteOldFiles(oldOptionImage2English).catch((err) => {
        console.error("Failed to delete old English option image 2:", err);
      });
    }
  }

  if (req.files.optionImage3English) {
    const oldOptionImage3English = existingQuestion.optionImage3English;
    updateData.optionImage3English = `${req.files.optionImage3English[0].destination}/${req.files.optionImage3English[0].filename}`;

    if (oldOptionImage3English) {
      await deleteOldFiles(oldOptionImage3English).catch((err) => {
        console.error("Failed to delete old English option image 3:", err);
      });
    }
  }

  if (req.files.optionImage4English) {
    const oldOptionImage4English = existingQuestion.optionImage4English;
    updateData.optionImage4English = `${req.files.optionImage4English[0].destination}/${req.files.optionImage4English[0].filename}`;

    if (oldOptionImage4English) {
      await deleteOldFiles(oldOptionImage4English).catch((err) => {
        console.error("Failed to delete old English option image 4:", err);
      });
    }
  }

  // Handle file updates and old file deletions for Hindi images
  if (req.files.questionImageHindi) {
    const oldQuestionImageHindi = existingQuestion.questionImageHindi;
    updateData.questionImageHindi = `${req.files.questionImageHindi[0].destination}/${req.files.questionImageHindi[0].filename}`;

    if (oldQuestionImageHindi) {
      await deleteOldFiles(oldQuestionImageHindi).catch((err) => {
        console.error("Failed to delete old Hindi question image:", err);
      });
    }
  }

  if (req.files.solutionImageHindi) {
    const oldSolutionImageHindi = existingQuestion.solutionImageHindi;
    updateData.solutionImageHindi = `${req.files.solutionImageHindi[0].destination}/${req.files.solutionImageHindi[0].filename}`;

    if (oldSolutionImageHindi) {
      await deleteOldFiles(oldSolutionImageHindi).catch((err) => {
        console.error("Failed to delete old Hindi solution image:", err);
      });
    }
  }

  if (req.files.optionImage1Hindi) {
    const oldOptionImage1Hindi = existingQuestion.optionImage1Hindi;
    updateData.optionImage1Hindi = `${req.files.optionImage1Hindi[0].destination}/${req.files.optionImage1Hindi[0].filename}`;

    if (oldOptionImage1Hindi) {
      await deleteOldFiles(oldOptionImage1Hindi).catch((err) => {
        console.error("Failed to delete old Hindi option image 1:", err);
      });
    }
  }

  if (req.files.optionImage2Hindi) {
    const oldOptionImage2Hindi = existingQuestion.optionImage2Hindi;
    updateData.optionImage2Hindi = `${req.files.optionImage2Hindi[0].destination}/${req.files.optionImage2Hindi[0].filename}`;

    if (oldOptionImage2Hindi) {
      await deleteOldFiles(oldOptionImage2Hindi).catch((err) => {
        console.error("Failed to delete old Hindi option image 2:", err);
      });
    }
  }

  if (req.files.optionImage3Hindi) {
    const oldOptionImage3Hindi = existingQuestion.optionImage3Hindi;
    updateData.optionImage3Hindi = `${req.files.optionImage3Hindi[0].destination}/${req.files.optionImage3Hindi[0].filename}`;

    if (oldOptionImage3Hindi) {
      await deleteOldFiles(oldOptionImage3Hindi).catch((err) => {
        console.error("Failed to delete old Hindi option image 3:", err);
      });
    }
  }

  if (req.files.optionImage4Hindi) {
    const oldOptionImage4Hindi = existingQuestion.optionImage4Hindi;
    updateData.optionImage4Hindi = `${req.files.optionImage4Hindi[0].destination}/${req.files.optionImage4Hindi[0].filename}`;

    if (oldOptionImage4Hindi) {
      await deleteOldFiles(oldOptionImage4Hindi).catch((err) => {
        console.error("Failed to delete old Hindi option image 4:", err);
      });
    }
  }

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
