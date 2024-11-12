import axios from 'axios';

// API CONFIGURATION FOR DEPLOYMENT -- UNCOMMENT ON DEPLOYMENT
// const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL,
//     withCredentials: true,
// });

// API CONFIGURATION FOR DEVELOPMENT -- COMMENT ON DEPLOYMENT
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'ngrok-skip-browser-warning': 'true', 
    },
});

export default api;