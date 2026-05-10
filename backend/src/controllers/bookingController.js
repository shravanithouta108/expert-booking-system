const Booking = require("../models/Booking");
const Expert = require("../models/Expert");

// ── POST /api/bookings ────────────────────────────────────────────────────────
exports.createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, email, phone, date, timeSlot, notes } = req.body;

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    // Check if slot is already booked (before insert, for a readable error)
    const existing = await Booking.findOne({
      expertId,
      date,
      timeSlot,
      status: { $ne: "cancelled" },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This time slot has already been booked. Please choose another slot.",
      });
    }

    // Create booking – unique index provides the final atomic guard
    const booking = await Booking.create({
      expertId,
      expertName: expert.name,
      expertCategory: expert.category,
      userName,
      email,
      phone,
      date,
      timeSlot,
      notes: notes || "",
    });

    // ── Real-time: notify all clients viewing this expert ────────────────────
    const io = req.app.get("io");
    if (io) {
      io.to(`expert-${expertId}`).emit("slot-booked", {
        expertId,
        date,
        timeSlot,
        bookingId: booking._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully!",
      data: booking,
    });
  } catch (err) {
    // Duplicate key = race condition caught at DB level
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This time slot was just booked by someone else. Please choose another slot.",
      });
    }
    next(err);
  }
};

// ── GET /api/bookings?email= ──────────────────────────────────────────────────
exports.getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const bookings = await Booking.find({ email: email.toLowerCase().trim() })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/status ────────────────────────────────────────────
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(", ")}`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Notify real-time clients
    const io = req.app.get("io");
    if (io) {
      io.to(`expert-${booking.expertId}`).emit("booking-status-updated", {
        bookingId: booking._id,
        status,
      });
    }

    res.json({ success: true, message: "Status updated", data: booking });
  } catch (err) {
    next(err);
  }
};
