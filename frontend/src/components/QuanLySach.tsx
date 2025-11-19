import React, { useEffect, useState } from 'react';
import { apiThuVien } from '../api/apiThuVien'; 
import './QuanLySach.css';

interface Sach {
  id: number;
  title: string;
  author: string;
  category_id: number;
  ten_the_loai?: string;
  total_quantity: number;
  available_quantity: number;
  published_year: number;
}

interface TheLoai {
  id: number;
  name: string;
}

const QuanLySach: React.FC = () => {
  const [danhSachSach, setDanhSachSach] = useState<Sach[]>([]); 
  const [danhSachTheLoai, setDanhSachTheLoai] = useState<TheLoai[]>([]);
  const [dangTai, setDangTai] = useState<boolean>(false);       
  const [tuKhoa, setTuKhoa] = useState<string>('');             
  
  // Phân trang
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(1);

  // Modal (Thêm/Sửa)
  const [hienModal, setHienModal] = useState(false);
  const [dangSuaSach, setDangSuaSach] = useState<Sach | null>(null); 
  const [formData, setFormData] = useState({
    title: '', author: '', category_id: 0, total_quantity: 10, published_year: 2023
  });

  // Tải dữ liệu
  const layDuLieu = async () => {
    setDangTai(true);
    try {
      const dataSach = await apiThuVien.layDanhSachSach(trangHienTai, tuKhoa);
      setDanhSachSach(dataSach.duLieu || []);
      setTongSoTrang(Math.ceil(dataSach.phanTrang.tongSoBanGhi / 10) || 1);

      const dataTL = await apiThuVien.layDanhSachTheLoai();
      setDanhSachTheLoai(dataTL);
    } catch (loi) {
      console.error(loi);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => layDuLieu(), 300);
    return () => clearTimeout(timer);
  }, [trangHienTai, tuKhoa]);

  // Xử lý Modal
  const moModalThem = () => {
    setDangSuaSach(null);
    setFormData({ title: '', author: '', category_id: danhSachTheLoai[0]?.id || 0, total_quantity: 10, published_year: 2023 });
    setHienModal(true);
  };

  const moModalSua = (sach: Sach) => {
    setDangSuaSach(sach);
    setFormData({
      title: sach.title, author: sach.author, category_id: sach.category_id,
      total_quantity: sach.total_quantity, published_year: sach.published_year
    });
    setHienModal(true);
  };

  const luuDuLieu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (dangSuaSach) {
        await apiThuVien.capNhatSach(dangSuaSach.id, formData);
        alert("Đã cập nhật!");
      } else {
        await apiThuVien.themSachMoi(formData);
        alert("Đã thêm mới!");
      }
      setHienModal(false);
      layDuLieu();
    } catch (e) { alert("Lỗi khi lưu!"); }
  };

  const xoaSach = async (id: number) => {
    if (window.confirm("Chắc chắn xóa?")) {
      await apiThuVien.xoaSach(id);
      layDuLieu();
    }
  };

  return (
    <div className="quan-ly-sach-container">
      <div className="header-actions">
        <h2 style={{ color: '#0056b3' }}>Quản Lý Kho Sách</h2>
        <button className="btn-add" onClick={moModalThem}>+ Thêm Sách</button>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
        <input className="search-input" placeholder="🔍 Tìm tên sách, tác giả..." 
               value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
      </div>

      {dangTai ? <p>Đang tải...</p> : (
        <div className="book-grid">
          {danhSachSach.map((sach) => (
            <div className="book-card" key={sach.id}>
              <div className="book-image-wrapper">
                 <img src={`https://picsum.photos/seed/${sach.id}/200/300`} className="book-cover" alt="cover"/>
              </div>
              <div className="book-info">
                <div>
                  <h3 className="book-title">{sach.title}</h3>
                  <p style={{color:'#666', fontSize:14}}>✍️ {sach.author} ({sach.published_year})</p>
                  <span style={{background:'#eee', padding:'2px 8px', borderRadius:4, fontSize:12}}>📂 {sach.ten_the_loai}</span>
                </div>
                <div className="book-stats">
                   <b style={{color: sach.available_quantity > 0 ? 'green' : 'red'}}>
                     Kho: {sach.available_quantity}/{sach.total_quantity}
                   </b>
                   <div>
                      <button className="btn-edit" onClick={() => moModalSua(sach)}>Sửa</button>
                      <button className="btn-delete" onClick={() => xoaSach(sach.id)}>Xóa</button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <div className="pagination">
        <button disabled={trangHienTai===1} onClick={() => setTrangHienTai(trangHienTai-1)}>Trước</button>
        <span>Trang {trangHienTai}/{tongSoTrang}</span>
        <button disabled={trangHienTai===tongSoTrang} onClick={() => setTrangHienTai(trangHienTai+1)}>Sau</button>
      </div>

      {/* Modal */}
      {hienModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{dangSuaSach ? 'Sửa Sách' : 'Thêm Sách Mới'}</h3>
            <form onSubmit={luuDuLieu}>
              <div className="form-group">
                <label>Tên sách:</label>
                <input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tác giả:</label>
                <input required value={formData.author} onChange={e=>setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Thể loại:</label>
                <select value={formData.category_id} onChange={e=>setFormData({...formData, category_id: Number(e.target.value)})}>
                   {danhSachTheLoai.map(tl => <option key={tl.id} value={tl.id}>{tl.name}</option>)}
                </select>
              </div>
              <div style={{display:'flex', gap:10}}>
                <div className="form-group" style={{flex:1}}>
                  <label>Tổng số lượng:</label>
                  <input type="number" required value={formData.total_quantity} onChange={e=>setFormData({...formData, total_quantity: Number(e.target.value)})} />
                </div>
                <div className="form-group" style={{flex:1}}>
                  <label>Năm XB:</label>
                  <input type="number" required value={formData.published_year} onChange={e=>setFormData({...formData, published_year: Number(e.target.value)})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={()=>setHienModal(false)} style={{background:'#6c757d', color:'white', border:'none', padding:'8px 15px', borderRadius:4}}>Hủy</button>
                <button type="submit" style={{background:'#007bff', color:'white', border:'none', padding:'8px 15px', borderRadius:4}}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default QuanLySach;