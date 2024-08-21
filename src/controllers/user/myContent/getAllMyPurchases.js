const Transaction = require("../../../models/transaction");
const MockTest = require("../../../models/mockTest");
const TestResult = require("../../../models/testResult");
const Bookmark = require("../../../models/bookmark");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllMyPurchases = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { type } = req.query;

  let transactionsQuery = {
    user: userId,
    orderStatus: "success",
  };

  if (type && type !== "Bookmark") {
    transactionsQuery.onModel = type;
  }

  let data = [];

  if (type === "Bookmark" || type === undefined) {
    const bookmarks = await Bookmark.find({
      user: userId,
      status: true,
    }).populate("class", "title thumbImage logo");

    for (const bookmark of bookmarks) {
      if (bookmark.class) {
        const item = bookmark.class.toObject();
        item.type = "Bookmark";
        data.push(item);
      }
    }
  }

  if (type !== "Bookmark" || type === undefined) {
    console.log("here");
    const transactions = await Transaction.find(transactionsQuery).populate(
      "item",
      "name thumbImage logo rating subHeading"
    );

    for (const transaction of transactions) {
      if (transaction.item) {
        // Check if item is not null
        const item = transaction.item.toObject();
        item.type = transaction.onModel; // Add type field to the item

        if (transaction.onModel === "TestSeries") {
          const totalMockTests = await MockTest.countDocuments({
            testSeries: transaction.item._id,
          });

          const userSubmittedTests = await TestResult.countDocuments({
            user: userId,
            mockTest: {
              $in: await MockTest.find({
                testSeries: transaction.item._id,
              }).distinct("_id"),
            },
          });

          item.totalMockTests = totalMockTests;
          item.userSubmittedTests = userSubmittedTests;
        }

        data.push(item);
      }
    }
  }

  if (data.length === 0) {
    return res.status(404).json({
      status: false,
      error: {
        statusCode: 404,
        status: false,
        message: "No purchases found",
      },
      message: "No purchases found",
    });
  }

  res.status(200).json({
    status: true,
    results: data.length,
    message: "Purchases retrieved successfully",
    data: {
      purchases: data,
    },
  });
});
