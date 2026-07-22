'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  DEPARTMENTS, AGENTS,
  getAgentsByDept, getAgentsByDepartment, searchAgents,
  getAgentsByPosition, ORG_CHART, POSITION_TO_DEPT,
} from '@/lib/agents';

const DEPT_KEYS = Object.keys(DEPARTMENTS);


// ── Icons ────────────────────────────────────────────────────────────────────
const ICONS = {
  'chart-arrows-vertical': <path d="M18 9l3 3-3 3M6 9l-3 3 3 3M12 3v18M9 18l3 3 3-3M9 6l3-3 3 3"/>,
  calculator: <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h2M14 14h2M8 18h2M14 18h2"/></>,
  users: <><path d="M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9"/></>,
  chess: <><path d="M8 16l-1.4 2.8A2 2 0 0 0 8.4 22h7.2a2 2 0 0 0 1.8-3.2L16 16"/><path d="M5 11h14V7l-2-2h-1l-1 2h-2l-1-2h-1L9 7v4z"/><path d="M6 15a2 2 0 0 0 2-2 2 2 0 0 1 2-2h4a2 2 0 0 1 2 2 2 2 0 0 0 2 2"/></>,
  factory: <><path d="M2 20V9l6-4v3l6-4v3l5-2v18H2z"/><path d="M13 20v-4h3v4"/><rect x="5" y="14" width="3" height="3"/><rect x="5" y="9" width="3" height="3"/></>,
  crown: <><path d="M3 18h18M4 18l2-10 5 6 3-8 3 8 5-6 2 10"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v.01"/></>,
  clipboard: <><path d="M9 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></>,
  'shield-user': <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></>,
  'user-search': <><circle cx="10" cy="7" r="4"/><path d="M10.3 15H7a4 4 0 0 0-4 4v1"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.9-1.9"/></>,
  graduation: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
  trending: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  invoice: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></>,
  handshake: <><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.36-7.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65z"/></>,
  megaphone: <><path d="m3 11 19-9-9 19-2-8-8-2z"/></>,
  'check-badge': <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></>,
  package: <><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></>,
  flowchart: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3h12V9M12 12v3M9 9l-3 3M15 9l3 3"/></>,
  sparkles: <><path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z"/><path d="M5 12l.72 2.17L8 15l-2.28.83L5 18l-.72-2.17L2 15l2.28-.83L5 12z"/><path d="M19 12l.72 2.17L22 15l-2.28.83L19 18l-.72-2.17L16 15l2.28-.83L19 12z"/></>,
};

function Icon({ name, size = 20 }) {
  const content = ICONS[name];
  if (!content) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {content}
    </svg>
  );
}

