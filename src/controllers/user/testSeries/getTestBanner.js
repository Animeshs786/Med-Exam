const Banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");

exports.getTestBanner = catchAsync(async (req, res) => {
  const testBanner = await Banner.find({ type: "TestSeries" });
  res.status(200).json({
    status: true,
    message: "Banner fetched successfully",
    data: {
      testBanner,
    },
  });
});
