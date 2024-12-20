// const Banner = require("../../../models/banner");
// const Class = require("../../../models/class");
// const Course = require("../../../models/course");
// const Note = require("../../../models/notes");
// const TestSeries = require("../../../models/testSeries");
// const Transaction = require("../../../models/transaction");

// exports.homeApi = async (req, res, next) => {
//   try {
//     const userExam = req.user.exam;
//     const userId = req.user._id;

//     const purchasedCourses = await Transaction.find({
//       user: userId,
//       onModel: "Course",
//       orderStatus: "success",
//     }).select("item");

//     const purchasedCourseIds = purchasedCourses.map((transaction) => transaction.item);

//     const [banner, recommendedCourse, popularCourse, paidCourse] = await Promise.all([
//       Banner.find(),
//       Course.find({
//         exam: { $in: [userExam] },
//         _id: { $nin: purchasedCourseIds },
//       }).select(
//         "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//       ),
//       Course.find({
//         _id: { $nin: purchasedCourseIds },
//       })
//         .select(
//           "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//         )
//         .sort({ purchaseNumber: -1 }),
//       Course.find({
//         isPremium: true,
//         _id: { $nin: purchasedCourseIds },
//       })
//         .select(
//           "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//         )
//         .sort({ createdAt: -1 }),
//     ]);

//     const modifiedBanners = await Promise.all(
//       banner.map(async (banner) => {
//         let courseId = "";
//         let isPurchased = false;

//         if (banner.redirectType === "Internal") {
//           if (banner.type === "Notes") {
//             const note = await Note.findOne({ _id: banner.url }).populate("course");
//             if (note && note.course) {
//               courseId = note.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: note.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (banner.type === "TestSeries") {
//             const testSeries = await TestSeries.findOne({
//               _id: banner.url,
//             }).populate("course");
//             if (testSeries && testSeries.course) {
//               courseId = testSeries.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: testSeries.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (["Live", "Recorded"].includes(banner.type)) {
//             const classItem = await Class.findOne({ _id: banner.url }).populate("course");
//             if (classItem && classItem.course) {
//               courseId = classItem.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: classItem.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (banner.type === "Course") {
//             const course = await Course.findById(banner.url);
//             if (course) {
//               courseId = course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           }
//         } else {
//           courseId = "";
//           isPurchased = false;
//         }

//         return {
//           ...banner.toObject(),
//           courseId,
//           isPurchased,
//         };
//       })
//     );

//     res.status(200).json({
//       status: true,
//       message: "Data fetched successfully.",
//       data: {
//         banner: modifiedBanners,
//         recommendedCourse,
//         popularCourse,
//         paidCourse,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const Banner = require("../../../models/banner");
// const Class = require("../../../models/class");
// const Course = require("../../../models/course");
// const Note = require("../../../models/notes");
// const TestSeries = require("../../../models/testSeries");
// const Transaction = require("../../../models/transaction");

// exports.homeApi = async (req, res, next) => {
//   try {
//     const userExam = req.user.exam;
//     const userId = req.user._id;

//     // Find purchased courses by the user
//     const purchasedCourses = await Transaction.find({
//       user: userId,
//       onModel: "Course",
//       orderStatus: "success",
//     }).select("item");

//     // Extract IDs of purchased courses
//     const purchasedCourseIds = purchasedCourses.map((transaction) => transaction.item);

//     // Fetch all necessary data, ensuring purchased courses are excluded
//     const [banner, recommendedCourse, popularCourse, paidCourse] = await Promise.all([
//       Banner.find(),
//       Course.find({
//         exam: { $in: [userExam] },
//         _id: { $nin: purchasedCourseIds }, // Exclude purchased courses
//       }).select(
//         "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//       ),
//       Course.find({
//         _id: { $nin: purchasedCourseIds }, // Exclude purchased courses
//       })
//         .select(
//           "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//         )
//         .sort({ purchaseNumber: -1 }),
//       Course.find({
//         isPremium: true,
//         _id: { $nin: purchasedCourseIds }, // Exclude purchased premium courses
//       })
//         .select(
//           "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//         )
//         .sort({ createdAt: -1 }),
//     ]);

//     // Modify banners to check if the related course is purchased
//     const modifiedBanners = await Promise.all(
//       banner.map(async (bannerItem) => {
//         let courseId = "";
//         let isPurchased = false;

