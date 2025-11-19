
import axiosInstance from './axiosInstance'; 

export const apiThuVien = {
  // Lấy danh sách sách
  layDanhSachSach: async (trang = 1, tuKhoa = '') => {
    const res = await axiosInstance.get(`/books?page=${trang}&search=${tuKhoa}`);
    return res.data;
  },

  // Lấy danh sách thể loại
  layDanhSachTheLoai: async () => {
    const res = await axiosInstance.get('/categories');
    return res.data;
  },

  // Thêm sách
  themSachMoi: async (data) => {
    const res = await axiosInstance.post('/books', data);
    return res.data;
  },

  // Sửa sách
  capNhatSach: async (id, data) => {
    const res = await axiosInstance.put(`/books/${id}`, data);
    return res.data;
  },

  // Xóa sách
  xoaSach: async (id) => {
    const res = await axiosInstance.delete(`/books/${id}`);
    return res.data;
  }
};