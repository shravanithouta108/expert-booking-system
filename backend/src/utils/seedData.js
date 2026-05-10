/**
 * Seed script – run once with: npm run seed
 * Clears existing experts (keeps bookings) and inserts fresh demo data.
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Expert = require("../models/Expert");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/expert-booking";

const experts = [
  {
    name: "Dr. Priya Sharma",
    bio: "Full-stack architect with a passion for scalable cloud systems. Former engineering lead at Google and Flipkart. Specialises in microservices, Kubernetes, and distributed databases.",
    category: "Technology",
    experience: 12,
    rating: 4.9,
    reviewCount: 234,
    hourlyRate: 150,
    skills: ["React", "Node.js", "Kubernetes", "AWS", "System Design"],
    workingHours: { start: 9, end: 17 },
  },
  {
    name: "Arjun Mehta",
    bio: "CFA-certified investment analyst with a decade at Goldman Sachs. Helps individuals and startups navigate personal finance, equity markets, and venture funding strategies.",
    category: "Finance",
    experience: 10,
    rating: 4.8,
    reviewCount: 189,
    hourlyRate: 200,
    skills: ["Portfolio Management", "Tax Planning", "Equity Research", "Startup Finance"],
    workingHours: { start: 10, end: 18 },
  },
  {
    name: "Dr. Kavya Reddy",
    bio: "Board-certified physician specialising in preventive care and wellness. Known for translating complex medical jargon into actionable health plans for busy professionals.",
    category: "Health",
    experience: 8,
    rating: 4.7,
    reviewCount: 312,
    hourlyRate: 120,
    skills: ["Preventive Care", "Nutrition", "Mental Health", "Chronic Disease Management"],
    workingHours: { start: 9, end: 16 },
  },
  {
    name: "Rohan Verma",
    bio: "Senior partner at Verma & Associates. Decade of experience in startup law, IP protection, and commercial contracts. Trusted counsel for 50+ funded startups.",
    category: "Legal",
    experience: 14,
    rating: 4.9,
    reviewCount: 145,
    hourlyRate: 250,
    skills: ["Corporate Law", "IP Rights", "Contract Drafting", "GDPR Compliance"],
    workingHours: { start: 10, end: 17 },
  },
  {
    name: "Sneha Iyer",
    bio: "Growth marketer who scaled B2B SaaS companies from 0 to 1M ARR. Expert in SEO, content strategy, and paid acquisition channels. Ex-HubSpot.",
    category: "Marketing",
    experience: 7,
    rating: 4.6,
    reviewCount: 278,
    hourlyRate: 130,
    skills: ["SEO", "Content Strategy", "PPC", "Growth Hacking", "Analytics"],
    workingHours: { start: 9, end: 17 },
  },
  {
    name: "Vikram Nair",
    bio: "Award-winning UX/UI designer with roots in cognitive psychology. Has redesigned products for Swiggy, Razorpay, and Freshworks. Obsessed with accessibility-first design.",
    category: "Design",
    experience: 9,
    rating: 4.8,
    reviewCount: 196,
    hourlyRate: 140,
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping", "Accessibility"],
    workingHours: { start: 10, end: 18 },
  },
  {
    name: "Ananya Krishnan",
    bio: "AI/ML specialist and Kaggle Grandmaster. Former Research Scientist at DeepMind. Coaches engineers on applied machine learning, LLMs, and MLOps best practices.",
    category: "Technology",
    experience: 6,
    rating: 4.7,
    reviewCount: 167,
    hourlyRate: 180,
    skills: ["Python", "TensorFlow", "LLMs", "MLOps", "Computer Vision"],
    workingHours: { start: 11, end: 19 },
  },
  {
    name: "Suresh Pillai",
    bio: "Chartered accountant and financial planner helping MSMEs and professionals with tax optimisation, GST compliance, and business valuation.",
    category: "Finance",
    experience: 15,
    rating: 4.5,
    reviewCount: 320,
    hourlyRate: 110,
    skills: ["Taxation", "GST", "Financial Planning", "Business Valuation", "Audit"],
    workingHours: { start: 9, end: 17 },
  },
  {
    name: "Dr. Meera Patel",
    bio: "Licensed clinical psychologist specialising in workplace burnout, anxiety, and leadership psychology. Evidence-based CBT practitioner with corporate program experience.",
    category: "Health",
    experience: 11,
    rating: 4.9,
    reviewCount: 401,
    hourlyRate: 160,
    skills: ["CBT", "Stress Management", "Leadership Psychology", "Mindfulness"],
    workingHours: { start: 9, end: 15 },
  },
  {
    name: "Rahul Desai",
    bio: "Brand strategist and creative director behind campaigns for TATA, Byju's, and Zomato. Helps startups build compelling brand identities that resonate and convert.",
    category: "Marketing",
    experience: 10,
    rating: 4.6,
    reviewCount: 152,
    hourlyRate: 145,
    skills: ["Brand Strategy", "Creative Direction", "Social Media", "Storytelling", "Video Marketing"],
    workingHours: { start: 10, end: 18 },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅  Connected to MongoDB");

    await Expert.deleteMany({});
    console.log("🗑   Cleared existing experts");

    const inserted = await Expert.insertMany(experts);
    console.log(`🌱  Seeded ${inserted.length} experts`);

    console.log("\nExpert IDs for reference:");
    inserted.forEach((e) => console.log(`  ${e.name}: ${e._id}`));
  } catch (err) {
    console.error("❌  Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌  Disconnected from MongoDB");
  }
}

seed();
