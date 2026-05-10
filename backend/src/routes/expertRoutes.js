const express = require("express");
const router = express.Router();
const { query, param } = require("express-validator");
const { getExperts, getExpertById } = require("../controllers/expertController");
const validate = require("../middleware/validate");

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 20 }).withMessage("Limit must be between 1 and 20"),
    query("category")
      .optional()
      .isIn(["All", "Technology", "Finance", "Health", "Legal", "Marketing", "Design"])
      .withMessage("Invalid category"),
  ],
  validate,
  getExperts
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid expert ID")],
  validate,
  getExpertById
);

module.exports = router;
