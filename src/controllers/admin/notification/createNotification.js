const Notification = require("../../../models/notification");
const catchAsync = require("../../../utils/catchAsync");

exports.createNotification = catchAsync(async (req, res) => {
  let thumbImage;
  const { title, message, userId } = req.body;

  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const newNotification = await Notification.create({
    title,
    message,
    userId: userId || null,
    thumbImage,
  });

  const io = req.app.locals.io;
  const users = req.app.locals.users;

  if (io) {
    const emitNotificationCount = async (userId) => {
      const notificationCount = await Notification.countDocuments({
        $or: [{ userId: userId }, { userId: null }],
        readBy: { $ne: userId },
      });

      const socketId = users[userId];
      if (socketId) {
        io.to(socketId).emit("notificationCount", notificationCount);
      }
    };

    if (userId) {
      emitNotificationCount(userId);
      const socketId = users[userId];
      if (socketId) {
        io.to(socketId).emit("notification", newNotification);
      }
    } else {
      io.emit("notification", newNotification);
      // Emit count to all users
      for (const userId of Object.keys(users)) {
        emitNotificationCount(userId);
      }
    }
  } else {
    console.error("Socket.io instance not found on req");
  }

  res.status(201).json({
    status: true,
    message: "Notification created successfully",
    data: {
      notification: newNotification,
    },
  });
});
