// File: frontend/src/components/PrivateRoute.js

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // 1. Lấy token từ "kho" Redux
  const { token } = useSelector((state) => state.auth);

  if (token) {
    // 2. Nếu có token (đã đăng nhập), cho phép render "Outlet"
    // (Outlet chính là các trang con như DashboardPage)
    return <Outlet />;
  } else {
    // 3. Nếu không có token, "đá" người dùng về trang /login
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;