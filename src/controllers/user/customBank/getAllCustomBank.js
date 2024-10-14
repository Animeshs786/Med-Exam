// const catchAsync = require("../../../utils/catchAsync");
// const CustomQueBank = require("../../../models/customQueBank");

// exports.getAllCustomBank = catchAsync(async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const customQueBank = await CustomQueBank.find({
//       user: userId,
//     }).sort("-createdAt");

//     return res.status(200).json({
//       status: true,
//       message: "Custom Question Bank fetched successfully",
//       data: {
//         customQueBank,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// });

// const mongoose = require("mongoose");
// const catchAsync = require("../../../utils/catchAsync");
// const CustomQueBank = require("../../../models/customQueBank");
// const TestResult = require("../../../models/testResult");

// exports.getAllCustomBank = catchAsync(async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const customQueBanks = await CustomQueBank.aggregate([
//       {
//         $lookup: {
//           from: "testresults",
//           let: {
//             customBankId: "$_id",
//             userId: new mongoose.Types.ObjectId(userId),
//           },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$preparationTest", "$$customBankId"] },
//                     { $eq: ["$user", "$$userId"] },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "testResult",
//         },
//       },
//       {
//         $addFields: {
//           attempted: { $gt: [{ $size: "$testResult" }, 0] },
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           totalQuestions: 1,
//           testType: 1,
//           user: 1,
//           createdAt: 1,
//           attempted: 1,
//         },
//       },
//     ]);

//     return res.status(200).json({
//       status: true,
//       message: "Custom Question Bank fetched successfully",
//       data: { customQueBank: customQueBanks },
//     });
//   } catch (error) {
//     console.error("Error fetching custom question banks:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// });



const mongoose = require("mongoose");
const catchAsync = require("../../../utils/catchAsync");
const CustomQueBank = require("../../../models/customQueBank");
const TestResult = require("../../../models/testResult");

exports.getAllCustomBank = catchAsync(async (req, res) => {
  const userId = req.user._id; // Get the authenticated user's ID

  try {
    const customQueBanks = await CustomQueBank.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId), // Filter by the authenticated user
        },
      },
      {
        $lookup: {
          from: "testresults", // Lookup in the test results collection
          let: {
            customBankId: "$_id",
            userId: new mongoose.Types.ObjectId(userId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$preparationTest", "$$customBankId"] }, // Match preparation test with custom bank ID
                    { $eq: ["$user", "$$userId"] }, // Match test result's user with authenticated user
                  ],
                },
              },
            },
          ],
          as: "testResult",
        },
      },
      {
        $addFields: {
          attempted: { $gt: [{ $size: "$testResult" }, 0] }, // Add an "attempted" field based on the size of testResult
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalQuestions: 1,
          testType: 1,
          user: 1,
          createdAt: 1,
          attempted: 1,
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Custom Question Bank fetched successfully",
      data: { customQueBank: customQueBanks },
    });
  } catch (error) {
    console.error("Error fetching custom question banks:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});
