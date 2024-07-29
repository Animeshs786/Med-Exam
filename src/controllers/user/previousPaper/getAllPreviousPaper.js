const PreviousPaper = require("../../../models/previousPaper");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllPreviousPaper = catchAsync(async (req, res) => {
  const previousPaper = await PreviousPaper.aggregate([
    {
      $lookup: {
        from: "mocktests",
        localField: "_id",
        foreignField: "previousPaper",
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
    results: previousPaper.length,
    message: "Previous paper fetched successfully",
    data: {
      previousPaper,
    },
  });
});
