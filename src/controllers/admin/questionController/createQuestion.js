const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");

exports.createQuestion = catchAsync(async (req, res) => {
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

  const obj = {
    subject,
    mockTest,
    difficulty,
  };

  if (questionNameEnglish) obj.questionNameEnglish = questionNameEnglish;
  if (questionNameHindi) obj.questionNameHindi = questionNameHindi;
  if (correctAnswerEnglish) obj.correctAnswerEnglish = correctAnswerEnglish;
  if (correctAnswerHindi) obj.correctAnswerHindi = correctAnswerHindi;
  if (solutionDetailEnglish) obj.solutionDetailEnglish = solutionDetailEnglish;
  if (solutionDetailHindi) obj.solutionDetailHindi = solutionDetailHindi;

  if (optionsEnglish) {
    const optionsEnglishParse = JSON.parse(optionsEnglish);
    obj.optionsEnglish = optionsEnglishParse;
  }

  if (optionsHindi) {
    const optionsHindiParse = JSON.parse(optionsHindi);
    obj.optionsHindi = optionsHindiParse;
  }

  if (req.files.questionImageEnglish) {
    const questionImageEnglish = `${req.files.questionImageEnglish[0].destination}/${req.files.questionImageEnglish[0].filename}`;
    obj.questionImageEnglish = questionImageEnglish;
  }

  if (req.files.solutionImageEnglish) {
    const solutionImageEnglish = `${req.files.solutionImageEnglish[0].destination}/${req.files.solutionImageEnglish[0].filename}`;
    obj.solutionImageEnglish = solutionImageEnglish;
  }

  if (req.files.optionImage1English) {
    const optionImage1English = `${req.files.optionImage1English[0].destination}/${req.files.optionImage1English[0].filename}`;
    obj.optionImage1English = optionImage1English;
  }

  if (req.files.optionImage2English) {
    const optionImage2English = `${req.files.optionImage2English[0].destination}/${req.files.optionImage2English[0].filename}`;
    obj.optionImage2English = optionImage2English;
  }

  if (req.files.optionImage3English) {
    const optionImage3English = `${req.files.optionImage3English[0].destination}/${req.files.optionImage3English[0].filename}`;
    obj.optionImage3English = optionImage3English;
  }

  if (req.files.optionImage4English) {
    const optionImage4English = `${req.files.optionImage4English[0].destination}/${req.files.optionImage4English[0].filename}`;
    obj.optionImage4English = optionImage4English;
  }

  if (req.files.questionImageHindi) {
    const questionImageHindi = `${req.files.questionImageHindi[0].destination}/${req.files.questionImageHindi[0].filename}`;
    obj.questionImageHindi = questionImageHindi;
  }

  if (req.files.solutionImageHindi) {
    const solutionImageHindi = `${req.files.solutionImageHindi[0].destination}/${req.files.solutionImageHindi[0].filename}`;
    obj.solutionImageHindi = solutionImageHindi;
  }

  if (req.files.optionImage1Hindi) {
    const optionImage1Hindi = `${req.files.optionImage1Hindi[0].destination}/${req.files.optionImage1Hindi[0].filename}`;
    obj.optionImage1Hindi = optionImage1Hindi;
  }

  if (req.files.optionImage2Hindi) {
    const optionImage2Hindi = `${req.files.optionImage2Hindi[0].destination}/${req.files.optionImage2Hindi[0].filename}`;
    obj.optionImage2Hindi = optionImage2Hindi;
  }

  if (req.files.optionImage3Hindi) {
    const optionImage3Hindi = `${req.files.optionImage3Hindi[0].destination}/${req.files.optionImage3Hindi[0].filename}`;
    obj.optionImage3Hindi = optionImage3Hindi;
  }

  if (req.files.optionImage4Hindi) {
    const optionImage4Hindi = `${req.files.optionImage4Hindi[0].destination}/${req.files.optionImage4Hindi[0].filename}`;
    obj.optionImage4Hindi = optionImage4Hindi;
  }

  const newQuestion = await Question.create(obj);

  res.status(201).json({
    status: true,
    message: "Question created successfully.",
    data: {
      question: newQuestion,
    },
  });
});
