const catchAsync = require("../../../utils/catchAsync");
const CustomQueBank = require("../../../models/customQueBank");

exports.getCustomBank = catchAsync(async (req, res) => {
  try {
    const customQueBank = await CustomQueBank.findById(req.params.id);

    return res.status(200).json({
      status: true,
      message: "Custom Question Bank fetched successfully",
      data: {
        customQueBank,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
});
