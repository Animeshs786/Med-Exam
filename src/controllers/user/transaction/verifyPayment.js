const Razorpay = require("razorpay");
const AppError = require("../../../utils/AppError");
const Transaction = require("../../../models/transaction");

exports.verifyPayment = async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID_TEST,
    key_secret: process.env.RAZOR_KEY_SECRET_TEST,
  });

  try {
    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_KEY_SECRET_TEST)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");
    
    const isValid = generatedSignature === razorpaySignature;

    if (!isValid) {
      // Payment verification failed
      const transaction = await Transaction.findOneAndUpdate(
        { orderId: razorpayOrderId },
        { orderStatus: "failed" },
        { new: true }
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: {
          transaction,
        },
      });
    }

    // Payment verification successful
    const transaction = await Transaction.findOneAndUpdate(
      { orderId: razorpayOrderId },
      { orderStatus: "success" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};
