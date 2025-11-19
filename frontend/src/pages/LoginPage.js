// File: frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios'; // Dùng axios thường để login
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Gọi API login từ Backend
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      // 2. Nếu thành công, Backend sẽ trả về (token, user)
      // Gọi action `loginSuccess` để lưu vào Redux
      dispatch(loginSuccess(response.data));

      // 3. Chuyển hướng người dùng đến trang Dashboard
      navigate('/dashboard');

    } catch (err) {
      // 4. Nếu lỗi (sai pass, sai user...)
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Đăng nhập Hệ thống Thư viện</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;