// FILE: frontend/src/components/QuanLySach.tsx
import React, { useEffect, useState } from 'react';
import { apiThuVien } from '../api/apiThuVien'; // Import file API đã tạo

// Local type definition because 'Sach' is not exported from apiThuVien
interface Sach {
  id: number;
  title: string;
  author: string;
  ten_the_loai?: string;
  available_quantity: number;
  total_quantity: number;
}

const QuanLySach: React.FC = () => {
  // 1. KHAI BÁO STATE (Biến lưu dữ liệu)
  const [danhSachSach, setDanhSachSach] = useState<Sach[]>([]); // Lưu danh sách sách
  const [dangTai, setDangTai] = useState<boolean>(false);       // Trạng thái loading
  const [tuKhoa, setTuKhoa] = useState<string>('');             // Từ khóa tìm kiếm

  // 2. HÀM GỌI API (LOGIC)
  const layDuLieu = async () => {
    setDangTai(true);
    try {
      // Gọi hàm từ file apiThuVien, truyền trang 1 và từ khóa
      const ketQua = await apiThuVien.layDanhSachSach(1, tuKhoa);
      setDanhSachSach(ketQua.duLieu);
    } catch (loi) {
      console.error("Lỗi tải sách:", loi);
      alert("Không tải được danh sách sách!");
    } finally {
      setDangTai(false);
    }
  };

  // 3. USE EFFECT (Chạy 1 lần khi mở trang hoặc khi từ khóa thay đổi)
  useEffect(() => {
    // Kỹ thuật Debounce (đợi ngưng gõ 500ms mới tìm) để đỡ lag server
    const timeoutId = setTimeout(() => {
      layDuLieu();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tuKhoa]); // Khi 'tuKhoa' thay đổi thì chạy lại hàm này

  // 4. HÀM XỬ LÝ SỰ KIỆN (User bấm nút)
  const xuLyXoa = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
      try {
        await apiThuVien.xoaSach(id);
        alert("Đã xóa thành công!");
        layDuLieu(); // Tải lại bảng sau khi xóa
      } catch (loi) {
        alert("Lỗi khi xóa sách!");
      }
    }
  };

  // 5. GIAO DIỆN (Render HTML)
  return (
    <div className="quan-ly-sach-container" style={{ padding: '20px' }}>
      <h2>Quản Lý Sách Thư Viện</h2>

      {/* Ô Tìm kiếm */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm theo tên sách hoặc tác giả..." 
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      {/* Bảng dữ liệu */}
      {dangTai ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Tên Sách</th>
              <th>Tác Giả</th>
              <th>Thể Loại</th>
              <th>Kho (Còn/Tổng)</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachSach.length > 0 ? (
              danhSachSach.map((sach) => (
                <tr key={sach.id}>
                  <td>{sach.id}</td>
                  <td>{sach.title}</td>
                  <td>{sach.author}</td>
                  <td>{sach.ten_the_loai || 'Chưa cập nhật'}</td>
                  <td>
                    <span style={{ color: sach.available_quantity > 0 ? 'green' : 'red' }}>
                      {sach.available_quantity}
                    </span> 
                    / {sach.total_quantity}
                  </td>
                  <td>
                    <button onClick={() => xuLyXoa(sach.id)} style={{ color: 'red', cursor: 'pointer' }}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>Không tìm thấy sách nào</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuanLySach;