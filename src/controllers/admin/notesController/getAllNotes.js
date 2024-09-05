const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllNotes = catchAsync(async (req, res) => {
  const { search, course, page: currentPage, limit: currentLimit } = req.query;
  const filterObj = {};

  if (search) filterObj.name = { $regex: search, $options: "i" };
  if (course) filterObj.course = course;

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    Note,
    null,
    filterObj
  );

  const notes = await Note.find(filterObj).skip(skip).limit(limit);

  res.status(200).json({
    status: true,
    totalResult,
    totalPage,
    message: "Notes fetched successfully",
    results: notes.length,
    data: {
      notes,
    },
  });
});
