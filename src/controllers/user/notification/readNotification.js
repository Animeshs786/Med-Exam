/* eslint-disable no-case-declarations */
// const Notification = require("../../../models/notification");
// const catchAsync = require("../../../utils/catchAsync");

// exports.readNotification = catchAsync(async (req, res) => {
//   const { notificationId } = req.params;
//   const userId = req.user._id;

//   const notification = await Notification.findById(notificationId);

//   if (!notification) {
//     return res.status(404).json({
//       status: false,
//       message: "Notification not found",
//     });
//   }

//   // Check if the userId is already in the readBy array
//   if (!notification.readBy.includes(userId)) {
//     notification.readBy.push(userId);
//     await notification.save();
//   }

//   res.status(200).json({
//     status: true,
//     message: "Notification view successfully",
//     data: {
//       notification,
//     },
//   });
// });
const Notification = require("../../../models/notification");
const Transaction = require("../../../models/transaction");
const Course = require("../../../models/course");
const Note = require("../../../models/notes");
const TestSeries = require("../../../models/testSeries");
const Class = require("../../../models/class");
const catchAsync = require("../../../utils/catchAsync");

exports.readNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return res.status(404).json({
      status: false,
      message: "Notification not found",
    });
  }

  // Initialize courseId and isPurchased
  let courseId = "";
  let isPurchased = false;

  if (notification.redirectType === "Internal") {
    switch (notification.type) {
      case "Course":
        const course = await Course.findById(notification.url);
        if (course) {
          courseId = course._id;
          isPurchased = !!(await Transaction.exists({
            user: userId,
            item: course._id,
            onModel: "Course",
            orderStatus: "success",
          }));
        }
        break;

      case "Notes":
        const note = await Note.findById(notification.url).populate("course");
        if (note && note.course) {
          courseId = note.course._id;
          isPurchased = !!(await Transaction.exists({
            user: userId,
            item: note.course._id,
            onModel: "Course",
            orderStatus: "success",
          }));
        }
        break;

      case "TestSeries":
        const testSeries = await TestSeries.findById(notification.url).populate(
          "course"
        );
        if (testSeries && testSeries.course) {
          courseId = testSeries.course._id;
          isPurchased = !!(await Transaction.exists({
            user: userId,
            item: testSeries.course._id,
            onModel: "Course",
            orderStatus: "success",
          }));
        }
        break;

      case "Class":
        const classItem = await Class.findById(notification.url).populate(
          "course"
        );
        if (classItem && classItem.course) {
          courseId = classItem.course._id;
          isPurchased = !!(await Transaction.exists({
            user: userId,
            item: classItem.course._id,
            onModel: "Course",
            orderStatus: "success",
          }));
        }
        break;

      // Add more cases as needed for other types
    }
  }

  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }

  const io = req.app.locals.io;
  const users = req.app.locals.users;

  if (io) {
    const notificationCount = await Notification.countDocuments({
      $or: [{ userId: userId }, { userId: null }],
      readBy: { $ne: userId },
    });

    const socketId = users[userId];
    if (socketId) {
      io.to(socketId).emit("notificationCount", notificationCount);
    }
  }

  res.status(200).json({
    status: true,
    message: "Notification retrieved successfully.",
    data: {
      notification: {
        ...notification.toObject(),
        courseId,
        isPurchased,
      },
    },
  });
});
