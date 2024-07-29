const TestResult = require("../../../models/testResult");
const MockTest = require("../../../models/mockTest");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.getLeaderboard = catchAsync(async (req, res, next) => {
  const mockTestId = req.params.id;
  const userId = req.user._id.toString();

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    return next(new AppError("Mock test not found", 404));
  }

  // Get all test results for the mock test
  const testResults = await TestResult.find({ mockTest: mockTestId }).populate("user");

  if (testResults.length === 0) {
    return next(new AppError("No test results found for this mock test", 404));
  }

  // Sort test results by totalMarks in descending order
  testResults.sort((a, b) => b.totalMarks - a.totalMarks);

  // Calculate ranks considering ties
  let currentRank = 1;
  let previousScore = testResults[0].totalMarks;
  testResults[0].rank = currentRank;

  for (let i = 1; i < testResults.length; i++) {
    if (testResults[i].totalMarks < previousScore) {
      currentRank = i + 1;
    }
    testResults[i].rank = currentRank;
    previousScore = testResults[i].totalMarks;
  }

  // Map sorted test results to leaderboard format
  const leaderboard = testResults.map(result => ({
    name: result.user.name,
    profileImage: result.user.profileImage || "",
    rank: result.rank,
    score: result.totalMarks,
    totalScore: mockTest.totalMarks,
  }));

  // Find current user's rank
  const currentUserResult = testResults.find(result => result.user._id.toString() === userId);
  const currentUser = currentUserResult
    ? {
        name: currentUserResult.user.name,
        profileImage: currentUserResult.user.profileImage || "",
        rank: currentUserResult.rank,
        score: currentUserResult.totalMarks,
        totalScore: mockTest.totalMarks,
      }
    : null;

  res.status(200).json({
    status:true,
    message: "Leaderboard fetched successfully",
    mockTest: mockTest.name,
    totalUser: testResults.length,
    users: leaderboard,
    currentUser: currentUser,
  });
});
