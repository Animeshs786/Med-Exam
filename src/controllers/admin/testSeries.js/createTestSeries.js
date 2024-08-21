const TestSeries = require("../../../models/testSeries");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createTestSeries = catchAsync(async (req, res,next) => {
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
    course
  } = req.body;
  let thumbImage;
  let bannerImage;
  let logo;
  let parseDetail;

  if (req.files && req.files?.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  if (req.files && req.files?.logo) {
    logo = `${req.files.logo[0].destination}/${req.files.logo[0].filename}`;
  }

  if (req.files && req.files?.bannerImage) {
    bannerImage = `${req.files.bannerImage[0].destination}/${req.files.bannerImage[0].filename}`;
  }

  if (details) {
    parseDetail = JSON.parse(details);
  }

   if(!course) return next(new AppError("Course id is required",400))

  const testSeries = await TestSeries.create({
    name,
    exam,
    price,
    thumbImage,
    logo,
    subHeading,
    description,
    details: parseDetail,
    isFullTest,
    isSubjectTest,
    isChapterTest,
    bannerImage,
    course
  });

  res.status(201).json({
    status: true,
    message: "TestSeries created successfully",
    data: {
      testSeries,
    },
  });
});
