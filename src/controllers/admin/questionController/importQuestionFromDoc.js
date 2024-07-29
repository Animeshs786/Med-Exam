const mammoth = require("mammoth");
const Question = require("../../../models/question");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const cheerio = require("cheerio");

exports.importQuestionsFromDoc = catchAsync(async (req, res, next) => {
  const { subject, mockTest } = req.body;

  if (!subject) return next(new AppError("Please provide a subject", 400));
  if (!mockTest) return next(new AppError("Please provide a mock test", 400));

  if (!req.files) return next(new AppError("Please upload a file", 400));

  const filePath = `${req.files.file[0].destination}/${req.files.file[0].filename}`;

  const { value: htmlContent } = await mammoth.convertToHtml({
    path: filePath,
  });
  //   const { value: rawText } = await mammoth.extractRawText({ path: filePath });

  const questions = parseHtmlContent(htmlContent, subject, mockTest);

  // Save questions to the database
  // const savedQuestions = await Question.insertMany(questions);

  res.status(201).json({
    status: true,
    message: "Questions imported successfully.",
    size: questions?.length,
    // data: savedQuestions,
    htmlContent,
    questions,
  });
});

function parseHtmlContent(htmlContent, subjectId, mockTestId) {
  const $ = cheerio.load(htmlContent);

  const questions = [];

  const questionElements = $("p:has(strong)").toArray();

  questionElements.forEach((elem, index) => {
    console.log(elem);
    const questionText = `<p><strong>${$(elem)
      .find("strong")
      .text()
      .replace(/^\d+\./, "")
      .replace("Que:", "")
      .trim()}</strong></p>`;
    const options = [];
    let correctAnswer = -1;

    for (let i = 1; i <= 4; i++) {
      const optionElement = $(elem)
        .nextAll("p")
        .eq(i - 1);
      if (optionElement.length) {
        const optionText = `<p>${optionElement
          .text()
          .replace(/^\([A-D]\)\s*/, "")}</p>`;
        options.push(optionText);
      }
    }

    const answerElement = $(elem).nextAll('p:contains("Ans:")').first();
    if (answerElement.length) {
      const answerText = answerElement.text().replace("Ans: ", "").trim();
      const answerIndex = answerText.charCodeAt(0) - 65;
      if (answerIndex >= 0 && answerIndex < options.length) {
        correctAnswer = answerIndex;
      }
    }

    questions.push({
      question: questionText,
      correctAnswer: correctAnswer,
      options: options,
      subject: subjectId,
      mockTest: [mockTestId],
    });
  });

  return questions;
}

// function parseRawTextToQuestions(rawText, subject, mockTest) {
//   const questionsArray = rawText
//     .split(/\d+\.Que: /)
//     .filter((item) => item.trim() !== "");

//   const formattedQuestions = [];

//   questionsArray.forEach((question) => {
//     const parts = question.split("\n").filter((part) => part.trim() !== "");

//     const questionText = parts[0].trim().replace(/\s*Ans:.*/g, "");

//     const options = [];
//     let correctAnswer = -1;

//     parts.slice(1).forEach((part) => {
//       const optionMatch = part.match(/^\(([A-D])\)\s*(.+)/);
//       if (optionMatch) {
//         const optionText = optionMatch[2].trim();
//         options.push(optionText);
//       }

//       const ansMatch = part.match(/Ans:\s*([A-D])/);
//       if (ansMatch) {
//         correctAnswer = ansMatch[1].charCodeAt(0) - "A".charCodeAt(0);
//       }
//     });

//     const formattedQuestion = {
//       question: questionText,
//       correctAnswer: correctAnswer,
//       options: options,
//       subject: subject,
//       mockTest: [mockTest],
//     };

//     formattedQuestions.push(formattedQuestion);
//   });

//   return formattedQuestions;
// }
