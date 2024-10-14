const QuestionImage = require("../../../models/questionImage");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateQuestionImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  let updateData = {};

  const existingQuestion = await QuestionImage.findById(id);
  if (!existingQuestion) {
    return next(new AppError("No question found with that ID", 404));
  }

  const optionImageEnglish = [];
  const optionImageHindi = [];

  // Updating the English question image
  if (req.files.questionImageEnglish) {
    const oldQuestionImageEnglish = existingQuestion.questionImageEnglish;
    updateData.questionImageEnglish = `${req.files.questionImageEnglish[0].destination}/${req.files.questionImageEnglish[0].filename}`;
    if (oldQuestionImageEnglish) {
      await deleteOldFiles(oldQuestionImageEnglish).catch((err) => {
        console.error("Failed to delete old English question image:", err);
      });
    }
  }

  // Updating the English solution image
  if (req.files.solutionImageEnglish) {
    const oldSolutionImageEnglish = existingQuestion.solutionImageEnglish;
    updateData.solutionImageEnglish = `${req.files.solutionImageEnglish[0].destination}/${req.files.solutionImageEnglish[0].filename}`;
    if (oldSolutionImageEnglish) {
      await deleteOldFiles(oldSolutionImageEnglish).catch((err) => {
        console.error("Failed to delete old English solution image:", err);
      });
    }
  }

  // Updating the Hindi question image
  if (req.files.questionImageHindi) {
    const oldQuestionImageHindi = existingQuestion.questionImageHindi;
    updateData.questionImageHindi = `${req.files.questionImageHindi[0].destination}/${req.files.questionImageHindi[0].filename}`;
    if (oldQuestionImageHindi) {
      await deleteOldFiles(oldQuestionImageHindi).catch((err) => {
        console.error("Failed to delete old Hindi question image:", err);
      });
    }
  }

  // Updating the Hindi solution image
  if (req.files.solutionImageHindi) {
    const oldSolutionImageHindi = existingQuestion.solutionImageHindi;
    updateData.solutionImageHindi = `${req.files.solutionImageHindi[0].destination}/${req.files.solutionImageHindi[0].filename}`;
    if (oldSolutionImageHindi) {
      await deleteOldFiles(oldSolutionImageHindi).catch((err) => {
        console.error("Failed to delete old Hindi solution image:", err);
      });
    }
  }

  // Updating the English option images
  if (req.files.optionImage1English) {
    const optionImage1English = `${req.files.optionImage1English[0].destination}/${req.files.optionImage1English[0].filename}`;
    optionImageEnglish.push(optionImage1English);
  }

  if (req.files.optionImage2English) {
    const optionImage2English = `${req.files.optionImage2English[0].destination}/${req.files.optionImage2English[0].filename}`;
    optionImageEnglish.push(optionImage2English);
  }

  if (req.files.optionImage3English) {
    const optionImage3English = `${req.files.optionImage3English[0].destination}/${req.files.optionImage3English[0].filename}`;
    optionImageEnglish.push(optionImage3English);
  }

  if (req.files.optionImage4English) {
    const optionImage4English = `${req.files.optionImage4English[0].destination}/${req.files.optionImage4English[0].filename}`;
    optionImageEnglish.push(optionImage4English);
  }

  updateData.optionImageEnglish = optionImageEnglish;

  // Updating the Hindi option images
  if (req.files.optionImage1Hindi) {
    const optionImage1Hindi = `${req.files.optionImage1Hindi[0].destination}/${req.files.optionImage1Hindi[0].filename}`;
    optionImageHindi.push(optionImage1Hindi);
  }

  if (req.files.optionImage2Hindi) {
    const optionImage2Hindi = `${req.files.optionImage2Hindi[0].destination}/${req.files.optionImage2Hindi[0].filename}`;
    optionImageHindi.push(optionImage2Hindi);
  }

  if (req.files.optionImage3Hindi) {
    const optionImage3Hindi = `${req.files.optionImage3Hindi[0].destination}/${req.files.optionImage3Hindi[0].filename}`;
    optionImageHindi.push(optionImage3Hindi);
  }

  if (req.files.optionImage4Hindi) {
    const optionImage4Hindi = `${req.files.optionImage4Hindi[0].destination}/${req.files.optionImage4Hindi[0].filename}`;
    optionImageHindi.push(optionImage4Hindi);
  }

  updateData.optionImageHindi = optionImageHindi;

  // If name is provided, update it
  if (name) updateData.name = name;

  // Update the QuestionImage document in the database
  await QuestionImage.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    message: "Question image updated successfully.",
  });
});
