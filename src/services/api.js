import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Auth
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  
  // Users
  getUsers: () => api.get('/api/users'),
  createUser: (userData) => api.post('/api/users', userData),
  updateUser: (userId, userData) => api.put(`/api/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/api/users/${userId}`),
  addMember: (userId, memberData) => api.post(`/api/users/${userId}/members`, memberData),
  
  // Attendance
  getAttendance: (params) => api.get('/api/attendance', { params }),
  markAttendance: (data) => api.post('/api/attendance', data),
  approveAttendance: (id) => api.put(`/api/attendance/${id}/approve`),
  rejectAttendance: (id) => api.put(`/api/attendance/${id}/reject`),
  bulkApproveAttendance: (ids) => api.post('/api/attendance/bulk-approve', { ids }),
  
  // Gatha
  getGatha: (params) => api.get('/api/gatha', { params }),
  addGatha: (data) => api.post('/api/gatha', data),
  approveGatha: (id) => api.put(`/api/gatha/${id}/approve`),
  rejectGatha: (id) => api.put(`/api/gatha/${id}/reject`),
  bulkApproveGatha: (ids) => api.post('/api/gatha/bulk-approve', { ids }),
  
  // Reports
  getMonthlyReport: (year, month) => api.get(`/api/reports/monthly/${year}/${month}`),
  getStudentReport: (memberId, startDate, endDate) => 
    api.get(`/api/reports/student/${memberId}`, { params: { startDate, endDate } }),
  exportReport: (type, params) => api.get(`/api/reports/export/${type}`, { 
    params, 
    responseType: 'blob' 
  }),
};

export default api;
