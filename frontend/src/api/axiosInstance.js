// File: frontend/src/api/axiosInstance.js

import axios from 'axios';
import { store } from '../redux/store'; // Import store

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // URL gốc của Backend
});

// Cấu hình "interceptor" (bộ chặn)
// Trước mỗi request, nó sẽ chạy hàm này
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ trong Redux store
    const token = store.getState().auth.token;
    
    if (token) {
      // Nếu có token, gắn nó vào header Authorization
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;