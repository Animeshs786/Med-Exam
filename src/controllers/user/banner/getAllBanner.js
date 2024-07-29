const Banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllBanners = catchAsync(async (req, res) => {
  const banners = await Banner.find().sort({ priority: 1 });

  res.status(200).json({
    status: true,
    results: banners.length,
    message: "Banners fetched successfully",
    data: {
      banners,
    },
  });
});
