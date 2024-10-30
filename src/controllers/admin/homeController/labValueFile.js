const Home = require("../../../models/home");
const catchAsync = require("../../../utils/catchAsync");

exports.labValueFile = catchAsync(async (req, res) => {
  const { id = "66a363460971bf6ac5286aa4" } = req.body;

  let labValueFile;
  const updateData = { labValueFile };

  if (req.files?.labValueFile) {
    labValueFile = `${req.files.labValueFile[0].destination}/${req.files.labValueFile[0].filename}`;
    updateData.labValueFile = labValueFile;
  }

  let home;

  if (id) {
    home = await Home.findByIdAndUpdate(id, updateData, { new: true });
  }

  res.status(200).json({
    success: true,
    message: "Lab value file updated successfully",
    data: { home },
  });
});
