const jwt = require('jsonwebtoken');

// Key này phải GIỐNG HỆT key ở file index.js
const MY_SECRET_KEY = 'lap-trinh-web-nang-cao-bi-mat';

function authMiddleware(req, res, next) {
  // 1. Lấy token từ header
  const authHeader = req.headers['authorization'];
  // Header sẽ có dạng: "Bearer [token]"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // 2. Nếu không có token, trả lỗi 401 (Chưa xác thực)
    return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
  }

  // 3. Xác thực token
  jwt.verify(token, MY_SECRET_KEY, (err, user) => {
    if (err) {
      // Nếu token sai, trả lỗi 403 (Cấm truy cập)
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    // 4. Nếu token hợp lệ, lưu thông tin user vào request
    req.user = user;
    next(); // Cho phép request đi tiếp
  });
}

module.exports = authMiddleware;