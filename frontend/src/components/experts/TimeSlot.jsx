import { formatTime } from "../../utils/helpers";

export default function TimeSlot({ time, isBooked, isSelected, onClick }) {
  if (isBooked) {
    return (
      <button
        disabled
        title="Already booked"
        className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 text-slate-400 line-through cursor-not-allowed border border-slate-200"
      >
        {formatTime(time)}
        <span className="block text-[10px] mt-0.5 no-underline">Booked</span>
      </button>
    );
  }
  return (
    <button
      onClick={() => onClick(time)}
      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
        isSelected
          ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
          : "bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
      }`}
    >
      {formatTime(time)}
    </button>
  );
}