// const Course = require("../../../models/course");
// const Note = require("../../../models/notes");
// const PreparationTest = require("../../../models/preparationTest");
// const QuestionBank = require("../../../models/questionBank");
// const TestSeries = require("../../../models/testSeries");
// const catchAsync = require("../../../utils/catchAsync");
// const { escapeRegex } = require("../../../utils/excapeRegex");

// const globalSearch = catchAsync(async (req, res) => {
//   const search = req.query.search?.trim();

//   if (!search) {
//     return res.status(400).json({
//       status: false,
//       message: "Search term is required",
//     });
//   }

//   const searchCriteria = {
//     name: { $regex: escapeRegex(search), $options: "i" },
//   };

//   const [notes, courses, testSeries,preparationTest,questionBank] = await Promise.all([
//     Note.find(searchCriteria).select("name thumbImage logo").exec(),
//     Course.find(searchCriteria).select("name thumbImage logo").exec(),
//     TestSeries.find(searchCriteria).select("name thumbImage logo").exec(),
//     PreparationTest.find(searchCriteria).select("name thumbImage logo").exec(),
//     QuestionBank.find(searchCriteria).select("name thumbImage logo").exec(),
//   ]);

//   const results = [
//     ...notes.map((note) => ({ type: "note", data: note })),
//     ...courses.map((course) => ({ type: "course", data: course })),
//     ...testSeries.map((testSeries) => ({
//       type: "testSeries",
//       data: testSeries,
//     })),
//     ...preparationTest.map((preparationTest) => ({
//       type: "preparationTest",
//       data: preparationTest,
//     })),
//     ...questionBank.map((questionBank) => ({
//       type: "questionBank",
//       data: questionBank,
//     })),
//   ];

//   res.status(200).json({
//     status: true,
//     message:
//       results.length > 0
//         ? "Search results retrieved successfully"
//         : "No results found!",
//     data: results,
//   });
// });

// module.exports = globalSearch;

const Course = require("../../../models/course");
const Note = require("../../../models/notes");
const PreparationTest = require("../../../models/preparationTest");
const QuestionBank = require("../../../models/questionBank");
const TestSeries = require("../../../models/testSeries");
const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");
const { escapeRegex } = require("../../../utils/excapeRegex");

const getRandomDocuments = async (Model, count) => {
  const total = await Model.countDocuments().exec();
  const random = Math.floor(Math.random() * total);
  const documents = await Model.find()
    .select("name thumbImage logo course")
    .skip(random)
    .limit(count)
    .exec();
  return documents;
};

const globalSearch = catchAsync(async (req, res) => {
  const search = req.query.search?.trim();
  const userId = req.user._id;
  if (search) {
    // Fetch user's transactions to determine purchased courses
    const userTransactions = await Transaction.find({
      user: userId,
      orderStatus: "success",
    })
      .select("item")
      .exec();
    const purchasedCourseIds = userTransactions.map((transaction) =>
      transaction.item.toString()
    );

    const searchCriteria = {
      name: { $regex: escapeRegex(search), $options: "i" },
    };

    const [notes, courses, testSeries, preparationTest, questionBank] =
      await Promise.all([
        Note.find(searchCriteria)
          .populate("course")
          .select("name thumbImage course")
          .exec(),
        Course.find(searchCriteria).select("name thumbImage logo").exec(),
        TestSeries.find(searchCriteria)
          .populate("course")
          .select("name thumbImage logo course")
          .exec(),
        PreparationTest.find(searchCriteria)
          .populate("course")
          .select("name thumbImage course")
          .exec(),
        QuestionBank.find(searchCriteria)
          // .populate("course")
          .select("name thumbImage course")
          .exec(),
      ]);

    const results = [
      ...notes.map((note) => ({
        type: "note",
        data: {
          ...note.toObject(),
          courseId: note.course?._id || null,
          isPurchased:
            note.course &&
            purchasedCourseIds.includes(note.course._id.toString()),
          course: undefined,
        },
      })),
      ...courses.map((course) => ({
        type: "course",
        data: {
          ...course.toObject(),
          courseId: course._id,
          isPurchased: purchasedCourseIds.includes(course._id.toString()),
          course: undefined,
        },
      })),
      ...testSeries.map((test) => ({
        type: "testSeries",
        data: {
          ...test.toObject(),
          courseId: test.course?._id || null,
          isPurchased:
            test.course &&
            purchasedCourseIds.includes(test.course._id.toString()),
          course: undefined,
        },
      })),
      ...preparationTest.map((test) => ({
        type: "preparationTest",
        data: {
          ...test.toObject(),
          courseId: test.course?._id || null,
          isPurchased:
            test.course &&
            purchasedCourseIds.includes(test.course._id.toString()),
          course: undefined,
        },
      })),
      ...questionBank.map((qb) => ({
        type: "questionBank",
        data: {
          ...qb.toObject(),
          courseId: qb.course?._id || null,
          isPurchased: true,
          course: undefined,
        },
      })),
    ];

    res.status(200).json({
      status: true,
      message:
        results.length > 0
          ? "Search results retrieved successfully"
          : "No results found!",
      data: results,
    });
  } else {
    // Fetch user's transactions to determine purchased courses
    const userTransactions = await Transaction.find({
      user: userId,
      orderStatus: "success",
    })
      .select("item")
      .exec();
    const purchasedCourseIds = userTransactions.map((transaction) =>
      transaction.item.toString()
    );

    const [randomCourses, randomNotes, randomTestSeries] = await Promise.all([
      getRandomDocuments(Course, 3),
      getRandomDocuments(Note, 3),
      getRandomDocuments(TestSeries, 3),
    ]);

    const results = [
      ...randomNotes.map((note) => ({
        type: "note",
        data: {
          ...note.toObject(),
          courseId: note.course?._id || null,
          isPurchased:
            note.course &&
            purchasedCourseIds.includes(note.course._id.toString()),
        },
      })),
      ...randomCourses.map((course) => ({
        type: "course",
        data: {
          ...course.toObject(),
          courseId: course._id,
          isPurchased: purchasedCourseIds.includes(course._id.toString()),
        },
      })),
      ...randomTestSeries.map((testSeries) => ({
        type: "testSeries",
        data: {
          ...testSeries.toObject(),
          courseId: testSeries.course?._id || null,
          isPurchased:
            testSeries.course &&
            purchasedCourseIds.includes(testSeries.course._id.toString()),
        },
      })),
    ];

    res.status(200).json({
      status: true,
      message: "Search suggestions retrieved successfully",
      data: results,
    });
  }
});

module.exports = globalSearch;
