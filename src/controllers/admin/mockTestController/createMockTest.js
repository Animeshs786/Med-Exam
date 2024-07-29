const MockTest = require("../../../models/mockTest");
const catchAsync = require("../../../utils/catchAsync");

exports.createMockTest = catchAsync(async (req, res) => {
  const mockData = { ...req.body };
  if (req.body.instructions) {
    mockData.instructions = JSON.parse(req.body.instructions);
  }

  if (req.body.subjects) {
    mockData.subjects = JSON.parse(req.body.subjects);
  }

  if (req.files.thumbImage) {
    mockData.thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const newMockTest = await MockTest.create(mockData);

  res.status(201).json({
    status: true,
    message: "Mock test created successfully",
    data: {
      mockTest: newMockTest,
    },
  });
});
