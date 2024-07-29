const mongoose = require("mongoose");

const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getMockTest = catchAsync(async (req, res, next) => {
  const mockTestId = req.params.id;
  console.log(mockTestId,"lsdfjls");

  // Perform the aggregation to look up questions and subjects associated with the mock test
  const mockTestWithDetails = await MockTest.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(mockTestId) },
    },
    {
      $lookup: {
        from: "questions",
        localField: "_id",
        foreignField: "mockTest",
        as: "questions",
      },
    },
    {
      $lookup: {
        from: "subjects",
        localField: "subjects",
        foreignField: "_id",
        as: "subjects",
      },
    },
    {
      $unwind: {
        path: "$subjects",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        "subjects.name": 1, // Sort subjects by name in ascending order
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        thumbImage: { $first: "$thumbImage" },
        subjects: { $push: "$subjects" },
        createdAt: { $first: "$createdAt" },
        questions: { $first: "$questions" },
      },
    },
    {
      $unwind: {
        path: "$questions",
        preserveNullAndEmptyArrays: true, // Include mock tests even if there are no questions
      },
    },
    {
      $lookup: {
        from: "subjects",
        localField: "questions.subject",
        foreignField: "_id",
        as: "questions.subject",
      },
    },
    {
      $unwind: {
        path: "$questions.subject",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        "questions.subject.name": 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        thumbImage: { $first: "$thumbImage" },
        subjects: { $first: "$subjects" },
        createdAt: { $first: "$createdAt" },
        questions: { $push: "$questions" },
      },
    },
  ]);

  

  if (!mockTestWithDetails || mockTestWithDetails.length === 0) {
    return next(new AppError("No mock test found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      mockTest: mockTestWithDetails[0],
    },
  });
});