//         if (bannerItem.redirectType === "Internal") {
//           if (bannerItem.type === "Notes") {
//             const note = await Note.findOne({ _id: bannerItem.url }).populate("course");
//             if (note?.course) {
//               courseId = note.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: note.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (bannerItem.type === "TestSeries") {
//             const testSeries = await TestSeries.findOne({ _id: bannerItem.url }).populate("course");
//             if (testSeries?.course) {
//               courseId = testSeries.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: testSeries.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (["Live", "Recorded"].includes(bannerItem.type)) {
//             const classItem = await Class.findOne({ _id: bannerItem.url }).populate("course");
//             if (classItem?.course) {
//               courseId = classItem.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: classItem.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (bannerItem.type === "Course") {
//             const course = await Course.findById(bannerItem.url);
//             if (course) {
//               courseId = course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           }
//         }

//         return {
//           ...bannerItem.toObject(),
//           courseId,
//           isPurchased,
//         };
//       })
//     );

//     res.status(200).json({
//       status: true,
//       message: "Data fetched successfully.",
//       data: {
//         banner: modifiedBanners,
//         recommendedCourse,
//         popularCourse,
//         paidCourse,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const Banner = require("../../../models/banner");
// const Class = require("../../../models/class");
// const Course = require("../../../models/course");
// const Note = require("../../../models/notes");
// const TestSeries = require("../../../models/testSeries");
// const Transaction = require("../../../models/transaction");

// exports.homeApi = async (req, res, next) => {
//   try {
//     const userExam = req.user.exam;
//     const userId = req.user._id;

//     // Find purchased courses by the user
//     const purchasedCourses = await Transaction.find({
//       user: userId,
//       onModel: "Course",
//       orderStatus: "success",
//     }).select("item");

//     // Extract IDs of purchased courses
//     const purchasedCourseIds = purchasedCourses.map(
//       (transaction) => transaction.item
//     );

//     // Fetch all necessary data, ensuring purchased courses are excluded
//     const [banner, recommendedCourse, paidCourse] = await Promise.all([
//       Banner.find(),
//       Course.find({
//         exam: { $in: [userExam] },
//         _id: { $nin: purchasedCourseIds }, // Exclude purchased courses
//       }).select(
//         "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//       ),
//       Course.find({
//         isPremium: true,
//         _id: { $nin: purchasedCourseIds }, // Exclude purchased premium courses
//       })
//         .select(
//           "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//         )
//         .sort({ createdAt: -1 }),
//     ]);

//     // Fetch popular courses excluding purchased courses
//     let popularCourse = await Course.find({
//       _id: { $nin: purchasedCourseIds }, // Exclude purchased courses
//     })
//       .select(
//         "name price duration rating ratingNumber thumbImage lesson logo bannerImage purchaseNumber"
//       )
//       .sort({ purchaseNumber: -1 }) // Sort by purchase count
//       .limit(10); // Limit to 10 courses (or any number you prefer)

//     // If no popular courses found (meaning no courses are purchased), return random courses
//     if (popularCourse.length === 0) {
//       popularCourse = await Course.find({
//         _id: { $nin: purchasedCourseIds }, // Exclude purchased courses
//       })
//         .select(
//           "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
//         )
//         .limit(10); // Return random 10 courses
//     }

//     // Modify banners to check if the related course is purchased
//     const modifiedBanners = await Promise.all(
//       banner.map(async (bannerItem) => {
//         let courseId = "";
//         let isPurchased = false;

//         if (bannerItem.redirectType === "Internal") {
//           if (bannerItem.type === "Notes") {
//             const note = await Note.findOne({ _id: bannerItem.url }).populate(
//               "course"
//             );
//             if (note?.course) {
//               courseId = note.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: note.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (bannerItem.type === "TestSeries") {
//             const testSeries = await TestSeries.findOne({
//               _id: bannerItem.url,
//             }).populate("course");
//             if (testSeries?.course) {
//               courseId = testSeries.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: testSeries.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (["Live", "Recorded"].includes(bannerItem.type)) {
//             const classItem = await Class.findOne({
//               _id: bannerItem.url,
//             }).populate("course");
//             if (classItem?.course) {
//               courseId = classItem.course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: classItem.course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           } else if (bannerItem.type === "Course") {
//             const course = await Course.findById(bannerItem.url);
//             if (course) {
//               courseId = course._id;

//               const transaction = await Transaction.findOne({
//                 user: userId,
//                 item: course._id,
//                 onModel: "Course",
//                 orderStatus: "success",
//               });
//               isPurchased = !!transaction;
//             }
//           }
//         }

//         return {
//           ...bannerItem.toObject(),
//           courseId,
//           isPurchased,
//         };
//       })
//     );

