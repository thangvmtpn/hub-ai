'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEPARTMENTS, AGENTS } from '@/lib/agents';

const G_DARK = '#1B4332';
const DEPT_KEYS = Object.keys(DEPARTMENTS);

// Positions per department (from org chart)
const POSITIONS_BY_DEPT = {
  board:      [{ key: 'ceo', label: 'Tổng Giám Đốc (CEO)' }, { key: 'cdo', label: 'Phó TGĐ (CDO)' }, { key: 'coo', label: 'Phó TGĐ (COO)' }, { key: 'secretary', label: 'Trợ Lý BGĐ' }],
  hr:         [{ key: 'chro', label: 'Giám Đốc NS & ĐT (CHRO)' }, { key: 'tp_ns', label: 'Trưởng Phòng HC Nhân Sự' }, { key: 'tb_hc', label: 'Trưởng Ban HC & Đời Sống' }, { key: 'tb_ns', label: 'Trưởng Ban NS & Đào Tạo' }, { key: 'cv_hc', label: 'Chuyên Viên Hành Chính' }, { key: 'cv_ns', label: 'Chuyên Viên Nhân Sự' }, { key: 'cv_dt', label: 'Chuyên Viên Đào Tạo' }],
  finance:    [{ key: 'cfo', label: 'Giám Đốc Tài Chính (CFO)' }, { key: 'tp_tc', label: 'Trưởng Phòng TC & KT' }, { key: 'tb_tc', label: 'Trưởng Ban Tài Chính' }, { key: 'tb_kt', label: 'Trưởng Ban Kế Toán' }, { key: 'cv_tc', label: 'Chuyên Viên Tài Chính' }, { key: 'cv_kt', label: 'Chuyên Viên Kế Toán' }],
  business:   [{ key: 'cco', label: 'Giám Đốc Kinh Doanh (CCO)' }, { key: 'tp_kd', label: 'Trưởng Phòng KD & PTTT' }, { key: 'tb_kd', label: 'Trưởng Ban KD & PTTT' }, { key: 'tb_dv', label: 'Trưởng Ban DV & Khách Hàng' }, { key: 'cv_kd_b2c', label: 'CV Kinh Doanh B2C' }, { key: 'cv_kd_b2b', label: 'CV Kinh Doanh B2B' }, { key: 'cv_marketing', label: 'CV Marketing' }, { key: 'cv_branding', label: 'CV Branding' }, { key: 'cv_dv', label: 'CV Dịch Vụ KH' }],
  production: [{ key: 'cpo', label: 'Giám Đốc Sản Xuất (CPO)' }, { key: 'tp_sx', label: 'Trưởng Phòng Sản Xuất' }, { key: 'tb_vh', label: 'Trưởng Ban Vận Hành SX' }, { key: 'tb_rnd', label: 'Trưởng Ban RND & QC' }, { key: 'nv_sx', label: 'Nhân Viên Sản Xuất' }, { key: 'nv_kd', label: 'NV Kiểm Định CL' }],
};

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (!d.user || d.user.role !== 'admin') { router.push('/'); return; }
      setUser(d.user);
      loadUsers();
    });
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  const deleteUser = async (username) => {
    if (!confirm(`Xóa tài khoản "${username}"?`)) return;
    await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) });
    loadUsers();
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;

  return (
    <div className="min-h-screen" style={{ background: '#F0F4F2' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3"
        style={{ background: G_DARK, boxShadow: '0 2px 12px rgba(27,67,50,0.2)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 rounded-lg transition"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <div className="text-sm font-bold text-white">Quản Lý Tài Khoản</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Phân quyền theo phòng ban & vị trí</div>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition"
          style={{ background: '#C41230', color: '#fff', boxShadow: '0 2px 8px rgba(196,18,48,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Tạo tài khoản
        </button>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {DEPT_KEYS.map(k => {
            const dept = DEPARTMENTS[k];
            const count = users.filter(u => u.department === k).length;
            return (
              <div key={k} className="rounded-xl p-4" style={{ background: '#fff', border: '1.5px solid #e2e8e5' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: G_DARK }}>{dept.shortLabel}</div>
                <div className="text-2xl font-bold" style={{ color: G_DARK }}>{count}</div>
                <div className="text-[10px]" style={{ color: '#9ca3af' }}>tài khoản</div>
              </div>
            );
          })}
        </div>

        {/* User table */}
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: '#fff', border: '1.5px solid #e2e8e5' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #f0f4f2' }}>
            <h2 className="text-sm font-bold" style={{ color: G_DARK }}>Danh sách tài khoản ({users.length})</h2>
          </div>
          {loading ? (
            <div className="p-10 text-center text-sm" style={{ color: '#9ca3af' }}>Đang tải...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ background: '#f8faf9', borderBottom: '1px solid #f0f4f2' }}>
                  {['Tên đăng nhập', 'Họ tên', 'Phòng ban', 'Vị trí', 'Agents được phép', 'Thao tác'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold" style={{ color: '#6b7280' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const dept = DEPARTMENTS[u.department];
                  const positions = POSITIONS_BY_DEPT[u.department] || [];
                  const pos = positions.find(p => p.key === u.position);
                  const agentCount = u.allowedAgents?.length || 0;
                  return (
                    <tr key={u.username} style={{ borderBottom: '1px solid #f8faf9' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafcfa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: u.role === 'admin' ? '#C41230' : G_DARK }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-sm font-mono" style={{ color: '#374151' }}>{u.username}</span>
                          {u.role === 'admin' && <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{ background: '#fee2e2', color: '#dc2626' }}>ADMIN</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#1f2937' }}>{u.name}</td>
                      <td className="px-5 py-3.5">
                        {dept ? (
                          <span className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ background: `${G_DARK}12`, color: G_DARK }}>
                            {dept.label}
                          </span>
                        ) : <span className="text-xs" style={{ color: '#9ca3af' }}>Tất cả</span>}
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: '#374151' }}>
                        {pos?.label || <span style={{ color: '#9ca3af' }}>—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: agentCount > 0 ? '#dcfce7' : '#f3f4f6', color: agentCount > 0 ? '#16a34a' : '#9ca3af' }}>
                          {u.role === 'admin' ? 'Tất cả' : agentCount === 0 ? 'Toàn phòng ban' : `${agentCount} agents`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditUser(u)}
                            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition"
                            style={{ background: `${G_DARK}10`, color: G_DARK, border: `1px solid ${G_DARK}20` }}
                            onMouseEnter={e => e.currentTarget.style.background = `${G_DARK}20`}
                            onMouseLeave={e => e.currentTarget.style.background = `${G_DARK}10`}>
                            Chỉnh sửa
                          </button>
                          {u.username !== 'admin' && (
                            <button onClick={() => deleteUser(u.username)}
                              className="text-xs px-3 py-1.5 rounded-lg font-semibold transition"
                              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}>
                              Xóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit modal */}
      {(showCreate || editUser) && (
        <UserModal
          user={editUser}
          onClose={() => { setShowCreate(false); setEditUser(null); }}
          onSaved={() => { setShowCreate(false); setEditUser(null); loadUsers(); }}
        />
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSaved }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    username: user?.username || '',
    name: user?.name || '',
    password: '',
    department: user?.department || 'hr',
    position: user?.position || '',
    allowedAgents: user?.allowedAgents || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const deptAgents = AGENTS.filter(a => a.department === form.department);
  const positions = POSITIONS_BY_DEPT[form.department] || [];

  const toggleAgent = (id) => {
    setForm(f => ({
      ...f,
      allowedAgents: f.allowedAgents.includes(id)
        ? f.allowedAgents.filter(x => x !== id)
        : [...f.allowedAgents, id],
    }));
  };

  const selectAllAgents = () => setForm(f => ({ ...f, allowedAgents: deptAgents.map(a => a.id) }));
  const clearAgents = () => setForm(f => ({ ...f, allowedAgents: [] }));

  const handleSave = async () => {
    setError('');
    if (!form.name || (!isEdit && !form.password)) { setError('Vui lòng điền đầy đủ thông tin'); return; }
    setSaving(true);
    const body = isEdit
      ? { username: form.username, name: form.name, department: form.department, position: form.position, allowedAgents: form.allowedAgents, ...(form.password && { newPassword: form.password }) }
      : { ...form };
    const res = await fetch('/api/admin/users', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSaving(false); return; }
    onSaved();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-2xl rounded-2xl shadow-2xl pointer-events-auto fade-up overflow-hidden"
          style={{ background: '#fff', border: '1.5px solid #e2e8e5', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ background: G_DARK, borderRadius: '16px 16px 0 0' }}>
            <div className="text-sm font-bold text-white">{isEdit ? `Chỉnh sửa: ${user.name}` : 'Tạo tài khoản mới'}</div>
            <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="p-6 grid grid-cols-2 gap-4">
              {/* Basic info */}
              {!isEdit && (
                <Field label="Tên đăng nhập *">
                  <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }} />
                </Field>
              )}
              <Field label="Họ & tên *">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }} />
              </Field>
              <Field label={isEdit ? 'Đổi mật khẩu (để trống nếu không đổi)' : 'Mật khẩu *'}>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }}
                  placeholder={isEdit ? '••••••••' : ''} />
              </Field>
              <Field label="Phòng ban">
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value, position: '', allowedAgents: [] }))}
                  className="w-full px-3 py-2 rounded-xl text-sm cursor-pointer" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }}>
                  {DEPT_KEYS.map(k => <option key={k} value={k}>{DEPARTMENTS[k].label}</option>)}
                </select>
              </Field>
              <Field label="Vị trí">
                <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm cursor-pointer" style={{ border: '1.5px solid #e0d9ff', background: '#fafaff' }}>
                  <option value="">— Chọn vị trí —</option>
                  {positions.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </Field>
            </div>

            {/* Agent permissions */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold" style={{ color: G_DARK }}>AI Agents được phép sử dụng</div>
                  <div className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Để trống = có thể dùng tất cả agents trong phòng ban</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={selectAllAgents} className="text-xs px-2.5 py-1 rounded-lg font-semibold transition"
                    style={{ background: `${G_DARK}10`, color: G_DARK }}>Chọn tất cả</button>
                  <button onClick={clearAgents} className="text-xs px-2.5 py-1 rounded-lg font-semibold transition"
                    style={{ background: '#f3f4f6', color: '#6b7280' }}>Bỏ chọn</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {deptAgents.map(agent => {
                  const checked = form.allowedAgents.includes(agent.id);
                  return (
                    <label key={agent.id} className="flex items-start gap-2.5 p-3 rounded-xl cursor-pointer transition"
                      style={{ border: `1.5px solid ${checked ? G_DARK : '#e5e7eb'}`, background: checked ? `${G_DARK}08` : '#fafafa' }}
                      onMouseEnter={e => { if (!checked) e.currentTarget.style.borderColor = '#9ca3af'; }}
                      onMouseLeave={e => { if (!checked) e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleAgent(agent.id)} className="mt-0.5 flex-shrink-0"
                        style={{ accentColor: G_DARK }} />
                      <div>
                        <div className="text-xs font-semibold" style={{ color: checked ? G_DARK : '#374151' }}>{agent.name}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{agent.desc.slice(0, 50)}...</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid #f0f4f2' }}>
            {error && <span className="text-xs" style={{ color: '#dc2626' }}>{error}</span>}
            {!error && <span />}
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold transition"
                style={{ background: '#f3f4f6', color: '#374151' }}>Hủy</button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white transition disabled:opacity-50"
                style={{ background: G_DARK }}>
                {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: '#5b4fa0' }}>{label}</label>
      {children}
    </div>
  );
}
