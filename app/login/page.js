'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Đăng nhập thất bại'); setLoading(false); return; }
      router.push('/'); router.refresh();
    } catch { setError('Lỗi kết nối. Thử lại sau.'); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #F0EEFF 0%, #E8F0FF 50%, #F5F0FF 100%)' }}>
      <div className="w-full max-w-sm fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #6941F6, #4f2fe0)', boxShadow: '0 8px 24px rgba(105,65,246,0.35)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 0 4h-2v2a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-4 0v-2H8a2 2 0 0 1-2-2v-2H4a2 2 0 0 1 0-4h2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1535' }}>AI Agent Hub</h1>
          <p className="text-sm mt-1.5" style={{ color: '#7c6fa8' }}>Đăng nhập để sử dụng hệ thống</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 shadow-xl" style={{ background: '#fff', border: '1px solid #e8e3ff' }}>
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2.5"
              style={{ background: '#fff1f1', border: '1px solid #fecaca', color: '#dc2626' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wide" style={{ color: '#5b4fa0' }}>TÀI KHOẢN</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                style={{ background: '#F7F5FF', border: '1.5px solid #E0D9FF', color: '#1a1535' }}
                onFocus={e => e.target.style.borderColor = '#6941F6'}
                onBlur={e => e.target.style.borderColor = '#E0D9FF'}
                placeholder="Nhập tên đăng nhập" required autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wide" style={{ color: '#5b4fa0' }}>MẬT KHẨU</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                style={{ background: '#F7F5FF', border: '1.5px solid #E0D9FF', color: '#1a1535' }}
                onFocus={e => e.target.style.borderColor = '#6941F6'}
                onBlur={e => e.target.style.borderColor = '#E0D9FF'}
                placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6941F6, #4f2fe0)', boxShadow: '0 4px 16px rgba(105,65,246,0.4)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 22px rgba(105,65,246,0.55)'; }}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(105,65,246,0.4)'}>
              {loading
                ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />Đang đăng nhập...</>
                : 'Đăng nhập'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#a89ed0' }}>
          Liên hệ quản trị viên nếu chưa có tài khoản
        </p>
      </div>
    </div>
  );
}
