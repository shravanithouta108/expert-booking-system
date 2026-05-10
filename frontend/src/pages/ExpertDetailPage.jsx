import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { expertApi } from "../services/api";
import { useSocket } from "../context/SocketContext";
import TimeSlot from "../components/experts/TimeSlot";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatDate, categoryIcon, avatarBg, getInitials } from "../utils/helpers";

export default function ExpertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [expert, setExpert] = useState(null);
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const fetchExpert = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await expertApi.getById(id);
      setExpert(res.data);
      const availSlots = res.data.availableSlots || {};
      setSlots(availSlots);
      const firstDate = Object.keys(availSlots)[0];
      if (firstDate) setSelectedDate(firstDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchExpert(); }, [fetchExpert]);

  // Socket.io: join expert room & listen for real-time slot updates
  useEffect(() => {
    if (!socket || !id) return;
    socket.emit("join-expert", id);

    const handleSlotBooked = ({ date, timeSlot }) => {
      setSlots((prev) => {
        if (!prev[date]) return prev;
        return {
          ...prev,
          [date]: prev[date].map((s) =>
            s.time === timeSlot ? { ...s, isBooked: true } : s
          ),
        };
      });
    };

    socket.on("slot-booked", handleSlotBooked);
    return () => {
      socket.emit("leave-expert", id);
      socket.off("slot-booked", handleSlotBooked);
    };
  }, [socket, id]);

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    navigate(`/book?expertId=${id}&date=${selectedDate}&timeSlot=${selectedTime}`);
  };

  if (loading) return <LoadingSpinner text="Loading expert profile..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExpert} />;
  if (!expert) return null;

  const dates = Object.keys(slots);
  const currentSlots = selectedDate ? slots[selectedDate] || [] : [];
  const bg = avatarBg(expert.name);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline text-sm mb-6 flex items-center gap-1">
        ← Back to Experts
      </button>

      {/* Expert Header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className={`${bg} w-24 h-24 rounded-3xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0`}>
            {getInitials(expert.name)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{expert.name}</h1>
                <span className="inline-flex items-center gap-1.5 text-slate-500 mt-1">
                  <span>{categoryIcon[expert.category]}</span>
                  <span className="font-medium">{expert.category}</span>
                  <span className="text-slate-300">·</span>
                  <span>{expert.experience} years experience</span>
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 justify-end">
                  <span>★</span>
                  <span className="font-bold text-slate-800 text-lg">{expert.rating.toFixed(1)}</span>
                  <span className="text-slate-400 text-sm">({expert.reviewCount} reviews)</span>
                </div>
                <p className="text-indigo-600 font-bold text-xl mt-1">₹{expert.hourlyRate}<span className="text-sm font-normal text-slate-400">/hr</span></p>
              </div>
            </div>
            <p className="text-slate-600 mt-3 leading-relaxed">{expert.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {expert.skills.map((s) => (
                <span key={s} className="badge bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slot Booking */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">Available Time Slots</h2>
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Updates in real-time
          </span>
        </div>

        {/* Date Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                selectedDate === date
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>

        {/* Time Slots Grid */}
        {currentSlots.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {currentSlots.map(({ time, isBooked }) => (
              <TimeSlot
                key={time}
                time={time}
                isBooked={isBooked}
                isSelected={selectedTime === time}
                onClick={(t) => setSelectedTime(t)}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm mb-6">No slots available for this date.</p>
        )}

        {/* CTA */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          {selectedDate && selectedTime && (
            <p className="text-sm text-slate-600">
              Selected: <strong className="text-indigo-600">{formatDate(selectedDate)}</strong> at <strong className="text-indigo-600">{selectedTime}</strong>
            </p>
          )}
          <button
            onClick={handleBook}
            disabled={!selectedDate || !selectedTime}
            className="btn-primary ml-auto"
          >
            Book This Slot →
          </button>
        </div>
      </div>
    </div>
  );
}