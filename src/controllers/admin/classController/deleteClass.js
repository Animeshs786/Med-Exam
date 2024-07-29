const Class = require("../../../models/class");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteClass = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const classToDelete = await Class.findByIdAndDelete(id);

  if (!classToDelete) {
    return next(new AppError("Class not found", 404));
  }

  res.status(204).json({
    status: true,
    message: "Class deleted successfully",
    data: null,
  });
});
