// const User = require("../../../models/user");
// const AppError = require("../../../utils/AppError");
// const catchAsync = require("../../../utils/catchAsync");
// const generateOtp = require("../../../utils/generateOtp");
// const axios = require("axios");

// exports.signUp = catchAsync(async (req, res, next) => {
//   let { mobile, email } = req.body;
//   let newUser = false;

//   if (mobile) {
//     if (!mobile) throw new AppError("Mobile number is required.", 400);
//     mobile = String(mobile).trim();

//     if (
//       isNaN(mobile) ||
//       mobile.includes("e") ||
//       mobile.includes(".") ||
//       mobile.length > 10
//     ) {
//       return next(new AppError("Invalid mobile number.", 400));
//     }

//     const otp = generateOtp();

//     // async function send_otp(number, otp) {
//     //   const options = {
//     //     method: "POST",
//     //     url: "https://api.msg91.com/api/v5/flow/",
//     //     headers: {
//     //       authkey: process.env.MSI_AUTH_KEY,
//     //       "content-type": "application/JSON",
//     //       Cookie: "PHPSESSID=p6sigj223tdkhtfnq7l41tplh3",
//     //     },
//     //     data: {
//     //       flow_id: process.env.FLOW_ID,
//     //       sender: "DILLIS",
//     //       mobiles: "91" + number,
//     //       otp: otp,
//     //     },
//     //   };
//     //   try {
//     //     await axios(options);
//     //   } catch (error) {
//     //     throw new Error(error);
//     //   }
//     // }

//     // await send_otp(mobile, otp);
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

//     // Find user by mobile number
//     let user = await User.findOne({ mobile });

//     if (!user) {
//       user = await User.create({ mobile: mobile });
//       newUser = true;
//     }

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();
//     user.otp = undefined;

//     return res.status(200).json({
//       status: true,
//       message: "OTP has been sent",
//       data: {
//         mobile: user.mobile,
//         otpExpiry: user.otpExpiry,
//         user,
//       },
//       newUser,
//     });
//   }

//   if (email) {
//     if (!mobile) throw new AppError("Mobile number is required.", 400);
//     mobile = String(mobile).trim();

//     if (
//       isNaN(mobile) ||
//       mobile.includes("e") ||
//       mobile.includes(".") ||
//       mobile.length > 10
//     ) {
//       return next(new AppError("Invalid mobile number.", 400));
//     }

//     const otp = generateOtp();

//     // async function send_otp(number, otp) {
//     //   const options = {
//     //     method: "POST",
//     //     url: "https://api.msg91.com/api/v5/flow/",
//     //     headers: {
//     //       authkey: process.env.MSI_AUTH_KEY,
//     //       "content-type": "application/JSON",
//     //       Cookie: "PHPSESSID=p6sigj223tdkhtfnq7l41tplh3",
//     //     },
//     //     data: {
//     //       flow_id: process.env.FLOW_ID,
//     //       sender: "DILLIS",
//     //       mobiles: "91" + number,
//     //       otp: otp,
//     //     },
//     //   };
//     //   try {
//     //     await axios(options);
//     //   } catch (error) {
//     //     throw new Error(error);
//     //   }
//     // }

//     // await send_otp(mobile, otp);
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

//     // Find user by mobile number
//     let user = await User.findOne({ mobile });

//     if (!user) {
//       user = await User.create({ mobile: mobile });
//       newUser = true;
//     }

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();
//     user.otp = undefined;

//     return res.status(200).json({
//       status: true,
//       message: "OTP has been sent",
//       data: {
//         mobile: user.mobile,
//         otpExpiry: user.otpExpiry,
//         user,
//       },
//       newUser,
//     });
//   }
// });

const User = require("../../../models/user");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const generateOtp = require("../../../utils/generateOtp");

// Utility function to validate and trim mobile number
const validateMobile = (mobile) => {
  if (!mobile) throw new AppError("Mobile number is required.", 400);
  mobile = String(mobile).trim();

  if (
    isNaN(mobile) ||
    mobile.includes("e") ||
    mobile.includes(".") ||
    mobile.length > 10
  ) {
    throw new AppError("Invalid mobile number.", 400);
  }

  return mobile;
};

const processOtpAndUser = async (identifier, field) => {
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  let newUser = false;

  let query = {};
  query[field] = identifier;

  let user = await User.findOne(query);

  if (!user) {
    const userData = { [field]: identifier };
    user = await User.create(userData);
    newUser = true;
  }

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();
  user.otp = undefined;

  return { user, newUser, otpExpiry };
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { mobile, email } = req.body;
  let type;

  if (!mobile && !email) {
    return next(
      new AppError("Either mobile number or email is required.", 400)
    );
  }

  let identifier, field;

  if (mobile) {
    identifier = validateMobile(mobile);
    field = "mobile";
    type = "mobile";
  }

  if (email) {
    if (!email.includes("@") || !email.includes(".")) {
      return next(new AppError("Invalid email address.", 400));
    }
    identifier = email.trim().toLowerCase();
    field = "email";
    type = "email";
  }

  const { user, newUser, otpExpiry } = await processOtpAndUser(
    identifier,
    field
  );

  return res.status(200).json({
    status: true,
    message: "OTP has been send",
    data: {
      mobile: user[field] === "mobile" ? user[field] : "",
      email: user[field] === "email" ? user[field] : "",
      otpExpiry,
      user,
      type,
    },
    newUser,
  });
});
