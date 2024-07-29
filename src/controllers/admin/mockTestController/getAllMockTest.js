const MockTest = require("../../../models/mockTest");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllMockTests = catchAsync(async (req, res) => {
  const mockTests = await MockTest.find().select(
    "name thumbImage minute isPaid"
  );

  res.status(200).json({
    status: true,
    results: mockTests.length,
    data: {
      mockTests,
    },
  });
});
