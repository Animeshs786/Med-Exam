const Bookmark = require("../../../models/bookmark");
const catchAsync = require("../../../utils/catchAsync");

exports.bookmarkClass = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { class: classId } = req.body;

  if (!classId) {
    return res.status(400).json({
      status: false,
      message: "Class ID is required",
    });
  }

  let bookmark = await Bookmark.findOne({ user: userId, class: classId });

  if (bookmark) {
    bookmark.status = !bookmark.status;
    await bookmark.save();
    res.status(200).json({
      status: true,
      message: bookmark.status
        ? "Bookmark added successfully"
        : "Bookmark removed successfully",
      bookmarkStatus: bookmark.status,
    });
  } else {
    bookmark = new Bookmark({
      user: userId,
      class: classId,
    });
    await bookmark.save();
    res.status(201).json({
      status: true,
      message: "Bookmark add successfully",
      bookmarkStatus: bookmark.status,
    });
  }
});
