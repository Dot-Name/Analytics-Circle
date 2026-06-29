import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  amountPaid: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentGateway: { type: String, enum: ["RAZORPAY", "STRIPE"], required: true },
  gatewayOrderId: { type: String, required: true, unique: true },
  gatewayPaymentId: { type: String, default: null }, // Filled upon success verification
  status: { type: String, enum: ["PENDING", "COMPLETED", "FAILED"], default: "PENDING" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);