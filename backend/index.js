// File: backend/index.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const pool = require('./db'); 
const authMiddleware = require('./authMiddleware'); 
// 1. Import Controller Sách ở đầu file cho gọn
const QuanLySachController = require('./quanLySachController'); 

const app = express();
const PORT = 8080; 

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

const MY_SECRET_KEY = 'lap-trinh-web-nang-cao-bi-mat';

// === API ENDPOINTS ===

// --- NHIỆM VỤ 1: XÁC THỰC (Giữ nguyên code cũ của bạn) ---
app.post('/api/auth/register', async (req, res) => {
  // ... (Code đăng ký giữ nguyên) ...
    try {
    const { username, password, email, full_name } = req.body;
    const [existingUser] = await pool.query('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser.length > 0) return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const [result] = await pool.query('INSERT INTO Users (username, password_hash, email, full_name) VALUES (?, ?, ?, ?)', [username, password_hash, email, full_name]);
    res.status(201).json({ message: 'Tạo tài khoản thành công', userId: result.insertId });
  } catch (err) { res.status(500).json({ message: 'Lỗi server', error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  // ... (Code đăng nhập giữ nguyên) ...
    try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) return res.status(404).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    const payload = { userId: user.user_id, username: user.username, full_name: user.full_name, role: user.role };
    const token = jwt.sign(payload, MY_SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Đăng nhập thành công', token: token, user: payload });
  } catch (err) { res.status(500).json({ message: 'Lỗi server', error: err.message }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  // ... (Code lấy thông tin user giữ nguyên) ...
    const userId = req.user.userId;
    const [rows] = await pool.query('SELECT user_id, username, email, full_name FROM Users WHERE user_id = ?', [userId]);
    res.json({ message: 'Bạn đã được xác thực', user: rows[0] });
});

// --- NHIỆM VỤ 2: QUẢN LÝ SÁCH (SỬA LẠI VỊ TRÍ VÀO ĐÂY) ---
// Lưu ý: Mình thêm authMiddleware vào các hàm Thêm/Sửa/Xóa để bảo mật (cần đăng nhập mới làm được)

// Lấy danh sách (Ai cũng xem được thì không cần authMiddleware, hoặc thêm vào nếu muốn bảo mật cả xem)
app.get('/api/books', QuanLySachController.layDanhSachSach);
// Lấy thể loại
app.get('/api/categories', QuanLySachController.layDanhSachTheLoai);

// Các chức năng thay đổi dữ liệu nên cần đăng nhập (authMiddleware)
app.post('/api/books', authMiddleware, QuanLySachController.themSachMoi);
app.put('/api/books/:id', authMiddleware, QuanLySachController.capNhatSach);
app.delete('/api/books/:id', authMiddleware, QuanLySachController.xoaSach);


// === CHẠY SERVER (Luôn để cuối cùng) ===
app.listen(PORT, () => {
  console.log(`✅ Backend server đang chạy ở http://localhost:${PORT}`);
});