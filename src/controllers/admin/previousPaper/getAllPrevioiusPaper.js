const PreviousPaper = require("../../../models/previousPaper");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllPreviousPaper = catchAsync(async (req, res) => {
  const previousPaper = await PreviousPaper.find();

  res.status(200).json({
    status: true,
    results: previousPaper.length,
    message: "Previous paper fetched successfully",
    data: {
      previousPaper,
    },
  });
});
