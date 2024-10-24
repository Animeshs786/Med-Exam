// const TestResult = require("../../../models/testResult");
// const MockTest = require("../../../models/mockTest");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.getLeaderboard = catchAsync(async (req, res, next) => {
//   const mockTestId = req.params.id;
//   const userId = req.user._id.toString();

//   const mockTest = await MockTest.findById(mockTestId);
//   if (!mockTest) {
//     return next(new AppError("Mock test not found", 404));
//   }

//   // Get all test results for the mock test
//   const testResults = await TestResult.find({ mockTest: mockTestId }).populate("user");

//   if (testResults.length === 0) {
//     return next(new AppError("No test results found for this mock test", 404));
//   }

//   // Sort test results by totalMarks in descending order
//   testResults.sort((a, b) => b.totalMarks - a.totalMarks);

//   // Calculate ranks considering ties
//   let currentRank = 1;
//   let previousScore = testResults[0].totalMarks;
//   testResults[0].rank = currentRank;

//   for (let i = 1; i < testResults.length; i++) {
//     if (testResults[i].totalMarks < previousScore) {
//       currentRank = i + 1;
//     }
//     testResults[i].rank = currentRank;
//     previousScore = testResults[i].totalMarks;
//   }

//   // Map sorted test results to leaderboard format
//   const leaderboard = testResults.map(result => ({
//     name: result.user.name,
//     profileImage: result.user.profileImage || "",
//     rank: result.rank,
//     score: result.totalMarks,
//     totalScore: mockTest.totalMarks,
//   }));

//   // Find current user's rank
//   const currentUserResult = testResults.find(result => result.user._id.toString() === userId);
//   const currentUser = currentUserResult
//     ? {
//         name: currentUserResult.user.name,
//         profileImage: currentUserResult.user.profileImage || "",
//         rank: currentUserResult.rank,
//         score: currentUserResult.totalMarks,
//         totalScore: mockTest.totalMarks,
//       }
//     : null;

//   res.status(200).json({
//     status:true,
//     message: "Leaderboard fetched successfully",
//     mockTest: mockTest.name,
//     totalUser: testResults.length,
//     users: leaderboard,
//     currentUser: currentUser,
//   });
// });

// const TestResult = require("../../../models/testResult");
// const MockTest = require("../../../models/mockTest");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");

// exports.getLeaderboard = catchAsync(async (req, res, next) => {
//   const mockTestId = req.params.id;
//   const userId = req.user._id.toString();

//   const mockTest = await MockTest.findById(mockTestId);
//   if (!mockTest) {
//     return next(new AppError("Mock test not found", 404));
//   }

//   // Get all test results for the mock test
//   const testResults = await TestResult.find({ mockTest: mockTestId }).populate(
//     "user"
//   );

//   if (testResults.length === 0) {
//     return next(new AppError("No test results found for this mock test", 404));
//   }

//   // Sort test results by totalMarks in descending order
//   testResults.sort((a, b) => b.totalMarks - a.totalMarks);

//   // Calculate ranks considering ties
//   let currentRank = 1;
//   let previousScore = testResults[0].totalMarks;
//   testResults[0].rank = currentRank;

//   for (let i = 1; i < testResults.length; i++) {
//     if (testResults[i].totalMarks < previousScore) {
//       currentRank = i + 1;
//     }
//     testResults[i].rank = currentRank;
//     previousScore = testResults[i].totalMarks;
//   }

//   // Map sorted test results to leaderboard format
//   const leaderboard = testResults.map((result) => ({
//     name: result.user.name,
//     profileImage: result.user.profileImage || "",
//     rank: result.rank,
//     score: result.totalMarks,
//     totalScore: mockTest.totalMarks,
//   }));

//   // Find current user's rank
//   const currentUserResult = testResults.find(
//     (result) => result.user._id.toString() === userId
//   );
//   const currentUser = currentUserResult
//     ? {
//         name: currentUserResult.user.name,
//         profileImage: currentUserResult.user.profileImage || "",
//         rank: currentUserResult.rank,
//         score: currentUserResult.totalMarks,
//         totalScore: mockTest.totalMarks,
//       }
//     : null;

//   res.status(200).json({
//     status: true,
//     message: "Leaderboard fetched successfully",
//     mockTest: mockTest.name,
//     totalUser: testResults.length,
//     users: leaderboard,
//     currentUser: currentUser,
//   });
// });

// const TestResult = require("../../../models/testResult");
// const MockTest = require("../../../models/mockTest");
// const catchAsync = require("../../../utils/catchAsync");
// const AppError = require("../../../utils/AppError");
// const mongoose = require("mongoose");

// exports.getLeaderboard = catchAsync(async (req, res, next) => {
//   const mockTestId = req.params.id;
//   const userId = req.user._id.toString();

//   const mockTest = await MockTest.findById(mockTestId);
//   if (!mockTest) {
//     return next(new AppError("Mock test not found", 404));
//   }

