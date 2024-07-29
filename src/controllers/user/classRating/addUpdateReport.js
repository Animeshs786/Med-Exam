const ClassRating = require("../../../models/classRating");
const catchAsync = require("../../../utils/catchAsync");

exports.addOrUpdateReport = catchAsync(async (req, res) => {
  const { classId, report } = req.body;
  const userId = req.user._id;

  let classRating = await ClassRating.findOne({ user: userId, class: classId });

  if (classRating) {
    classRating.report = report;
    await classRating.save();
  } else {
    classRating = await ClassRating.create({
      user: userId,
      class: classId,
      report,
    });
    
  }

  res.status(200).json({
    status: true,
    message: "Report added successfully.",
    // data: {
    //   classRating,
    // },
  });
});
