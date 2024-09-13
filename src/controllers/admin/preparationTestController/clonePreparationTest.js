const PreparationTest = require("../../../models/preparationTest");
const Question = require("../../../models/question");
const AppError = require("../../../utils/AppError");

exports.clonePreparationTest = async (req, res, next) => {
  try {
    const { preparationId, courseId } = req.body;

    const originalPreparation = await PreparationTest.findById(preparationId);
    if (!originalPreparation) {
      return next(new AppError("Preparation test not found", 404));
    }

    if (!courseId) {
      return next(new AppError("Course ID is required to clone the test", 400));
    }

    const clonePreparationData = originalPreparation.toObject();
    delete clonePreparationData._id; 

    const clonePreparation = new PreparationTest({
      ...clonePreparationData,
      name: `${originalPreparation.name} clone`,
      course: courseId, 
      createdAt: Date.now(),
    });

    await clonePreparation.save();

    const questions = await Question.find({ preparationTest: preparationId });

    for (const question of questions) {
      question.preparationTest.push(clonePreparation._id);
      await question.save();
    }


    res.status(201).json({
      message: "Preparation test cloned successfully",
      status: true,
      clonedTestId: clonePreparation._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
