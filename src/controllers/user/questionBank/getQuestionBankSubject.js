const mongoose = require("mongoose");

const catchAsync = require("../../../utils/catchAsync");
const QuestionBank = require("../../../models/questionBank");

exports.getQuestionBankSubject = catchAsync(async (req, res) => {
    const userId = req.user._id;
  
    try {
      const data = await QuestionBank.aggregate([
        {
          $lookup: {
            from: "subjects",
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
            from: "testresults",
            let: {
              questionBankId: "$_id", // Define questionBankId properly here
              userId: new mongoose.Types.ObjectId(userId),
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$questionBank", "$$questionBankId"] }, // Match using $$questionBankId
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
        message: "Test series subject fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching test series subjects:", error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  });
  