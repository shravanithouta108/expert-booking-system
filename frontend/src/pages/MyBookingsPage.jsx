import { useState } from "react";
import { useForm } from "react-hook-form";
import { bookingApi } from "../services/api";
import { formatDate, formatTime, statusConfig, categoryIcon, avatarBg, getInitials } from "../utils/helpers";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSearch = async ({ email }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.getByEmail(email);
      setBookings(res.data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;
    setUpdatingId(bookingId);
    try {
      await bookingApi.updateStatus(bookingId, "cancelled");
      setBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, status: "cancelled" } : b)
      );
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOrder = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };
  const sorted = [...bookings].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-500">Enter your email to view all your sessions</p>
      </div>

      {/* Email lookup */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit(onSearch)} className="flex gap-3" noValidate>
          <div className="flex-1">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              className={`input ${errors.email ? "border-red-400" : ""}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? "Searching..." : "Find Bookings"}
          </button>
        </form>
      </div>

      {/* Results */}
      {loading && <LoadingSpinner text="Fetching your bookings..." />}

      {error && (
        <div className="card text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && searched && bookings.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-slate-600 font-medium">No bookings found for this email</p>
          <p className="text-slate-400 text-sm mt-1">Book a session with an expert to get started</p>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{sorted.length} booking{sorted.length !== 1 ? "s" : ""} found</p>
          {sorted.map((booking) => {
            const bg = avatarBg(booking.expertName);
            const cfg = statusConfig[booking.status] || statusConfig.pending;
            const isCancellable = ["pending", "confirmed"].includes(booking.status);

            return (
              <div key={booking._id} className={`card ${booking.status === "cancelled" ? "opacity-60" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {getInitials(booking.expertName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-slate-900">{booking.expertName}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <span>{categoryIcon[booking.expertCategory]}</span>
                          {booking.expertCategory}
                        </p>
                      </div>
                      <span className={`badge ${cfg.classes} text-xs px-3 py-1 rounded-full font-semibold`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                      <span>📅 {formatDate(booking.date)}</span>
                      <span>⏰ {formatTime(booking.timeSlot)}</span>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-slate-400 mt-2 italic">"{booking.notes}"</p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-400">ID: {booking._id}</p>
                      {isCancellable && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={updatingId === booking._id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50"
                        >
                          {updatingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}