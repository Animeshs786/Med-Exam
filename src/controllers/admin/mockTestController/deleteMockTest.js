const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteMockTest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const mockTest = await MockTest.findByIdAndDelete(id);

  if (!mockTest) {
    return next(new AppError("Mock test not found.", 404));
  }

  // Delete the thumb image if it exists
  if (mockTest.thumbImage) {
    await deleteOldFiles(mockTest.thumbImage).catch((err) => {
      console.error("Failed to delete thumb image", err);
    });
  }

  res.status(200).json({
    status: true,
    message: "Mock test deleted successfully",
  });
});
