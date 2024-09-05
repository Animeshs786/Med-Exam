const QuestionImage = require("../../../models/questionImage");
const catchAsync = require("../../../utils/catchAsync");

exports.createQuestionImage = catchAsync(async (req, res) => {
  const { name } = req.body;

  const obj = {
    name,
  };

  if (req.files.questionImageEnglish) {
    const questionImageEnglish = `${req.files.questionImageEnglish[0].destination}/${req.files.questionImageEnglish[0].filename}`;
    obj.questionImageEnglish = questionImageEnglish;
  }

  if (req.files.solutionImageEnglish) {
    const solutionImageEnglish = `${req.files.solutionImageEnglish[0].destination}/${req.files.solutionImageEnglish[0].filename}`;
    obj.solutionImageEnglish = solutionImageEnglish;
  }

  if (req.files.questionImageHindi) {
    const questionImageHindi = `${req.files.questionImageHindi[0].destination}/${req.files.questionImageHindi[0].filename}`;
    obj.questionImageHindi = questionImageHindi;
  }

  if (req.files.solutionImageHindi) {
    const solutionImageHindi = `${req.files.solutionImageHindi[0].destination}/${req.files.solutionImageHindi[0].filename}`;
    obj.solutionImageHindi = solutionImageHindi;
  }

  if (req.files.optionImageEnglish) {
    const optionImageEnglish = req.files.optionImageEnglish.map((file) => {
      return `${file.destination}/${file.filename}`;
    });
    obj.optionImageEnglish = optionImageEnglish;
  }

  if (req.files.optionImageHindi) {
    const optionImageHindi = req.files.optionImageHindi.map((file) => {
      return `${file.destination}/${file.filename}`;
    });
    obj.optionImageHindi = optionImageHindi;
  }

  const newQuestion = await QuestionImage.create(obj);

  res.status(201).json({
    status: true,
    message: "Question Image upload successfully.",
    data: {
      question: newQuestion,
    },
  });
});
