const PreviousPaper = require("../../../models/previousPaper");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getPreviousPaper = catchAsync(async (req, res, next) => {
  const { search, testType } = req.query;

  const previousPaper = await PreviousPaper.findById(req.params.id).populate(
    "mockTest"
  );

  if (!previousPaper) {
    return next(new AppError("No test series found with that ID", 404));
  }

  // Calculate overall statistics for the test series
  const totalMockTests = previousPaper.mockTest.length;
  const freeMockTests = previousPaper.mockTest.filter(
    (test) => !test.isPaid
  ).length;
  const fullTests = previousPaper.mockTest.filter(
    (test) => test.testType === "Full Test"
  ).length;
  const subjectTests = previousPaper.mockTest.filter(
    (test) => test.testType === "Subject Test"
  ).length;
  const previousPapers = previousPaper.mockTest.filter(
    (test) => test.testType === "Previous Paper"
  ).length;

  // Filter mock tests based on search and test type
  let filteredMockTests = previousPaper.mockTest;

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filteredMockTests = filteredMockTests.filter((mockTest) =>
      searchRegex.test(mockTest.name)
    );
  }

  if (testType) {
    filteredMockTests = filteredMockTests.filter(
      (mockTest) => mockTest.testType === testType
    );
  }

  res.status(200).json({
    status: true,
    message: "previousPaper fetched successfully",
    data: {
      previousPaper: {
        ...previousPaper.toObject(),
        mockTest: filteredMockTests,
      },
      totalMockTests,
      freeMockTests,
      fullTests,
      subjectTests,
      previousPapers,
    },
  });
});
