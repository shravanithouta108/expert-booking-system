import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { expertApi, bookingApi } from "../services/api";
import { formatDate, formatTime, avatarBg, getInitials, categoryIcon } from "../utils/helpers";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const expertId = searchParams.get("expertId");
  const date = searchParams.get("date");
  const timeSlot = searchParams.get("timeSlot");

  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!expertId) { navigate("/"); return; }
    expertApi.getById(expertId)
      .then((res) => setExpert(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [expertId, navigate]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await bookingApi.create({
        expertId,
        date,
        timeSlot,
        userName: formData.userName,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
      });
      setBooking(res.data);
      setSuccess(true);
      toast.success("Booking confirmed!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading booking form..." />;

  if (success && booking) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="card">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-500 mb-6">Your session has been successfully booked.</p>
          <div className="bg-indigo-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <p className="text-sm"><strong>Expert:</strong> {booking.expertName}</p>
            <p className="text-sm"><strong>Date:</strong> {formatDate(booking.date)}</p>
            <p className="text-sm"><strong>Time:</strong> {formatTime(booking.timeSlot)}</p>
            <p className="text-sm"><strong>Status:</strong> <span className="text-amber-600 font-semibold">Pending</span></p>
            <p className="text-sm text-slate-400 mt-2 text-xs">Booking ID: {booking._id}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/my-bookings")} className="btn-primary">
              View My Bookings
            </button>
            <button onClick={() => navigate("/")} className="btn-outline">
              Browse More
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bg = expert ? avatarBg(expert.name) : "bg-indigo-500";

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline text-sm mb-6 flex items-center gap-1">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Complete Your Booking</h1>

      {/* Booking Summary */}
      {expert && (
        <div className="card mb-6 bg-indigo-50 border-indigo-100">
          <div className="flex items-center gap-4">
            <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold`}>
              {getInitials(expert.name)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{expert.name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <span>{categoryIcon[expert.category]}</span>{expert.category}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Session</p>
              <p className="font-semibold text-indigo-700">{formatDate(date)}</p>
              <p className="text-sm text-indigo-600">{formatTime(timeSlot)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <div className="card">
        <h2 className="text-base font-semibold text-slate-800 mb-5">Your Details</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              {...register("userName", {
                required: "Name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              className={`input ${errors.userName ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="Priya Sharma"
            />
            {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              className={`input ${errors.email ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="priya@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: { value: /^[+]?[\d\s\-().]{7,15}$/, message: "Enter a valid phone number" },
              })}
              className={`input ${errors.phone ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input disabled value={date || ""} className="input bg-slate-50 text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
              <input disabled value={formatTime(timeSlot) || ""} className="input bg-slate-50 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Agenda <span className="text-slate-400">(optional)</span></label>
            <textarea
              {...register("notes", { maxLength: { value: 500, message: "Max 500 characters" } })}
              rows={3}
              className={`input resize-none ${errors.notes ? "border-red-400" : ""}`}
              placeholder="What would you like to discuss? Any specific topics or questions?"
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full mt-2">
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming...
              </span>
            ) : "Confirm Booking →"}
          </button>
        </form>
      </div>
    </div>
  );
}