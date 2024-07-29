const Mentor = require("../../../models/mentor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const generateOtp = require("../../../utils/generateOtp");

exports.signUp = catchAsync(async (req, res, next) => {
  let { mobile } = req.body;

  if (!mobile) throw new AppError("Mobile number is required.", 400);
  mobile = String(mobile).trim();

  if (
    isNaN(mobile) ||
    mobile.includes("e") ||
    mobile.includes(".") ||
    mobile.length > 10
  ) {
    return next(new AppError("Invalid mobile number.", 400));
  }

  const otp = generateOtp();

  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

  // Send OTP to mobile
  //   await sendOtpTomobile(mobile, otp);

  // Find user by mobile number
  let user = await Mentor.findOne({ mobile });

  if (!user) {
    user = await Mentor.create({ mobile });
  }

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();
  user.otp = undefined;

  return res.status(200).json({
    status: true,
    message: "OTP has been sent",
    data: {
      mobile: user.mobile,
      otpExpiry: user.otpExpiry,
      user,
    },
  });
});
