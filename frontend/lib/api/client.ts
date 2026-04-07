import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Needed if backend relies on cookies (not strictly needed for JWT in header, but good practice)
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('financeflow_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from localStorage', error);
    }
  }
  return config;
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    // Our backend returns { success, message, data, meta }
    // We'll just return the full response data
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeflow_auth_token');
        localStorage.removeItem('financeflow_auth_user');
        
        // Redirect to login if not already there
        if (!window.location.pathname.match(/^\/(login|register)$/)) {
          window.location.href = '/login';
        }
      }
    }
    // Reject with the backend error payload or standard error
    return Promise.reject(error.response?.data || { message: error.message });
  }
);
