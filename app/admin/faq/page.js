'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const G_DARK = '#1B4332';

const CATEGORIES = ['Sản phẩm', 'Đơn hàng & Giao hàng', 'Đổi trả & Hoàn tiền', 'Khuyến mãi & Giá', 'Đại lý & Hợp tác', 'Sử dụng sản phẩm', 'Khác'];

export default function FaqAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (!d.user || d.user.role !== 'admin') { router.push('/'); return; }
      load();
    });
  }, []);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/faq');
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  const deleteItem = async (id) => {
    if (!confirm('Xóa mục này?')) return;
    await fetch('/api/admin/faq', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const filtered = items.filter(i => {
    const matchSearch = !search || i.question.toLowerCase().includes(search.toLowerCase()) || i.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || i.category === filterCat;
    return matchSearch && matchCat;
  });

  const cats = [...new Set(items.map(i => i.category))];

  return (
    <div className="min-h-screen" style={{ background: '#F0F4F2' }}>
      <header className="flex items-center justify-between px-6 py-3" style={{ background: G_DARK, boxShadow: '0 2px 12px rgba(27,67,50,0.2)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="p-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <div className="text-sm font-bold text-white">Quản Lý Kho Dữ Liệu Q&A</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{items.length} câu hỏi trong kho • Phòng Kinh Doanh</div>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition"
          style={{ background: '#C41230', boxShadow: '0 2px 8px rgba(196,18,48,0.3)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Thêm câu hỏi
        </button>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6 border-b border-[#e2e8e5] pb-1">
          <button onClick={() => router.push('/admin')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            👥 Quản lý tài khoản
          </button>
          <button onClick={() => router.push('/admin/knowledge')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            📚 Kho kiến thức AI
          </button>
          <button onClick={() => router.push('/admin/faq')} className="text-sm font-bold pb-3 border-b-2 transition-all" style={{ color: G_DARK, borderColor: G_DARK }}>
            💬 Câu hỏi Q&A (FAQ)
          </button>
          <button onClick={() => router.push('/admin/visual-library')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            🖼 Kho ảnh mẫu (Visual Library)
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-2.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#9ca3af' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm câu hỏi, câu trả lời..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" style={{ background: '#fff', border: '1.5px solid #e5e7eb' }} />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-sm cursor-pointer" style={{ background: '#fff', border: '1.5px solid #e5e7eb', color: '#374151' }}>
            <option value="">Tất cả danh mục</option>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Stats by category */}
        <div className="flex gap-3 mb-5 flex-wrap">
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? '' : cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              style={{ background: filterCat === cat ? G_DARK : '#fff', color: filterCat === cat ? '#fff' : G_DARK, border: `1.5px solid ${filterCat === cat ? G_DARK : '#e2e8e5'}` }}>
              {cat} ({items.filter(i => i.category === cat).length})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: '#9ca3af' }}>Đang tải...</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid #e2e8e5' }}>
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: `${G_DARK}12`, color: G_DARK }}>{item.category}</span>
                        {item.tags?.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: '#f3f4f6', color: '#6b7280' }}>#{t}</span>
                        ))}
                      </div>
                      <div className="text-sm font-semibold mb-1.5" style={{ color: '#1f2937' }}>❓ {item.question}</div>
                      <div className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>💬 {item.answer}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setEditItem(item)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                        style={{ background: `${G_DARK}10`, color: G_DARK }}>Sửa</button>
                      <button onClick={() => deleteItem(item.id)}
                        className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                        style={{ background: '#fee2e2', color: '#dc2626' }}>Xóa</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="text-center py-12 text-sm" style={{ color: '#9ca3af' }}>Không tìm thấy kết quả</div>
            )}
          </div>
        )}
      </div>

      {(showCreate || editItem) && (
        <FaqModal item={editItem} onClose={() => { setShowCreate(false); setEditItem(null); }} onSaved={() => { setShowCreate(false); setEditItem(null); load(); }} />
      )}
    </div>
  );
}

function FaqModal({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    id: item?.id || '',
    category: item?.category || CATEGORIES[0],
    question: item?.question || '',
    answer: item?.answer || '',
    tags: item?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.question || !form.answer) return;
    setSaving(true);
    const body = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    await fetch('/api/admin/faq', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    onSaved();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-xl rounded-2xl shadow-2xl pointer-events-auto fade-up overflow-hidden"
          style={{ background: '#fff', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ background: G_DARK }}>
            <div className="text-sm font-bold text-white">{isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</div>
            <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#5b4fa0' }}>DANH MỤC</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#5b4fa0' }}>CÂU HỎI *</label>
              <textarea value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} rows={2}
                placeholder="Khách hàng thường hỏi gì?"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm resize-none" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#5b4fa0' }}>CÂU TRẢ LỜI *</label>
              <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={5}
                placeholder="Câu trả lời đầy đủ, chính xác..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm resize-y" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff', lineHeight: 1.6 }} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#5b4fa0' }}>TAGS (phân cách bằng dấu phẩy)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="hoa cúc, mật ong, tác dụng..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }} />
            </div>
          </div>
          <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: '1px solid #f0f4f2' }}>
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: '#f3f4f6', color: '#374151' }}>Hủy</button>
            <button onClick={handleSave} disabled={saving || !form.question || !form.answer}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-50"
              style={{ background: G_DARK }}>
              {saving ? 'Đang lưu...' : isEdit ? 'Lưu' : 'Thêm'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
