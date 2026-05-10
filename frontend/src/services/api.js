import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor — unwrap data, surface meaningful errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.message ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ── Experts ───────────────────────────────────────────────────────────────────
export const expertApi = {
  getAll: (params) => api.get("/experts", { params }),
  getById: (id) => api.get(`/experts/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingApi = {
  create: (data) => api.post("/bookings", data),
  getByEmail: (email) => api.get("/bookings", { params: { email } }),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

export default api;
