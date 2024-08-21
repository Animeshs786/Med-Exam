const mongoose = require("mongoose");
const MockTest = require("../../../models/mockTest");
const TestResult = require("../../../models/testResult");
const Subject = require("../../../models/subject");
const catchAsync = require("../../../utils/catchAsync");

exports.getTestSeriesSubject = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { testSeriesId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(testSeriesId)) {
    return res.status(400).json({ error: "Invalid testSeriesId" });
  }

  try {
    const data = await MockTest.aggregate([
      {
        $match: {
          testSeries: new mongoose.Types.ObjectId(testSeriesId),
          testType: "Subject Test",
        },
      },
      {
        $lookup: {
          from: "subjects", // Name of the Subject collection
          localField: "subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },
      {
        $lookup: {
          from: "testresults", // Name of the TestResult collection
          let: {
            mockTestId: "$_id",
            userId: new mongoose.Types.ObjectId(userId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$mockTest", "$$mockTestId"] },
                    { $eq: ["$user", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "userTestResult",
        },
      },
      {
        $group: {
          _id: "$subject._id",
          name: { $first: "$subject.name" },
          thumbImage: { $first: "$subject.thumbImage" },
          totalTest: { $sum: 1 },
          attemptTest: {
            $sum: {
              $cond: [{ $gt: [{ $size: "$userTestResult" }, 0] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          thumbImage: 1,
          totalTest: 1,
          attemptTest: 1,
        },
      },
    ]);

    res.status(200).json({
      status: true,
      data: data,
      message: "Test series subject fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching test series subjects:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});
