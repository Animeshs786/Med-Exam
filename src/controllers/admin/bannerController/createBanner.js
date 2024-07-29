const Banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.createBanner = catchAsync(async (req, res, next) => {
  const { url, webUrl, type, priority, redirectType } = req.body;
  let image = "";
  let webImage = "";

  if (req.files && req.files.image) {
    image = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
  } else {
    return next(new AppError("Image is required", 400));
  }

  if (req.files && req.files.webImage) {
    webImage = `${req.files.webImage[0].destination}/${req.files.webImage[0].filename}`;
  } else {
    return next(new AppError("WebImage is required", 400));
  }

  // Create new banner
  const newBanner = await Banner.create({
    image,
    webImage,
    webUrl,
    url,
    type,
    priority,
    redirectType: redirectType ? redirectType : "",
  });

  // Respond with the created banner
  res.status(201).json({
    status: true,
    data: {
      banner: newBanner,
    },
  });
});
