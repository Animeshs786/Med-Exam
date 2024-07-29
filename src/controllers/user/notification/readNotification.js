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
    message: "Notification retrieved successfully",
    data: {
      notification,
    },
  });
});
