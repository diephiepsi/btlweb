
const ketNoiCSDL = require('./db');

const QuanLySachController = {
  
  // 1. Lấy danh sách sách (Có tìm kiếm + Phân trang)
  layDanhSachSach: async (yeuCau, phanHoi) => {
    try {
      const { search: tuKhoa, category_id: maTheLoai, page: trang = 1, limit: gioiHan = 10 } = yeuCau.query;
      const viTriBatDau = (Number(trang) - 1) * Number(gioiHan);

      
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

      cauLenhSql += ` ORDER BY b.book_id DESC LIMIT ? OFFSET ?`;
      thamSo.push(Number(gioiHan), Number(viTriBatDau));

      const [danhSachSach] = await ketNoiCSDL.query(cauLenhSql, thamSo);
      const [ketQuaDem] = await ketNoiCSDL.query('SELECT COUNT(*) as tongSo FROM Books WHERE is_hidden = 0');

      phanHoi.json({
        duLieu: danhSachSach,
        phanTrang: {
          trangHienTai: Number(trang),
          tongSoBanGhi: ketQuaDem[0].tongSo
        }
      });
    } catch (loi) {
      console.error(loi);
      phanHoi.status(500).json({ thongBao: "Lỗi server: " + loi.message });
    }
  },

  // 2. Thêm sách mới
  themSachMoi: async (yeuCau, phanHoi) => {
    try {
      const { title, author, category_id, total_quantity, published_year } = yeuCau.body;
      const soLuongKhaDung = total_quantity; 

      const cauLenhSql = `
        INSERT INTO Books 
        (title, author, category_id, total_quantity, available_quantity, published_year, is_hidden) 
        VALUES (?, ?, ?, ?, ?, ?, 0)
      `;
      await ketNoiCSDL.query(cauLenhSql, [title, author, category_id, total_quantity, soLuongKhaDung, published_year]);

      phanHoi.status(201).json({ thongBao: 'Thêm sách thành công' });
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi thêm sách: " + loi.message });
    }
  },

  // 3. Cập nhật sách
  capNhatSach: async (yeuCau, phanHoi) => {
    try {
      const { id } = yeuCau.params;
      const { total_quantity, title, author, category_id, published_year } = yeuCau.body;

      
      const [ketQuaTim] = await ketNoiCSDL.query('SELECT * FROM Books WHERE book_id = ?', [id]);
      if (ketQuaTim.length === 0) return phanHoi.status(404).json({ thongBao: 'Sách không tồn tại' });
      
      const sachCu = ketQuaTim[0];
      let soLuongKhaDungMoi = sachCu.available_quantity;
      
      if (total_quantity !== undefined && total_quantity != sachCu.total_quantity) {
        const chenhLech = Number(total_quantity) - sachCu.total_quantity;
        soLuongKhaDungMoi += chenhLech;
        if (soLuongKhaDungMoi < 0) return phanHoi.status(400).json({ thongBao: 'Số lượng không hợp lệ (thấp hơn số đang mượn)' });
      }

      const cauLenhSql = `
        UPDATE Books 
        SET title = ?, author = ?, category_id = ?, published_year = ?, 
            total_quantity = ?, available_quantity = ? 
        WHERE book_id = ?
      `;
      await ketNoiCSDL.query(cauLenhSql, [title, author, category_id, published_year, total_quantity, soLuongKhaDungMoi, id]);

      phanHoi.json({ thongBao: 'Cập nhật thành công' });
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi cập nhật: " + loi.message });
    }
  },

  // 4. Xóa sách (Ẩn đi)
  xoaSach: async (yeuCau, phanHoi) => {
    try {
      const { id } = yeuCau.params;
      await ketNoiCSDL.query('UPDATE Books SET is_hidden = 1 WHERE book_id = ?', [id]);
      phanHoi.json({ thongBao: 'Đã xóa sách thành công' });
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi xóa sách" });
    }
  },

  // 5. Lấy danh sách thể loại (cho Dropdown)
  layDanhSachTheLoai: async (yeuCau, phanHoi) => {
    try {
      
      const [danhSach] = await ketNoiCSDL.query('SELECT category_id as id, name FROM Categories');
      phanHoi.json(danhSach);
    } catch (loi) {
      phanHoi.status(500).json({ thongBao: "Lỗi lấy thể loại" });
    }
  }
};

module.exports = QuanLySachController;