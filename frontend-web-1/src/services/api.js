import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
  // , baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  // withCredentials: true,
  // headers: {
  //       'ngrok-skip-browser-warning': 'true',  // Add this header to bypass ngrok warning
  // },
});

let alertShown = false;

export const setupAxiosInterceptors = (setShowModal) => {
  api.interceptors.response.use(
    response => response,
    error => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) ||
        error.response.data.message === 'Access token expired. Please use the refresh token to obtain a new access token.'
      ) {
        if (!alertShown) {
          setShowModal(true); // Display the modal
          alertShown = true; // Prevent multiple alerts
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
