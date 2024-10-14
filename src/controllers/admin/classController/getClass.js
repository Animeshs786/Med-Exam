const Class = require("../../../models/class");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getClass = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const singleClass = await Class.findById(id);

  if (!singleClass) {
    return next(new AppError("Class not found", 404));
  }

  res.status(200).json({
    status: true,
    data: {
      class: singleClass,
    },
  });
});
