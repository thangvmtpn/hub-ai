'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const G_DARK = '#1B4332';

const PRODUCT_LINES = [
  { key: 'van_loc_tra', label: 'Vạn Lộc Trà — Trà xanh Thái Nguyên' },
  { key: 'van_tho_tra', label: 'Vạn Thọ Trà — Trà Dược' },
  { key: 'van_hy_tra', label: 'Vạn Hỷ Trà — Trà Việt Nam' },
  { key: 'traba', label: 'TRABA — Bánh ăn cùng trà' },
  { key: 'van_thinh_tra', label: 'Vạn Thịnh Trà — Trà biếu' },
  { key: 'general', label: 'Tất cả — Dùng chung cho ngành Trà' }
];

const CATEGORIES = [
  { key: 'product_shot', label: '📸 Ảnh sản phẩm gốc' },
  { key: 'banner_reference', label: '🖼 Banner mẫu tham khảo' },
  { key: 'lifestyle_scene', label: '🌄 Bối cảnh Lifestyle / Người dùng' },
  { key: 'packaging', label: '🎁 Hộp quà & Bao bì' }
];

export default function VisualLibraryAdminPage() {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState('');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setFormData(p => ({ ...p, image_url: data.url }));
      } else {
        alert(data.error || 'Lỗi tải ảnh');
      }
    } catch (e) {
      alert('Lỗi kết nối khi tải ảnh');
    }
    setUploading(false);
  };

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    product_line: 'van_loc_tra',
    category: 'product_shot',
    image_url: '',
    visual_description: '',
    suggested_prompt: '',
    color_palette: '#1B4332, #D4AF37'
  });

  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => {
        if (!d.user || d.user.role !== 'admin') {
          router.push('/');
          return;
        }
        setUser(d.user);
        loadAssets();
      });
  }, [filterProduct]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/visual-library?product_line=${encodeURIComponent(filterProduct)}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setAssets(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSaveAsset = async (e) => {
    e.preventDefault();
    try {
      const url = '/api/admin/visual-library';
      const method = editAsset ? 'PUT' : 'POST';
      const body = editAsset ? { ...formData, id: editAsset.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowCreateModal(false);
        setEditAsset(null);
        setFormData({
          title: '',
          product_line: 'van_loc_tra',
          category: 'product_shot',
          image_url: '',
          visual_description: '',
          suggested_prompt: '',
          color_palette: '#1B4332, #D4AF37'
        });
        loadAssets();
      } else {
        const err = await res.json();
        alert(`Lỗi: ${err.error}`);
      }
    } catch (err) {
      alert('Lỗi kết nối');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa ảnh mẫu này khỏi Kho Visual Library?')) return;
    await fetch('/api/admin/visual-library', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    loadAssets();
  };

  const handleEditClick = (asset) => {
    setEditAsset(asset);
    setFormData({
      title: asset.title,
      product_line: asset.product_line,
      category: asset.category,
      image_url: asset.image_url,
      visual_description: asset.visual_description || '',
      suggested_prompt: asset.suggested_prompt || '',
      color_palette: asset.color_palette || ''
    });
    setShowCreateModal(true);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;

  return (
    <div className="min-h-screen" style={{ background: '#F0F4F2' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3" style={{ background: G_DARK, boxShadow: '0 2px 12px rgba(27,67,50,0.2)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 rounded-lg transition" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <div className="text-sm font-bold text-white">Quản Lý Kho Ảnh Mẫu & Visual Library</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Kho dữ liệu ảnh thương hiệu cho AI RAG học tập</div>
          </div>
        </div>
        <button onClick={() => {
          setEditAsset(null);
          setFormData({
            title: '', product_line: 'van_loc_tra', category: 'product_shot', image_url: '',
            visual_description: '', suggested_prompt: '', color_palette: '#1B4332, #D4AF37'
          });
          setShowCreateModal(true);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition shadow"
        style={{ background: '#C41230' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Thêm ảnh mẫu mới
        </button>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6 border-b border-[#e2e8e5] pb-1">
          <button onClick={() => router.push('/admin')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            👥 Quản lý tài khoản
          </button>
          <button onClick={() => router.push('/admin/knowledge')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            📚 Kho kiến thức AI
          </button>
          <button onClick={() => router.push('/admin/faq')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            💬 Câu hỏi Q&A (FAQ)
          </button>
          <button onClick={() => router.push('/admin/visual-library')} className="text-sm font-bold pb-3 border-b-2 transition-all" style={{ color: G_DARK, borderColor: G_DARK }}>
            🖼 Kho ảnh mẫu (Visual Library)
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-white border border-[#e2e8e5]">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-600">Dòng sản phẩm:</label>
            <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 focus:outline-none" style={{ background: '#F8FAF9' }}>
              <option value="">Tất cả dòng sản phẩm</option>
              {PRODUCT_LINES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Tìm tên ảnh / mô tả..." value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadAssets()}
              className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 focus:outline-none w-64" />
            <button onClick={loadAssets} className="px-3 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: G_DARK }}>
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Asset Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-gray-400">Đang tải kho ảnh mẫu...</div>
        ) : assets.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8">
            <p className="text-sm font-bold text-gray-600 mb-2">Chưa có ảnh mẫu nào trong Kho Visual Library</p>
            <p className="text-xs text-gray-400 mb-4">Thêm ảnh mẫu sản phẩm hoặc banner tham khảo để AI học cách tạo ảnh chính xác theo nhận diện thương hiệu.</p>
            <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: G_DARK }}>
              + Thêm ảnh mẫu đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {assets.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-[#e2e8e5] shadow-sm hover:shadow-md transition">
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow" style={{ background: G_DARK }}>
                    {PRODUCT_LINES.find(p => p.key === item.product_line)?.label.split('—')[0] || item.product_line}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.visual_description || 'Chưa có mô tả visual'}</p>
                  
                  {item.color_palette && (
                    <div className="text-[11px] font-medium text-gray-600 mb-3 flex items-center gap-1.5">
                      <span>Palette:</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-gray-100">{item.color_palette}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button onClick={() => handleEditClick(item)} className="text-xs font-semibold text-blue-600 hover:underline">
                      Chỉnh sửa
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-xs font-semibold text-red-500 hover:underline">
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editAsset ? 'Chỉnh Sửa Ảnh Mẫu Visual' : 'Thêm Ảnh Mẫu Visual Mới'}
            </h2>
            <form onSubmit={handleSaveAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tên ảnh / Tiêu đề mẫu</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none" placeholder="VD: Đồi chè Thái Nguyên lúc bình minh" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Dòng sản phẩm</label>
                  <select value={formData.product_line} onChange={e => setFormData({ ...formData, product_line: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none bg-white">
                    {PRODUCT_LINES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Loại ảnh</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Hình ảnh Visual Mẫu (Upload file hoặc dán URL)</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-dashed transition"
                      style={{ background: '#E8F5E9', borderColor: G_DARK, color: G_DARK }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      {uploading ? 'Đang tải ảnh lên...' : '📁 Tải ảnh từ máy tính'}
                      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUploadFile(e.target.files[0])} />
                    </label>
                  </div>
                  <input type="text" required value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none font-mono" placeholder="https://... hoặc /uploads/..." />
                  {formData.image_url && (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 p-1 bg-gray-50 flex items-center justify-center">
                      <img src={formData.image_url} alt="Visual Preview" className="h-32 object-contain rounded-lg" onError={e => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả đặc điểm Visual (Để AI học)</label>
                <textarea rows={3} value={formData.visual_description} onChange={e => setFormData({ ...formData, visual_description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none"
                  placeholder="Mô tả bối cảnh, ánh sáng, góc quay, vị trí sản phẩm trong ảnh..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mã màu Palette (Hex/Tên màu)</label>
                  <input type="text" value={formData.color_palette} onChange={e => setFormData({ ...formData, color_palette: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none" placeholder="VD: #1B4332, #D4AF37" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Gợi ý Prompt tiếng Anh mẫu</label>
                  <input type="text" value={formData.suggested_prompt} onChange={e => setFormData({ ...formData, suggested_prompt: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none font-mono" placeholder="Shot of fresh green tea leaves..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: G_DARK }}>
                  {editAsset ? 'Lưu cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
