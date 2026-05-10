import { useState, useEffect, useCallback } from "react";
import { expertApi } from "../services/api";
import ExpertCard from "../components/experts/ExpertCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import Pagination from "../components/common/Pagination";

const CATEGORIES = ["All", "Technology", "Finance", "Health", "Legal", "Marketing", "Design"];

export default function ExpertListingPage() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, category]);

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await expertApi.getAll({
        page,
        limit: 6,
        category: category === "All" ? undefined : category,
        search: debouncedSearch || undefined,
      });
      setExperts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, category, debouncedSearch]);

  useEffect(() => { fetchExperts(); }, [fetchExperts]);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          Find Your <span className="text-indigo-600">Expert</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Book 1-on-1 sessions with vetted professionals across Technology, Finance, Health, and more.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${
                category === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner text="Finding experts..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchExperts} />
      ) : experts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-slate-600 font-medium text-lg">No experts found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            Showing {experts.length} of {pagination.total} experts
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((e) => <ExpertCard key={e._id} expert={e} />)}
          </div>
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}