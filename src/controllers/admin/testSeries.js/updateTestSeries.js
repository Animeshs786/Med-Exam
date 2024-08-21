const TestSeries = require("../../../models/testSeries");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateTestSeries = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let newThumbImage;
  let newLogo;
  let newBannerImage

  // Handle file uploads
  if (req.files?.thumbImage) {
    newThumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }
  if (req.files?.logo) {
    newLogo = `${req.files.logo[0].destination}/${req.files.logo[0].filename}`;
  }
  if (req.files?.bannerImage) {
    newBannerImage = `${req.files.bannerImage[0].destination}/${req.files.bannerImage[0].filename}`;
  }

  try {
    const {
      name,
      exam,
      price,
      subHeading,
      description,
      details,
      isFullTest,
      isSubjectTest,
      isChapterTest,
      rating,
      ratingNumber,
      course
    } = req.body;

    const testSeriesData = {};

    if (name) testSeriesData.name = name;
    if (course) testSeriesData.course = course;
    if (exam) testSeriesData.exam = exam;
    if (price) testSeriesData.price = price;
    if (subHeading) testSeriesData.subHeading = subHeading;
    if (description) testSeriesData.description = description;
    if (details) testSeriesData.details = JSON.parse(details);
    if (isFullTest !== undefined) testSeriesData.isFullTest = isFullTest;
    if (isSubjectTest !== undefined) testSeriesData.isSubjectTest = isSubjectTest;
    if (isChapterTest !== undefined) testSeriesData.isChapterTest = isChapterTest;
    if (rating !== undefined) testSeriesData.rating = rating;
    if (ratingNumber !== undefined) testSeriesData.ratingNumber = ratingNumber;

    const existingTestSeries = await TestSeries.findById(id);
    if (!existingTestSeries) {
      if (newThumbImage) await deleteOldFiles(newThumbImage);
      if (newLogo) await deleteOldFiles(newLogo);
      if (newBannerImage) await deleteOldFiles(newBannerImage);
      return next(new AppError("Test Series not found", 404));
    }

    if (newThumbImage && existingTestSeries.thumbImage) {
      await deleteOldFiles(existingTestSeries.thumbImage);
      testSeriesData.thumbImage = newThumbImage;
    }
    if (newLogo && existingTestSeries.logo) {
      await deleteOldFiles(existingTestSeries.logo);
      testSeriesData.logo = newLogo;
    }
    if (newBannerImage && existingTestSeries.bannerImage) {
      await deleteOldFiles(existingTestSeries.bannerImage);
      testSeriesData.bannerImage = newBannerImage;
    }

    const updatedTestSeries = await TestSeries.findByIdAndUpdate(id, testSeriesData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      message: "Test Series updated successfully",
      data: {
        testSeries: updatedTestSeries,
      },
    });
  } catch (error) {
    if (newThumbImage) await deleteOldFiles(newThumbImage);
    if (newLogo) await deleteOldFiles(newLogo);
    if (newBannerImage) await deleteOldFiles(newBannerImage);
    return next(error);
  }
});

