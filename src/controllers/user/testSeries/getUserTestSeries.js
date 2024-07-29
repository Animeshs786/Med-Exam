const TestSeries = require("../../../models/testSeries");
const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getUserTestSeries = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) return next(new AppError("User not found", 404));

  const testSeries = await TestSeries.aggregate([
    {
      $match: { exam: { $in: user.exam } },
    },
    {
      $lookup: {
        from: "mocktests",
        localField: "_id",
        foreignField: "testSeries",
        as: "mockTests",
      },
    },
    {
      $addFields: {
        totalMockTests: { $size: "$mockTests" },
        freeMockTests: {
          $size: {
            $filter: {
              input: "$mockTests",
              as: "mockTest",
              cond: { $eq: ["$$mockTest.isPaid", false] },
            },
          },
        },
      },
    },
    {
      $project: {
        mockTests: 0,
      },
    },
  ]);

  res.status(200).json({
    status: true,
    results: testSeries.length,
    message: "Test Series fetched successfully",
    data: {
      testSeries,
    },
  });
});
