const Notification = require("../../../models/notification");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const firebase = require("../../../firebase/firebase");

exports.createNotification = catchAsync(async (req, res) => {
  let thumbImage;
  const { title, message, userId, redirectType, type, url, webUrl } = req.body;

  if (req.files.thumbImage) {
    thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
  }

  const newNotification = await Notification.create({
    title,
    message,
    userId: userId || null,
    thumbImage,
    redirectType,
    type,
    url,
    webUrl,
    // createdAt,
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

// exports.createNotification = catchAsync(async (req, res) => {
//   let thumbImage;
//   const { title, message, userId, redirectType, type, url, webUrl } = req.body;

//   if (req.files.thumbImage) {
//     thumbImage = `${req.files.thumbImage[0].destination}/${req.files.thumbImage[0].filename}`;
//   }
//   const createdAt = getCurrentDate();

//   const newNotification = await Notification.create({
//     title,
//     message,
//     userId: userId || null,
//     thumbImage,
//     redirectType,
//     type,
//     url,
//     webUrl,
//     // createdAt,
//   });

//   const io = req.app.locals.io;
//   const users = req.app.locals.users;

//   if (io) {
//     const emitNotificationCount = async (userId) => {
//       const notificationCount = await Notification.countDocuments({
//         $or: [{ userId: userId }, { userId: null }],
//         readBy: { $ne: userId },
//       });

//       const socketId = users[userId];
//       if (socketId) {
//         io.to(socketId).emit("notificationCount", notificationCount);
//       }
//     };

//     if (userId) {
//       emitNotificationCount(userId);
//       const socketId = users[userId];
//       if (socketId) {
//         io.to(socketId).emit("notification", newNotification);
//       } else {
//         // Send FCM notification if socketId doesn't exist
//         await sendFCMNotification(userId, title, message, thumbImage, type);
//       }
//     } else {
//       io.emit("notification", newNotification);
//       // Emit count to all users
//       for (const userId of Object.keys(users)) {
//         emitNotificationCount(userId);
//         const socketId = users[userId];
//         if (!socketId) {
//           await sendFCMNotification(userId, title, message, thumbImage, type);
//         }
//       }
//     }
//   } else {
//     console.error("Socket.io instance not found on req");
//   }

//   res.status(201).json({
//     status: true,
//     message: "Notification created successfully",
//     data: {
//       notification: newNotification,
//     },
//   });
// });

// // Function to send FCM notification
// const sendFCMNotification = async (
//   userId,
//   title,
//   message,
//   thumbImage,
//   type
// ) => {
//   const user = await User.findById(userId);
//   if (!user || !user.fcmToken) return;

//   const payload = {
//     notification: {
//       title: title,
//       body: message,
//       image: thumbImage,
//     },
//     data: {
//       type: type,
//     },
//   };

//   try {
//     await firebase.messaging().sendToDevice(user.fcmToken, payload);
//     console.log(`Notification sent via FCM to user ${userId}`);
//   } catch (error) {
//     console.error("Error sending FCM notification:", error);
//   }
// };
