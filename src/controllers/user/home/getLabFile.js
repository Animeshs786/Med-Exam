const Home = require("../../../models/home");
const catchAsync = require("../../../utils/catchAsync");

exports.getLabFile = catchAsync(async (req, res, next) => {
  const labFile = await Home.findById("66a363460971bf6ac5286aa4").select(
    "labValueFile"
  );
  res.status(200).json({
    status: true,
    data: {
      labFile,
    },
  });
});
