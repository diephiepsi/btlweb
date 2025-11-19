// FILE: backend/quanLySachController.js
const ketNoiCSDL = require('./db');

const QuanLySachController = {
  
  // 1. Lấy danh sách sách
  layDanhSachSach: async (yeuCau, phanHoi) => {
    try {
      const { search: tuKhoa, category_id: maTheLoai, page: trang = 1, limit: gioiHan = 10 } = yeuCau.query;
      const viTriBatDau = (Number(trang) - 1) * Number(gioiHan);

      // --- SỬA QUAN TRỌNG ---
      // 1. Đổi b.id thành b.book_id as id (để Frontend vẫn hiểu là id)
      // 2. Đổi JOIN ... c.id thành c.category_id
      let cauLenhSql = `
        SELECT b.book_id as id, b.title, b.author, b.category_id, b.total_quantity, b.available_quantity, b.published_year,
               c.name as ten_the_loai 
        FROM Books b 
        LEFT JOIN Categories c ON b.category_id = c.category_id 
        WHERE b.is_hidden = 0
      `;
      const thamSo = [];

      if (tuKhoa) {
        cauLenhSql += ` AND (b.title LIKE ? OR b.author LIKE ?)`;
        thamSo.push(`%${tuKhoa}%`, `%${tuKhoa}%`);
      }
      if (maTheLoai) {
        cauLenhSql += ` AND b.category_id = ?`;
        thamSo.push(maTheLoai);
      }

      // Sắp xếp theo book_id mới nhất
      cauLenhSql += ` ORDER BY b.book_id DESC LIMIT ? OFFSET ?`;
      thamSo.push(Number(gioiHan), Number(viTriBatDau));

      const [danhSachSach] = await ketNoiCSDL.query(cauLenhSql, thamSo);
      const [ketQuaDem] = await ketNoiCSDL.query('SELECT COUNT(*) as tongSo FROM Books WHERE is_hidden = 0');

      phanHoi.json({
        duLieu: danhSachSach, // Frontend nhận được object có field "id" nhờ lệnh AS ở trên
        phanTrang: {
          trangHienTai: Number(trang),
          tongSoBanGhi: ketQuaDem[0].tongSo
        }
      });
    } catch (loi) {
      console.log(loi);
      phanHoi.status(500).json({ thongBao: "Lỗi server: " + loi.message });
    }
  },

  // 2. Thêm sách mới
  themSachMoi: async (yeuCau, phanHoi) => {
    try {
      const { title, author, category_id, total_quantity, published_year } = yeuCau.body;
      
      // Logic mặc định
      const soLuongKhaDung = total_quantity;
      const daAn = 0; 

      // Cột trong SQL của bạn là book_id (tự tăng), nên không cần insert id
      const cauLenhSql = `
        INSERT INTO Books 
        (title, author, category_id, total_quantity, available_quantity, published_year, is_hidden) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await ketNoiCSDL.query(cauLenhSql, [title, author, category_id, total_quantity, soLuongKhaDung, published_year, daAn]);

      phanHoi.status(201).json({ thongBao: 'Thêm sách thành công' });
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi thêm sách: " + loi.message });
    }
  },

  // 3. Cập nhật sách
  capNhatSach: async (yeuCau, phanHoi) => {
    try {
      const { id } = yeuCau.params; // Frontend gửi lên là "id"
      const { total_quantity, title, author, category_id, published_year } = yeuCau.body;

      // Sửa: WHERE book_id = ?
      const [ketQuaTim] = await ketNoiCSDL.query('SELECT * FROM Books WHERE book_id = ?', [id]);
      
      if (ketQuaTim.length === 0) {
        return phanHoi.status(404).json({ thongBao: 'Sách không tồn tại' });
      }
      const sachCu = ketQuaTim[0];

      let soLuongKhaDungMoi = sachCu.available_quantity;
      
      if (total_quantity !== undefined && total_quantity != sachCu.total_quantity) {
        const chenhLech = Number(total_quantity) - sachCu.total_quantity;
        soLuongKhaDungMoi += chenhLech;

        if (soLuongKhaDungMoi < 0) {
          return phanHoi.status(400).json({ thongBao: 'Số lượng tồn kho không hợp lệ' });
        }
      }

      // Sửa: WHERE book_id = ?
      const cauLenhSql = `
        UPDATE Books 
        SET title = ?, author = ?, category_id = ?, published_year = ?, 
            total_quantity = ?, available_quantity = ? 
        WHERE book_id = ?
      `;
      
      await ketNoiCSDL.query(cauLenhSql, [
        title || sachCu.title, 
        author || sachCu.author, 
        category_id || sachCu.category_id, 
        published_year || sachCu.published_year,
        total_quantity || sachCu.total_quantity,
        soLuongKhaDungMoi, 
        id
      ]);

      phanHoi.json({ thongBao: 'Cập nhật thành công' });
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi cập nhật: " + loi.message });
    }
  },

  // 4. Xóa sách
  xoaSach: async (yeuCau, phanHoi) => {
    try {
      const { id } = yeuCau.params;
      // Sửa: WHERE book_id = ?
      await ketNoiCSDL.query('UPDATE Books SET is_hidden = 1 WHERE book_id = ?', [id]);
      phanHoi.json({ thongBao: 'Đã xóa sách thành công' });
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi xóa sách" });
    }
  },

  // 5. Lấy thể loại
  layDanhSachTheLoai: async (yeuCau, phanHoi) => {
    try {
      // Sửa: Lấy category_id as id để Frontend hiển thị đúng dropdown
      const [danhSachTheLoai] = await ketNoiCSDL.query('SELECT category_id as id, name, description FROM Categories');
      phanHoi.json(danhSachTheLoai);
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi server" });
    }
  }
};

module.exports = QuanLySachController;