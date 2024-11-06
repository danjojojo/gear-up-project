import axios from 'axios';

const api = axios.create({
    // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    baseURL: process.env.REACT_APP_API_URL,
    // headers: {
    //     'ngrok-skip-browser-warning': 'true',  // Add this header to bypass ngrok warning
    // },
});

export default api;