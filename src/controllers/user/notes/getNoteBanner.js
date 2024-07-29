const Banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");

exports.getNoteBanner = catchAsync(async (req, res) => {
  const noteBanner = await Banner.find({ type: "Notes" });
  res.status(200).json({
    status: true,
    message: "Banner fetched successfully",
    data: {
      noteBanner,
    },
  });
});
