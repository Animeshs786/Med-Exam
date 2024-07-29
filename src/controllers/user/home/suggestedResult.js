const Course = require("../../../models/course");
const Note = require("../../../models/notes");
const TestSeries = require("../../../models/testSeries");
const catchAsync = require("../../../utils/catchAsync");

const getRandomDocuments = async (Model, count) => {
  const total = await Model.countDocuments().exec();
  const random = Math.floor(Math.random() * total);
  const documents = await Model.find()
    .select("name thumbImage logo")
    .skip(random)
    .limit(count)
    .exec();
  return documents;
};

exports.suggestedResult = catchAsync(async (req, res) => {
  const [randomCourses, randomNotes, randomTestSeries] = await Promise.all([
    getRandomDocuments(Course, 3),
    getRandomDocuments(Note, 3),
    getRandomDocuments(TestSeries, 3),
  ]);

  const results = [
    ...randomNotes.map((note) => ({ type: "note", data: note })),
    ...randomCourses.map((course) => ({ type: "course", data: course })),
    ...randomTestSeries.map((testSeries) => ({
      type: "testSeries",
      data: testSeries,
    })),
  ];

  res.status(200).json({
    status: true,
    message: "Search suggestions retrieved successfully",
    data: results,
  });
});
