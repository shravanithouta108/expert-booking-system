import { Link, NavLink } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

export default function Navbar() {
  const { connected } = useSocket();
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <span className="text-2xl">🎯</span> ExpertConnect
        </Link>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`
            }
          >
            Experts
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`
            }
          >
            My Bookings
          </NavLink>
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${connected ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
            {connected ? "Live" : "Offline"}
          </span>
        </div>
      </div>
    </nav>
  );
}