const { isValidObjectId } = require("mongoose");

const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");
const deleteOldFiles = require("../../../utils/deleteOldFiles");
const Mentor = require("../../../models/mentor");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { subject, achivements, name, email, qualification } = req.body;
  const obj = {};
  const id = req.user._id;

  if (!isValidObjectId(id)) return next(new AppError("Invalid id", 400));

  if (subject) {
    const parseExam = JSON.parse(subject);
    obj.subject = parseExam;
  }

  if (achivements) {
    const parseExam = JSON.parse(achivements);
    obj.achivements = parseExam;
  }

  if (name) obj.name = name;
  if (email) obj.email = email;
  if (qualification) obj.qualification = qualification;

  let profileImagePath;

  try {
    if (req.files && req.files.profileImage) {
      const url = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;
      obj.profileImage = url;
      profileImagePath = url;
    }

    const user = await Mentor.findByIdAndUpdate(id, obj, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
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
