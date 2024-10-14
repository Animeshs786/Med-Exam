const Banner = require("../../../models/banner");
const catchAsync = require("../../../utils/catchAsync");
const Transaction = require("../../../models/transaction");
const Class = require("../../../models/class");
const Note = require("../../../models/notes");
const Course = require("../../../models/course");
const TestSeries = require("../../../models/testSeries");

exports.getAllBanners = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const banners = await Banner.find().sort({ priority: 1 });

  const modifiedBanners = await Promise.all(
    banners.map(async (banner) => {
      let courseId = "";
      let isPurchased = false;

      if (banner.redirectType === "Internal") {
        if (banner.type === "Notes") {
          const note = await Note.findOne({ _id: banner.url }).populate(
            "course"
          );
          if (note && note.course) {
            courseId = note.course._id;

            const transaction = await Transaction.findOne({
              user: userId,
              item: note.course._id,
              onModel: "Course",
              orderStatus: "success",
            });
            isPurchased = !!transaction;
          }
        } else if (banner.type === "TestSeries") {
          const testSeries = await TestSeries.findOne({
            _id: banner.url,
          }).populate("course");
          if (testSeries && testSeries.course) {
            courseId = testSeries.course._id;

            const transaction = await Transaction.findOne({
              user: userId,
              item: testSeries.course._id,
              onModel: "Course",
              orderStatus: "success",
            });
            isPurchased = !!transaction;
          }
        } else if (["Live", "Recorded"].includes(banner.type)) {
          const classItem = await Class.findOne({ _id: banner.url }).populate(
            "course"
          );
          if (classItem && classItem.course) {
            courseId = classItem.course._id;

            const transaction = await Transaction.findOne({
              user: userId,
              item: classItem.course._id,
              onModel: "Course",
              orderStatus: "success",
            });
            isPurchased = !!transaction;
          }
        } else if (banner.type === "Course") {
          const course = await Course.findById(banner.url);
          console.log(course,"dlsjd");  
          if (course) {
            courseId = course._id;

            const transaction = await Transaction.findOne({
              user: userId,
              item: course._id,
              onModel: "Course",
              orderStatus: "success",
            });
            isPurchased = !!transaction;
          }
        }
      } else {
        courseId = "";
        isPurchased = false;
      }

      return {
        ...banner.toObject(),
        courseId,
        isPurchased,
      };
    })
  );

  res.status(200).json({
    status: true,
    results: modifiedBanners.length,
    message: "Banners fetched successfully.",
    data: {
      banners: modifiedBanners,
    },
  });
});
