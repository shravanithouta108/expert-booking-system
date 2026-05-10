import { Link } from "react-router-dom";
import { categoryIcon, avatarBg, getInitials } from "../../utils/helpers";

export default function ExpertCard({ expert }) {
  const bg = avatarBg(expert.name);
  const initials = getInitials(expert.name);

  return (
    <div className="card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className={`${bg} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-base leading-tight truncate">{expert.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <span>{categoryIcon[expert.category]}</span>
            {expert.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
          <span className="text-sm">★</span>
          <span className="text-sm font-semibold text-slate-700">{expert.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({expert.reviewCount})</span>
        </div>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{expert.bio}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {expert.skills.slice(0, 3).map((s) => (
          <span key={s} className="badge bg-indigo-50 text-indigo-700">{s}</span>
        ))}
        {expert.skills.length > 3 && (
          <span className="badge bg-slate-100 text-slate-500">+{expert.skills.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400">Experience</p>
          <p className="text-sm font-semibold text-slate-700">{expert.experience} yrs</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Hourly Rate</p>
          <p className="text-sm font-semibold text-indigo-600">₹{expert.hourlyRate}</p>
        </div>
        <Link to={`/experts/${expert._id}`} className="btn-primary text-sm px-4 py-2">
          View Profile
        </Link>
      </div>
    </div>
  );
}