// ── Markdown ─────────────────────────────────────────────────────────────────
function MarkdownView({ text }) {
  if (!text) return null;
  const html = text
    .replace(/\r\n/g, '\n')
    .replace(/^### (.+)$/gm, '<h4 style="font-size:13px;font-weight:600;margin:14px 0 5px;color:#2d2060">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:18px 0 7px;color:#1a1535">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 style="font-size:17px;font-weight:700;margin:18px 0 7px;color:#1a1535">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600;color:#2d2060">$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:#EDE9FF;color:#6941F6;padding:2px 6px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #ede9ff;margin:12px 0"/>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;align-items:flex-start;gap:8px;margin:4px 0"><span style="margin-top:7px;width:5px;height:5px;border-radius:50%;background:#6941F6;flex-shrink:0;display:inline-block"></span><span>$1</span></div>')
    .replace(/^\d+\.\s(.+)$/gm, '<div style="padding-left:14px;margin:3px 0">$1</div>')
    .replace(/\n{2,}/g, '</p><p style="margin:7px 0;line-height:1.75">')
    .replace(/\n/g, '<br/>');
  return (
    <div style={{ fontSize: 14, lineHeight: 1.75, color: '#3d3560' }}
      dangerouslySetInnerHTML={{ __html: `<p style="margin:3px 0;line-height:1.75">${html}</p>` }} />
  );
}

// ── Slide viewer ─────────────────────────────────────────────────────────────
function SlideView({ data }) {
  const [fullscreen, setFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const fsRef = useRef(null);
  useEffect(() => {
    if (iframeRef.current && data?.html) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) { doc.open(); doc.write(data.html); doc.close(); }
    }
  }, [data?.html]);

  // Forward arrow keys from parent window into the iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        iframeRef.current?.contentWindow?.dispatchEvent(
          new KeyboardEvent('keydown', { key: e.key, bubbles: true, cancelable: true })
        );
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => {
    if (fullscreen && fsRef.current && data?.html) {
      const doc = fsRef.current.contentDocument || fsRef.current.contentWindow?.document;
      if (doc) { doc.open(); doc.write(data.html); doc.close(); }
    }
  }, [fullscreen, data?.html]);
  if (!data?.html) return null;
  return (
    <>
      {fullscreen && (
        <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: '#0d0d14' }}>
          <div className="flex items-center justify-between px-5 py-3"
            style={{ background: 'rgba(0,0,0,0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-sm text-white/60 truncate">{data.title}</span>
            <button onClick={() => setFullscreen(false)} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <iframe ref={fsRef} className="flex-1 w-full border-0" title="fs" />
        </div>
      )}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1a1535' }}>{data.title}</p>
            <p className="text-xs" style={{ color: '#9b8fc0' }}>Claude Design AI</p>
          </div>
          <button onClick={() => setFullscreen(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition"
            style={{ color: '#6941F6', background: '#EDE9FF', border: '1.5px solid #d4caff' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E0D9FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#EDE9FF'}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            Toàn màn hình
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', border: '1.5px solid #ddd6ff', boxShadow: '0 8px 30px rgba(105,65,246,0.1)' }}>
          <iframe ref={iframeRef} className="w-full h-full border-0" title="slide" sandbox="allow-scripts allow-same-origin" />
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <button onClick={() => iframeRef.current?.contentWindow?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition"
            style={{ background: '#EDE9FF', color: '#6941F6', border: '1.5px solid #d4caff' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E0D9FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#EDE9FF'}>
            ← Trước
          </button>
          <span className="text-xs" style={{ color: '#b0a5cc' }}>Dùng nút hoặc phím ← →</span>
          <button onClick={() => iframeRef.current?.contentWindow?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition"
            style={{ background: '#EDE9FF', color: '#6941F6', border: '1.5px solid #d4caff' }}
            onMouseEnter={e => e.currentTarget.style.background = '#E0D9FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#EDE9FF'}>
            Tiếp →
          </button>
        </div>
      </div>
    </>
  );
}

// ── Training modal ────────────────────────────────────────────────────────────
function TrainingModal({ agent, onClose }) {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    fetch(`/api/admin/training?agentId=${agent.id}`).then(r => r.json())
      .then(d => { setSystemPrompt(d.systemPrompt || ''); setLoading(false); }).catch(() => setLoading(false));
  }, [agent.id]);
  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/training', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agentId: agent.id, systemPrompt }) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl fade-up" style={{ background: '#fff', border: '1.5px solid #e0d9ff' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f0eaff' }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: '#1a1535' }}>Training: {agent.name}</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9b8fc0' }}>Tùy chỉnh system prompt</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition" style={{ color: '#9b8fc0' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-5">
          {loading ? <div className="flex justify-center py-10"><div className="spinner" /></div> : (
            <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} rows={7}
              placeholder="Ví dụ: Bạn là trợ lý của công ty ABC..."
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition font-mono resize-y"
              style={{ background: '#F7F5FF', border: '1.5px solid #E0D9FF', color: '#2d2060', minHeight: 140 }}
              onFocus={e => e.target.style.borderColor = '#6941F6'}
              onBlur={e => e.target.style.borderColor = '#E0D9FF'} />
          )}
        </div>
        <div className="flex justify-end gap-2.5 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl transition"
            style={{ color: '#6b5fa0', background: '#F0EEFF', border: '1.5px solid #E0D9FF' }}>Đóng</button>
          <button onClick={handleSave} disabled={saving || loading}
            className="px-4 py-2 text-sm font-bold text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
            style={{ background: saved ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#6941F6,#4f2fe0)', boxShadow: '0 4px 14px rgba(105,65,246,0.4)' }}>
            {saving ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 13, height: 13 }} />Lưu...</>
              : saved ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>Đã lưu!</> : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Contract HTML Renderer ────────────────────────────────────────────────────
// ── Contract Template ─────────────────────────────────────────────────────────
function ContractTemplate({ cccd = {}, contract = {}, duties = [] }) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2,'0');
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const yyyy = today.getFullYear();
  const { position='', department='', salary='', contractType='', startDate='', endDate='' } = contract;
  const { ho_ten='', ngay_sinh='', gioi_tinh='', que_quan='', noi_thuong_tru='', so_cccd='', ngay_cap='', noi_cap='' } = cccd;
  const dash = (n=40) => '─'.repeat(n);

  const S = { // styles
    page:   { fontFamily:'"Times New Roman",Times,serif', fontSize:13, color:'#000', lineHeight:1.75 },
    center: { textAlign:'center' },
    bold:   { fontWeight:'bold' },
    italic: { fontStyle:'italic' },
    under:  { textDecoration:'underline' },
    title:  { fontSize:16, fontWeight:'bold', textAlign:'center', margin:'10px 0 4px', letterSpacing:'.5px' },
    heading:{ fontWeight:'bold', marginTop:16, marginBottom:4, fontSize:13 },
    clause: { textAlign:'justify', paddingLeft:28, marginBottom:2 },
    sub:    { textAlign:'justify', paddingLeft:52, marginBottom:2 },
    space:  { height:10, display:'block' },
    line:   { borderBottom:'1px solid #aaa', margin:'4px 0 8px' },
    signBox:{ display:'flex', justifyContent:'space-between', marginTop:32 },
    signCol:{ width:'46%', textAlign:'center' },
    sigGap: { height:80 },
  };

  return (
    <div style={S.page}>
      {/* Quốc hiệu */}
      <p style={{...S.center, ...S.bold}}>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      <p style={{...S.center, ...S.bold, ...S.under}}>Độc lập – Tự do – Hạnh phúc</p>
      <p style={{...S.center, marginBottom:12}}>———————</p>

      {/* Tiêu đề */}
      <p style={S.title}>HỢP ĐỒNG LAO ĐỘNG</p>
      <p style={{...S.center, ...S.italic, fontSize:12}}>Loại hợp đồng: {contractType}</p>
      <p style={{...S.center, fontSize:12, marginBottom:4}}>Số: ........./HĐLĐ-{yyyy}</p>
      <p style={{...S.center, ...S.italic, marginBottom:16}}>Hôm nay, ngày {dd} tháng {mm} năm {yyyy}</p>

      {/* Bên A */}
      <p style={S.heading}>BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
      <p style={S.clause}>- Tên doanh nghiệp : CÔNG TY TNHH THƯƠNG MẠI & TRÀ DƯỢC VIỆT NAM</p>
      <p style={S.clause}>- Địa chỉ trụ sở&nbsp;&nbsp; : ................................................................................................</p>
      <p style={S.clause}>- Mã số thuế&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : .....................................................</p>
      <p style={S.clause}>- Đại diện bởi&nbsp;&nbsp;&nbsp;&nbsp; : .....................................................</p>
      <p style={S.clause}>- Chức vụ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : Giám Đốc</p>
      <p style={{...S.sub, ...S.italic}}>(Sau đây gọi là Bên A)</p>
      <span style={S.space}/>

      {/* Bên B */}
      <p style={S.heading}>BÊN B: NGƯỜI LAO ĐỘNG</p>
      <p style={S.clause}>- Họ và tên&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : <strong>{ho_ten || '............................................................'}</strong></p>
      <p style={S.clause}>- Ngày sinh&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {ngay_sinh || '................'}{'  '}{gioi_tinh ? `Giới tính: ${gioi_tinh}` : ''}</p>
      <p style={S.clause}>- Quê quán&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {que_quan || '................................................................................................'}</p>
      <p style={S.clause}>- Nơi thường trú : {noi_thuong_tru || '................................................................................................'}</p>
      <p style={S.clause}>- Số CCCD/CMND : <strong>{so_cccd || '.....................................'}</strong>{'  '}Ngày cấp: {ngay_cap || '................'}</p>
      <p style={S.clause}>- Nơi cấp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : {noi_cap || '................................................................................................'}</p>
      <p style={{...S.sub, ...S.italic}}>(Sau đây gọi là Bên B)</p>
      <span style={S.space}/>

      <p style={{textAlign:'justify', ...S.italic}}>Hai bên thỏa thuận ký kết hợp đồng lao động với các điều khoản sau:</p>
      <span style={S.space}/>

      {/* Điều 1 */}
      <p style={S.heading}>Điều 1. CÔNG VIỆC VÀ ĐỊA ĐIỂM LÀM VIỆC</p>
      <p style={S.clause}>1.1. Chức danh / Vị trí: <strong>{position}</strong></p>
      <p style={S.clause}>1.2. Phòng ban trực thuộc: <strong>{department}</strong></p>
      <p style={S.clause}>1.3. Địa điểm làm việc: Tại trụ sở Công ty và các địa điểm do Công ty phân công.</p>
      <p style={S.clause}>1.4. Nhiệm vụ chính:</p>
      {duties.map((d,i) => <p key={i} style={S.sub}>{i+1}. {d}</p>)}
      <span style={S.space}/>

      {/* Điều 2 */}
      <p style={S.heading}>Điều 2. THỜI HẠN HỢP ĐỒNG</p>
      <p style={S.clause}>2.1. Loại hợp đồng: {contractType}</p>
      <p style={S.clause}>2.2. Ngày bắt đầu làm việc: <strong>{startDate}</strong></p>
      {endDate
        ? <p style={S.clause}>2.3. Ngày kết thúc hợp đồng: <strong>{endDate}</strong></p>
        : <p style={S.clause}>2.3. Hợp đồng không xác định thời hạn, có hiệu lực cho đến khi một trong hai bên chấm dứt theo quy định pháp luật.</p>}
      <span style={S.space}/>

      {/* Điều 3 */}
      <p style={S.heading}>Điều 3. LƯƠNG, PHỤ CẤP VÀ PHÚC LỢI</p>
      <p style={S.clause}>3.1. Mức lương cơ bản: <strong>{salary} VNĐ/tháng</strong></p>
      <p style={S.sub}>(Bằng chữ: ......................................................................................................)</p>
      <p style={S.clause}>3.2. Phụ cấp chức vụ, đi lại, ăn trưa và các khoản khác: Theo quy chế lương thưởng Công ty.</p>
      <p style={S.clause}>3.3. Hình thức thanh toán: Chuyển khoản ngân hàng vào ngày 05 hàng tháng.</p>
      <p style={S.clause}>3.4. Lương làm thêm giờ / ca đêm: Theo quy định của Bộ Luật Lao Động 2019.</p>
      <span style={S.space}/>

      {/* Điều 4 */}
      <p style={S.heading}>Điều 4. THỜI GIỜ LÀM VIỆC VÀ NGHỈ NGƠI</p>
      <p style={S.clause}>4.1. Giờ làm việc: 08 giờ/ngày, 05 ngày/tuần (Thứ Hai đến Thứ Sáu).</p>
      <p style={S.clause}>4.2. Ca làm việc: Sáng 08:00 – 12:00  |  Chiều 13:30 – 17:30.</p>
      <p style={S.clause}>4.3. Nghỉ lễ, Tết: Theo quy định của Nhà nước.</p>
      <p style={S.clause}>4.4. Nghỉ phép năm: 12 ngày/năm (theo Điều 113 Bộ Luật Lao Động 2019).</p>
      <span style={S.space}/>

      {/* Điều 5 */}
      <p style={S.heading}>Điều 5. BẢO HIỂM XÃ HỘI, BẢO HIỂM Y TẾ, BẢO HIỂM THẤT NGHIỆP</p>
      <p style={S.clause}>5.1. Bên B được tham gia BHXH, BHYT, BHTN theo quy định pháp luật hiện hành.</p>
      <p style={S.clause}>5.2. Tỷ lệ đóng góp: Bên A chịu 21,5% / Bên B chịu 10,5% trên mức lương đóng bảo hiểm.</p>
      <span style={S.space}/>

      {/* Điều 6 */}
      <p style={S.heading}>Điều 6. TRANG THIẾT BỊ VÀ BẢO HỘ LAO ĐỘNG</p>
      <p style={S.clause}>6.1. Bên A cung cấp đầy đủ phương tiện, thiết bị cần thiết để Bên B thực hiện công việc.</p>
      <p style={S.clause}>6.2. Bên B có trách nhiệm bảo quản, sử dụng đúng mục đích tài sản Công ty giao.</p>
      <span style={S.space}/>

      {/* Điều 7 */}
      <p style={S.heading}>Điều 7. CAM KẾT BẢO MẬT THÔNG TIN</p>
      <p style={S.clause}>7.1. Bên B cam kết bảo mật toàn bộ thông tin kinh doanh, kỹ thuật, tài chính và nhân sự của Công ty trong suốt thời gian làm việc và sau khi chấm dứt hợp đồng.</p>
      <p style={S.clause}>7.2. Vi phạm điều khoản bảo mật, Bên B phải chịu trách nhiệm bồi thường thiệt hại theo quy định pháp luật.</p>
      <span style={S.space}/>

      {/* Điều 8 */}
      <p style={S.heading}>Điều 8. QUYỀN VÀ NGHĨA VỤ CÁC BÊN</p>
      <p style={S.clause}>8.1. Bên A đảm bảo điều kiện làm việc, trả lương đúng hạn, thực hiện đầy đủ chế độ bảo hiểm và các quyền lợi khác theo pháp luật.</p>
      <p style={S.clause}>8.2. Bên B thực hiện đúng chức trách được giao, chấp hành nội quy Công ty, tham gia đào tạo theo yêu cầu.</p>
      <p style={S.clause}>8.3. Mỗi bên có quyền chấm dứt hợp đồng theo quy định Bộ Luật Lao Động 2019 với thời gian báo trước theo luật định.</p>
      <span style={S.space}/>

      {/* Điều 9 */}
      <p style={S.heading}>Điều 9. ĐIỀU KHOẢN CHUNG</p>
      <p style={S.clause}>9.1. Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi, bổ sung phải lập thành phụ lục có chữ ký của cả hai bên.</p>
      <p style={S.clause}>9.2. Hợp đồng lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản.</p>
      <p style={S.clause}>9.3. Các tranh chấp giải quyết trước tiên bằng thương lượng; nếu không thành sẽ đưa ra Tòa án có thẩm quyền tại Việt Nam.</p>
      <p style={S.clause}>9.4. Các vấn đề không được quy định trong hợp đồng này thực hiện theo Bộ Luật Lao Động 2019 và pháp luật liên quan.</p>

      {/* Chữ ký */}
      <p style={{textAlign:'right', ...S.italic, marginTop:24, fontSize:12}}>........., ngày {dd} tháng {mm} năm {yyyy}</p>
      <div style={S.signBox}>
        <div style={S.signCol}>
          <p style={S.bold}>ĐẠI DIỆN BÊN A</p>
          <p style={S.bold}>NGƯỜI SỬ DỤNG LAO ĐỘNG</p>
          <p style={{...S.italic, fontSize:12}}>(Ký, đóng dấu, ghi rõ họ tên)</p>
          <div style={S.sigGap}/>
          <p style={S.bold}>..................................</p>
        </div>
        <div style={S.signCol}>
          <p style={S.bold}>BÊN B</p>
          <p style={S.bold}>NGƯỜI LAO ĐỘNG</p>
          <p style={{...S.italic, fontSize:12}}>(Ký, ghi rõ họ tên)</p>
          <div style={S.sigGap}/>
          <p style={S.bold}>{ho_ten || '..................................'}</p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Dummy – kept to avoid breaking reference (replaced above)
function ContractHTMLView({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: 13, color: '#111' }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: 8 }} />;

        // Quốc hiệu / tiêu đề trung tâm in đậm
        const isCenterBold =
          trimmed.includes('CỘNG HOÀ XÃ HỘI CHỦ NGHĨA') ||
          trimmed.includes('Độc lập') ||
          trimmed === '***' ||
          trimmed.includes('HỢP ĐỒNG LAO ĐỘNG') ||
          trimmed.includes('CỘNG HÒA');

        // Tiêu đề điều khoản: "Điều X." hoặc "BÊN A:" / "BÊN B:"
        const isSectionTitle =
          /^(Điều\s+\d+[\.:])/.test(trimmed) ||
          /^(BÊN [AB][\.:])/.test(trimmed) ||
          /^(CHƯƠNG|PHẦN|MỤC)\s+[IVX\d]+/.test(trimmed) ||
          /^[IVX]+\.\s+[A-ZÁÀẢÃẠĂẮẶẰẲẴÂẤẬẦẨẪĐÉÈẺẼẸÊẾỆỀỂỄÍÌỈĨỊÓÒỎÕỌÔỐỘỒỔỖƠỚỢỜỞỠÚÙỦŨỤƯỨỰỪỬỮÝỲỶỸỴ]/.test(trimmed);

        // Mục con có số (1.1., 2.3.)
        const isSubClause = /^\d+\.\d+[\.]?\s/.test(trimmed);

        // Chữ ký
        const isSignLine =
          trimmed.startsWith('ĐẠI DIỆN') ||
          trimmed.startsWith('BÊN B') ||
          trimmed.includes('(Ký,') ||
          trimmed.includes('Ký tên') ||
          /^(Người lao động|Người sử dụng)/i.test(trimmed);

        // Loại hợp đồng / số HĐ (italic center)
        const isSubtitle =
          trimmed.startsWith('Loại hợp đồng:') ||
          trimmed.startsWith('Số:') ||
          trimmed.startsWith('Hôm nay') ||
          /^Hôm (nay|ngày)/.test(trimmed);

        if (isCenterBold && trimmed === 'HỢP ĐỒNG LAO ĐỘNG') {
          return (
            <p key={i} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 17, marginBottom: 4, marginTop: 8, letterSpacing: 1 }}>
              {trimmed}
            </p>
          );
        }
        if (isCenterBold) {
          return (
            <p key={i} style={{ textAlign: 'center', fontWeight: trimmed === '***' ? 'normal' : 'bold',
              textDecoration: trimmed.includes('Độc lập') ? 'underline' : 'none', marginBottom: 2 }}>
              {trimmed}
            </p>
          );
        }
        if (isSubtitle) {
          return (
            <p key={i} style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 12, marginBottom: 2, color: '#333' }}>
              {trimmed}
            </p>
          );
        }
        if (isSectionTitle) {
          return (
            <p key={i} style={{ fontWeight: 'bold', marginTop: 14, marginBottom: 3, fontSize: 13 }}>
              {trimmed}
            </p>
          );
        }
        if (isSubClause) {
          return (
            <p key={i} style={{ textAlign: 'justify', paddingLeft: 24, marginBottom: 2, lineHeight: 1.75 }}>
              {trimmed}
            </p>
          );
        }
        if (isSignLine) {
          return (
            <p key={i} style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 4 }}>
              {trimmed}
            </p>
          );
        }
        // Dòng thường
        return (
          <p key={i} style={{ textAlign: 'justify', marginBottom: 2, lineHeight: 1.75, paddingLeft: line.startsWith(' ') ? 16 : 0 }}>
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

// ── Contract Panel ────────────────────────────────────────────────────────────
function ContractPanel({ agent, dept, user, onClose }) {
  const [formData, setFormData] = useState({});
  const [cccdFile, setCccdFile] = useState(null);
  const [cccdPreview, setCccdPreview] = useState(null);
  const [contractData, setContractData] = useState(null); // { cccd, contract, duties }
  const [loading, setLoading] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const resultRef = useRef(null);

  const textFields = agent.fields.filter(f => f.type !== 'file');
  const isFormValid = textFields.filter(f => f.required).every(f =>
    f.type === 'dept-auto' ? !!formData[f.key] : formData[f.key]?.trim()
  ) && cccdFile;

  const handleCccdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCccdFile(file);
    setCccdPreview(URL.createObjectURL(file));
    setContractData(null);
  };

  const handleSubmit = async () => {
    if (loading || !isFormValid) return;
    setLoading(true); setContractData(null);
    const fd = new FormData();
    fd.append('cccd', cccdFile);
    for (const f of textFields) fd.append(f.key, formData[f.key] || '');
    try {
      const res = await fetch('/api/contract', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { alert(`Lỗi: ${data.error}`); } else { setContractData(data); }
    } catch { alert('Lỗi kết nối.'); }
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  const handleCopy = () => {
    if (!contractData) return;
    const el = document.getElementById('contract-preview');
    navigator.clipboard.writeText(el?.innerText || '');
  };

  const handleDownloadWord = async () => {
    if (!contractData) return;
    try {
      const res = await fetch('/api/contract/download', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });
      if (!res.ok) { alert('Lỗi tạo file Word'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `HDLD_${(contractData.cccd?.ho_ten || 'nhan-vien').replace(/\s+/g,'_')}_${new Date().getFullYear()}.docx`;
      a.click(); URL.revokeObjectURL(url);
    } catch { alert('Lỗi tạo file Word'); }
  };

  const handleDownloadPDF = () => {
    if (!contractData) return;
    const content = document.getElementById('contract-preview');
    if (!content) return;
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Hợp Đồng Lao Động</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Times New Roman',Times,serif;font-size:13pt;color:#000;background:#fff}
  .page{width:210mm;margin:0 auto;padding:25mm 20mm 25mm 30mm}
  p{margin-bottom:3px;line-height:1.75}
  strong{font-weight:bold}
  em{font-style:italic}
  @media print{
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .page{padding:20mm 20mm 20mm 25mm}
  }
</style></head><body><div class="page">${content.innerHTML}</div></body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  };

  return (
    <>
      {trainingOpen && <TrainingModal agent={agent} onClose={() => setTrainingOpen(false)} />}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="w-full flex flex-col shadow-2xl pointer-events-auto fade-up"
        style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #EDE9FF', maxWidth: 880, maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: '1.5px solid #F0EEFF', background: '#FAFAFF', borderRadius: '20px 20px 0 0' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${dept?.color}18`, border: `1.5px solid ${dept?.color}35` }}>
              <span style={{ color: dept?.color }}><Icon name={dept?.icon || 'users'} size={18} /></span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold" style={{ color: '#1a1535' }}>{agent.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: '#E6F4EA', color: '#2E7D32', border: '1px solid #A5D6A7' }}>AI Vision + Contract</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#9b8fc0' }}>{agent.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {user.role === 'admin' && (
              <button onClick={() => setTrainingOpen(true)}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium"
                style={{ color: '#6941F6', background: '#EDE9FF', border: '1.5px solid #d4caff' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                Train
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg transition" style={{ color: '#b0a5cc' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0EEFF'; e.currentTarget.style.color = '#6941F6'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b0a5cc'; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden" style={{ borderRadius: '0 0 20px 20px' }}>

          {/* Cột trái: Form */}
          <div className="flex flex-col overflow-y-auto px-6 py-5 flex-shrink-0"
            style={{ width: 360, borderRight: '1.5px solid #F0EEFF', background: '#FDFCFF' }}>

            {/* Upload CCCD */}
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1.5 tracking-wide" style={{ color: '#5b4fa0' }}>
                ẢNH CCCD / CMND <span className="text-red-500">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition"
                style={{ border: `2px dashed ${cccdFile ? '#6941F6' : '#D0C9F0'}`, background: cccdFile ? '#F5F3FF' : '#FAFAFF', minHeight: 110 }}>
                {cccdPreview ? (
                  <img src={cccdPreview} alt="CCCD" className="w-full rounded-xl object-cover" style={{ maxHeight: 130 }} />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9b8fc0" strokeWidth="1.5">
                      <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="m21 19-5-5-3 3-2-2-5 5"/>
                    </svg>
                    <span className="text-xs font-medium" style={{ color: '#9b8fc0' }}>Click để chọn ảnh CCCD</span>
                    <span className="text-[11px]" style={{ color: '#c4b8e8' }}>JPG, PNG, WEBP</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleCccdChange} />
              </label>
              {cccdFile && (
                <p className="text-[11px] mt-1" style={{ color: '#6941F6' }}>
                  ✓ {cccdFile.name}
                </p>
              )}
            </div>

            {/* Thông tin CCCD đã đọc */}
            {contractData?.cccd?.ho_ten && (
              <div className="mb-4 p-3 rounded-xl text-xs space-y-1" style={{ background: '#F0FFF4', border: '1px solid #86EFAC' }}>
                <p className="font-bold text-green-700 mb-1.5">✓ Đã trích xuất từ CCCD</p>
                {contractData.cccd.ho_ten && <p><span className="font-semibold text-gray-600">Họ tên:</span> {contractData.cccd.ho_ten}</p>}
                {contractData.cccd.ngay_sinh && <p><span className="font-semibold text-gray-600">Ngày sinh:</span> {contractData.cccd.ngay_sinh}</p>}
                {contractData.cccd.so_cccd && <p><span className="font-semibold text-gray-600">Số CCCD:</span> {contractData.cccd.so_cccd}</p>}
                {contractData.cccd.noi_thuong_tru && <p><span className="font-semibold text-gray-600">Thường trú:</span> {contractData.cccd.noi_thuong_tru}</p>}
              </div>
            )}

            {/* Các trường form */}
            <div className="space-y-3 mb-4">
              {textFields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-bold mb-1 tracking-wide" style={{ color: '#5b4fa0' }}>
                    {field.label.toUpperCase()}{field.required && <span className="ml-1 text-red-500">*</span>}
                  </label>

                  {field.type === 'org-select' ? (
                    /* Dropdown vị trí từ sơ đồ tổ chức */
                    <select
                      value={formData[field.key] || ''}
                      onChange={e => {
                        const pos = e.target.value;
                        const dept = POSITION_TO_DEPT[pos] || '';
                        setFormData(p => ({ ...p, position: pos, department: dept }));
                      }}
                      className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: formData[field.key] ? '#1a1535' : '#9b8fc0' }}
                      onFocus={e => e.target.style.borderColor = '#6941F6'}
                      onBlur={e => e.target.style.borderColor = '#E0D9FF'}>
                      <option value="">— Chọn vị trí —</option>
                      {ORG_CHART.map(group => (
                        <optgroup key={group.deptKey} label={group.dept}>
                          {group.positions.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>

                  ) : field.type === 'dept-auto' ? (
                    /* Phòng ban tự động điền, chỉ đọc */
                    <div className="w-full px-3 py-2 rounded-xl text-sm flex items-center gap-2"
                      style={{ background: '#F5F3FF', border: '1.5px solid #E0D9FF', color: formData[field.key] ? '#1a1535' : '#c4b8e8', minHeight: 40 }}>
                      {formData[field.key]
                        ? <><span className="text-green-600">✓</span> {formData[field.key]}</>
                        : <span style={{ color: '#c4b8e8' }}>Tự động điền khi chọn vị trí</span>}
                    </div>

                  ) : field.type === 'select' ? (
                    <select value={formData[field.key] || field.options?.[0] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: '#1a1535' }}
                      onFocus={e => e.target.style.borderColor = '#6941F6'}
                      onBlur={e => e.target.style.borderColor = '#E0D9FF'}>
                      {field.options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>

                  ) : field.type === 'textarea' ? (
                    <>
                      {field.key === 'jd_content' && (
                        <a href={`https://drive.google.com/drive/folders/${agent.gdriveFolderId}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] mb-1 font-medium"
                          style={{ color: '#6941F6' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          Mở folder JD trên Google Drive
                        </a>
                      )}
                      <textarea value={formData[field.key] || ''}
                        onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder} rows={field.key === 'jd_content' ? 4 : 3}
                        className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-y"
                        style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: '#1a1535', lineHeight: 1.6 }}
                        onFocus={e => e.target.style.borderColor = '#6941F6'}
                        onBlur={e => e.target.style.borderColor = '#E0D9FF'} />
                    </>

                  ) : field.format === 'number' ? (
                    <input type="text" value={formData[field.key] || ''}
                      onChange={e => {
                        const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                        const formatted = raw ? Number(raw).toLocaleString('vi-VN').replace(/,/g, '.') : '';
                        setFormData(p => ({ ...p, [field.key]: formatted }));
                      }}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: '#1a1535' }}
                      onFocus={e => e.target.style.borderColor = '#6941F6'}
                      onBlur={e => e.target.style.borderColor = '#E0D9FF'} />
                  ) : (
                    <input type="text" value={formData[field.key] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: '#1a1535' }}
                      onFocus={e => e.target.style.borderColor = '#6941F6'}
                      onBlur={e => e.target.style.borderColor = '#E0D9FF'} />
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={loading || !isFormValid}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={loading || !isFormValid ? { background: '#c4c0d8' } : { background: 'linear-gradient(135deg,#2E7D32,#43A047)', boxShadow: '0 6px 20px rgba(46,125,50,0.35)' }}>
              {loading
                ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 14, height: 14 }} />Đang đọc CCCD & sinh HĐ...</>
                : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>Tạo Hợp Đồng Lao Động</>}
            </button>
          </div>

          {/* Cột phải: Kết quả */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F0F2F5' }}>
            {contractData ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-2.5 flex-shrink-0"
                  style={{ borderBottom: '1px solid #E8E0FF', background: '#fff' }}>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span className="text-xs font-bold" style={{ color: '#1B4332' }}>HỢP ĐỒNG LAO ĐỘNG</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: '#E6F4EA', color: '#2E7D32' }}>✓ Đã tạo</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={handleCopy} title="Sao chép văn bản"
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg font-medium"
                      style={{ color: '#5b4fa0', background: '#EDE9FF', border: '1px solid #d4caff' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy
                    </button>
                    <button onClick={handleDownloadWord} title="Tải file Word (.docx)"
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg font-medium"
                      style={{ color: '#1a56db', background: '#EBF5FF', border: '1px solid #93C5FD' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2l2 5 2-5h2"/></svg>
                      Word
                    </button>
                    <button onClick={handleDownloadPDF} title="In / Xuất PDF"
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg font-medium"
                      style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                      PDF
                    </button>
                  </div>
                </div>

                {/* Contract preview — A4 paper */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                  <div ref={resultRef} id="contract-preview"
                    style={{
                      background: '#fff',
                      maxWidth: 720,
                      margin: '0 auto',
                      padding: '48px 60px 56px',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                      borderRadius: 3,
                    }}>
                    <ContractTemplate
                      cccd={contractData.cccd}
                      contract={contractData.contract}
                      duties={contractData.duties}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-8" style={{ color: '#c4b8e8' }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-4 opacity-40">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <p className="text-sm font-medium" style={{ color: '#b0a5cc' }}>Upload CCCD và điền thông tin<br/>hợp đồng để tạo tự động</p>
                <div className="mt-4 text-left text-xs space-y-1.5" style={{ color: '#c4b8e8' }}>
                  <p>① Upload ảnh CCCD nhân viên mới</p>
                  <p>② AI tự động đọc thông tin cá nhân</p>
                  <p>③ Điền vị trí, lương & loại HĐ</p>
                  <p>④ Dán nội dung JD từ Google Drive</p>
                  <p>⑤ Nhấn tạo — nhận HĐ hoàn chỉnh</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

// ── Agent form panel ──────────────────────────────────────────────────────────
// ── Q&A Panel (chat với knowledge base nội bộ) ───────────────────────────────
function QAPanel({ agent, dept, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    let answer = '';
    setMessages(m => [...m, { role: 'assistant', text: '' }]);
    try {
      const res = await fetch('/api/qa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) });
      const reader = res.body.getReader(); const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith('data: ')) continue;
          const d = cleanLine.slice(6); if (d === '[DONE]') continue;
          try { const p = JSON.parse(d); if (p.text) { answer += p.text; setMessages(m => [...m.slice(0, -1), { role: 'assistant', text: answer }]); } } catch {}
        }
      }
    } catch { setMessages(m => [...m.slice(0, -1), { role: 'assistant', text: 'Lỗi kết nối. Vui lòng thử lại.' }]); }
    setLoading(false);
    inputRef.current?.focus();
  };

  const SUGGESTED = ['Chính sách đổi trả như thế nào?', 'Điều kiện trở thành đại lý?', 'Phí vận chuyển bao nhiêu?', 'Sản phẩm có chứng nhận gì?'];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full flex flex-col shadow-2xl pointer-events-auto fade-up"
          style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #EDE9FF', maxWidth: 700, height: '86vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ background: G_DARK, borderRadius: '20px 20px 0 0' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.36-7.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65z"/></svg>
              </div>
              <div>
                <div className="text-sm font-bold text-white">{agent.name}</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Tra cứu từ kho dữ liệu nội bộ • Trả lời tức thì</div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${G_DARK}12` }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={G_DARK} strokeWidth="1.8"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.36-7.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65z"/></svg>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: G_DARK }}>Hỏi bất cứ điều gì về sản phẩm & chính sách</p>
                <p className="text-xs mb-6" style={{ color: '#9ca3af' }}>Hệ thống tra cứu từ kho dữ liệu nội bộ và đưa ra câu trả lời chính xác</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                      className="text-xs px-3 py-2 rounded-xl transition"
                      style={{ background: `${G_DARK}08`, color: G_DARK, border: `1px solid ${G_DARK}20` }}
                      onMouseEnter={e => e.currentTarget.style.background = `${G_DARK}15`}
                      onMouseLeave={e => e.currentTarget.style.background = `${G_DARK}08`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5" style={{ background: G_DARK }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.36-7.94 1.06-1.06a5.4 5.4 0 0 0 0-7.65z"/></svg>
                  </div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? G_DARK : '#F8FAF9',
                  color: msg.role === 'user' ? '#fff' : '#1f2937',
                  border: msg.role === 'assistant' ? '1.5px solid #e2e8e5' : 'none',
                  fontSize: 13, lineHeight: 1.6,
                }}>
                  {msg.role === 'assistant' ? <MarkdownView text={msg.text} /> : msg.text}
                  {msg.role === 'assistant' && loading && i === messages.length - 1 && !msg.text && (
                    <span style={{ display: 'flex', gap: 4 }}>
                      {[0,1,2].map(j => <span key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: `bounce 1.2s ${j*0.2}s infinite` }} />)}
                    </span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-2 mt-0.5 text-xs font-bold text-white" style={{ background: '#C41230' }}>
                    B
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: '1.5px solid #f0f4f2' }}>
            <div className="flex gap-3">
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Nhập câu hỏi của bạn... (Enter để gửi)"
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none"
                style={{ background: '#F8FAF9', border: `1.5px solid ${G_BORDER}`, color: '#1a1a1a' }}
                onFocus={e => e.target.style.borderColor = G_DARK}
                onBlur={e => e.target.style.borderColor = G_BORDER} />
              <button onClick={send} disabled={loading || !input.trim()}
                className="px-5 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition disabled:opacity-40"
                style={{ background: G_DARK, flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
                Hỏi
              </button>
            </div>
            <p className="text-[10px] mt-2 text-center" style={{ color: '#9ca3af' }}>Dữ liệu được lấy từ kho FAQ nội bộ — không tìm trên internet</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Content Creator Panel (Tạo Content + Ảnh AI) ─────────────────────────────
function ContentCreatorPanel({ agent, dept, user, onClose }) {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState('');
  const [imageData, setImageData] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [masterPrompt, setMasterPrompt] = useState('');
  const [promptCopied, setPromptCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgFullscreen, setImgFullscreen] = useState(false);
  const [history, setHistory] = useState([]);
  const resultRef = useRef(null);
  const isFormValid = agent.fields.filter(f => f.required).every(f => formData[f.key]?.trim());

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true); setResult(''); setImageData(null); setImageError(''); setImageLoading(false); setMasterPrompt('');
    try {
      const res = await fetch('/api/content-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });
      if (!res.ok) { const e = await res.json(); setResult(`Lỗi: ${e.error}`); setLoading(false); return; }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith('data: ')) continue;
          const d = cleanLine.slice(6);
          if (d === '[DONE]') continue;
          try {
            const p = JSON.parse(d);
            if (p.text) { full += p.text; setResult(full); }
            if (p.masterPrompt) setMasterPrompt(p.masterPrompt);
            if (p.textComplete && p.cleanText) {
              full = p.cleanText;
              setResult(p.cleanText);
            }
            if (p.imageLoading) setImageLoading(true);
            if (p.image) {
              setImageData(p.image);
              if (p.image.masterPrompt) setMasterPrompt(p.image.masterPrompt);
              setImageLoading(false);
              // Save to history
              setHistory(h => [{ text: full, image: p.image, time: new Date().toLocaleTimeString('vi-VN') }, ...h].slice(0, 10));
            }
            if (p.imageError) {
              setImageError(p.imageError);
              if (p.masterPrompt) setMasterPrompt(p.masterPrompt);
              setImageLoading(false);
              setHistory(h => [{ text: full, image: null, time: new Date().toLocaleTimeString('vi-VN') }, ...h].slice(0, 10));
            }
            if (p.error) setResult(`Lỗi: ${p.error}`);
          } catch (e) {
            console.error('Failed to parse line:', cleanLine, e);
          }
        }
      }
    } catch { setResult('Lỗi kết nối. Vui lòng thử lại.'); }
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    if (!imageData?.url) return;
    try {
      const res = await fetch(imageData.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `content-image-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Không thể tải ảnh. Hãy nhấn chuột phải để lưu.'); }
  };

  return (
    <>
      {trainingOpen && <TrainingModal agent={agent} onClose={() => setTrainingOpen(false)} />}
      {/* Image fullscreen */}
      {imgFullscreen && imageData?.url && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <button onClick={() => setImgFullscreen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition z-10">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <img src={imageData.url} alt="Content" className="max-w-full max-h-full rounded-xl shadow-2xl" style={{ objectFit: 'contain' }} />
        </div>
      )}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="w-full flex flex-col shadow-2xl pointer-events-auto fade-up"
        style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #d4edda', maxWidth: 1050, maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-7 py-4 flex-shrink-0"
          style={{ borderBottom: '1.5px solid #e8f5e9', background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)', borderRadius: '20px 20px 0 0' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047)', boxShadow: '0 4px 12px rgba(46,125,50,0.3)' }}>
              <span style={{ color: '#fff' }}><Icon name="sparkles" size={18} /></span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold" style={{ color: '#1B4332' }}>{agent.name}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>✨ AI Content + Image</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#6b8f71' }}>{agent.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {user.role === 'admin' && (
              <button onClick={() => setTrainingOpen(true)}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition"
                style={{ color: '#2E7D32', background: '#E8F5E9', border: '1.5px solid #A5D6A7' }}
                onMouseEnter={e => e.currentTarget.style.background = '#C8E6C9'}
                onMouseLeave={e => e.currentTarget.style.background = '#E8F5E9'}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                Train
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg transition" style={{ color: '#81C784' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E9'; e.currentTarget.style.color = '#2E7D32'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#81C784'; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Body — 2 cột */}
        <div className="flex flex-1 overflow-hidden" style={{ borderRadius: '0 0 20px 20px' }}>

          {/* Cột trái: Form */}
          <div className="flex flex-col overflow-y-auto px-6 py-5 flex-shrink-0"
            style={{ width: 350, borderRight: '1.5px solid #e8f5e9', background: '#FAFFF7' }}>
            <div className="space-y-3.5 mb-5">
              {agent.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-[11px] font-bold mb-1.5 tracking-wide" style={{ color: '#2E7D32' }}>
                    {field.label.toUpperCase()}{field.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select value={formData[field.key] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition cursor-pointer"
                      style={{ background: '#fff', border: '1.5px solid #C8E6C9', color: '#1B4332' }}
                      onFocus={e => e.target.style.borderColor = '#2E7D32'}
                      onBlur={e => e.target.style.borderColor = '#C8E6C9'}>
                      <option value="">— Chọn —</option>
                      {field.options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea value={formData[field.key] || ''} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder} rows={2}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition resize-y"
                      style={{ background: '#fff', border: '1.5px solid #C8E6C9', color: '#1B4332', lineHeight: 1.5 }}
                      onFocus={e => e.target.style.borderColor = '#2E7D32'}
                      onBlur={e => e.target.style.borderColor = '#C8E6C9'} />
                  ) : (
                    <input type="text" value={formData[field.key] || ''} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                      style={{ background: '#fff', border: '1.5px solid #C8E6C9', color: '#1B4332' }}
                      onFocus={e => e.target.style.borderColor = '#2E7D32'}
                      onBlur={e => e.target.style.borderColor = '#C8E6C9'} />
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} disabled={loading || !isFormValid}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={loading || !isFormValid ? { background: '#b0bec5' } : { background: 'linear-gradient(135deg,#2E7D32,#43A047)', boxShadow: '0 6px 20px rgba(46,125,50,0.35)' }}>
              {loading
                ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 14, height: 14 }} />Đang tạo content + ảnh...</>
                : <><Icon name="sparkles" size={16} /> Tạo Content & Ảnh AI</>}
            </button>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] font-bold tracking-wider mb-2" style={{ color: '#81C784' }}>LỊCH SỬ ({history.length})</p>
                <div className="space-y-1.5">
                  {history.map((h, i) => (
                    <button key={i} onClick={() => { setResult(h.text); setImageData(h.image); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-[11px] transition truncate"
                      style={{ background: '#fff', border: '1px solid #E8F5E9', color: '#4a7c4f' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E8F5E9'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <span style={{ color: '#aaa', marginRight: 6 }}>{h.time}</span>
                      {h.text.slice(0, 50)}...
                      {h.image && <span style={{ color: '#2E7D32', marginLeft: 4 }}>🖼</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Kết quả */}
          <div className="flex-1 overflow-y-auto" style={{ background: '#fff' }}>
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center px-10" style={{ color: '#a5d6a7' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#E8F5E910' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-30">
                    <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z"/>
                    <path d="M5 12l.72 2.17L8 15l-2.28.83L5 18l-.72-2.17L2 15l2.28-.83L5 12z"/>
                    <path d="M19 12l.72 2.17L22 15l-2.28.83L19 18l-.72-2.17L16 15l2.28-.83L19 12z"/>
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: '#81C784' }}>Sẵn sàng tạo content</p>
                <p className="text-xs" style={{ color: '#a5d6a7' }}>Chọn nhóm content, dòng sản phẩm và nhấn<br/><strong>Tạo Content & Ảnh AI</strong></p>
                <div className="mt-5 text-left text-[11px] space-y-1.5 px-4" style={{ color: '#a5d6a7' }}>
                  <p>① Chọn nhóm content theo phễu marketing</p>
                  <p>② Chọn dòng sản phẩm trà</p>
                  <p>③ Chọn định dạng (status, bài đăng, podcast...)</p>
                  <p>④ AI tạo nội dung text + ảnh minh họa</p>
                  <p>⑤ Copy text & tải ảnh → gửi cho khách hàng</p>
                </div>
              </div>
            )}

            {(result || loading) && (
              <div className="p-6">
                {/* Content text */}
                <div ref={resultRef} className="rounded-2xl overflow-hidden fade-up mb-5"
                  style={{ background: '#FAFFF7', border: '1.5px solid #E8F5E9' }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #E8F5E9' }}>
                    <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#2E7D32' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{
                        background: loading && !imageLoading ? '#2E7D32' : '#22c55e',
                        boxShadow: `0 0 5px ${loading && !imageLoading ? '#2E7D32' : '#22c55e'}`,
                        animation: loading && !imageLoading ? 'pulse 1.5s infinite' : 'none'
                      }} />
                      {loading && !imageLoading ? '✍️ Đang viết content...' : '📝 Nội dung bài viết'}
                    </div>
                    {result && (
                      <button onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium transition"
                        style={{ color: copied ? '#fff' : '#2E7D32', background: copied ? '#2E7D32' : '#E8F5E9', border: '1px solid #A5D6A7' }}>
                        {copied ? '✓ Đã copy' : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>}
                      </button>
                    )}
                  </div>
                  <div className="p-5">
                    <MarkdownView text={result} />
                    {loading && !result && (
                      <div className="flex items-center gap-3 py-4">
                        <span className="spinner" style={{ borderColor: '#C8E6C9', borderTopColor: '#2E7D32', width: 16, height: 16 }} />
                        <span className="text-xs" style={{ color: '#81C784' }}>AI đang viết nội dung...</span>
                      </div>
                    )}
                    {loading && result && <span className="cursor-blink" />}
                  </div>
                </div>

                {/* Image section */}
                {(imageLoading || imageData || imageError) && (
                  <div className="rounded-2xl overflow-hidden fade-up"
                    style={{ background: '#FAFFF7', border: '1.5px solid #E8F5E9' }}>
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #E8F5E9' }}>
                      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#2E7D32' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{
                          background: imageLoading ? '#FF9800' : imageError ? '#ef4444' : '#22c55e',
                          boxShadow: `0 0 5px ${imageLoading ? '#FF9800' : imageError ? '#ef4444' : '#22c55e'}`,
                          animation: imageLoading ? 'pulse 1.5s infinite' : 'none'
                        }} />
                        {imageLoading ? '🎨 Đang tạo ảnh AI...' : imageError ? '⚠️ Lỗi tạo ảnh' : '🖼 Ảnh minh họa AI'}
                      </div>
                      {imageData?.url && (
                        <div className="flex gap-1.5">
                          <button onClick={() => setImgFullscreen(true)}
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg font-medium"
                            style={{ color: '#2E7D32', background: '#E8F5E9', border: '1px solid #A5D6A7' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                            Phóng to
                          </button>
                          <button onClick={handleDownloadImage}
                            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg font-medium"
                            style={{ color: '#1565C0', background: '#E3F2FD', border: '1px solid #90CAF9' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                            Tải ảnh
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {imageLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div style={{
                            width: 48, height: 48, borderRadius: '50%',
                            border: '3px solid #C8E6C9', borderTopColor: '#2E7D32',
                            animation: 'spin 1s linear infinite'
                          }} />
                          <p className="text-xs mt-4" style={{ color: '#81C784' }}>DALL-E 3 đang tạo ảnh minh họa...</p>
                          <p className="text-[10px] mt-1" style={{ color: '#A5D6A7' }}>Thường mất 10-20 giây</p>
                        </div>
                      )}
                      {imageError && (
                        <div className="text-center py-6">
                          <p className="text-xs" style={{ color: '#ef4444' }}>⚠️ {imageError}</p>
                          <p className="text-[10px] mt-2" style={{ color: '#aaa' }}>Bạn vẫn có thể sử dụng nội dung text ở trên</p>
                        </div>
                      )}
                      {imageData?.url && (
                        <div>
                          <img src={imageData.url} alt="AI Generated Content Image"
                            className="w-full rounded-xl shadow-lg cursor-pointer transition hover:shadow-xl"
                            style={{ maxHeight: 500, objectFit: 'cover' }}
                            onClick={() => setImgFullscreen(true)} />
                          {imageData.revised_prompt && (
                            <p className="text-[10px] mt-3 px-2 py-1.5 rounded-lg" style={{ color: '#81C784', background: '#F1F8E9' }}>
                              💡 <strong>AI prompt:</strong> {imageData.revised_prompt.slice(0, 150)}...
                            </p>
                          )}
                          {imageData.isFallback && (
                            <p className="text-[10px] mt-3 px-3 py-2.5 rounded-lg border" style={{ color: '#E65100', background: '#FFF3E0', borderColor: '#FFE0B2' }}>
                              ⚠️ <strong>Tài khoản OpenAI (DALL-E) bị giới hạn:</strong> {imageData.originalError || 'Lỗi kết nối'}. <br />
                              Hệ thống tự động sử dụng hình ảnh chất lượng cao tương ứng với sản phẩm từ thư viện ảnh Unsplash.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Master Prompt Card for Midjourney / DALL-E / ChatGPT */}
                {(masterPrompt || imageData?.masterPrompt) && (
                  <div className="mt-4 p-4 rounded-2xl border fade-up" style={{ background: '#F8F7FF', borderColor: '#E0D9FF' }}>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: '#4B38B3' }}>✨ Master English Prompt (DALL-E 3 / Midjourney / ChatGPT):</span>
                      </div>
                      <button onClick={() => {
                        const pText = masterPrompt || imageData?.masterPrompt;
                        navigator.clipboard.writeText(pText);
                        setPromptCopied(true);
                        setTimeout(() => setPromptCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm"
                      style={{ background: promptCopied ? '#2E7D32' : 'linear-gradient(135deg, #6941F6, #4f2fe0)' }}>
                        {promptCopied ? '✓ Đã sao chép Prompt!' : '📋 Sao chép Prompt 1-Click'}
                      </button>
                    </div>
                    <p className="text-xs font-mono p-3 rounded-xl border leading-relaxed select-all"
                      style={{ background: '#fff', borderColor: '#E8E3FF', color: '#33296B' }}>
                      {masterPrompt || imageData?.masterPrompt}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

function AgentPanel({ agent, dept, user, onClose }) {
  if (agent.type === 'qa') return <QAPanel agent={agent} dept={dept} user={user} onClose={onClose} />;
  if (agent.type === 'contract') return <ContractPanel agent={agent} dept={dept} user={user} onClose={onClose} />;
  if (agent.type === 'content-creator') return <ContentCreatorPanel agent={agent} dept={dept} user={user} onClose={onClose} />;

  const [formData, setFormData] = useState({});
  const [result, setResult] = useState('');
  const [slideData, setSlideData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const resultRef = useRef(null);
  const isFormValid = agent.fields.filter(f => f.required).every(f => formData[f.key]?.trim());

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true); setResult(''); setSlideData(null);
    try {
      if (agent.type === 'slides' || agent.type === 'workflow') {
        const endpoint = agent.type === 'workflow' ? '/api/workflow' : '/api/slides';
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agentId: agent.id, formData }) });
        const data = await res.json();
        if (!res.ok) setResult(`Lỗi: ${data.error}`); else setSlideData(data);
      } else {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agentId: agent.id, formData }) });
        if (!res.ok) { const e = await res.json(); setResult(`Lỗi: ${e.error}`); setLoading(false); return; }
        const reader = res.body.getReader(); const decoder = new TextDecoder(); let full = '';
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();
          for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine.startsWith('data: ')) continue;
            const d = cleanLine.slice(6); if (d === '[DONE]') continue;
            try { const p = JSON.parse(d); if (p.text) { full += p.text; setResult(full); } if (p.error) setResult(`Lỗi: ${p.error}`); } catch {}
          }
        }
      }
    } catch { setResult('Lỗi kết nối.'); }
    setLoading(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  return (
    <>
      {trainingOpen && <TrainingModal agent={agent} onClose={() => setTrainingOpen(false)} />}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="w-full flex flex-col shadow-2xl pointer-events-auto fade-up"
        style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #EDE9FF', maxWidth: 820, maxHeight: '90vh' }}>
        <div className="flex items-start justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: '1.5px solid #F0EEFF', background: '#FAFAFF', borderRadius: '20px 20px 0 0' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${dept?.color}18`, border: `1.5px solid ${dept?.color}35` }}>
              <span style={{ color: dept?.color }}><Icon name={dept?.icon || 'chess'} size={18} /></span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold" style={{ color: '#1a1535' }}>{agent.name}</h2>
                {agent.type === 'slides' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: '#EDE9FF', color: '#6941F6', border: '1px solid #d4caff' }}>AI Slides</span>
                )}
                {agent.type === 'workflow' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid #86EFAC' }}>Workflow</span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#9b8fc0' }}>{agent.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            {user.role === 'admin' && (
              <button onClick={() => setTrainingOpen(true)}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition"
                style={{ color: '#6941F6', background: '#EDE9FF', border: '1.5px solid #d4caff' }}
                onMouseEnter={e => e.currentTarget.style.background = '#E0D9FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#EDE9FF'}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                Train
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg transition" style={{ color: '#b0a5cc' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0EEFF'; e.currentTarget.style.color = '#6941F6'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b0a5cc'; }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        {/* Body — 2 cột: form trái | kết quả phải */}
        <div className="flex flex-1 overflow-hidden" style={{ borderRadius: '0 0 20px 20px' }}>

          {/* Cột trái: Form */}
          <div className="flex flex-col overflow-y-auto px-7 py-5 flex-shrink-0"
            style={{ width: 340, borderRight: '1.5px solid #F0EEFF', background: '#FDFCFF' }}>
            <div className="space-y-4 mb-5">
              {agent.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-bold mb-1.5 tracking-wide" style={{ color: '#5b4fa0' }}>
                    {field.label.toUpperCase()}{field.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select value={formData[field.key] || field.options?.[0] || ''}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition cursor-pointer"
                      style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: '#1a1535' }}
                      onFocus={e => e.target.style.borderColor = '#6941F6'}
                      onBlur={e => e.target.style.borderColor = '#E0D9FF'}>
                      {field.options.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea value={formData[field.key] || ''} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder} rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition resize-y"
                      style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: '#1a1535', lineHeight: 1.6 }}
                      onFocus={e => e.target.style.borderColor = '#6941F6'}
                      onBlur={e => e.target.style.borderColor = '#E0D9FF'} />
                  ) : (
                    <input type="text" value={formData[field.key] || ''} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition"
                      style={{ background: '#fff', border: '1.5px solid #E0D9FF', color: '#1a1535' }}
                      onFocus={e => e.target.style.borderColor = '#6941F6'}
                      onBlur={e => e.target.style.borderColor = '#E0D9FF'} />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} disabled={loading || !isFormValid}
              className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={loading || !isFormValid ? { background: '#c4c0d8' } : { background: 'linear-gradient(135deg,#6941F6,#4f2fe0)', boxShadow: '0 6px 20px rgba(105,65,246,0.4)' }}>
              {loading
                ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 14, height: 14 }} />{agent.type === 'slides' ? 'Đang tạo slide...' : agent.type === 'workflow' ? 'Đang tạo sơ đồ...' : 'Đang xử lý...'}</>
                : agent.type === 'slides'
                  ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21l4-4 4 4M12 17v4"/></svg>Tạo Slide</>
                  : agent.type === 'workflow'
                    ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3h12V9M12 12v3M9 9l-3 3M15 9l3 3"/></svg>Tạo Sơ Đồ</>
                    : <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>Chạy Agent</>}
            </button>
          </div>

          {/* Cột phải: Kết quả */}
          <div className="flex-1 overflow-y-auto px-7 py-5" style={{ background: '#fff' }}>
            {!result && !slideData && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center" style={{ color: '#c4b8e8' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-4 opacity-40">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                <p className="text-sm font-medium" style={{ color: '#b0a5cc' }}>Điền form bên trái và nhấn<br/><strong>Chạy Agent</strong> để xem kết quả</p>
              </div>
            )}
            {slideData && <div ref={resultRef}><SlideView data={slideData} /></div>}
            {(result || loading) && (
              <div ref={resultRef} className="rounded-2xl overflow-hidden fade-up"
                style={{ background: '#FAFAFF', border: '1.5px solid #EDE9FF' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F0EEFF' }}>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: '#5b4fa0' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: loading ? '#6941F6' : '#22c55e', boxShadow: `0 0 5px ${loading ? '#6941F6' : '#22c55e'}` }} />
                    {loading ? 'Đang xử lý...' : 'Kết quả'}
                  </div>
                  {result && (
                    <button onClick={() => navigator.clipboard.writeText(result)}
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium transition"
                      style={{ color: '#6941F6', background: '#EDE9FF', border: '1px solid #d4caff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#E0D9FF'}
                      onMouseLeave={e => e.currentTarget.style.background = '#EDE9FF'}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy
                    </button>
                  )}
                </div>
                <div className="p-5">
                  <MarkdownView text={result} />
                  {loading && <span className="cursor-blink" />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

// ── Position agents modal ─────────────────────────────────────────────────────
function PositionAgentsModal({ position, dept, user, onSelectAgent, onClose }) {
  const agents = getAgentsByPosition(position.key);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl fade-up overflow-hidden"
        style={{ background: '#fff', border: '1.5px solid #e0d9ff', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1.5px solid #f0eaff', background: `${dept.color}08` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${dept.color}18`, border: `1.5px solid ${dept.color}30` }}>
              <span style={{ color: dept.color }}><Icon name={dept.icon} size={18} /></span>
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: '#1a1535' }}>{position.label}</h2>
              <p className="text-xs mt-0.5" style={{ color: '#9b8fc0' }}>{dept.label} · {agents.length} AI agents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition" style={{ color: '#9b8fc0' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {/* agent grid */}
        <div className="overflow-y-auto p-5">
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {agents.map(agent => (
              <button key={agent.id} onClick={() => { onClose(); onSelectAgent(agent, dept); }}
                className="group text-left rounded-2xl flex flex-col relative overflow-hidden transition-all"
                style={{ background: '#FAFAFF', border: '2px solid #EDE9FF', padding: '16px 16px 12px' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = dept.color;
                  e.currentTarget.style.boxShadow = `0 4px 16px ${dept.color}22`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#EDE9FF';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.background = '#FAFAFF';
                }}>
                {/* top accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg,${dept.color},${dept.color}55)` }} />
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${dept.color}12`, border: `1.5px solid ${dept.color}22` }}>
                    <span style={{ color: dept.color }}><Icon name={dept.icon} size={14} /></span>
                  </div>
                  {agent.type === 'slides' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: '#EDE9FF', color: '#6941F6', border: '1px solid #d4caff' }}>Slides</span>
                  )}
                </div>
                <div className="text-sm font-bold mb-1 leading-snug" style={{ color: '#1a1535' }}>{agent.name}</div>
                <div className="text-xs leading-relaxed flex-1" style={{ color: '#9b8fc0' }}>{agent.desc}</div>
                <div className="flex items-center justify-end mt-3 pt-2.5"
                  style={{ borderTop: `1.5px solid ${dept.color}12` }}>
                  <span className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                    style={{ color: dept.color }}>
                    Sử dụng
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Colors ────────────────────────────────────────────────────────────────────
const G_DARK   = '#1B4332';
const G_STRIP  = '#163728';
const G_BORDER = '#2D6A4F';
const R_TITLE  = '#C41230';

// ── Agent Hub Grid ────────────────────────────────────────────────────────────
function OrgChart({ user, onSelectAgent }) {
  // Filter agents by department + allowedAgents whitelist
  const getAllowedAgents = () => {
    if (user.role === 'admin' || user.department === 'all') return AGENTS;
    const deptAgents = AGENTS.filter(a => a.department === user.department);
    if (!user.allowedAgents || user.allowedAgents.length === 0) return deptAgents;
    return deptAgents.filter(a => user.allowedAgents.includes(a.id));
  };

  const allowedAgents = getAllowedAgents();
  const deptKeys = [...new Set(allowedAgents.map(a => a.department))];
  const totalAgents = allowedAgents.length;

  return (
    <div className="fade-up select-none">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div style={{ background: R_TITLE, borderRadius: 10, padding: '12px 20px', boxShadow: '0 2px 10px rgba(196,18,48,0.25)' }}>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 600, opacity: 0.85, letterSpacing: 0.5 }}>KHO AI AGENT</div>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginTop: 2 }}>Công Ty TNHH Trà Dược Việt Nam</div>
        </div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>
          <span style={{ color: G_DARK, fontWeight: 700 }}>{totalAgents}</span> agents sẵn sàng
        </div>
      </div>

      {/* Dept sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {deptKeys.map(deptKey => {
          const dept = DEPARTMENTS[deptKey];
          const deptAllowed = allowedAgents.filter(a => a.department === deptKey);
          return (
            <div key={deptKey}>
              {/* Dept header */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: G_DARK, borderRadius: 10,
                padding: '10px 20px', marginBottom: 14,
                boxShadow: '0 2px 10px rgba(27,67,50,0.18)',
              }}>
                <span style={{ color: '#fff' }}><Icon name={dept.icon} size={16} /></span>
                <div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{dept.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 1 }}>{deptAllowed.length} AI agents</div>
                </div>
              </div>

              {/* Agent boxes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {allowedAgents.filter(a => a.department === deptKey).map(agent => (
                  <AgentBox key={agent.id} agent={agent} dept={dept} onSelect={onSelectAgent} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentBox({ agent, dept, onSelect }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onSelect(agent, dept)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 172, textAlign: 'left', cursor: 'pointer',
        background: hov ? G_DARK : '#fff',
        border: `1.5px solid ${hov ? G_DARK : '#e2e8e5'}`,
        borderRadius: 10, padding: '14px 14px 12px',
        boxShadow: hov ? '0 6px 20px rgba(27,67,50,0.22)' : '0 1px 5px rgba(0,0,0,0.06)',
        transform: hov ? 'translateY(-3px)' : 'none',
        transition: 'all .15s ease',
      }}>
      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, marginBottom: 10,
        background: hov ? 'rgba(255,255,255,0.15)' : `${G_DARK}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: hov ? '#fff' : G_DARK }}>
          <Icon name={agent.icon} size={15} />
        </span>
      </div>
      {/* Name */}
      <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.35, color: hov ? '#fff' : G_DARK, marginBottom: 6 }}>
        {agent.name}
      </div>
      {/* Desc */}
      <div style={{ fontSize: 10, lineHeight: 1.5, color: hov ? 'rgba(255,255,255,0.7)' : '#6b7280', marginBottom: 8 }}>
        {agent.desc}
      </div>
      {/* Badge */}
      {agent.type === 'slides' && (
        <div style={{
          display: 'inline-block', fontSize: 9, fontWeight: 600,
          padding: '2px 7px', borderRadius: 20,
          background: hov ? 'rgba(255,255,255,0.2)' : '#EDE9FF',
          color: hov ? '#fff' : '#6941F6',
          border: `1px solid ${hov ? 'rgba(255,255,255,0.3)' : '#d4caff'}`,
        }}>Slides</div>
      )}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HubPage() {
  const [user, setUser] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPositionDept, setSelectedPositionDept] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (d.user) setUser(d.user); else router.push('/login');
    }).catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim()) setSearchResults(searchAgents(searchQuery));
    else setSearchResults([]);
  }, [searchQuery]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const onSelectPosition = useCallback((pos, dept) => {
    setSelectedPosition(pos);
    setSelectedPositionDept(dept);
    setSearchQuery('');
  }, []);

  const onSelectAgent = useCallback((agent, dept) => {
    setSelectedAgent(agent);
    setSelectedDept(dept);
    setSelectedPosition(null);
  }, []);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0F4F2' }}>
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: '#c4d9d0', borderTopColor: G_DARK }} />
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#F0F4F2' }}>

      {/* TOP BAR — green theme */}
      <header className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ background: G_DARK, borderBottom: `1px solid ${G_STRIP}`, boxShadow: '0 2px 12px rgba(27,67,50,0.2)' }}>
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: R_TITLE, boxShadow: '0 2px 8px rgba(196,18,48,0.4)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 0 4h-2v2a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-4 0v-2H8a2 2 0 0 1-2-2v-2H4a2 2 0 0 1 0-4h2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-white">AI Agent Hub</span>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Sơ Đồ Tổ Chức</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs mx-6">
          <svg className="absolute left-3 top-2.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'rgba(255,255,255,0.4)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Tìm agent..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs focus:outline-none transition"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }} />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto"
              style={{ background: '#fff', border: `1.5px solid ${G_BORDER}30` }}>
              {searchResults.map(agent => {
                const dept = DEPARTMENTS[agent.department];
                return (
                  <button key={agent.id} onClick={() => onSelectAgent(agent, dept)}
                    className="w-full text-left px-4 py-3 transition flex items-center gap-3"
                    style={{ borderBottom: '1px solid #f0f4f2' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f4f2'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: G_DARK }}>
                      <span style={{ color: '#fff' }}><Icon name={dept?.icon || 'chess'} size={11} /></span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: G_DARK }}>{agent.name}</div>
                      <div className="text-[10px]" style={{ color: G_BORDER }}>{dept?.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white">{user.name}</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.role === 'admin' ? 'Administrator' : user.department}</div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: R_TITLE, color: '#fff' }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          {user.role === 'admin' && (
            <button onClick={() => router.push('/admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Quản lý tài khoản
            </button>
          )}
          <button onClick={handleLogout} className="p-2 rounded-lg transition" style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      {/* AGENT GRID */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <OrgChart user={user} onSelectAgent={onSelectAgent} />
        </div>
      </div>

      {/* Agent form panel */}
      {selectedAgent && (
        <AgentPanel agent={selectedAgent} dept={selectedDept} user={user}
          onClose={() => { setSelectedAgent(null); setSelectedDept(null); }} />
      )}
    </div>
  );
}
