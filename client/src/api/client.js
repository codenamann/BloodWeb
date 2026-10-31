import env from "../utils/env.js";
import axios from "axios";

const client = axios.create({ baseURL: env.server.url });

client.interceptors.request.use(config => {
    const token = localStorage.getItem('bloodweb_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('bloodweb_token');
            const publicPaths = ['/login', '/register', '/verify-otp', '/'];
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;