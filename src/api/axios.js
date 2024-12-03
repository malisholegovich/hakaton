import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // URL вашего Node.js сервера
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
