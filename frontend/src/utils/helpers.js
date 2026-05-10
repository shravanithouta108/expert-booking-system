export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });
};

export const formatTime = (time) => {
  if (!time) return "";
  const [h, min] = time.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const hour = h % 12 || 12;
  return String(hour).padStart(2, "0") + ":" + String(min).padStart(2, "0") + " " + ampm;
};

export const today = () => new Date().toISOString().split("T")[0];

export const statusConfig = {
  pending:   { label: "Pending",   classes: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", classes: "bg-green-100 text-green-700" },
  completed: { label: "Completed", classes: "bg-indigo-100 text-indigo-700" },
  cancelled: { label: "Cancelled", classes: "bg-red-100 text-red-700" },
};

export const categoryIcon = {
  Technology: "💻", Finance: "💰", Health: "🩺",
  Legal: "⚖️", Marketing: "📈", Design: "🎨",
};

export const avatarBg = (name = "") => {
  const colours = ["bg-indigo-500","bg-purple-500","bg-pink-500","bg-teal-500","bg-orange-500","bg-cyan-500"];
  return colours[name.charCodeAt(0) % colours.length];
};

export const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
