import axios from 'axios';

// In production uses VITE_API_URL env variable, falls back to localhost for dev
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const userToken = localStorage.getItem('userToken');
        const adminToken = localStorage.getItem('adminToken');

        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        } else if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            error.message = 'Request timeout. Please check your connection.';
        } else if (error.code === 'ERR_NETWORK') {
            error.message = 'Network error. Please make sure the backend server is running on port 5000.';
        } else if (!error.response) {
            error.message = 'Cannot connect to server. Please check if backend is running.';
        }
        return Promise.reject(error);
    }
);

export default api;


