const catchAsync = require("../../../utils/catchAsync");
const Question = require("../../../models/question");
const CustomQueBank = require("../../../models/customQueBank");
const AppError = require("../../../utils/AppError");

exports.deleteCustomBank = catchAsync(async (req, res, next) => {
  try {
    const  customBankId  = req.params.id;
    const userId = req.user.id;

    const customQueBank = await CustomQueBank.findOne({
      _id: customBankId,
      user: userId,
    });

    if (!customQueBank) {
      return next(new AppError("Custom Question Bank not found", 404));
    }

    await Question.updateMany(
      { customBank: customBankId },
      { $pull: { customBank: customBankId } }
    );

    await CustomQueBank.findByIdAndDelete(customBankId);

    return res.status(200).json({
      status: true,
      message: "Custom Question Bank deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});
