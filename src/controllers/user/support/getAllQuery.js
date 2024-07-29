const Support = require("../../../models/support");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuery = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const query = await Support.find({ userId }).select("query solution").sort("-createdAt");

  res.status(200).json({
    status: true,
    message: "Support history fetched successfully",
    data: {
      query,
    },
  });
});
