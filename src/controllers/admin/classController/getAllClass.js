const Class = require("../../../models/class");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllClasses = catchAsync(async (req, res) => {
  const classes = await Class.find().populate("course");

  res.status(200).json({
    status: true,
    results: classes.length,
    data: {
      classes,
    },
  });
});
