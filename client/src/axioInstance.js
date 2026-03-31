import axios from 'axios';

const userBaseUrl = axios.create({
    baseURL: "http://localhost:5000/api"
});

userBaseUrl.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default userBaseUrl;