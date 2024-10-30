const Course = require("../../../models/course");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.createCourse = catchAsync(async (req, res, next) => {
  let thumbImage;
  let bannerImage;
  let pdf;
  let logo;
  let previewBanner = [];

  if (req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  if (req.files?.bannerImage) {
    bannerImage = `${req.files.bannerImage[0].destination}/${req.files.bannerImage[0].filename}`;
  }
  if (req.files?.logo) {
    logo = `${req.files.logo[0].destination}/${req.files.logo[0].filename}`;
  }
  if (req.files?.pdf) {
    pdf = `${req.files.pdf[0].destination}/${req.files.pdf[0].filename}`;
  }
  if (req.files?.previewBanner) {
    req.files.previewBanner.forEach((file) => {
      previewBanner.push(`${file.destination}/${file.filename}`);
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
      isPdf,
      isTestSeries,
      isPreparationtest,
      subjects,
    } = req.body;

    const courseData = {
      name,
      price,
      rating,
      ratingNumber,
      purchasedNumber,
      isPremium,
      subHeading,
      topDescription,
      bottomDescription,
      isPdf,
      isTestSeries,
      isPreparationtest,
    };

    console.log(req.body, res.files, "test");

    if (!slug) {
      return next(new AppError("Slug is required", 400));
    }

    if (!price) {
      return next(new AppError("Price is required", 400));
    }

    const existingSlug = await Course.findOne({ slug });

    if (existingSlug) {
      return next(new AppError("Slug already exists", 400));
    }

    if (slug) courseData.slug = slug;
    if (exam) courseData.exam = JSON.parse(exam);
    if (subjects) courseData.subjects = JSON.parse(subjects);

    if (thumbImage) {
      courseData.thumbImage = thumbImage;
    }
    if (bannerImage) {
      courseData.bannerImage = bannerImage;
    }

    if (pdf) {
      courseData.pdf = pdf;
    }

    if (logo) {
      courseData.logo = logo;
    }
    if (previewBanner.length > 0) courseData.previewBanner = previewBanner;

    const newCourse = await Course.create(courseData);

    res.status(201).json({
      status: true,
      data: {
        course: newCourse,
      },
    });
  } catch (error) {
    if (thumbImage) {
      await deleteOldFiles(thumbImage).catch((err) => {
        console.error("Failed to delete thumb image", err);
      });
    }

    if (pdf) {
      await deleteOldFiles(pdf).catch((err) => {
        console.error("Failed to delete pdf", err);
      });
    }

    if (previewBanner.length > 0) {
      previewBanner.forEach(async (file) => {
        await deleteOldFiles(file).catch((err) => {
          console.error("Failed to delete preview banner", err);
        });
      });
    }

    return next(error);
  }
});
