const Bookmark = require("../../../models/bookmark");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllBookmarks = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const bookmarks = await Bookmark.find({ user: userId })
    .populate("item")
    .exec();

  const bookmarkData = bookmarks.map((bookmark) => ({
    item: bookmark.item,
    type: bookmark.onModel,
    status: bookmark.status,
    createdAt: bookmark.createdAt,
  }));

  res.status(200).json({
    status: true,
    results: bookmarkData.length,
    message: "Bookmarks retrieved successfully",
    data: {
      bookmarks: bookmarkData,
    },
  });
});
