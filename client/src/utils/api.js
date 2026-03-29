import axios from 'axios';

// Create axios instance with proper configuration
const api = axios.create({
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
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


