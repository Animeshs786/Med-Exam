const Subject = require("../../../models/subject");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllSubject = catchAsync(async (req, res,) => {
  const { search } = req.query;
  let subjects;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  subjects = await Subject.find(filter);

  res.status(200).json({
    status: true,
    results: subjects.length,
    data: {
      subjects,
    },
  });
});
