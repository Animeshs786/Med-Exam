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
    preparationTest,
    questionBank,
    difficulty,
    solutionDetailEnglish,
    solutionDetailHindi,
  } = req.body;

  const obj = {
    subject,
    difficulty,
  };

  const optionImageEnglish = [];
  const optionImageHindi = [];
  if (mockTest) obj.mockTest = mockTest;
  if (preparationTest) obj.preparationTest = preparationTest;
  if (questionBank) obj.questionBank = questionBank;

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

  // Handling question and solution images
  if (req.files?.questionImageEnglish) {
    const questionImageEnglish = `${req.files.questionImageEnglish[0].destination}/${req.files.questionImageEnglish[0].filename}`;
    obj.questionImageEnglish = questionImageEnglish;
  }

  if (req.files?.solutionImageEnglish) {
    const solutionImageEnglish = `${req.files.solutionImageEnglish[0].destination}/${req.files.solutionImageEnglish[0].filename}`;
    obj.solutionImageEnglish = solutionImageEnglish;
  }

  if (req.files?.questionImageHindi) {
    const questionImageHindi = `${req.files.questionImageHindi[0].destination}/${req.files.questionImageHindi[0].filename}`;
    obj.questionImageHindi = questionImageHindi;
  }

  if (req.files?.solutionImageHindi) {
    const solutionImageHindi = `${req.files.solutionImageHindi[0].destination}/${req.files.solutionImageHindi[0].filename}`;
    obj.solutionImageHindi = solutionImageHindi;
  }

  // Handling option images for English
  // if (req.files?.optionImageEnglish) {
  //   const optionImageEnglish = req.files.optionImageEnglish.map((file) => {
  //     return `${file.destination}/${file.filename}`;
  //   });
  //   obj.optionImageEnglish = optionImageEnglish;
  // }

  if (req.files?.optionImage1English) {
    const optionImage1English = `${req.files.optionImage1English[0].destination}/${req.files.optionImage1English[0].filename}`;
    optionImageEnglish.push(optionImage1English);
  }
  if (req.files?.optionImage2English) {
    const optionImage2English = `${req.files.optionImage2English[0].destination}/${req.files.optionImage2English[0].filename}`;
    optionImageEnglish.push(optionImage2English);
  }
  if (req.files?.optionImage3English) {
    const optionImage3English = `${req.files.optionImage3English[0].destination}/${req.files.optionImage3English[0].filename}`;
    optionImageEnglish.push(optionImage3English);
  }
  if (req.files?.optionImage4English) {
    const optionImage4English = `${req.files.optionImage4English[0].destination}/${req.files.optionImage4English[0].filename}`;
    optionImageEnglish.push(optionImage4English);
  }

  // Handling option images for Hindi
  // if (req.files?.optionImageHindi) {
  //   const optionImageHindi = req.files.optionImageHindi.map((file) => {
  //     return `${file.destination}/${file.filename}`;
  //   });
  //   obj.optionImageHindi = optionImageHindi;
  // }

  if (req.files?.optionImage1Hindi) {
    const optionImage1Hindi = `${req.files.optionImage1Hindi[0].destination}/${req.files.optionImage1Hindi[0].filename}`;
    optionImageHindi.push(optionImage1Hindi);
  }
  if (req.files?.optionImage2Hindi) {
    const optionImage2Hindi = `${req.files.optionImage2Hindi[0].destination}/${req.files.optionImage2Hindi[0].filename}`;
    optionImageHindi.push(optionImage2Hindi);
  }
  if (req.files?.optionImage3Hindi) {
    const optionImage3Hindi = `${req.files.optionImage3Hindi[0].destination}/${req.files.optionImage3Hindi[0].filename}`;
    optionImageHindi.push(optionImage3Hindi);
  }
  if (req.files?.optionImage4Hindi) {
    const optionImage4Hindi = `${req.files.optionImage4Hindi[0].destination}/${req.files.optionImage4Hindi[0].filename}`;
    optionImageHindi.push(optionImage4Hindi);
  }

  obj.optionImageEnglish = optionImageEnglish;
  obj.optionImageHindi = optionImageHindi;

  const newQuestion = await Question.create(obj);

  res.status(201).json({
    status: true,
    message: "Question created successfully.",
    data: {
      question: newQuestion,
    },
  });
});
