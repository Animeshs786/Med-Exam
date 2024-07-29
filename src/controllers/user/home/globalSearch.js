const Course = require("../../../models/course");
const Note = require("../../../models/notes");
const TestSeries = require("../../../models/testSeries");
const catchAsync = require("../../../utils/catchAsync");
const { escapeRegex } = require("../../../utils/excapeRegex");

const globalSearch = catchAsync(async (req, res) => {
  const search = req.query.search?.trim();

  if (!search) {
    return res.status(400).json({
      status: false,
      message: "Search term is required",
    });
  }

  const searchCriteria = {
    name: { $regex: escapeRegex(search), $options: "i" },
  };

  const [notes, courses, testSeries] = await Promise.all([
    Note.find(searchCriteria).select("name thumbImage logo").exec(),
    Course.find(searchCriteria).select("name thumbImage logo").exec(),
    TestSeries.find(searchCriteria).select("name thumbImage logo").exec(),
  ]);

  const results = [
    ...notes.map((note) => ({ type: "note", data: note })),
    ...courses.map((course) => ({ type: "course", data: course })),
    ...testSeries.map((testSeries) => ({
      type: "testSeries",
      data: testSeries,
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
});

module.exports = globalSearch;
