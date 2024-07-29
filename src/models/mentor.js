const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  otp: {
    type: String,
    select: false,
  },
  otpExpiry: Date,
  qualification: [String],
  achivements: [String],
  subject: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],

  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

mentorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "subject",
    select: "name",
  });
  next();
});
const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;
