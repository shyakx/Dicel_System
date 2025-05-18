import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && typeof user.token === 'string' && user.token.length > 0) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${user.token}`;
      } else {
        // Optionally log a warning for debugging
        // console.warn('No valid token found in localStorage for API request');
      }
    } catch (e) {
      // Optionally log a warning for debugging
      // console.warn('Error parsing user from localStorage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
); 