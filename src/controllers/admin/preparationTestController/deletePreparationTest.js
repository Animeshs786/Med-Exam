const PreparationTest = require("../../../models/preparationTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deletePreparationTest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const preparationTest = await PreparationTest.findByIdAndDelete(id);

  if (!preparationTest) {
    return next(new AppError("Preparation test not found.", 404));
  }

  // Delete the thumb image if it exists
  if (preparationTest.thumbImage) {
    await deleteOldFiles(preparationTest.thumbImage).catch((err) => {
      console.error("Failed to delete thumb image", err);
    });
  }

  res.status(200).json({
    status: true,
    message: "Preparation test deleted successfully",
  });
});
