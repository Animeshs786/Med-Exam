const mongoose = require("mongoose");

const TestResult = require("../../../models/testResult");
const Subject = require("../../../models/subject");
const catchAsync = require("../../../utils/catchAsync");
const PreparationTest = require("../../../models/preparationTest");

exports.getPreparationTestSubject = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { course } = req.query;

  try {
    const data = await PreparationTest.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(course),
          // testType: "Subject Test",
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
            preparationTestId: "$_id",
            userId: new mongoose.Types.ObjectId(userId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$preparationTest", "$$preparationTestId"] },
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
      {
        $sort: { name: 1 }, 
      },
    ]);

    res.status(200).json({
      status: true,
      data: data,
      message: "Preparatoin test subject fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching test series subjects:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});
