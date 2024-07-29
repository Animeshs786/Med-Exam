const TestSeries = require("../../../models/testSeries");
const catchAsync = require("../../../utils/catchAsync");

exports.createTestSeries = catchAsync(async (req, res) => {
  const { name, exam, price } = req.body;
  let thumbImage;

  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const testSeries = await TestSeries.create({
    name,
    exam,
    price,
    thumbImage,
  });

  res.status(201).json({
    status: true,
    message: "TestSeries created successfully",
    data: {
      testSeries,
    },
  });
});
