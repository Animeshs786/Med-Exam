// const Razorpay = require("razorpay");
// const AppError = require("../../../utils/AppError");
// const Transaction = require("../../../models/transaction");
// const generateOrderId = require("../../../utils/generateOrderId");
// const Course = require("../../../models/course");

// exports.createTransaction = async (req, res, next) => {
//   console.log("transaction");
//   const razorpayInstance = new Razorpay({
//     key_id: process.env.RAZOR_KEY_ID_TEST,
//     key_secret: process.env.RAZOR_KEY_SECRET_TEST,
//   });
//   try {
//     const { item, onModel, price } = req.body;
//     const user = req.user._id;
//     let newCheckout;
//     let order;

//     if (price) {
//       if (!item) {
//         return next(new AppError("Item must be required.", 400));
//       }

//       if (!onModel) {
//         return next(new AppError("onModle  must be required.", 400));
//       }

//       if (!price) {
//         return next(new AppError("Price  must be required.", 400));
//       }

//       order = await razorpayInstance.orders.create({
//         amount: price * 100, // Amount in paise
//         currency: "INR",
//         receipt: `receipt_${Date.now()}`,
//       });

//       newCheckout = new Transaction({
//         user,
//         orderId: order.id,
//         orderStatus: "initiated",
//         price,
//         onModel,
//         item,
//       });

//       await newCheckout.save();
//       if (onModel === "Course") {
//         const course = await Course.findById(item);
//         course.purchasedNumber = course.purchasedNumber + 1;
//         await course.save();
//       }
//       console.log(order, "orderd");
//     } else {
//       const orderId = generateOrderId();
//       newCheckout = new Transaction({
//         user,
//         orderId,
//         orderStatus: "success",
//         onModel,
//         item,
//       });
//       await newCheckout.save();

//       if (onModel === "Course") {
//         const course = await Course.findById(item);
//         course.purchasedNumber = course?.purchasedNumber + 1;
//         await course.save();
//       }
//     }
//     res.status(200).json({
//       success: true,
//       message: "Order created successfully",
//       order,
//       data: {
//         checkout: newCheckout,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const Razorpay = require("razorpay");
// const AppError = require("../../../utils/AppError");
// const Transaction = require("../../../models/transaction");
// const generateOrderId = require("../../../utils/generateOrderId");
// const Course = require("../../../models/course");

// exports.createTransaction = async (req, res, next) => {
//   const razorpayInstance = new Razorpay({
//     key_id: process.env.RAZOR_KEY_ID_TEST,
//     key_secret: process.env.RAZOR_KEY_SECRET_TEST,
//   });
//   try {
//     const { item, onModel, price } = req.body;
//     const user = req.user._id;
//     let newCheckout;
//     let order;
//     console.log("transactjion++++++++++++++++++++++++++++++++++++");

//     if (price) {
//       if (!item) {
//         return next(new AppError("Item must be required.", 400));
//       }

//       if (!onModel) {
//         return next(new AppError("onModle  must be required.", 400));
//       }

//       if (!price) {
//         return next(new AppError("Price  must be required.", 400));
//       }

//       order = await razorpayInstance.orders.create({
//         amount: price * 100, // Amount in paise
//         currency: "INR",
//         receipt: `receipt_${Date.now()}`,
//       });

//       newCheckout = new Transaction({
//         user,
//         orderId: order.id,
//         orderStatus: "initiated",
//         price,
//         onModel,
//         item,
//       });

//       await newCheckout.save();
//     } else {
//       const orderId = generateOrderId();
//       newCheckout = new Transaction({
//         user,
//         orderId,
//         orderStatus: "success",
//         onModel,
//         item,
//       });
//       await newCheckout.save();

//       if (onModel === "Course") {
//         const course = await Course.findById(item);
//         course.purchasedNumber = course?.purchasedNumber + 1;
//         await course.save();
//       }
//     }
//     res.status(200).json({
//       success: true,
//       message: "Order created successfully",
//       order,
//       data: {
//         checkout: newCheckout,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const Razorpay = require("razorpay");
const AppError = require("../../../utils/AppError");
const Transaction = require("../../../models/transaction");
const generateOrderId = require("../../../utils/generateOrderId");
const Course = require("../../../models/course");

exports.createTransaction = async (req, res, next) => {
  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID_TEST,
    key_secret: process.env.RAZOR_KEY_SECRET_TEST,
  });
  try {
    const { item, onModel, price } = req.body;
    const user = req.user._id;
    let newCheckout;
    let order;

    console.log("transaction++++++++++++++++++++++++++++++++++++");

    if (!item || !onModel || !price) {
      return next(new AppError("Item, onModel, and price are required.", 400));
    }

    const course = await Course.findById(item);
    if (!course) {
      return next(new AppError("Course not found.", 404));
    }

    const expiryDays = course.expiry || 30;
    const newExpiryDate = new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000
    );

    const existingTransaction = await Transaction.findOne({
      user,
      item,
      onModel: "Course",
      orderStatus: "success",
    });

    if (existingTransaction) {
      await Transaction.findByIdAndDelete(existingTransaction?._id);
    }
    
    order = await razorpayInstance.orders.create({
      amount: price * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    newCheckout = new Transaction({
      user,
      orderId: order.id,
      orderStatus: "initiated",
      price,
      onModel,
      item,
      expiryAt: newExpiryDate,
    });

    await newCheckout.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order: order || null, 
      data: {
        checkout: newCheckout,
      },
    });
  } catch (error) {
    next(error);
  }
};
