const Support = require("../../../models/support");
const catchAsync = require("../../../utils/catchAsync");

exports.sendQuery = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { query } = req.body;

  await Support.create({ query, userId });

  res.status(201).json({
    status: true,
    message: "Query sent successfully",
  });
});
