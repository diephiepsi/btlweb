// File: frontend/src/pages/DashboardPage.js

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

// QUAN TRỌNG: Import bảng sách vào
// Nếu file QuanLySach.js nằm trong components thì đường dẫn là ../components/QuanLySach
import QuanLySach from '../components/QuanLySach'; 

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* --- PHẦN 1: HEADER CỦA DASHBOARD --- */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '2px solid #eee',
        paddingBottom: '15px',
        marginBottom: '20px'
      }}>
        <div>
            {/* Hiển thị tên người dùng */}
            <h2 style={{ margin: 0, color: '#333' }}>
              Chào mừng, {user?.full_name || user?.username || "Admin"}!
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Hệ thống quản lý thư viện</p>
        </div>
        
        <button 
            onClick={handleLogout}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
        >
            Đăng xuất
        </button>
      </div>

      {/* --- PHẦN 2: KHU VỰC HIỂN THỊ BẢNG SÁCH --- */}
      {/* Đây là dòng quan trọng nhất, nó sẽ gọi bảng ra */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <QuanLySach />
      </div>
      
    </div>
  );
}

export default DashboardPage;