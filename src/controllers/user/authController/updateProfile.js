const { isValidObjectId } = require("mongoose");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const User = require("../../../models/user");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const {
    exam,
    name,
    email,
    state,
    notification,
    collegeName,
    admissionYear,
    mobile,
  } = req.body;
  const obj = {};
  const id = req.user._id;
  console.log(req.body, "body");
  console.log(req.files, "files");

  if (!isValidObjectId(id)) {
    return next(new AppError("Invalid id", 400));
  }

  if (email) {
    const user = await User.findOne({ email: email, _id: { $ne: id } });
    if (user) {
      return next(new AppError("Email already exists", 400));
    }
  }

  if (mobile) {
    const user = await User.findOne({ mobile: mobile, _id: { $ne: id } });
    if (user) {
      return next(new AppError("Mobile number already exists", 400));
    }
  }

  if (exam) obj.exam = exam;
  if (collegeName) obj.collegeName = collegeName;
  if (name) obj.name = name;
  if (email) obj.email = email;
  if (admissionYear) obj.admissionYear = admissionYear;
  if (state) obj.state = state;
  if (notification) obj.notification = notification;
  if (mobile) obj.mobile = mobile;

  let profileImagePath;

  try {
    if (req.files && req.files.profileImage) {
      const url = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;
      obj.profileImage = url;
      profileImagePath = url;
    }

    const user = await User.findByIdAndUpdate(id, obj, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: true,
      message:
        exam?.length > 0
          ? "Exam select successfully"
          : "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    if (profileImagePath) {
      await deleteOldFiles(profileImagePath).catch((err) => {
        console.error("Failed to delete profile image:", err);
      });
    }
    return next(error);
  }
});
