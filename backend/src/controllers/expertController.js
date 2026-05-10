const Expert = require("../models/Expert");
const Booking = require("../models/Booking");

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns an array of "YYYY-MM-DD" strings for the next `days` working days */
const getWorkingDays = (days = 14) => {
  const result = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (result.length < days) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      result.push(cursor.toISOString().split("T")[0]);
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
};

/** Generates time slot strings for given working-hour range */
const generateSlots = (startHour, endHour) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
};

// ── GET /api/experts ──────────────────────────────────────────────────────────
exports.getExperts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 6));
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const [experts, total] = await Promise.all([
      Expert.find(filter)
        .select("-__v")
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Expert.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: experts,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/experts/:id ──────────────────────────────────────────────────────
exports.getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).select("-__v");
    if (!expert) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    // Build available-slot map for next 14 working days
    const workingDays = getWorkingDays(14);
    const today = new Date().toISOString().split("T")[0];

    // Fetch all bookings for this expert in the date range
    const bookings = await Booking.find(
      {
        expertId: expert._id,
        date: { $in: workingDays },
        status: { $ne: "cancelled" },
      },
      "date timeSlot"
    );

    // Build a Set of "date|time" for O(1) lookup
    const bookedSet = new Set(bookings.map((b) => `${b.date}|${b.timeSlot}`));

    const allSlots = generateSlots(
      expert.workingHours.start,
      expert.workingHours.end
    );

    const availableSlots = {};
    for (const day of workingDays) {
      // Skip past days
      if (day < today) continue;
      availableSlots[day] = allSlots.map((time) => ({
        time,
        isBooked: bookedSet.has(`${day}|${time}`),
      }));
    }

    res.json({
      success: true,
      data: { ...expert.toObject(), availableSlots },
    });
  } catch (err) {
    next(err);
  }
};
