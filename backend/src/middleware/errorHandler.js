/**
 * Central error-handling middleware.
 * All errors thrown or passed via next(err) land here.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error("❌ Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // MongoDB duplicate key – double booking
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "This time slot has already been booked. Please choose another slot.",
    });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  // Custom status passed by controllers
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
