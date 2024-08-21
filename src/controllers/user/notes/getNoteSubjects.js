const Note = require("../../../models/notes");
const NoteSubject = require("../../../models/notesSubject");
const catchAsync = require("../../../utils/catchAsync");

exports.getNoteSubjects = catchAsync(async (req, res) => {
  const { id } = req.query;
  const userId = req.user._id;

  const note = await Note.findById(id);

  if (!note) {
    return res.status(404).json({
      status: false,
      message: "Note not found",
    });
  }

  const noteSubjects = await NoteSubject.find({ note: note._id })
    .populate("subject", "name thumbImage")
    .populate("watchBy", "_id");

  const subjectMap = new Map();

  noteSubjects.forEach((cls) => {
    if (cls.subject) {
      const subjectId = cls.subject._id.toString();
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          _id: cls.subject._id,
          name: cls.subject.name,
          thumbImage: cls.subject.thumbImage || "",
          totalClasses: 0,
          watchedClassesCount: 0,
        });
      }
      const subjectData = subjectMap.get(subjectId);
      subjectData.totalClasses += 1;
      subjectData.watchedClassesCount += cls.watchBy.some((user) =>
        user._id.equals(userId)
      )
        ? 1
        : 0;
    }
  });

  const subjects = Array.from(subjectMap.values());

  res.status(200).json({
    status: true,
    results: subjects?.length,
    message: "Notes subjects fetched successfully",
    data: {
      subject: subjects,
    },
  });
});
