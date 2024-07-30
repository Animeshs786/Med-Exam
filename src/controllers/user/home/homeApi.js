const Banner = require("../../../models/banner");
const Course = require("../../../models/course");

exports.homeApi = async (req, res, next) => {
  try {
    const userExam = req.user.exam;
    const [banner, recommendedCourse, popularCourse, paidCourse] =
      await Promise.all([
        Banner.find(),
        Course.find({
          exam: { $in: userExam },
        }).select(
          "name price duration rating ratingNumber thumbImage lesson logo"
        ),
        Course.find()
          .select(
            "name price duration rating ratingNumber thumbImage lesson logo"
          )
          .sort({ purchaseNumber: -1 }),
        Course.find({ isPremium: true })
          .select(
            "name price duration rating ratingNumber thumbImage lesson logo"
          )
          .sort({ createdAt: -1 }),
      ]);

    res.status(200).json({
      status: true,
      message: "Data fetched successfully.",
      data: {
        banner,
        recommendedCourse,
        popularCourse,
        paidCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};
