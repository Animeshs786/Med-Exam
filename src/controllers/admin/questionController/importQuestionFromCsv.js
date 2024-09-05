// const fs = require("fs");
// const csv = require("csv-parser");
// const Question = require("../../../models/question");
// const Subject = require("../../../models/subject");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.importQuestionFromCsv = catchAsync(async (req, res, next) => {
//   const { mockTest } = req.body;

//   if (!req.files || !req.files.csvFile) {
//     return next(new AppError("No file uploaded", 400));
//   }

//   const filePath = `${req.files.csvFile[0].destination}/${req.files.csvFile[0].filename}`;

//   const results = [];

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", async () => {
//       try {
//         for (const row of results) {
//           const subject = await Subject.findOne({ name: row["Subject Name"] });

//           if (!subject) {
//             return next(
//               new AppError(`Subject ${row["Subject Name"]} not found`, 400)
//             );
//           }

//           const question = new Question({
//             questionNameEnglish:
//               row["Question Name English"] !== "Null"
//                 ? row["Question Name English"]
//                 : "",
//             questionNameHindi:
//               row["Question Name Hindi"] !== "Null"
//                 ? row["Question Name Hindi"]
//                 : "",
//             correctAnswerEnglish: row["Correct Option English"],
//             correctAnswerHindi: row["Correct Option Hindi"],
//             optionsEnglish: [
//               row["Option 1 English"],
//               row["Option 2 English"],
//               row["Option 3 English"],
//               row["Option 4 English"],
//             ],
//             optionsHindi: [
//               row["Option 1 Hindi"],
//               row["Option 2 Hindi"],
//               row["Option 3 Hindi"],
//               row["Option 4 Hindi"],
//             ],
//             subject: subject?._id || null,
//             mockTest: mockTest,
//             questionImageEnglish:
//               row["Question Image English"] !== "Null"
//                 ? row["Question Image English"]
//                 : "",
//             solutionImageEnglish:
//               row["Solution Image English"] !== "Null"
//                 ? row["Solution Image English"]
//                 : "",
//             optionImage1English:
//               row["Option 1 Image English"] !== "Null"
//                 ? row["Option 1 Image English"]
//                 : "",
//             optionImage2English:
//               row["Option 2 Image English"] !== "Null"
//                 ? row["Option 2 Image English"]
//                 : "",
//             optionImage3English:
//               row["Option 3 Image English"] !== "Null"
//                 ? row["Option 3 Image English"]
//                 : "",
//             optionImage4English:
//               row["Option 4 Image English"] !== "Null"
//                 ? row["Option 4 Image English"]
//                 : "",

//             questionImageHindi:
//               row["Question Image Hindi"] !== "Null"
//                 ? row["Question Image Hindi"]
//                 : "",
//             solutionImageHindi:
//               row["Solution Image Hindi"] !== "Null"
//                 ? row["Solution Image Hindi"]
//                 : "",
//             optionImage1Hindi:
//               row["Option 1 Image Hindi"] !== "Null"
//                 ? row["Option 1 Image Hindi"]
//                 : "",
//             optionImage2Hindi:
//               row["Option 2 Image Hindi"] !== "Null"
//                 ? row["Option 2 Image Hindi"]
//                 : "",
//             optionImage3Hindi:
//               row["Option 3 Image Hindi"] !== "Null"
//                 ? row["Option 3 Image Hindi"]
//                 : "",
//             optionImage4Hindi:
//               row["Option 4 Image Hindi"] !== "Null"
//                 ? row["Option 4 Image Hindi"]
//                 : "",
//             solutionDetailEnglish:
//               row["Solution Detail English"] !== "Null"
//                 ? row["Solution Detail English"]
//                 : "",
//             solutionDetailHind:
//               row["Solution Detail Hindi"] !== "Null"
//                 ? row["Solution Detail Hindi"]
//                 : "",
//             createdAt:
//               row["Created At"] !== "Null" ? row["Created At"] : Date.now(),

//             difficulty: row["Difficulty"],
//           });

//           await question.save();
//         }

