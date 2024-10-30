// const fs = require("fs");
// const csv = require("csv-parser");
// const Question = require("../../../models/question");
// const Subject = require("../../../models/subject");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.importQuestionFromCsv = catchAsync(async (req, res, next) => {
//   const { mockTest, preparationTest, questionBank } = req.body;

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
//             mockTest: mockTest || null,
//             preparationTest: preparationTest || null,
//             questionBank: questionBank || null,
//             questionImageEnglish:
//               row["Question Image English"] !== "Null"
//                 ? row["Question Image English"]
//                 : "",
//             solutionImageEnglish:
//               row["Solution Image English"] !== "Null"
//                 ? row["Solution Image English"]
//                 : "",
//             optionImageEnglish: [
//               row["Option 1 Image English"] !== "Null"
//                 ? row["Option 1 Image English"]
//                 : "",
//               row["Option 2 Image English"] !== "Null"
//                 ? row["Option 2 Image English"]
//                 : "",
//               row["Option 3 Image English"] !== "Null"
//                 ? row["Option 3 Image English"]
//                 : "",
//               row["Option 4 Image English"] !== "Null"
//                 ? row["Option 4 Image English"]
//                 : "",
//             ],
//             questionImageHindi:
//               row["Question Image Hindi"] !== "Null"
//                 ? row["Question Image Hindi"]
//                 : "",
//             solutionImageHindi:
//               row["Solution Image Hindi"] !== "Null"
//                 ? row["Solution Image Hindi"]
//                 : "",
//             optionImageHindi: [
//               row["Option 1 Image Hindi"] !== "Null"
//                 ? row["Option 1 Image Hindi"]
//                 : "",
//               row["Option 2 Image Hindi"] !== "Null"
//                 ? row["Option 2 Image Hindi"]
//                 : "",
//               row["Option 3 Image Hindi"] !== "Null"
//                 ? row["Option 3 Image Hindi"]
//                 : "",
//               row["Option 4 Image Hindi"] !== "Null"
//                 ? row["Option 4 Image Hindi"]
//                 : "",
//             ],
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

// const fs = require("fs");
// const csv = require("csv-parser");
// const Question = require("../../../models/question");
// const Subject = require("../../../models/subject");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.importQuestionFromCsv = catchAsync(async (req, res, next) => {
//   const { mockTest, preparationTest, questionBank, isMcq } = req.body;

//   if (!req.files || !req.files.csvFile) {
//     return next(new AppError("No file uploaded", 400));
//   }

//   const filePath = `${req.files.csvFile[0].destination}/${req.files.csvFile[0].filename}`;

//   const results = [];

//   // Regex pattern to validate subject name (allows only alphabets and spaces)
//   const subjectNameRegex = /^[a-zA-Z\s]+$/;

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", async () => {
//       try {
//         // Step 1: Verify all subjects exist using case-insensitive comparison
//         const subjectNames = [
//           ...new Set(
//             results
//               .map((row) => row["Subject Name"].trim()) // Trim and normalize
//               .filter((name) => subjectNameRegex.test(name)) // Only include valid subject names
//           ),
//         ];

//         // Convert all subject names to lowercase for comparison
//         const lowerCasedSubjectNames = subjectNames.map((name) =>
//           name.toLowerCase()
//         );

//         // Find subjects in the database where the lowercase version of the name matches
//         const subjects = await Subject.find({
//           name: {
//             $in: lowerCasedSubjectNames.map(
//               (name) => new RegExp(`^${name}$`, "i")
//             ),
//           },
//         });

//         const existingSubjectNames = subjects.map((subject) =>
//           subject.name.toLowerCase()
//         );

//         // Check if all subjects from the CSV exist in the database
//         const missingSubjects = lowerCasedSubjectNames.filter(
//           (subjectName) => !existingSubjectNames.includes(subjectName)
//         );

//         if (missingSubjects.length > 0) {
//           return next(
//             new AppError(
//               `Subjects not found: ${missingSubjects.join(", ")}`,
//               400
//             )
//           );
//         }

