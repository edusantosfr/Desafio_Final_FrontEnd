import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const expirationDate = localStorage.getItem('tokenExpiration');

  if (token && expirationDate) {
    const currentTime = new Date().getTime();

    if (currentTime > parseInt(expirationDate)) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      sessionStorage.removeItem('token');
      
      window.location.href = '/';
      return Promise.reject('Token expirado');
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      sessionStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;