const Support = require("../../../models/support");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllQuery = catchAsync(async (req, res) => {
  const query = await Support.find().sort("-createdAt");

  res.status(200).json({
    status: true,
    message: "Support history fetched successfully",
    data: {
      query,
    },
  });
});
