import axios from 'axios';

// ==================== AXIOS INSTANCE ====================
// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 45000, // 45 seconds to accommodate free tier backend cold starts
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
// Handle common error responses and auto-retry cold start timeouts on GET requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Auto-retry for GET requests on network errors, timeouts, or 502/503/504 server sleep errors
    const isNetworkOrTimeout =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('timeout') ||
      [502, 503, 504].includes(error.response?.status);

    const isGetRequest = config && config.method?.toLowerCase() === 'get';

    if (config && isGetRequest && isNetworkOrTimeout) {
      config.__retryCount = config.__retryCount || 0;
      const MAX_RETRIES = 2;

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        const delay = config.__retryCount * 2000;
        console.warn(`Backend cold start / timeout detected. Retrying request (${config.__retryCount}/${MAX_RETRIES}) in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }

    // If token expired on protected requests, clear it and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/ad';
      }
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
  updateStatus: (id, status, email, shortlistedDomain) =>
    api.patch(`/applicants/${id}`, { status, email, shortlistedDomain }),

  // Delete applicant (admin only)
  deleteApplicant: (id) => api.delete(`/applicants/${id}`),

  // Get statistics (admin only)
  getStatistics: () => api.get('/applicants/stats'),
};

// ==================== SPEAKER API ====================
export const speakerAPI = {
  submitSpeaker: (data) => api.post('/speakers', data),
  getAllSpeakers: () => api.get('/speakers'),
  getSpeaker: (id) => api.get(`/speakers/${id}`),
  updateSpeaker: (id, data) => api.patch(`/speakers/${id}`, data),
  deleteSpeaker: (id) => api.delete(`/speakers/${id}`),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Admin login
  login: (email, password) =>
    api.post('/ad/login', { email, password }),

  // Create admin account
  createAdmin: (email, password) =>
    api.post('/ad/create', { email, password }),

  // Verify token
  verifyToken: () => api.get('/ad/verify'),

  // Change password
  changePassword: (currentPassword, newPassword) =>
    api.post('/ad/change-password', {
      currentPassword,
      newPassword,
    }),
};

// ==================== SETTINGS API ====================
export const settingsAPI = {
  // Get public settings
  getSettings: (config) => api.get('/settings', config),

  // Update settings (admin only)
  updateSettings: (data) => api.patch('/settings', data),
};

// ==================== IDEAS API ====================
export const ideasAPI = {
  getAllIdeas: () => api.get('/ideas'),
  submitIdea: (data) => api.post('/ideas', data),
  likeIdea: (id) => api.post(`/ideas/${id}/like`),
};

export default api;
