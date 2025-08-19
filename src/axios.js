import axios from 'axios';

// tente .env do Vue CLI; se não existir, cai num padrão local:
const baseURL =
    process.env.VUE_APP_API_URL ||
    'http://localhost:8000/api'; // ajuste se necessário

const api = axios.create({ baseURL });

// Auth header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// 401/403 -> logout
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response && [401, 403].includes(err.response.status)) {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }
        return Promise.reject(err);
    }
);

export default api;
