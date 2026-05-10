const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Finance", "Health", "Legal", "Marketing", "Design"],
    },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    hourlyRate: { type: Number, required: true },
    avatar: { type: String, default: "" },
    skills: [{ type: String }],
    workingHours: {
      start: { type: Number, default: 9 },  // 9 AM
      end: { type: Number, default: 17 },   // 5 PM
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

expertSchema.index({ name: "text", bio: "text", skills: "text" });
expertSchema.index({ category: 1 });
expertSchema.index({ rating: -1 });

module.exports = mongoose.model("Expert", expertSchema);
