const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateMobile = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { mobile } = req.body;

  if (!mobile) return next(new AppError("Mobile is required", 400));

  const existMobile = await User.findOne({ mobile });

  if (existMobile) return next(new AppError("Mobile already exist", 400));

  const user = await User.findByIdAndUpdate(userId, { mobile }, { new: true });

  res.status(200).json({
    status: true,
    message: "Mobile updated successfully",
    data: user,
  });
});
