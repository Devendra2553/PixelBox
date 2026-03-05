import axios from 'axios';

const userBaseUrl = axios.create({
    baseURL: "http://localhost:5000/api/users"
});

// Add a request interceptor
userBaseUrl.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            // Attach token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default userBaseUrl;