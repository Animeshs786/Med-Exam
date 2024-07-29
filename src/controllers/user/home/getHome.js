const Home = require("../../../models/home");
const catchAsync = require("../../../utils/catchAsync");

exports.getHome = catchAsync(async (req, res) => {
  const home = await Home.findById("66a363460971bf6ac5286aa4");
  res.status(200).json({
    status: true,
    message: "Home data fetched successfully",
    data: {
      home,
    },
  });
});
