const mongoose = require("mongoose");
const catchAsync = require("../../../utils/catchAsync");
const Question = require("../../../models/question");
const CustomQueBank = require("../../../models/customQueBank");

exports.createCustomBank = catchAsync(async (req, res) => {
  try {
    const { name, totalQuestions, difficulty, subjectId, testType } = req.body;
    const userId = req.user.id;
    const subjectObjectIds = subjectId.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    let query = {
      subject: { $in: subjectObjectIds },
    };

    if (difficulty !== "All") {
      query.difficulty = difficulty;
    }

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: +totalQuestions } }, 
    ]);

    // If not enough questions found
    if (questions.length < +totalQuestions) {
      return res
        .status(400)
        .json({ message: "Not enough questions available" });
    }

    // Create a new custom question bank
    const customQueBank = new CustomQueBank({
      name,
      totalQuestions: questions.length,
      testType,
      user: userId,
    });

    await customQueBank.save();

    const customBankId = customQueBank._id;
    await Question.updateMany(
      { _id: { $in: questions.map((q) => q._id) } },
      { $push: { customBank: customBankId } }
    );

    return res.status(201).json({
      status: true,
      message: "Custom Question Bank created successfully",
      data: { customQueBank },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, error });
  }
});
