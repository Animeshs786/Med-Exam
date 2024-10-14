const NoteSubject = require("../../../models/notesSubject");
const catchAsync = require("../../../utils/catchAsync");
const pagination = require("../../../utils/pagination");

// Get all NoteSubjects
exports.getAllNoteSubjects = catchAsync(async (req, res) => {
  const {
    search,
    page: currentPage,
    limit: currentLimit,
    startDate,
    endDate,
    note,
    subject,
  } = req.query;

  const filterObj = {};

  if (search) filterObj.name = { $regex: search, $options: "i" };
  if (note) filterObj.note = note;
  if (subject) filterObj.subject = subject;
  if (startDate) {
    filterObj.createdAt = { $gte: new Date(startDate) };
  }
  if (endDate) {
    filterObj.createdAt = { $lte: new Date(endDate) };
  }

  const { limit, skip, totalResult, totalPage } = await pagination(
    currentPage,
    currentLimit,
    NoteSubject,
    null,
    filterObj
  );

  const noteSubjects = await NoteSubject.find(filterObj)
    .skip(skip)
    .limit(limit)
    .sort("-createdAt");

  res.status(200).json({
    status: true,
    results: noteSubjects.length,
    totalPage,
    totalResult,
    message: "Notes fetched successfully",
    data: {
      noteSubjects,
    },
  });
});
