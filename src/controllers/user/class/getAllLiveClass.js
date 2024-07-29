const Class = require("../../../models/class");
const Transaction = require("../../../models/transaction");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllLiveClass = catchAsync(async (req, res) => {
  const currentDateTime = new Date();
  const { exam } = req.query;
  const userId = req.user._id;

  const query = { type: "Live" };
  if (exam) {
    query.exam = { $in: [exam] };
  }

  // Find all live classes based on the query
  let classes = await Class.find(query)
    .populate("mentor", "name profileImage")
    .sort({ schedule: 1 });

  const course = classes?.courese;

  const transactions = await Transaction.find({
    user: userId,
    item: course,
    onModel: "Course",
    orderStatus: "completed",
  });

  const hasPurchasedCourse = transactions?.length > 0;

  classes = classes.map((classItem) => {
    const isPurchased = hasPurchasedCourse || classItem.price === 0;

    return {
      ...classItem._doc,
      isPurchased,
    };
  });

  res.status(200).json({
    status: true,
    size: classes.length,
    message: "Classes fetched successfully",
    content: {
      data: classes,
    },
  });
});