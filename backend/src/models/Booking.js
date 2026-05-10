const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    expertName: { type: String, required: true },
    expertCategory: { type: String, required: true },
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },      // "YYYY-MM-DD"
    timeSlot: { type: String, required: true },  // "HH:MM"
    notes: { type: String, default: "", maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// ── Critical: prevents double-booking at the database level ──────────────────
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });
bookingSchema.index({ email: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
