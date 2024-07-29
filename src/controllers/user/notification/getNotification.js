const Notification = require("../../../models/notification");
const catchAsync = require("../../../utils/catchAsync");

exports.getNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({
    $or: [{ userId }, { userId: null }],
  }).sort({ createdAt: -1 });

  // Add isRead field based on whether the userId is in the readBy array
  const notificationsWithReadStatus = notifications.map((notification) => {
    return {
      ...notification.toObject(),
      isRead: notification.readBy.includes(userId),
    };
  });

  res.status(200).json({
    status: true,
    results: notificationsWithReadStatus.length,
    message: "Notifications retrieved successfully",
    data: {
      notifications: notificationsWithReadStatus,
    },
  });
});
