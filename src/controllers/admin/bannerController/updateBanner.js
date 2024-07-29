const Banner = require("../../../models/banner");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateBanner = catchAsync(async (req, res, next) => {
  const { url, webUrl, type, priority, redirectType } = req.body;
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new AppError("No banner found with that ID", 404));
  }

  let image = banner.image;
  let webImage = banner.webImage;

  if (req.files && req.files.image) {
    image = `${req.files.image[0].destination}/${req.files.image[0].filename}`;

    if (banner.image) {
      await deleteOldFiles([banner.image]).catch((err) => {
        console.error("Failed to delete old image", err);
      });
    }
  }

  if (req.files && req.files.webImage) {
    webImage = `${req.files.webImage[0].destination}/${req.files.webImage[0].filename}`;

    if (banner.webImage) {
      await deleteOldFiles([banner.webImage]).catch((err) => {
        console.error("Failed to delete old webImage", err);
      });
    }
  }

  const updatedData = {};

  if (image) updatedData.image = image;
  if (webImage) updatedData.webImage = webImage;
  if (url) updatedData.url = url;
  if (webUrl) updatedData.webUrl = webUrl;
  if (type) updatedData.type = type;
  if (priority) updatedData.priority = priority;
  if (redirectType) updatedData.redirectType = redirectType;

  const updatedBanner = await Banner.findByIdAndUpdate(
    req.params.id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: true,
    message: "Banner updated successfully",
    data: {
      banner: updatedBanner,
    },
  });
});
