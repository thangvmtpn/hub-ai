'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AGENTS } from '@/lib/agents';

const G_DARK = '#1B4332';
const CATEGORIES = ['Sản phẩm', 'Chính sách đại lý', 'Khoa học trà', 'Kế hoạch bán hàng', 'Quy trình sản xuất', 'Khác'];

export default function KnowledgeAdminPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('docs'); // 'docs' | 'training'

  // Docs state
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showCreateDoc, setShowCreateDoc] = useState(false);
  const [editDoc, setEditDoc] = useState(null);

  // Training state
  const [selectedAgentId, setSelectedAgentId] = useState(AGENTS[0]?.id || '');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [loadingPrompt, setLoadingPrompt] = useState(false);

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
        loadDocs();
      });
  }, []);

  // Fetch training prompt when agent selection changes
  useEffect(() => {
    if (activeTab === 'training' && selectedAgentId) {
      loadAgentTraining(selectedAgentId);
    }
  }, [selectedAgentId, activeTab]);

  const loadDocs = async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch(`/api/admin/knowledge?search=${encodeURIComponent(search)}&category=${encodeURIComponent(filterCat)}`);
      const data = await res.json();
      setDocs(data.items || []);
    } catch (e) {
      console.error(e);
    }
    setLoadingDocs(false);
  };

  const loadAgentTraining = async (agentId) => {
    setLoadingPrompt(true);
    try {
      const res = await fetch(`/api/admin/training?agentId=${agentId}`);
      const data = await res.json();
      setSystemPrompt(data.systemPrompt || '');
    } catch (e) {
      console.error(e);
    }
    setLoadingPrompt(false);
  };

  const handleSavePrompt = async () => {
    setSavingPrompt(true);
    try {
      const res = await fetch('/api/admin/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgentId, systemPrompt }),
      });
      if (res.ok) {
        alert('Đã cập nhật System Prompt thành công!');
      } else {
        alert('Lỗi khi lưu.');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi kết nối.');
    }
    setSavingPrompt(false);
  };

  const deleteDoc = async (id) => {
    if (!confirm('Xóa tài liệu này khỏi kho kiến thức?')) return;
    try {
      await fetch('/api/admin/knowledge', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadDocs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      loadDocs();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F0F4F2' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3" style={{ background: G_DARK, boxShadow: '0 2px 12px rgba(27,67,50,0.2)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin')} className="p-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <div className="text-sm font-bold text-white">Quản Lý Kho Kiến Thức AI</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Nạp tài liệu & Tối ưu System Prompt cho Agents</div>
          </div>
        </div>
        {activeTab === 'docs' && (
          <button onClick={() => setShowCreateDoc(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition"
            style={{ background: '#C41230', boxShadow: '0 2px 8px rgba(196,18,48,0.3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Thêm tài liệu
          </button>
        )}
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6 border-b border-[#e2e8e5] pb-1">
          <button onClick={() => router.push('/admin')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            👥 Quản lý tài khoản
          </button>
          <button onClick={() => router.push('/admin/knowledge')} className="text-sm font-bold pb-3 border-b-2 transition-all" style={{ color: G_DARK, borderColor: G_DARK }}>
            📚 Kho kiến thức AI
          </button>
          <button onClick={() => router.push('/admin/faq')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            💬 Câu hỏi Q&A (FAQ)
          </button>
          <button onClick={() => router.push('/admin/visual-library')} className="text-sm font-medium pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-all">
            🖼 Kho ảnh mẫu (Visual Library)
          </button>
        </div>

        {/* Local Toggle Tabs: Docs vs Agent Custom Training */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'docs' ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            📁 Tài liệu kiến thức
          </button>
          <button onClick={() => { setActiveTab('training'); loadAgentTraining(selectedAgentId); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'training' ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            ⚙️ Cấu hình Agent (System Prompt)
          </button>
        </div>

        {/* TAB 1: KNOWLEDGE DOCUMENTS */}
        {activeTab === 'docs' && (
          <>
            {/* Search & Filter */}
            <div className="flex gap-3 mb-5">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-2.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#9ca3af' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyPress} placeholder="Nhấn Enter để tìm kiếm tiêu đề hoặc nội dung..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm" style={{ background: '#fff', border: '1.5px solid #e5e7eb' }} />
              </div>
              <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setTimeout(loadDocs, 50); }}
                className="px-3 py-2.5 rounded-xl text-sm cursor-pointer" style={{ background: '#fff', border: '1.5px solid #e5e7eb', color: '#374151' }}>
                <option value="">Tất cả danh mục</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={loadDocs} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition" style={{ background: G_DARK }}>
                Tìm
              </button>
            </div>

            {/* List */}
            {loadingDocs ? (
              <div className="text-center py-12 text-sm" style={{ color: '#9ca3af' }}>Đang tải danh sách tài liệu...</div>
            ) : docs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-[#e2e8e5]">
                <p className="text-sm text-gray-500">Chưa có tài liệu nào trong kho kiến thức.</p>
                <button onClick={() => setShowCreateDoc(true)} className="mt-3 text-xs text-[#1B4332] font-bold hover:underline">
                  + Thêm tài liệu ngay
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {docs.map((doc) => (
                  <div key={doc.id} className="p-5 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                            {doc.category}
                          </span>
                          {!doc.is_active && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Tắt</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditDoc(doc)} className="text-xs px-2.5 py-1 rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition">
                            Sửa
                          </button>
                          <button onClick={() => deleteDoc(doc.id)} className="text-xs px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition">
                            Xóa
                          </button>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{doc.title}</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-4">{doc.content}</p>
                    </div>
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {doc.tags.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB 2: AGENT SYSTEM PROMPT CONFIGURATION */}
        {activeTab === 'training' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Cấu hình System Prompt (Nhân cách / Vai trò của AI)</h2>
            <div className="grid grid-cols-3 gap-6">
              {/* Agent List */}
              <div className="col-span-1 border-r border-gray-100 pr-4 space-y-1">
                <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">Chọn Agent</label>
                {AGENTS.map((agent) => (
                  <button key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedAgentId === agent.id ? 'bg-[#1B4332] text-white' : 'hover:bg-gray-50 text-gray-700'
                    }`}>
                    {agent.name}
                  </button>
                ))}
              </div>

              {/* Editor */}
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    System Prompt cho: <span className="text-[#1B4332] font-extrabold">{AGENTS.find(a => a.id === selectedAgentId)?.name}</span>
                  </label>
                  <p className="text-[11px] text-gray-400 mb-2">
                    System prompt định hình giọng văn, nhân cách, kiến thức nền tảng và cách cư xử của Agent này khi tương tác với người dùng.
                  </p>
                  {loadingPrompt ? (
                    <div className="w-full h-80 flex items-center justify-center border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-400">
                      Đang tải cấu hình...
                    </div>
                  ) : (
                    <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                      placeholder="VD: Bạn là chuyên gia về trà cổ thụ Việt Nam. Hãy trả lời khách hàng bằng phong thái thanh tao, sâu sắc..."
                      className="w-full h-80 p-4 border border-gray-200 rounded-xl text-sm font-mono focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]"
                      style={{ lineHeight: '1.6' }} />
                  )}
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSavePrompt} disabled={savingPrompt}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all bg-[#1b4332] hover:opacity-90 disabled:opacity-50">
                    {savingPrompt ? 'Đang lưu...' : 'Lưu cài đặt'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT DOC MODAL */}
      {(showCreateDoc || editDoc) && (
        <DocModal
          doc={editDoc}
          onClose={() => { setShowCreateDoc(false); setEditDoc(null); }}
          onSaved={() => { setShowCreateDoc(false); setEditDoc(null); loadDocs(); }}
        />
      )}
    </div>
  );
}

function DocModal({ doc, onClose, onSaved }) {
  const isEdit = !!doc;
  const [form, setForm] = useState({
    title: doc?.title || '',
    category: doc?.category || 'Sản phẩm',
    content: doc?.content || '',
    tagsString: doc?.tags ? doc.tags.join(', ') : '',
    agentIds: doc?.agent_ids || [],
    isActive: doc?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    if (!form.title || !form.content) {
      setError('Vui lòng điền tiêu đề và nội dung.');
      return;
    }
    setSaving(true);
    const tags = form.tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const body = {
      id: doc?.id,
      title: form.title,
      category: form.category,
      content: form.content,
      tags,
      agent_ids: form.agentIds,
      is_active: form.isActive,
    };
    try {
      const res = await fetch('/api/admin/knowledge', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        onSaved();
      } else {
        const d = await res.json();
        setError(d.error || 'Lỗi xảy ra');
      }
    } catch (e) {
      setError('Lỗi kết nối.');
    }
    setSaving(false);
  };

  // File Upload Helper
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || '';
      // Set content to text file contents
      setForm(f => ({
        ...f,
        content: text,
        title: f.title || file.name.replace(/\.[^/.]+$/, "") // Set title to filename if empty
      }));
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-2xl rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col"
          style={{ background: '#fff', border: '1.5px solid #e2e8e5', maxHeight: '90vh' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: G_DARK }}>
            <div className="text-sm font-bold text-white">{isEdit ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu kiến thức'}</div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-white/60 hover:text-white transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Quick File Upload (for creating only) */}
            {!isEdit && (
              <div className="p-3 bg-emerald-50 border border-dashed border-emerald-300 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-800">Nạp nhanh từ tệp tin</h4>
                  <p className="text-[10px] text-emerald-600">Chọn tệp văn bản (.txt, .md) để nạp nội dung tài liệu tự động.</p>
                </div>
                <label className="px-3 py-1.5 bg-[#1B4332] text-white rounded-lg text-xs font-bold cursor-pointer hover:opacity-90">
                  Chọn tệp
                  <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Tiêu đề tài liệu</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="VD: Công thức ủ chè xanh Thái Nguyên ngon nhất"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#1B4332]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Danh mục</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#1B4332]">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Từ khóa / Tags (phân cách bằng dấu phẩy)</label>
                <input value={form.tagsString} onChange={e => setForm(f => ({ ...f, tagsString: e.target.value }))}
                  placeholder="VD: thai nguyen, che moc cau, huong dan"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#1B4332]" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Nội dung kiến thức</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Nhập toàn bộ nội dung tài liệu chi tiết..."
                className="w-full h-60 p-3 border border-gray-200 rounded-xl text-sm focus:border-[#1B4332]" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]" />
              <label htmlFor="isActive" className="text-xs font-bold text-gray-600">Bật tài liệu này trong kho kiến thức</label>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Hủy
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-[#1B4332] text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50">
              {saving ? 'Đang lưu...' : 'Lưu tài liệu'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
