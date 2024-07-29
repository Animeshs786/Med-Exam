const Subject = require("../../../models/subject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteSubject = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const subject = await Subject.findByIdAndDelete(id);

  if (!subject) {
    return next(new AppError("No subject found with that ID", 404));
  }

  res.status(200).json({
    status: true,
    message: "Subject deleted successfully",
  });
});