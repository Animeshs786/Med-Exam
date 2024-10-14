const Note = require("../../../models/notes");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

exports.getAllNotes = catchAsync(async (req, res) => {
  const {
    search,
    course,
    page: currentPage,
    limit: currentLimit,
    exam,
    startDate,
    endDate,
  } = req.query;
  const filterObj = {};

  if (search) filterObj.name = { $regex: search, $options: "i" };
  if (course) filterObj.course = course;
  if (exam) filterObj.exam = { $in: exam };
  if (startDate) {
    filterObj.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    filterObj.createdAt = { $lte: new Date(endDate) };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    Note,
    null,
    filterObj
  );

  const notes = await Note.find(filterObj)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

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
