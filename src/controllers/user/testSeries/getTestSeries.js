const TestSeries = require("../../../models/testSeries");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getTestSeries = catchAsync(async (req, res, next) => {
  const { search, testType } = req.query;

  const testSeries = await TestSeries.findById(req.params.id).populate(
    "mockTest"
  );

  if (!testSeries) {
    return next(new AppError("No test series found with that ID", 404));
  }

  // Calculate overall statistics for the test series
  const totalMockTests = testSeries.mockTest.length;
  const freeMockTests = testSeries.mockTest.filter(
    (test) => !test.isPaid
  ).length;
  const fullTests = testSeries.mockTest.filter(
    (test) => test.testType === "Full Test"
  ).length;
  const subjectTests = testSeries.mockTest.filter(
    (test) => test.testType === "Subject Test"
  ).length;
  const previousPapers = testSeries.mockTest.filter(
    (test) => test.testType === "Previous Paper"
  ).length;

  // Filter mock tests based on search and test type
  let filteredMockTests = testSeries.mockTest;

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
    message: "TestSeries fetched successfully",
    data: {
      testSeries: {
        ...testSeries.toObject(),
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
