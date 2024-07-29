const Exam = require("../../../models/exam");
const Subject = require("../../../models/subject");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const mongoose = require("mongoose");

exports.getAllSubject = catchAsync(async (req, res, next) => {
  const { id, search } = req.query;
  let subjects;

  if (id) {
    const exam = await Exam.findById(id);
    if (!exam) {
      return next(new AppError("No exam found with that ID", 404));
    }
    const match = {
      _id: {
        $in: exam.subject.map(
          (subjectId) => new mongoose.Types.ObjectId(subjectId)
        ),
      },
      status: true,
    };

    if (search) {
      match.name = { $regex: search, $options: "i" };
    }

    subjects = await Subject.aggregate([{ $match: match }]);
  } else {
    const filter = { status: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    subjects = await Subject.find(filter);
  }

  res.status(200).json({
    status: true,
    results: subjects.length,
    message: "Subjects fetched successfully",
    data: {
      subjects,
    },
  });
});
