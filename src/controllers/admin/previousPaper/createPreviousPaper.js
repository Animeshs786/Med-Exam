const PreviousPaper = require("../../../models/previousPaper");
const catchAsync = require("../../../utils/catchAsync");

exports.createPreviousPaper = catchAsync(async (req, res) => {
  const { name, exam, price } = req.body;
  let thumbImage;

  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const previousPaper = await PreviousPaper.create({
    name,
    exam,
    price,
    thumbImage,
  });

  res.status(201).json({
    status: true,
    message: "PreviousPaper created successfully",
    data: {
      previousPaper,
    },
  });
});
