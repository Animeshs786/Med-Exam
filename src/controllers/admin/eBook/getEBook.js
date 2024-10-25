const eBook = require("../../../models/eBook");
const catchAsync = require("../../../utils/catchAsync");

exports.getEBooks = catchAsync(async (req, res) => {
  const { id } = req.params;

  const eBooks = await eBook.findById(id).populate("exam", "name");

  res.status(200).json({
    status: true,
    results: eBooks.length,
    data: { eBooks },
  });
});
