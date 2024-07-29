const ClassRating = require("../../../models/classRating");
const Class = require("../../../models/class");
const catchAsync = require("../../../utils/catchAsync");

exports.addOrUpdateRating = catchAsync(async (req, res) => {
  const { classId, rating } = req.body;
  const userId = req.user._id;

  let classRating = await ClassRating.findOne({ user: userId, class: classId });

  if (classRating) {
    classRating.rating = rating;
    await classRating.save();
  } else {
    classRating = await ClassRating.create({
      user: userId,
      class: classId,
      rating,
    });
  }

  const ratings = await ClassRating.find({ class: classId });
  const avgRating =
    ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length;

  await Class.findByIdAndUpdate(classId, { rating: avgRating });

  res.status(200).json({
    status: true,
    message: "Rating added successfully.",
    // data: {
    //   classRating,
    // },
  });
});