//         // Step 2: Proceed to upload questions if all subjects are verified
//         for (const row of results) {
//           const subject = subjects.find(
//             (subject) =>
//               subject.name.toLowerCase() === row["Subject Name"].toLowerCase()
//           );

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
//             subject: subject?._id,
//             mockTest: mockTest || [],
//             preparationTest: preparationTest || [],
//             questionBank: questionBank || [],
//             questionImageEnglish:
//               row["Question Image English"] !== "Null"
//                 ? row["Question Image English"]
//                 : "",
//             solutionImageEnglish:
//               row["Solution Image English"] !== "Null"
//                 ? row["Solution Image English"]
//                 : "",
//             optionImageEnglish: [
//               row["Option 1 Image English"] !== "Null"
//                 ? row["Option 1 Image English"]
//                 : "",
//               row["Option 2 Image English"] !== "Null"
//                 ? row["Option 2 Image English"]
//                 : "",
//               row["Option 3 Image English"] !== "Null"
//                 ? row["Option 3 Image English"]
//                 : "",
//               row["Option 4 Image English"] !== "Null"
//                 ? row["Option 4 Image English"]
//                 : "",
//             ],
//             questionImageHindi:
//               row["Question Image Hindi"] !== "Null"
//                 ? row["Question Image Hindi"]
//                 : "",
//             solutionImageHindi:
//               row["Solution Image Hindi"] !== "Null"
//                 ? row["Solution Image Hindi"]
//                 : "",
//             optionImageHindi: [
//               row["Option 1 Image Hindi"] !== "Null"
//                 ? row["Option 1 Image Hindi"]
//                 : "",
//               row["Option 2 Image Hindi"] !== "Null"
//                 ? row["Option 2 Image Hindi"]
//                 : "",
//               row["Option 3 Image Hindi"] !== "Null"
//                 ? row["Option 3 Image Hindi"]
//                 : "",
//               row["Option 4 Image Hindi"] !== "Null"
//                 ? row["Option 4 Image Hindi"]
//                 : "",
//             ],
//             solutionDetailEnglish:
//               row["Solution Detail English"] !== "Null"
//                 ? row["Solution Detail English"]
//                 : "",
//             solutionDetailHindi:
//               row["Solution Detail Hindi"] !== "Null"
//                 ? row["Solution Detail Hindi"]
//                 : "",
//             createdAt:
//               row["Created At"] !== "Null" ? row["Created At"] : Date.now(),

//             difficulty: row["Difficulty"]?.trim(),
//             isMcq: isMcq || false,
//             showAt: row["Created At"] !== "Null" ? row["Created At"] : null,
//           });

//           await question.save();
//         }

//         res.status(201).json({
//           status: true,
//           message: "Questions uploaded successfully",
//         });
//       } catch (error) {
//         console.log(error, "error");
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

// Helper function to convert dd-mm-yyyy to yyyy-mm-dd format
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
}

exports.importQuestionFromCsv = catchAsync(async (req, res, next) => {
  const { mockTest, preparationTest, questionBank, isMcq } = req.body;

  if (!req.files || !req.files.csvFile) {
    return next(new AppError("No file uploaded", 400));
  }

  const filePath = `${req.files.csvFile[0].destination}/${req.files.csvFile[0].filename}`;
  const results = [];
  const subjectNameRegex = /^[a-zA-Z\s]+$/;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const subjectNames = [
          ...new Set(
            results
              .map((row) => row["Subject Name"].trim())
              .filter((name) => subjectNameRegex.test(name))
          ),
        ];
        const lowerCasedSubjectNames = subjectNames.map((name) =>
          name.toLowerCase()
        );
        const subjects = await Subject.find({
          name: {
            $in: lowerCasedSubjectNames.map(
              (name) => new RegExp(`^${name}$`, "i")
            ),
          },
        });
        const existingSubjectNames = subjects.map((subject) =>
          subject.name.toLowerCase()
        );
        const missingSubjects = lowerCasedSubjectNames.filter(
          (subjectName) => !existingSubjectNames.includes(subjectName)
        );

        if (missingSubjects.length > 0) {
          return next(
            new AppError(
              `Subjects not found: ${missingSubjects.join(", ")}`,
              400
            )
          );
        }

        for (const row of results) {
          const subject = subjects.find(
            (subject) =>
              subject.name.toLowerCase() === row["Subject Name"].toLowerCase()
          );

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
            subject: subject?._id,
            mockTest: mockTest || [],
            preparationTest: preparationTest || [],
            questionBank: questionBank || [],
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
            solutionDetailHindi:
              row["Solution Detail Hindi"] !== "Null"
                ? row["Solution Detail Hindi"]
                : "",
            createdAt:
              row["Created At"] && row["Created At"] !== "Null"
                ? parseDate(row["Created At"])
                : Date.now(),
            difficulty: row["Difficulty"]?.trim(),
            isMcq: isMcq || false,
            showAt:
              row["Created At"] && row["Created At"] !== "Null"
                ? parseDate(row["Created At"])
                : null,
          });

          await question.save();
        }

        res.status(201).json({
          status: true,
          message: "Questions uploaded successfully",
        });
      } catch (error) {
        console.log(error, "error");
        next(new AppError("Error uploading questions", 500));
      } finally {
        fs.unlinkSync(filePath);
      }
    })
    .on("error", () => {
      return next(new AppError("Error reading the CSV file", 500));
    });
});
