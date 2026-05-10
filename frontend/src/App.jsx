import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ExpertListingPage from "./pages/ExpertListingPage";
import ExpertDetailPage from "./pages/ExpertDetailPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<ExpertListingPage />} />
          <Route path="/experts/:id" element={<ExpertDetailPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route
            path="*"
            element={
              <div className="text-center py-32">
                <p className="text-6xl mb-4">404</p>
                <p className="text-slate-500 text-lg">Page not found</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
