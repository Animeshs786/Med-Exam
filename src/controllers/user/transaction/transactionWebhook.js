const Course = require("../../../models/course");
const Transaction = require("../../../models/transaction");
const crypto = require("crypto");

exports.transactionWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  console.log(secret, "secret");
  // const secret = "skdhfsakhydfiawhiwhdsdsdesneow";
  try {
    const bodyString = JSON.stringify(req.body);
    console.log(bodyString, "body");

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(bodyString);
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      const event = req.body;
      console.log(event, "event+++++++++++++++++++++++++++");

      const paymentEntity = event.payload.payment.entity;
      console.log(paymentEntity.order_id, "order_id");

      if (event.event === "payment.captured") {
        console.log("Payment captured or authorized event received");

        const orderId = paymentEntity.order_id;
        if (!orderId) {
          console.error("Order ID is null. Cannot proceed.");
          return res
            .status(400)
            .json({ status: "error", message: "Order ID is null" });
        }

        const order = await Transaction.findOneAndUpdate(
          { orderId },
          {
            orderStatus: "success",
            paymentId: paymentEntity.id,
          },
          { new: true }
        );

        if (order && order.onModel === "Course") {
          const course = await Course.findById(order.item);
          course.purchasedNumber = course.purchasedNumber + 1;
          await course.save();
        }


      } else if (event.event === "payment.failed") {
        const orderId = paymentEntity.order_id;
        if (!orderId) {
          console.error("Order ID is null. Cannot proceed.");
          return res
            .status(400)
            .json({ status: "error", message: "Order ID is null" });
        }

        await Transaction.findOneAndUpdate(
          { orderId },
          { orderStatus: "failed", paymentId: paymentEntity.id },
          { new: true }
        );
      }

      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ status: "invalid signature" });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
