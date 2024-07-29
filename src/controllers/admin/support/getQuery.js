const Support = require("../../../models/support");
const catchAsync = require("../../../utils/catchAsync");

exports.getQuery = catchAsync(async (req, res) => {
  const query = await Support.findById(req.params.id);

  res.status(200).json({
    status: true,
    message: "Support history fetched successfully",
    data: {
      query,
    },
  });
});
