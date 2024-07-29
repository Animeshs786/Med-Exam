const Banner = require("../../../models/banner");
const Course = require("../../../models/course");
const User = require("../../../models/user");

exports.homeWebApi = async (req, res, next) => {
  try {
    let userExam = [];
    const { userId } = req.query;
    if (userId) {
      const user = await User.findById(userId);
      userExam = user.exam;
    }
    const [banner, recommendedCourse, freeCourse, paidCourse] =
      await Promise.all([
        Banner.find(),
        Course.find({
          exam: { $in: userExam },
        }).select(
          "name price duration rating ratingNumber thumbImage lesson logo slug"
        ),
        Course.find({ isPremium: false }).select(
          "name price duration rating ratingNumber thumbImage lesson logo slug"
        ),
        Course.find({ isPremium: true }).select(
          "name price duration rating ratingNumber thumbImage lesson logo slug"
        ).sort({ createdAt: -1 }),
      ]);

    res.status(200).json({
      status: true,
      message: "Data fetched successfully.",
      data: {
        banner,
        recommendedCourse,
        freeCourse,
        paidCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};
