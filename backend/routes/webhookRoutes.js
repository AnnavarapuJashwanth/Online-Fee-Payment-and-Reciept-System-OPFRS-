import express from "express";
import crypto from "crypto";
import Payment from "../models/Payment.js";

const router = express.Router();

router.post("/razorpay", express.json({ type: "application/json" }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      const event = req.body.event;
      if (event === "payment.captured") {
        const paymentId = req.body.payload.payment.entity.id;
        await Payment.findOneAndUpdate({ paymentId }, { status: "paid" });
      }
      res.json({ received: true });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
