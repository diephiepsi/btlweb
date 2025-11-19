// File: frontend/src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // (Các thành viên khác sau này sẽ thêm reducer của họ vào đây)
  },
});