// File: frontend/src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các trang
// Lưu ý: Đảm bảo file LoginPage và DashboardPage đang là .js hoặc .tsx đều được
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';

// Khai báo kiểu React.FC (Function Component) cho chuẩn TypeScript
const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        {/* 1. Route Công khai: Trang Đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2. Route Bảo vệ: Phải đăng nhập mới vào được */}
        <Route element={<PrivateRoute />}>
          {/* Khi vào /dashboard sẽ hiện trang DashboardPage */}
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* 3. Route Mặc định: Chuyển hướng về dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;