// File: frontend/src/api/apiThuVien.js
import axiosInstance from './axiosInstance'; // Import cái axios có chứa Token

export const apiThuVien = {
  // 1. Lấy danh sách thể loại
  layDanhSachTheLoai: async () => {
    // axiosInstance đã có baseURL là /api nên chỉ cần gọi /categories
    const res = await axiosInstance.get('/categories');
    return res.data;
  },

  // 2. Lấy danh sách sách (kèm phân trang & tìm kiếm)
  layDanhSachSach: async (trang = 1, tuKhoa = '') => {
    const res = await axiosInstance.get(`/books?page=${trang}&search=${tuKhoa}`);
    return res.data;
  },

  // 3. Thêm sách mới
  themSachMoi: async (data) => {
    const res = await axiosInstance.post('/books', data);
    return res.data;
  },

  // 4. Cập nhật sách
  capNhatSach: async (id, data) => {
    const res = await axiosInstance.put(`/books/${id}`, data);
    return res.data;
  },

  // 5. Xóa sách
  xoaSach: async (id) => {
    const res = await axiosInstance.delete(`/books/${id}`);
    return res.data;
  }
};