const Support = require("../../../models/support");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteQuery = catchAsync(async (req, res) => {
  await Support.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: true,
    message: "Query delete  successfully",
  });
});
