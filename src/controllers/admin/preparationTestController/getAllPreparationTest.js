const PreparationTest = require("../../../models/preparationTest");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllPreparationTest = catchAsync(async (req, res) => {
  const { course, testType, search } = req.query;
  let query = {};
  if (course) query.course = course;
  if (testType) query.testType = testType;
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const preparationTest = await PreparationTest.find(query).select(
    "name thumbImage minute"
  );

  res.status(200).json({
    status: true,
    results: preparationTest.length,
    data: {
      preparationTest,
    },
  });
});
