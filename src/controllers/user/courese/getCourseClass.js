const Class = require("../../../models/class");
const Bookmark = require("../../../models/bookmark");
const catchAsync = require("../../../utils/catchAsync");

exports.getCourseClass = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const queryType = req.query.type || "id";
  let classDetail;
  let classId;

  if (queryType === "slug") {
    classDetail = await Class.findOne({ slug: id });
    classId = classDetail?._id;
  } else {
    classDetail = await Class.findById(id);
    classId = classDetail?._id;
  }

  if (!classDetail) {
    return res.status(404).json({
      status: false,
      message: "Class not found",
    });
  }
  
  if(!classDetail.watchBy.includes(userId)){
    classDetail.watchBy.push(userId)
  }

  const isBookmarked = await Bookmark.exists({
    user: userId,
    class: classId,
    status: true,
  });

  res.status(200).json({
    status: true,
    message: "Class fetched successfully",
    content: {
      data: {
        ...classDetail.toObject(),
        isBookmarked: !!isBookmarked,
      },
    },
  });
});
