const express = require("express");
const router = express.Router();
const { body, query, param } = require("express-validator");
const {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} = require("../controllers/bookingController");
const validate = require("../middleware/validate");

// POST /api/bookings
router.post(
  "/",
  [
    body("expertId").isMongoId().withMessage("Valid expert ID is required"),
    body("userName")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be 2–100 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^[+]?[\d\s\-().]{7,15}$/)
      .withMessage("Please enter a valid phone number"),
    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage("Date must be in YYYY-MM-DD format"),
    body("timeSlot")
      .notEmpty()
      .withMessage("Time slot is required")
      .matches(/^\d{2}:\d{2}$/)
      .withMessage("Time slot must be in HH:MM format"),
    body("notes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Notes cannot exceed 500 characters"),
  ],
  validate,
  createBooking
);

// GET /api/bookings?email=
router.get(
  "/",
  [query("email").trim().notEmpty().isEmail().withMessage("Valid email is required")],
  validate,
  getBookingsByEmail
);

// PATCH /api/bookings/:id/status
router.patch(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Invalid booking ID"),
    body("status")
      .notEmpty()
      .isIn(["pending", "confirmed", "completed", "cancelled"])
      .withMessage("Invalid status value"),
  ],
  validate,
  updateBookingStatus
);

module.exports = router;
