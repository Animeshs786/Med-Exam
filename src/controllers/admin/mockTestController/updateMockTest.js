const MockTest = require("../../../models/mockTest");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateMockTest = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const mockTest = await MockTest.findById(id);

  if (!mockTest) {
    return next(new AppError("Mock test not found.", 404));
  }

  if (req.body.instructions) {
    updateData.instructions = JSON.parse(req.body.instructions);
  }
  if (req.body.subjects) {
    updateData.subjects = JSON.parse(req.body.subjects);
  }

  if (req.files.thumbImage) {
    updateData.thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  // Delete old thumb image if new one is provided
  if (req.files.thumbImage && mockTest.thumbImage) {
    await deleteOldFiles(mockTest.thumbImage).catch((err) => {
      console.error("Failed to delete old thumb image", err);
    });
  }

  Object.assign(mockTest, updateData);

  await mockTest.save();

  res.status(200).json({
    status: true,
    message: "Mock test updated successfully",
    data: {
      mockTest,
    },
  });
});