//         res.status(201).json({
//           status: true,
//           message: "Questions uploaded successfully",
//         });
//       } catch (error) {
//         next(new AppError("Error uploading questions", 500));
//       } finally {
//         fs.unlinkSync(filePath);
//       }
//     })
//     .on("error", () => {
//       return next(new AppError("Error reading the CSV file", 500));
//     });
// });


const fs = require("fs");
const csv = require("csv-parser");
const Question = require("../../../models/question");
const Subject = require("../../../models/subject");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.importQuestionFromCsv = catchAsync(async (req, res, next) => {
  const { mockTest } = req.body;

  if (!req.files || !req.files.csvFile) {
    return next(new AppError("No file uploaded", 400));
  }

  const filePath = `${req.files.csvFile[0].destination}/${req.files.csvFile[0].filename}`;

  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (const row of results) {
          const subject = await Subject.findOne({ name: row["Subject Name"] });

          if (!subject) {
            return next(
              new AppError(`Subject ${row["Subject Name"]} not found`, 400)
            );
          }

          const question = new Question({
            questionNameEnglish:
              row["Question Name English"] !== "Null"
                ? row["Question Name English"]
                : "",
            questionNameHindi:
              row["Question Name Hindi"] !== "Null"
                ? row["Question Name Hindi"]
                : "",
            correctAnswerEnglish: row["Correct Option English"],
            correctAnswerHindi: row["Correct Option Hindi"],
            optionsEnglish: [
              row["Option 1 English"],
              row["Option 2 English"],
              row["Option 3 English"],
              row["Option 4 English"],
            ],
            optionsHindi: [
              row["Option 1 Hindi"],
              row["Option 2 Hindi"],
              row["Option 3 Hindi"],
              row["Option 4 Hindi"],
            ],
            subject: subject?._id || null,
            mockTest: mockTest,
            questionImageEnglish:
              row["Question Image English"] !== "Null"
                ? row["Question Image English"]
                : "",
            solutionImageEnglish:
              row["Solution Image English"] !== "Null"
                ? row["Solution Image English"]
                : "",
            optionImageEnglish: [
              row["Option 1 Image English"] !== "Null"
                ? row["Option 1 Image English"]
                : "",
              row["Option 2 Image English"] !== "Null"
                ? row["Option 2 Image English"]
                : "",
              row["Option 3 Image English"] !== "Null"
                ? row["Option 3 Image English"]
                : "",
              row["Option 4 Image English"] !== "Null"
                ? row["Option 4 Image English"]
                : "",
            ],
            questionImageHindi:
              row["Question Image Hindi"] !== "Null"
                ? row["Question Image Hindi"]
                : "",
            solutionImageHindi:
              row["Solution Image Hindi"] !== "Null"
                ? row["Solution Image Hindi"]
                : "",
            optionImageHindi: [
              row["Option 1 Image Hindi"] !== "Null"
                ? row["Option 1 Image Hindi"]
                : "",
              row["Option 2 Image Hindi"] !== "Null"
                ? row["Option 2 Image Hindi"]
                : "",
              row["Option 3 Image Hindi"] !== "Null"
                ? row["Option 3 Image Hindi"]
                : "",
              row["Option 4 Image Hindi"] !== "Null"
                ? row["Option 4 Image Hindi"]
                : "",
            ],
            solutionDetailEnglish:
              row["Solution Detail English"] !== "Null"
                ? row["Solution Detail English"]
                : "",
            solutionDetailHind:
              row["Solution Detail Hindi"] !== "Null"
                ? row["Solution Detail Hindi"]
                : "",
            createdAt:
              row["Created At"] !== "Null" ? row["Created At"] : Date.now(),

            difficulty: row["Difficulty"],
          });

          await question.save();
        }

        res.status(201).json({
          status: true,
          message: "Questions uploaded successfully",
        });
      } catch (error) {
        next(new AppError("Error uploading questions", 500));
      } finally {
        fs.unlinkSync(filePath);
      }
    })
    .on("error", () => {
      return next(new AppError("Error reading the CSV file", 500));
    });
});
