const mongoose = require("mongoose");

const TestSeries = require("../../../models/testSeries");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.getAllTestSeries = catchAsync(async (req, res, next) => {
  const { search, course } = req.query;

  if (!course) return next(new AppError("Please provide a course", 400));

  const pipeline = [];

  if (search) {
    pipeline.push({
      $match: {
        name: { $regex: search, $options: "i" },
      },
    });
  }

  if (course) {
    pipeline.push({
      $match: {
        course: new mongoose.Types.ObjectId(course),
      },
    });
  }

  pipeline.push(
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
    }
  );

  const testSeries = await TestSeries.aggregate(pipeline);

  res.status(200).json({
    status: true,
    results: testSeries.length,
    message: "Test Series fetched successfully",
    data: {
      testSeries,
    },
  });
});