//     res.status(200).json({
//       status: true,
//       message: "Data fetched successfully.",
//       data: {
//         banner: modifiedBanners,
//         recommendedCourse,
//         popularCourse,
//         paidCourse,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const Banner = require("../../../models/banner");
const Class = require("../../../models/class");
const Course = require("../../../models/course");
const Note = require("../../../models/notes");
const TestSeries = require("../../../models/testSeries");
const Transaction = require("../../../models/transaction");

exports.homeApi = async (req, res, next) => {
  try {
    const userExam = req.user.exam;
    const userId = req.user._id;

    // Find purchased courses by the user that are still active (not expired)
    const activePurchases = await Transaction.find({
      user: userId,
      onModel: "Course",
      orderStatus: "success",
      expiryAt: { $gt: new Date() }, // Only get non-expired transactions
    }).select("item");

    // Extract IDs of active purchased courses
    const activePurchasedCourseIds = activePurchases.map(
      (transaction) => transaction.item
    );

    // Fetch all necessary data, ensuring only active purchases are excluded
    const [banner, recommendedCourse, paidCourse] = await Promise.all([
      Banner.find(),
      Course.find({
        exam: { $in: [userExam] },
        _id: { $nin: activePurchasedCourseIds }, // Exclude active purchased courses
      }).select(
        "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
      ),
      Course.find({
        isPremium: true,
        _id: { $nin: activePurchasedCourseIds }, // Exclude active purchased premium courses
      })
        .select(
          "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
        )
        .sort({ createdAt: -1 }),
    ]);

    // Fetch popular courses excluding active purchased courses
    let popularCourse = await Course.find({
      _id: { $nin: activePurchasedCourseIds }, // Exclude active purchased courses
    })
      .select(
        "name price duration rating ratingNumber thumbImage lesson logo bannerImage purchaseNumber"
      )
      .sort({ purchaseNumber: -1 }) // Sort by purchase count
      .limit(10); // Limit to 10 courses

    // If no popular courses found, return random courses
    if (popularCourse.length === 0) {
      popularCourse = await Course.find({
        _id: { $nin: activePurchasedCourseIds },
      })
        .select(
          "name price duration rating ratingNumber thumbImage lesson logo bannerImage"
        )
        .limit(10);
    }

    // Modify banners to check if the related course is purchased and still active
    const modifiedBanners = await Promise.all(
      banner.map(async (bannerItem) => {
        let courseId = "";
        let isPurchased = false;

        if (bannerItem.redirectType === "Internal") {
          if (bannerItem.type === "Notes") {
            const note = await Note.findOne({ _id: bannerItem.url }).populate(
              "course"
            );
            if (note?.course) {
              courseId = note.course._id;

              const transaction = await Transaction.findOne({
                user: userId,
                item: note.course._id,
                onModel: "Course",
                orderStatus: "success",
                expiryAt: { $gt: new Date() }, // Check for active transaction
              });
              isPurchased = !!transaction;
            }
          } else if (bannerItem.type === "TestSeries") {
            const testSeries = await TestSeries.findOne({
              _id: bannerItem.url,
            }).populate("course");
            if (testSeries?.course) {
              courseId = testSeries.course._id;

              const transaction = await Transaction.findOne({
                user: userId,
                item: testSeries.course._id,
                onModel: "Course",
                orderStatus: "success",
                expiryAt: { $gt: new Date() }, // Check for active transaction
              });
              isPurchased = !!transaction;
            }
          } else if (["Live", "Recorded"].includes(bannerItem.type)) {
            const classItem = await Class.findOne({
              _id: bannerItem.url,
            }).populate("course");
            if (classItem?.course) {
              courseId = classItem.course._id;

              const transaction = await Transaction.findOne({
                user: userId,
                item: classItem.course._id,
                onModel: "Course",
                orderStatus: "success",
                expiryAt: { $gt: new Date() }, // Check for active transaction
              });
              isPurchased = !!transaction;
            }
          } else if (bannerItem.type === "Course") {
            const course = await Course.findById(bannerItem.url);
            if (course) {
              courseId = course._id;

              const transaction = await Transaction.findOne({
                user: userId,
                item: course._id,
                onModel: "Course",
                orderStatus: "success",
                expiryAt: { $gt: new Date() }, // Check for active transaction
              });
              isPurchased = !!transaction;
            }
          }
        }

        return {
          ...bannerItem.toObject(),
          courseId,
          isPurchased,
        };
      })
    );

    res.status(200).json({
      status: true,
      message: "Data fetched successfully.",
      data: {
        banner: modifiedBanners,
        recommendedCourse,
        popularCourse,
        paidCourse,
      },
    });
  } catch (error) {
    next(error);
  }
};
