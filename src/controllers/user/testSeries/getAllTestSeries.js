const TestSeries = require("../../../models/testSeries");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllTestSeries = catchAsync(async (req, res) => {
  const testSeries = await TestSeries.aggregate([
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
