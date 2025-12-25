// src/services/api.js
import { auth } from "./firebase";

// Base URL for API
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    // Use emulator in development if configured
    if (process.env.REACT_APP_USE_EMULATOR === "true") {
      return "http://localhost:5001/YOUR_PROJECT_ID/us-central1/api";
    }
  }
  // Production URL
  return `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/api`;
};

const BASE_URL = getBaseUrl();

// Get auth token
const getToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = await getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }
  
  return data;
};

// API methods
const api = {
  // Health check
  health: () => apiRequest("/health"),
  
  // Auth
  getMe: () => apiRequest("/auth/me"),
  
  // Attendance
  markAttendance: (data) => apiRequest("/attendance/mark", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  
  getAttendanceHistory: (memberId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/attendance/history/${memberId}?${query}`);
  },
  
  checkTodayAttendance: (memberId) => apiRequest(`/attendance/today/${memberId}`),
  
  // Gatha
  addGatha: (data) => apiRequest("/gatha/add", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  
  getGathaHistory: (memberId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/gatha/history/${memberId}?${query}`);
  },
  
  getGathaStats: (memberId) => apiRequest(`/gatha/stats/${memberId}`),
  
  // Admin
  getPending: () => apiRequest("/admin/pending"),
  
  approve: (type, id) => apiRequest(`/admin/approve/${type}/${id}`, {
    method: "POST",
  }),
  
  reject: (type, id) => apiRequest(`/admin/reject/${type}/${id}`, {
    method: "POST",
  }),
  
  approveAll: (type) => apiRequest(`/admin/approve-all/${type}`, {
    method: "POST",
  }),
  
  getStudents: () => apiRequest("/admin/students"),
  
  addMember: (userId, name) => apiRequest(`/admin/students/${userId}/members`, {
    method: "POST",
    body: JSON.stringify({ name }),
  }),
  
  getStudentDetails: (memberId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/students/${memberId}/details?${query}`);
  },
  
  // Reports
  getMonthlyReport: (memberId, year, month) => 
    apiRequest(`/reports/monthly/${memberId}?year=${year}&month=${month}`),
  
  getProgressChart: (memberId, months = 6) => 
    apiRequest(`/reports/progress/${memberId}?months=${months}`),
  
  // User
  getProfile: () => apiRequest("/user/profile"),
  
  updateProfile: (data) => apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  
  // Languages
  getLanguages: () => apiRequest("/languages"),
  getTranslations: (lang) => apiRequest(`/translations/${lang}`),
};

export default api;
