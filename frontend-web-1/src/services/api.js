import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

let alertShown = false;

export const setupAxiosInterceptors = (setShowModal) => {
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        if (!alertShown) {
          setShowModal(true); 
          alertShown = true; 
        }
      }

      return Promise.reject(error);
    }
  );
};


export default api;