const MockTest = require("../../../models/mockTest");
const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");

exports.cloneMockTest = async (req, res, next) => {
  try {
    const { mockId, testSeriesId } = req.body;

    const originalMock = await MockTest.findById(mockId);
    if (!originalMock) {
      return next(new AppError("Mock test not found", 404));
    }

    const clonedMockData = originalMock.toObject();
    delete clonedMockData._id;

    const clonedMock = new MockTest({
      ...clonedMockData,
      name: `${originalMock.name} clone`,
      testSeries: testSeriesId,
      createdAt: Date.now(),
    });
    await clonedMock.save();

    const questions = await Question.find({ mockTest: mockId });

    for (const question of questions) {
      question.mockTest.push(clonedMock._id);
      await question.save(); 
    }

    res.status(201).json({
      message: "Mock test cloned successfully",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