//   const testResults = await TestResult.aggregate([
//     { $match: { mockTest: new mongoose.Types.ObjectId(mockTestId) } },
//     {
//       $sort: { user: 1, createdAt: -1 },
//     },
//     {
//       $group: {
//         _id: "$user",
//         latestResult: { $first: "$$ROOT" },
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     {
//       $unwind: "$user",
//     },
//   ]);

//   if (testResults.length === 0) {
//     return next(new AppError("No test results found for this mock test", 404));
//   }

//   testResults.sort(
//     (a, b) => b.latestResult.totalMarks - a.latestResult.totalMarks
//   );

//   let currentRank = 1;
//   let previousScore = testResults[0].latestResult.totalMarks;
//   testResults[0].latestResult.rank = currentRank;

//   for (let i = 1; i < testResults.length; i++) {
//     if (testResults[i].latestResult.totalMarks < previousScore) {
//       currentRank = i + 1;
//     }
//     testResults[i].latestResult.rank = currentRank;
//     previousScore = testResults[i].latestResult.totalMarks;
//   }

//   const leaderboard = testResults.map((result) => ({
//     name: result.user.name,
//     profileImage: result.user.profileImage || "",
//     rank: result.latestResult.rank,
//     score: result.latestResult.totalMarks,
//     totalScore: mockTest.totalMarks,
//   }));

//   const currentUserResult = testResults.find(
//     (result) => result.latestResult.user._id.toString() === userId
//   );
//   const currentUser = currentUserResult
//     ? {
//         name: currentUserResult.user.name,
//         profileImage: currentUserResult.user.profileImage || "",
//         rank: currentUserResult.rank,
//         score: currentUserResult.latestResult.totalMarks,
//         totalScore: mockTest.totalMarks,
//       }
//     : null;

//   res.status(200).json({
//     status: true,
//     message: "Leaderboard fetched successfully",
//     mockTest: mockTest.name,
//     totalUser: testResults.length,
//     users: leaderboard,
//     currentUser: currentUser,
//   });
// });

const TestResult = require("../../../models/testResult");
const MockTest = require("../../../models/mockTest");
const PreparationTest = require("../../../models/preparationTest");
const QuestionBank = require("../../../models/questionBank");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const mongoose = require("mongoose");

exports.getLeaderboard = catchAsync(async (req, res, next) => {
  const { mockTestId, preparationTestId, questionBankId } = req.query;
  const userId = req.user._id.toString();

  let testCriteria = {};

  // Check if any of the test types are provided and set the matching criteria
  if (mockTestId) {
    testCriteria.mockTest = new mongoose.Types.ObjectId(mockTestId);
  } else if (preparationTestId) {
    testCriteria.preparationTest = new mongoose.Types.ObjectId(
      preparationTestId
    );
  } else if (questionBankId) {
    testCriteria.questionBank = new mongoose.Types.ObjectId(questionBankId);
  } else {
    return next(new AppError("Test ID not provided in query", 400));
  }

  let testDetails;
  if (mockTestId) {
    testDetails = await MockTest.findById(mockTestId);
    if (!testDetails) {
      return next(new AppError("Mock test not found", 404));
    }
  } else if (preparationTestId) {
    testDetails = await PreparationTest.findById(preparationTestId);
    if (!testDetails) {
      return next(new AppError("Preparation test not found", 404));
    }
  } else if (questionBankId) {
    testDetails = await QuestionBank.findById(questionBankId);
    if (!testDetails) {
      return next(new AppError("Question bank not found", 404));
    }
  }

  const testResults = await TestResult.aggregate([
    { $match: testCriteria },
    {
      $sort: { user: 1, createdAt: -1 },
    },
    {
      $group: {
        _id: "$user",
        latestResult: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ]);

  if (testResults.length === 0) {
    return next(
      new AppError("No test results found for the selected test", 404)
    );
  }

  // Sort results by total marks
  testResults.sort(
    (a, b) => b.latestResult.totalMarks - a.latestResult.totalMarks
  );

  // Calculate ranks based on score
  let currentRank = 1;
  let previousScore = testResults[0].latestResult.totalMarks;
  testResults[0].latestResult.rank = currentRank;

  for (let i = 1; i < testResults.length; i++) {
    if (testResults[i].latestResult.totalMarks < previousScore) {
      currentRank = i + 1;
    }
    testResults[i].latestResult.rank = currentRank;
    previousScore = testResults[i].latestResult.totalMarks;
  }

  const leaderboard = testResults.map((result) => ({
    name: result.user.name || "",
    profileImage: result.user.profileImage || "",
    rank: result.latestResult.rank,
    score: result.latestResult.totalMarks,
    totalScore: testDetails.totalMarks,
  }));

  const currentUserResult = testResults.find(
    (result) => result.latestResult.user._id.toString() === userId
  );

  const currentUser = currentUserResult
    ? {
        name: currentUserResult.user.name || "",
        profileImage: currentUserResult.user.profileImage || "",
        rank: currentUserResult.latestResult.rank,
        score: currentUserResult.latestResult.totalMarks,
        totalScore: testDetails.totalMarks,
      }
    : null;

  res.status(200).json({
    status: true,
    message: "Leaderboard fetched successfully",
    testName: testDetails.name,
    totalUser: testResults.length,
    users: leaderboard,
    currentUser: currentUser,
  });
});
