const Support = require("../../../models/support");
const catchAsync = require("../../../utils/catchAsync");

exports.updateQuery = catchAsync(async (req, res) => {
  console.log(req.body);
  const query = await Support.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    status: true,
    message: "Solution added successfully",
    data: {
      query,
    },
  });
});
