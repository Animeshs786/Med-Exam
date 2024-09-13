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

  if (req.files.optionImageEnglish) {
    const oldOptionImagesEnglish = existingQuestion.optionImageEnglish || [];
    updateData.optionImageEnglish = req.files.optionImageEnglish.map(
      (file, index) => {
        const oldImage = oldOptionImagesEnglish[index];
        if (oldImage) {
          deleteOldFiles(oldImage).catch((err) => {
            console.error(
              `Failed to delete old English option image ${index + 1}:`,
              err
            );
          });
        }
        return `${file.destination}/${file.filename}`;
      }
    );
  }

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

  if (req.files.optionImageHindi) {
    const oldOptionImagesHindi = existingQuestion.optionImageHindi || [];
    updateData.optionImageHindi = req.files.optionImageHindi.map(
      (file, index) => {
        const oldImage = oldOptionImagesHindi[index];
        if (oldImage) {
          deleteOldFiles(oldImage).catch((err) => {
            console.error(
              `Failed to delete old Hindi option image ${index + 1}:`,
              err
            );
          });
        }
        return `${file.destination}/${file.filename}`;
      }
    );
  }
  if (name) updateData.name = name;

  await QuestionImage.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    message: "Question image Update successfully.",
  });
});
