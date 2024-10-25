const eBook = require("../../../models/eBook");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllEBook = catchAsync(async (req, res) => {
  const eBooks = await eBook.find().populate("exam", "name").sort("-createdAt");

  res.status(200).json({
    status: true,
    data: { eBooks },
  });
});
