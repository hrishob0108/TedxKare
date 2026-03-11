import axios from 'axios';

// ==================== AXIOS INSTANCE ====================
// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REQUEST INTERCEPTOR ====================
// Add JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
// Handle common error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired, clear it and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// ==================== APPLICANT API ====================
export const applicantAPI = {
  // Submit new application
  submitApplication: (data) => api.post('/applicants', data),

  // Get all applicants (admin only)
  getAllApplicants: (queryParams) =>
    api.get('/applicants', { params: queryParams }),

  // Get single applicant (admin only)
  getApplicant: (id) => api.get(`/applicants/${id}`),

  // Update applicant status (admin only)
  updateStatus: (id, status, email) =>
    api.patch(`/applicants/${id}`, { status, email }),

  // Delete applicant (admin only)
  deleteApplicant: (id) => api.delete(`/applicants/${id}`),

  // Get statistics (admin only)
  getStatistics: () => api.get('/applicants/stats'),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Admin login
  login: (email, password) =>
    api.post('/admin/login', { email, password }),

  // Create admin account
  createAdmin: (email, password) =>
    api.post('/admin/create', { email, password }),

  // Verify token
  verifyToken: () => api.get('/admin/verify'),

  // Change password
  changePassword: (currentPassword, newPassword) =>
    api.post('/admin/change-password', {
      currentPassword,
      newPassword,
    }),
};

export default api;
