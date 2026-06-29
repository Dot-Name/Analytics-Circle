import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
        type: String,
        required: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    deviceName: {
      type: String,
      default: "Unknown Device",
    },

    ipAddress: {
      type: String,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Session",
  sessionSchema
);