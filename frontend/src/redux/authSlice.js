// File: frontend/src/redux/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Lấy token từ localStorage nếu có (để F5 không bị logout)
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action này sẽ được gọi khi đăng nhập thành công
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Lưu token vào localStorage
      localStorage.setItem('token', action.payload.token);
    },
    // Action này sẽ được gọi khi đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;