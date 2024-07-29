const Course = require("../../../models/course");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  try {
    // Delete associated files
    if (course.thumbImage) {
      await deleteOldFiles(course.thumbImage);
    }
    if (course.coursePreview) {
      await deleteOldFiles(course.coursePreview);
    }
    if (course.pdf && course.pdf.length > 0) {
      await Promise.all(course.pdf.map((pdf) => deleteOldFiles(pdf)));
    }

    // Delete the course from the database
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Course deleted successfully",
      data: null,
    });
  } catch (error) {
    return next(error);
  }
});
