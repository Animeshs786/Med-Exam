const Course = require("../../../models/course");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let newThumbImage;
  let newPdf;
  let newLogo;
  let newPreviewBanner = [];

  if (req.files?.thumbImage) {
    newThumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  if (req.files?.logo) {
    newLogo = `${req.files.logo[0].destination}/${req.files.logo[0].filename}`;
  }
  if (req.files?.pdf) {
    newPdf = `${req.files.pdf[0].destination}/${req.files.pdf[0].filename}`;
  }
  if (req.files?.previewBanner) {
    req.files.previewBanner.forEach((file) => {
      newPreviewBanner.push(`${file.destination}/${file.filename}`);
    });
  }

  try {
    const {
      name,
      price,
      exam,
      rating,
      ratingNumber,
      purchasedNumber,
      isPremium,
      slug,
      subHeading,
      topDescription,
      bottomDescription,
      isLive,
      isRecorded,
      isPdf,
      isTestSeries,
    } = req.body;

    const courseData = {};

    if (name) courseData.name = name;
    if (price) courseData.price = price;
    if (rating) courseData.rating = rating;
    if (ratingNumber) courseData.ratingNumber = ratingNumber;
    if (purchasedNumber) courseData.purchasedNumber = purchasedNumber;
    if (isPremium) courseData.isPremium = isPremium;
    if (subHeading) courseData.subHeading = subHeading;
    if (topDescription) courseData.topDescription = topDescription;
    if (bottomDescription) courseData.bottomDescription = bottomDescription;
    if (isLive) courseData.isLive = isLive;
    if (isRecorded) courseData.isRecorded = isRecorded;
    if (isPdf) courseData.isPdf = isPdf;
    if (isTestSeries) courseData.isTestSeries = isTestSeries;

    if (exam) courseData.exam = JSON.parse(exam);

    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      if (newThumbImage) await deleteOldFiles(newThumbImage);
      if (newPdf) await deleteOldFiles(newPdf);
      if (newLogo) await deleteOldFiles(newLogo);
      if (newPreviewBanner.length > 0) {
        newPreviewBanner.forEach(async (file) => {
          await deleteOldFiles(file);
        });
      }
      return next(new AppError("Course not found", 404));
    }

    if (newThumbImage && existingCourse.thumbImage) {
      await deleteOldFiles(existingCourse.thumbImage);
      courseData.thumbImage = newThumbImage;
    }
    if (newPdf && existingCourse.pdf) {
      await deleteOldFiles(existingCourse.pdf);
      courseData.pdf = newPdf;
    }
    if (newLogo && existingCourse.logo) {
      await deleteOldFiles(existingCourse.logo);
      courseData.logo = newLogo;
    }
    if (newPreviewBanner.length > 0) {
      if (existingCourse.previewBanner) {
        existingCourse.previewBanner.forEach(async (file) => {
          await deleteOldFiles(file);
        });
      }
      courseData.previewBanner = newPreviewBanner;
    }

    if (slug && slug !== existingCourse.slug) {
      const existingSlug = await Course.findOne({ slug });
      if (existingSlug) {
        return next(new AppError("Slug already exists", 400));
      }
      courseData.slug = slug;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, courseData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    if (newThumbImage) await deleteOldFiles(newThumbImage);
    if (newPdf) await deleteOldFiles(newPdf);
    if (newLogo) await deleteOldFiles(newLogo);
    if (newPreviewBanner.length > 0) {
      newPreviewBanner.forEach(async (file) => {
        await deleteOldFiles(file);
      });
    }
    return next(error);
  }
});
