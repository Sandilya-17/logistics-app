import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ─────────────────────────────────────────────────
export const authAPI = {
  login: (d) => api.post('/auth/login', d),
  changePassword: (d) => api.post('/auth/change-password', d),
  changeUsername: (d) => api.post('/auth/change-username', d),
  updateProfile: (d) => api.put('/auth/profile', d),
};

// ── TRUCKS ───────────────────────────────────────────────
export const trucksAPI = {
  getAll: () => api.get('/trucks'),
  getNumbers: () => api.get('/trucks/numbers'),
  add: (d) => api.post('/trucks', d),
  update: (id, d) => api.put(`/trucks/${id}`, d),
  delete: (id) => api.delete(`/trucks/${id}`),
};

// ── FUEL ─────────────────────────────────────────────────
export const fuelAPI = {
  getAll: () => api.get('/fuel'),
  add: (d) => api.post('/fuel', d),
  update: (id, d) => api.put(`/fuel/${id}`, d),
  delete: (id) => api.delete(`/fuel/${id}`),
  getByTruck: (t) => api.get(`/fuel/truck/${t}`),
  getMonthly: (m, y) => api.get(`/fuel/monthly?month=${m}&year=${y}`),
  getExcessReport: (m, y) => api.get(`/fuel/excess-report?month=${m}&year=${y}`),
};

// ── SPARE PARTS ───────────────────────────────────────────
export const sparePartsAPI = {
  getAll: () => api.get('/spare-parts'),
  add: (d) => api.post('/spare-parts', d),
  update: (id, d) => api.put(`/spare-parts/${id}`, d),
  delete: (id) => api.delete(`/spare-parts/${id}`),
  addPurchase: (d) => api.post('/spare-parts/purchases', d),
  getAllPurchases: () => api.get('/spare-parts/purchases'),
  issue: (d) => api.post('/spare-parts/issues', d),
  getAllIssues: () => api.get('/spare-parts/issues'),
  getIssuesByTruck: (t) => api.get(`/spare-parts/issues/truck/${t}`),
  stockReport: () => api.get('/spare-parts/stock-report'),
};

// ── TYRES ─────────────────────────────────────────────────
export const tyresAPI = {
  getAll: () => api.get('/tyres'),
  add: (d) => api.post('/tyres', d),
  update: (id, d) => api.put(`/tyres/${id}`, d),
  delete: (id) => api.delete(`/tyres/${id}`),
  addPurchase: (d) => api.post('/tyres/purchases', d),
  issue: (d) => api.post('/tyres/issues', d),
  getAllIssues: () => api.get('/tyres/issues'),
  getIssuesByTruck: (t) => api.get(`/tyres/issues/truck/${t}`),
  stockReport: () => api.get('/tyres/stock-report'),
};

// ── TRIPS ─────────────────────────────────────────────────
export const tripsAPI = {
  getAll: () => api.get('/trips'),
  add: (d) => api.post('/trips', d),
  update: (id, d) => api.put(`/trips/${id}`, d),
  delete: (id) => api.delete(`/trips/${id}`),
  getSummary: () => api.get('/trips/summary'),
  getByTruck: (t) => api.get(`/trips/truck/${t}`),
};

// ── USERS (ADMIN) ─────────────────────────────────────────
export const usersAPI = {
  getAll: () => api.get('/admin/users'),
  add: (d) => api.post('/admin/users', d),
  update: (id, d) => api.put(`/admin/users/${id}`, d),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
