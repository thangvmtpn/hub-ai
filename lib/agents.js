// ═══════════════════════════════════════════════════
// AI AGENT HUB — Kho Agent theo Phòng Ban
// Doanh nghiệp: Thương mại điện tử + Trà Dược Việt Nam
// ═══════════════════════════════════════════════════

// Sơ đồ tổ chức: vị trí → phòng ban
export const ORG_CHART = [
  {
    dept: 'Ban Giám Đốc', deptKey: 'board',
    positions: [
      'Giám Đốc Điều Hành (CEO)',
      'Phó Giám Đốc',
      'Trợ Lý Giám Đốc',
    ],
  },
  {
    dept: 'Phòng Hành Chính & Nhân Sự', deptKey: 'hr',
    positions: [
      'Trưởng Phòng Nhân Sự',
      'Chuyên Viên Tuyển Dụng',
      'Chuyên Viên Đào Tạo & Phát Triển',
      'Chuyên Viên C&B (Lương Thưởng)',
      'Nhân Viên Hành Chính',
      'Nhân Viên Lễ Tân',
    ],
  },
  {
    dept: 'Phòng Tài Chính & Kế Toán', deptKey: 'finance',
    positions: [
      'Kế Toán Trưởng',
      'Kế Toán Tổng Hợp',
      'Kế Toán Công Nợ',
      'Kế Toán Thuế',
      'Thủ Quỹ',
    ],
  },
  {
    dept: 'Phòng Kinh Doanh & Phát Triển Thị Trường', deptKey: 'business',
    positions: [
      'Trưởng Phòng Kinh Doanh',
      'Chuyên Viên Kinh Doanh TMĐT',
      'Chuyên Viên Marketing & Content',
      'Chuyên Viên Phát Triển Thị Trường',
      'Nhân Viên Chăm Sóc Khách Hàng',
      'Nhân Viên Bán Hàng',
    ],
  },
  {
    dept: 'Phòng Sản Xuất', deptKey: 'production',
    positions: [
      'Trưởng Phòng Sản Xuất',
      'Tổ Trưởng Sản Xuất',
      'Kỹ Thuật Viên',
      'Nhân Viên Kiểm Soát Chất Lượng (QC)',
      'Công Nhân Sản Xuất',
      'Nhân Viên Kho & Logistics',
    ],
  },
];

// Tra cứu nhanh vị trí → phòng ban
export const POSITION_TO_DEPT = {};
for (const group of ORG_CHART) {
  for (const pos of group.positions) {
    POSITION_TO_DEPT[pos] = group.dept;
  }
}

export const DEPARTMENTS = {
  board: {
    key: 'board', label: 'Ban Giám Đốc',
    shortLabel: 'BGĐ', code: 'BGĐ',
    icon: 'chess', color: '#1B4332',
    desc: 'Chiến lược & điều hành doanh nghiệp',
  },
  hr: {
    key: 'hr', label: 'Phòng Nhân Sự & Đào Tạo',
    shortLabel: 'Nhân Sự', code: 'CHRO',
    icon: 'users', color: '#1B4332',
    desc: 'Tuyển dụng, đào tạo & phát triển nhân sự',
  },
  finance: {
    key: 'finance', label: 'Phòng Tài Chính & Kế Toán',
    shortLabel: 'Tài Chính', code: 'CFO',
    icon: 'calculator', color: '#1B4332',
    desc: 'Kế toán, thuế & quản lý tài chính',
  },
  business: {
    key: 'business', label: 'Phòng Kinh Doanh & PTTT',
    shortLabel: 'Kinh Doanh', code: 'CCO',
    icon: 'chart-arrows-vertical', color: '#1B4332',
    desc: 'Bán hàng TMĐT, marketing & phát triển thị trường',
  },
  production: {
    key: 'production', label: 'Phòng Sản Xuất',
    shortLabel: 'Sản Xuất', code: 'CPO',
    icon: 'factory', color: '#1B4332',
    desc: 'Quản lý sản xuất, quy trình & kiểm soát chất lượng',
  },
};

// ─── Kho Agent ───────────────────────────────────────────────────────────────
export const AGENTS = [

  // ══ BAN GIÁM ĐỐC ══════════════════════════════════════════════════════════

  {
    id: 'bgd_strategy', department: 'board',
    name: 'Phân Tích Chiến Lược', icon: 'trending',
    desc: 'SWOT, phân tích thị trường, cơ hội & rủi ro chiến lược',
    type: 'chat',
    fields: [
      { key: 'subject', label: 'Chủ đề phân tích', type: 'text', placeholder: 'VD: Mở rộng sang thị trường miền Nam', required: true },
      { key: 'context', label: 'Bối cảnh hiện tại', type: 'textarea', placeholder: 'Tình hình công ty, thị trường, đối thủ...' },
      { key: 'goal', label: 'Mục tiêu', type: 'select', options: ['Ra quyết định đầu tư', 'Lập chiến lược mới', 'Đánh giá rủi ro', 'Tái định vị thương hiệu'] },
    ],
  },
  {
    id: 'bgd_okr', department: 'board',
    name: 'Lập Kế Hoạch OKR', icon: 'check-badge',
    desc: 'Xây dựng mục tiêu OKR theo quý/năm cho toàn công ty hoặc từng phòng ban',
    type: 'chat',
    fields: [
      { key: 'dept', label: 'Phòng ban / cấp độ', type: 'text', placeholder: 'VD: Toàn công ty, Phòng Kinh Doanh', required: true },
      { key: 'period', label: 'Kỳ kế hoạch', type: 'select', options: ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4', 'Cả năm'] },
      { key: 'direction', label: 'Định hướng chiến lược', type: 'textarea', placeholder: 'Ưu tiên tăng trưởng, tối ưu chi phí, mở rộng thị trường...', required: true },
    ],
  },
  {
    id: 'bgd_decision', department: 'board',
    name: 'Hỗ Trợ Ra Quyết Định', icon: 'briefcase',
    desc: 'So sánh phương án, phân tích pros/cons, gợi ý quyết định tối ưu',
    type: 'chat',
    fields: [
      { key: 'decision', label: 'Quyết định cần đưa ra', type: 'textarea', required: true, placeholder: 'Mô tả vấn đề cần quyết định...' },
      { key: 'options', label: 'Các phương án đang xem xét', type: 'textarea', required: true, placeholder: 'Phương án A: ...\nPhương án B: ...' },
      { key: 'criteria', label: 'Tiêu chí quan trọng', type: 'textarea', placeholder: 'Chi phí, tốc độ triển khai, rủi ro, ROI...' },
      { key: 'urgency', label: 'Mức độ cấp bách', type: 'select', options: ['Có thể chờ 1–2 tuần', 'Cần trong tuần này', 'Cần ngay hôm nay'] },
    ],
  },
  {
    id: 'bgd_report', department: 'board',
    name: 'Báo Cáo Quản Trị', icon: 'invoice',
    desc: 'Tổng hợp & trình bày báo cáo KPI, hiệu suất toàn công ty cho BGĐ',
    type: 'chat',
    fields: [
      { key: 'period', label: 'Kỳ báo cáo', type: 'select', options: ['Tuần', 'Tháng', 'Quý', 'Năm'] },
      { key: 'data', label: 'Số liệu / dữ liệu thô', type: 'textarea', required: true, placeholder: 'Dán dữ liệu doanh thu, KPI, số liệu các phòng...' },
      { key: 'audience', label: 'Đối tượng đọc', type: 'select', options: ['Nội bộ BGĐ', 'Hội đồng cổ đông', 'Ngân hàng / Đối tác'] },
    ],
  },

  // ══ PHÒNG NHÂN SỰ & ĐÀO TẠO ══════════════════════════════════════════════

  {
    id: 'hr_jd', department: 'hr',
    name: 'Viết JD Tuyển Dụng', icon: 'briefcase',
    desc: 'Soạn mô tả công việc chuyên nghiệp, rõ ràng cho từng vị trí',
    type: 'chat',
    fields: [
      { key: 'position', label: 'Vị trí cần tuyển', type: 'text', required: true, placeholder: 'VD: Chuyên viên Kinh doanh TMĐT' },
      { key: 'dept', label: 'Phòng ban', type: 'text', placeholder: 'VD: Phòng Kinh Doanh' },
      { key: 'requirements', label: 'Yêu cầu chính', type: 'textarea', placeholder: 'Kinh nghiệm, kỹ năng, bằng cấp...' },
      { key: 'benefits', label: 'Quyền lợi', type: 'textarea', placeholder: 'Lương, thưởng, BHXH, phụ cấp...' },
    ],
  },
  {
    id: 'hr_cv', department: 'hr',
    name: 'Phân Tích & Sàng Lọc CV', icon: 'user-search',
    desc: 'Đánh giá CV ứng viên theo tiêu chí, xếp hạng phù hợp',
    type: 'chat',
    fields: [
      { key: 'position', label: 'Vị trí tuyển dụng', type: 'text', required: true },
      { key: 'criteria', label: 'Tiêu chí đánh giá', type: 'textarea', required: true, placeholder: 'Kinh nghiệm tối thiểu, kỹ năng bắt buộc, điểm cộng...' },
      { key: 'cv_content', label: 'Nội dung CV ứng viên', type: 'textarea', required: true, placeholder: 'Dán nội dung CV vào đây...' },
    ],
  },
  {
    id: 'hr_interview', department: 'hr',
    name: 'Bộ Câu Hỏi Phỏng Vấn', icon: 'clipboard',
    desc: 'Tạo bộ câu hỏi phỏng vấn phù hợp từng vị trí, đánh giá toàn diện ứng viên',
    type: 'chat',
    fields: [
      { key: 'position', label: 'Vị trí phỏng vấn', type: 'text', required: true },
      { key: 'level', label: 'Cấp độ', type: 'select', options: ['Fresher / Thực tập', 'Junior (1–2 năm)', 'Senior (3+ năm)', 'Trưởng nhóm / Quản lý'] },
      { key: 'focus', label: 'Trọng tâm đánh giá', type: 'textarea', placeholder: 'Kỹ năng chuyên môn, tư duy, thái độ, văn hóa...' },
    ],
  },
  {
    id: 'hr_onboarding', department: 'hr',
    name: 'Onboarding Nhân Viên Mới', icon: 'graduation',
    desc: 'Soạn tài liệu hướng dẫn, checklist & lịch onboarding cho nhân viên mới',
    type: 'chat',
    fields: [
      { key: 'position', label: 'Vị trí nhân viên mới', type: 'text', required: true },
      { key: 'dept', label: 'Phòng ban', type: 'text' },
      { key: 'start_date', label: 'Ngày bắt đầu', type: 'text', placeholder: 'VD: 01/08/2025' },
      { key: 'special_notes', label: 'Lưu ý đặc biệt', type: 'textarea', placeholder: 'Công cụ cần chuẩn bị, người hướng dẫn, quy trình riêng...' },
    ],
  },
  {
    id: 'hr_training', department: 'hr',
    name: 'Xây Dựng Nội Dung Đào Tạo', icon: 'graduation',
    desc: 'Lên chương trình, slide & tài liệu đào tạo nội bộ theo chủ đề',
    type: 'slides',
    fields: [
      { key: 'topic', label: 'Chủ đề đào tạo', type: 'text', required: true, placeholder: 'VD: Kỹ năng bán hàng TMĐT, An toàn lao động...' },
      { key: 'audience', label: 'Đối tượng học viên', type: 'text', placeholder: 'VD: Nhân viên mới, Trưởng nhóm...' },
      { key: 'duration', label: 'Thời lượng', type: 'select', options: ['30 phút', '1 tiếng', '2 tiếng', 'Nửa ngày', 'Cả ngày'] },
      { key: 'goals', label: 'Mục tiêu sau đào tạo', type: 'textarea', required: true, placeholder: 'Học viên sẽ biết/làm được gì sau buổi này?' },
    ],
  },
  {
    id: 'hr_kpi', department: 'hr',
    name: 'Đánh Giá KPI Nhân Viên', icon: 'check-badge',
    desc: 'Xây dựng bộ tiêu chí KPI & mẫu đánh giá hiệu suất theo từng vị trí',
    type: 'chat',
    fields: [
      { key: 'position', label: 'Vị trí cần đánh giá', type: 'text', required: true },
      { key: 'period', label: 'Kỳ đánh giá', type: 'select', options: ['Tháng', 'Quý', 'Năm', '6 tháng'] },
      { key: 'responsibilities', label: 'Nhiệm vụ chính của vị trí', type: 'textarea', required: true, placeholder: 'Liệt kê các nhiệm vụ chính...' },
    ],
  },
  {
    id: 'hr_policy', department: 'hr',
    name: 'Soạn Chính Sách Nội Bộ', icon: 'clipboard',
    desc: 'Soạn thảo quy chế, nội quy, quy trình làm việc nội bộ',
    type: 'chat',
    fields: [
      { key: 'policy_type', label: 'Loại chính sách', type: 'select', options: ['Nội quy công ty', 'Quy chế lương thưởng', 'Quy trình xin nghỉ phép', 'Quy định sử dụng tài sản', 'Quy trình xử lý vi phạm', 'Khác'] },
      { key: 'details', label: 'Nội dung / yêu cầu cụ thể', type: 'textarea', required: true, placeholder: 'Các điểm cần có trong chính sách...' },
    ],
  },

  {
    id: 'hr_contract', department: 'hr',
    name: 'Tạo Hợp Đồng Lao Động', icon: 'clipboard',
    desc: 'Tự động tạo HĐLĐ cho nhân sự mới từ ảnh CCCD & mô tả JD vị trí',
    type: 'contract',
    gdriveFolderId: '1c1cbzYEe7wC5xhBVrXg6xvXIItFvw6rt',
    fields: [
      { key: 'position', label: 'Vị trí tuyển dụng', type: 'org-select', required: true },
      { key: 'department', label: 'Phòng ban', type: 'dept-auto', required: true },
      { key: 'salary', label: 'Mức lương (VNĐ/tháng)', type: 'text', format: 'number', required: true, placeholder: 'VD: 12.000.000' },
      { key: 'contract_type', label: 'Loại hợp đồng', type: 'select', options: ['Thử việc (2 tháng)', 'Xác định thời hạn 1 năm', 'Xác định thời hạn 2 năm', 'Không xác định thời hạn'] },
      { key: 'start_date', label: 'Ngày bắt đầu làm việc', type: 'text', required: true, placeholder: 'VD: 01/07/2025' },
      { key: 'jd_content', label: 'Nội dung JD (từ Google Drive)', type: 'textarea', placeholder: 'Dán nội dung mô tả công việc từ Google Drive vào đây...' },
    ],
  },

  // ══ PHÒNG TÀI CHÍNH & KẾ TOÁN ════════════════════════════════════════════

  {
    id: 'fin_report', department: 'finance',
    name: 'Báo Cáo Tài Chính', icon: 'invoice',
    desc: 'Tổng hợp, phân tích & trình bày báo cáo P&L, doanh thu, chi phí',
    type: 'chat',
    fields: [
      { key: 'period', label: 'Kỳ báo cáo', type: 'select', options: ['Tháng', 'Quý', 'Năm'] },
      { key: 'data', label: 'Số liệu tài chính', type: 'textarea', required: true, placeholder: 'Dán số liệu doanh thu, chi phí, lợi nhuận...' },
      { key: 'compare', label: 'So sánh với', type: 'select', options: ['Kỳ trước', 'Cùng kỳ năm ngoái', 'Kế hoạch đề ra', 'Không so sánh'] },
    ],
  },
  {
    id: 'fin_cashflow', department: 'finance',
    name: 'Phân Tích Dòng Tiền', icon: 'trending',
    desc: 'Phân tích cashflow, dự báo thanh khoản & cảnh báo rủi ro tài chính',
    type: 'chat',
    fields: [
      { key: 'period', label: 'Giai đoạn phân tích', type: 'text', required: true, placeholder: 'VD: Tháng 7/2025 hoặc Q3/2025' },
      { key: 'inflow', label: 'Dòng tiền vào', type: 'textarea', required: true, placeholder: 'Doanh thu, thu hồi công nợ, vay...' },
      { key: 'outflow', label: 'Dòng tiền ra', type: 'textarea', required: true, placeholder: 'Chi phí vận hành, trả nợ, đầu tư...' },
    ],
  },
  {
    id: 'fin_budget', department: 'finance',
    name: 'Kế Hoạch Ngân Sách', icon: 'calculator',
    desc: 'Lập kế hoạch ngân sách theo phòng ban, dự án hoặc toàn công ty',
    type: 'chat',
    fields: [
      { key: 'scope', label: 'Phạm vi lập ngân sách', type: 'text', required: true, placeholder: 'VD: Phòng Kinh Doanh, Dự án X, Toàn công ty' },
      { key: 'period', label: 'Kỳ ngân sách', type: 'select', options: ['Tháng', 'Quý', 'Năm'] },
      { key: 'categories', label: 'Các hạng mục chi tiêu', type: 'textarea', placeholder: 'Nhân sự, Marketing, Vận hành, Đầu tư...' },
      { key: 'constraints', label: 'Giới hạn / ưu tiên', type: 'textarea', placeholder: 'Tổng ngân sách tối đa, hạng mục ưu tiên...' },
    ],
  },
  {
    id: 'fin_cost', department: 'finance',
    name: 'Phân Tích Chi Phí', icon: 'calculator',
    desc: 'Breakdown chi phí, tìm điểm tối ưu & đề xuất cắt giảm hợp lý',
    type: 'chat',
    fields: [
      { key: 'cost_data', label: 'Danh sách chi phí', type: 'textarea', required: true, placeholder: 'Dán bảng chi phí hoặc mô tả các khoản...' },
      { key: 'goal', label: 'Mục tiêu phân tích', type: 'select', options: ['Tìm điểm có thể cắt giảm', 'So sánh với ngân sách', 'Tính giá thành sản phẩm', 'Phân bổ chi phí'] },
    ],
  },
  {
    id: 'fin_contract', department: 'finance',
    name: 'Soạn Hợp Đồng Kinh Tế', icon: 'handshake',
    desc: 'Soạn thảo template hợp đồng mua bán, dịch vụ, hợp tác',
    type: 'chat',
    fields: [
      { key: 'contract_type', label: 'Loại hợp đồng', type: 'select', options: ['Hợp đồng mua bán hàng hóa', 'Hợp đồng dịch vụ', 'Hợp đồng hợp tác kinh doanh', 'Hợp đồng đại lý phân phối', 'Hợp đồng vận chuyển'] },
      { key: 'party_a', label: 'Bên A (mình)', type: 'text', placeholder: 'Tên công ty bên A' },
      { key: 'party_b', label: 'Bên B (đối tác)', type: 'text', placeholder: 'Tên công ty / cá nhân bên B' },
      { key: 'key_terms', label: 'Các điều khoản quan trọng', type: 'textarea', required: true, placeholder: 'Giá trị hợp đồng, thời hạn, điều kiện thanh toán...' },
    ],
  },
  {
    id: 'fin_tax', department: 'finance',
    name: 'Hỗ Trợ Kê Khai Thuế', icon: 'invoice',
    desc: 'Nhắc nhở kỳ hạn, tổng hợp số liệu & hướng dẫn kê khai thuế',
    type: 'chat',
    fields: [
      { key: 'tax_type', label: 'Loại thuế', type: 'select', options: ['Thuế GTGT', 'Thuế TNDN', 'Thuế TNCN', 'Thuế nhà thầu', 'Khác'] },
      { key: 'period', label: 'Kỳ kê khai', type: 'select', options: ['Tháng', 'Quý', 'Năm'] },
      { key: 'data', label: 'Số liệu liên quan', type: 'textarea', placeholder: 'Doanh thu, chi phí được khấu trừ, số thuế tạm nộp...' },
    ],
  },

  {
    id: 'fin_workflow_designer', department: 'finance',
    name: 'Thiết Kế Quy Trình', icon: 'flowchart',
    desc: 'Chuyển đổi quy trình vận hành thành sơ đồ graphic đẹp mắt với nhiều phong cách',
    type: 'workflow',
    fields: [
      { key: 'process_name', label: 'Tên quy trình', type: 'text', required: true, placeholder: 'VD: Quy trình thanh toán công nợ' },
      { key: 'steps', label: 'Các bước công việc', type: 'textarea', required: true, placeholder: 'Mô tả các bước theo thứ tự, ví dụ:\nBước 1: Kế toán lập phiếu chi\nBước 2: KT trưởng kiểm tra\n[Decision] Số tiền > 50 triệu?\n  → Yes: Gửi CFO duyệt\n  → No: KT trưởng duyệt luôn' },
      { key: 'actors', label: 'Người/Phòng ban thực hiện', type: 'textarea', placeholder: 'VD: Kế toán, Kế toán trưởng, CFO, Thủ quỹ' },
      { key: 'style', label: 'Phong cách thiết kế', type: 'select', 
        options: ['Corporate Blueprint', 'Modern Flat', 'Vietnamese Heritage', 'Creative Canvas', 'Technical Flow', 'Pastel Soft'] 
      },
    ],
  },

  // ══ PHÒNG KINH DOANH & PTTT ═══════════════════════════════════════════════

  {
    id: 'biz_qa', department: 'business',
    name: 'Hỏi Đáp Khách Hàng (Q&A)', icon: 'handshake',
    desc: 'Tra cứu câu trả lời từ kho dữ liệu nội bộ — FAQ sản phẩm, chính sách, đại lý',
    type: 'qa',
    fields: [],
  },

  {
    id: 'biz_listing', department: 'business',
    name: 'Viết Mô Tả Sản Phẩm', icon: 'package',
    desc: 'Viết content listing sản phẩm chuẩn SEO cho Shopee, Lazada, Tiki, TikTok Shop',
    type: 'chat',
    fields: [
      { key: 'product_name', label: 'Tên sản phẩm', type: 'text', required: true, placeholder: 'VD: Trà Hoa Cúc Mật Ong 100g' },
      { key: 'platform', label: 'Sàn TMĐT', type: 'select', options: ['Shopee', 'Lazada', 'Tiki', 'TikTok Shop', 'Tất cả sàn'] },
      { key: 'features', label: 'Đặc điểm nổi bật', type: 'textarea', required: true, placeholder: 'Thành phần, công dụng, xuất xứ, chứng nhận...' },
      { key: 'target', label: 'Khách hàng mục tiêu', type: 'text', placeholder: 'VD: Nữ 25–40 tuổi, người bận rộn, yêu sức khỏe' },
    ],
  },
  {
    id: 'biz_seo', department: 'business',
    name: 'Tối Ưu SEO Sàn TMĐT', icon: 'megaphone',
    desc: 'Nghiên cứu từ khóa, tối ưu tiêu đề, mô tả & tag sản phẩm trên sàn',
    type: 'chat',
    fields: [
      { key: 'product', label: 'Sản phẩm / danh mục', type: 'text', required: true },
      { key: 'platform', label: 'Sàn TMĐT', type: 'select', options: ['Shopee', 'Lazada', 'Tiki', 'TikTok Shop'] },
      { key: 'current_title', label: 'Tiêu đề hiện tại (nếu có)', type: 'text' },
      { key: 'competitors', label: 'Đối thủ cạnh tranh', type: 'textarea', placeholder: 'Tên shop / sản phẩm đối thủ đang bán tốt...' },
    ],
  },
  {
    id: 'biz_competitor', department: 'business',
    name: 'Phân Tích Đối Thủ TMĐT', icon: 'trending',
    desc: 'So sánh giá, đánh giá review, chiến lược của đối thủ trên sàn',
    type: 'chat',
    fields: [
      { key: 'product_category', label: 'Ngành hàng / danh mục', type: 'text', required: true, placeholder: 'VD: Trà thảo mộc, Thực phẩm chức năng' },
      { key: 'competitors', label: 'Đối thủ cần phân tích', type: 'textarea', required: true, placeholder: 'Tên shop, link sản phẩm hoặc mô tả...' },
      { key: 'focus', label: 'Trọng tâm phân tích', type: 'select', options: ['Giá & khuyến mãi', 'Đánh giá & review', 'Chiến lược marketing', 'Toàn diện'] },
    ],
  },
  {
    id: 'biz_livestream', department: 'business',
    name: 'Kịch Bản Livestream', icon: 'megaphone',
    desc: 'Viết script livestream bán hàng cho TikTok Live, Shopee Live',
    type: 'chat',
    fields: [
      { key: 'platform', label: 'Nền tảng', type: 'select', options: ['TikTok Live', 'Shopee Live', 'Facebook Live', 'YouTube Live'] },
      { key: 'products', label: 'Sản phẩm sẽ bán', type: 'textarea', required: true, placeholder: 'Liệt kê sản phẩm, giá, ưu đãi...' },
      { key: 'duration', label: 'Thời lượng live', type: 'select', options: ['30 phút', '1 tiếng', '2 tiếng', '3+ tiếng'] },
      { key: 'style', label: 'Phong cách', type: 'select', options: ['Chuyên nghiệp, uy tín', 'Vui vẻ, hài hước', 'Chia sẻ kiến thức', 'Flash sale dồn dập'] },
    ],
  },
  {
    id: 'biz_social', department: 'business',
    name: 'Content Mạng Xã Hội', icon: 'megaphone',
    desc: 'Viết caption, bài đăng cho Facebook, Zalo, TikTok, Instagram',
    type: 'chat',
    fields: [
      { key: 'platform', label: 'Kênh đăng', type: 'select', options: ['Facebook', 'Zalo', 'TikTok', 'Instagram', 'Tất cả'] },
      { key: 'content_type', label: 'Loại nội dung', type: 'select', options: ['Giới thiệu sản phẩm', 'Chia sẻ kiến thức', 'Minigame / Tương tác', 'Flash sale / Khuyến mãi', 'Câu chuyện thương hiệu'] },
      { key: 'product_or_topic', label: 'Sản phẩm / Chủ đề', type: 'text', required: true },
      { key: 'tone', label: 'Giọng điệu', type: 'select', options: ['Thân thiện, gần gũi', 'Chuyên nghiệp, uy tín', 'Hài hước, trẻ trung', 'Cảm xúc, truyền cảm hứng'] },
    ],
  },
  {
    id: 'biz_email', department: 'business',
    name: 'Email Marketing', icon: 'megaphone',
    desc: 'Soạn email chăm sóc khách hàng, khuyến mãi, re-engagement',
    type: 'chat',
    fields: [
      { key: 'email_type', label: 'Loại email', type: 'select', options: ['Chào mừng khách hàng mới', 'Khuyến mãi / Flash sale', 'Nhắc nhở giỏ hàng bỏ quên', 'Cảm ơn sau mua hàng', 'Tái kích hoạt khách cũ'] },
      { key: 'product_or_offer', label: 'Sản phẩm / Ưu đãi', type: 'textarea', required: true },
      { key: 'customer_segment', label: 'Phân khúc khách hàng', type: 'text', placeholder: 'VD: Khách mua lần đầu, Khách VIP, Khách chưa mua 30 ngày' },
    ],
  },
  {
    id: 'biz_review', department: 'business',
    name: 'Phân Tích Review Khách Hàng', icon: 'check-badge',
    desc: 'Tổng hợp phản hồi, tìm điểm cải thiện & phát hiện xu hướng từ review',
    type: 'chat',
    fields: [
      { key: 'product', label: 'Sản phẩm', type: 'text', required: true },
      { key: 'reviews', label: 'Nội dung review', type: 'textarea', required: true, placeholder: 'Dán các review khách hàng vào đây...' },
      { key: 'focus', label: 'Trọng tâm cần phân tích', type: 'select', options: ['Điểm mạnh cần phát huy', 'Điểm yếu cần cải thiện', 'Toàn diện cả hai'] },
    ],
  },
  {
    id: 'biz_cs', department: 'business',
    name: 'Chăm Sóc Khách Hàng', icon: 'handshake',
    desc: 'Soạn template trả lời tin nhắn, xử lý khiếu nại & hỗ trợ khách hàng',
    type: 'chat',
    fields: [
      { key: 'situation', label: 'Tình huống', type: 'select', options: ['Khách hỏi thông tin sản phẩm', 'Khách phàn nàn / khiếu nại', 'Khách yêu cầu đổi trả', 'Khách hỏi về vận chuyển', 'Khách để lại review xấu'] },
      { key: 'customer_message', label: 'Tin nhắn / phản hồi của khách', type: 'textarea', required: true },
      { key: 'tone', label: 'Cách xử lý', type: 'select', options: ['Xin lỗi & giải quyết nhanh', 'Giải thích & thuyết phục', 'Cứng rắn nhưng lịch sự'] },
    ],
  },
  {
    id: 'biz_content_creator', department: 'business',
    name: 'Tạo Content Chăm Sóc KH', icon: 'sparkles',
    desc: 'Tạo bài viết + ảnh minh họa AI để gửi khách hàng hàng ngày — podcast, dòng trạng thái, bài đăng',
    type: 'content-creator',
    fields: [
      { key: 'content_group', label: 'Nhóm Content', type: 'select', required: true,
        options: [
          'Gây Chú Ý — Hook, sự thật thú vị',
          'Tạo Cảm Xúc — Câu chuyện, ký ức',
          'Xây Niềm Tin — Nguồn gốc, chất lượng',
          'Giải Thích Logic — Kiến thức, so sánh',
          'Tạo Mong Muốn — Trải nghiệm, lifestyle',
          'Xã Hội Chứng Nhận — Review, feedback',
          'Thúc Đẩy Hành Động — CTA, ưu đãi'
        ] },
      { key: 'product_line', label: 'Dòng sản phẩm', type: 'select', required: true,
        options: [
          'Vạn Lộc Trà — Trà xanh Thái Nguyên',
          'Vạn Thọ Trà — Trà Dược',
          'Vạn Hỷ Trà — Trà Việt Nam',
          'TRABA — Bánh ăn cùng trà',
          'Vạn Thịnh Trà — Trà biếu',
          'Tất cả — Chủ đề chung về trà'
        ] },
      { key: 'content_format', label: 'Định dạng nội dung', type: 'select', required: true,
        options: [
          'Dòng trạng thái ngắn (50-100 từ)',
          'Bài đăng chi tiết (200-400 từ)',
          'Podcast script (400-800 từ)',
          'Series 3 bài liên tiếp',
          'Infographic text (bullet points)'
        ] },
      { key: 'tone', label: 'Giọng điệu', type: 'select',
        options: [
          'Thân thiện, gần gũi như bạn bè',
          'Chuyên gia chia sẻ kiến thức',
          'Cảm xúc, truyền cảm hứng',
          'Sang trọng, tinh tế',
          'Trẻ trung, năng động'
        ] },
      { key: 'image_style', label: 'Phong cách ảnh minh họa', type: 'select',
        options: [
          'Nhiếp ảnh chuyên nghiệp — đồi chè, ấm trà, không gian',
          'Watercolor nghệ thuật — tranh vẽ trà Việt truyền thống',
          'Flat illustration — infographic hiện đại',
          'Lifestyle photography — người thưởng trà, bàn trà',
          'Closeup macro — cánh trà, chén trà, búp chè'
        ] },
      { key: 'custom_topic', label: 'Ghi chú / chủ đề cụ thể (tuỳ chọn)', type: 'textarea',
        placeholder: 'VD: Viết về lợi ích polyphenol trong trà xanh, hoặc so sánh Móc Câu vs Nõn Tôm...' },
    ],
  },
  {
    id: 'biz_sales_report', department: 'business',
    name: 'Báo Cáo Kinh Doanh', icon: 'invoice',
    desc: 'Phân tích doanh thu, tăng trưởng, kênh bán & đề xuất cải thiện',
    type: 'chat',
    fields: [
      { key: 'period', label: 'Kỳ báo cáo', type: 'select', options: ['Tuần', 'Tháng', 'Quý', 'Năm'] },
      { key: 'data', label: 'Số liệu kinh doanh', type: 'textarea', required: true, placeholder: 'Doanh thu, đơn hàng, tỷ lệ chuyển đổi, kênh bán...' },
      { key: 'highlight', label: 'Điểm cần làm nổi bật', type: 'textarea', placeholder: 'Sản phẩm nổi bật, thị trường mới, vấn đề cần giải quyết...' },
    ],
  },
  {
    id: 'biz_pricing', department: 'business',
    name: 'Chiến Lược Định Giá', icon: 'trending',
    desc: 'Gợi ý chiến lược giá phù hợp thị trường, cạnh tranh & biên lợi nhuận',
    type: 'chat',
    fields: [
      { key: 'product', label: 'Sản phẩm', type: 'text', required: true },
      { key: 'cost', label: 'Giá thành sản xuất / nhập', type: 'text', placeholder: 'VD: 50,000 VND/sản phẩm' },
      { key: 'market_price', label: 'Giá thị trường hiện tại', type: 'text', placeholder: 'VD: Đối thủ bán 120,000–150,000 VND' },
      { key: 'strategy', label: 'Định hướng chiến lược', type: 'select', options: ['Giá cạnh tranh thấp hơn đối thủ', 'Giá ngang thị trường', 'Định vị cao cấp, giá premium', 'Giá theo phân khúc khách hàng'] },
    ],
  },

  // ══ PHÒNG SẢN XUẤT ════════════════════════════════════════════════════════

  {
    id: 'pro_plan', department: 'production',
    name: 'Kế Hoạch Sản Xuất', icon: 'factory',
    desc: 'Lập lịch sản xuất tối ưu theo đơn hàng, năng lực máy móc & nhân công',
    type: 'chat',
    fields: [
      { key: 'orders', label: 'Đơn hàng cần sản xuất', type: 'textarea', required: true, placeholder: 'Sản phẩm, số lượng, deadline...' },
      { key: 'capacity', label: 'Năng lực sản xuất', type: 'textarea', placeholder: 'Số ca, số công nhân, công suất máy/ngày...' },
      { key: 'constraints', label: 'Ràng buộc', type: 'textarea', placeholder: 'Thiếu nguyên liệu, máy bảo trì, ngày nghỉ...' },
    ],
  },
  {
    id: 'pro_material', department: 'production',
    name: 'Quản Lý Nguyên Vật Liệu', icon: 'package',
    desc: 'Lập BOM, kiểm soát tồn kho nguyên liệu & cảnh báo thiếu hàng',
    type: 'chat',
    fields: [
      { key: 'product', label: 'Sản phẩm', type: 'text', required: true },
      { key: 'production_qty', label: 'Số lượng cần sản xuất', type: 'text', required: true },
      { key: 'current_stock', label: 'Tồn kho nguyên liệu hiện tại', type: 'textarea', placeholder: 'Nguyên liệu A: 100kg, Nguyên liệu B: 50kg...' },
    ],
  },
  {
    id: 'pro_sop', department: 'production',
    name: 'Soạn Quy Trình SOP', icon: 'clipboard',
    desc: 'Xây dựng quy trình chuẩn (SOP) cho từng công đoạn sản xuất',
    type: 'chat',
    fields: [
      { key: 'process_name', label: 'Tên quy trình / công đoạn', type: 'text', required: true, placeholder: 'VD: Quy trình sấy khô trà, Quy trình đóng gói...' },
      { key: 'steps', label: 'Các bước thực hiện (nếu có sẵn)', type: 'textarea', placeholder: 'Mô tả sơ bộ các bước đang làm...' },
      { key: 'safety', label: 'Yêu cầu an toàn đặc biệt', type: 'textarea', placeholder: 'Bảo hộ lao động, nhiệt độ, áp suất...' },
    ],
  },
  {
    id: 'pro_qc', department: 'production',
    name: 'Kiểm Soát Chất Lượng QC', icon: 'check-badge',
    desc: 'Xây dựng checklist QC, tiêu chuẩn chất lượng sản phẩm từng công đoạn',
    type: 'chat',
    fields: [
      { key: 'product', label: 'Sản phẩm / công đoạn', type: 'text', required: true },
      { key: 'standards', label: 'Tiêu chuẩn cần đạt', type: 'textarea', required: true, placeholder: 'Độ ẩm, màu sắc, mùi vị, trọng lượng, bao bì...' },
      { key: 'defect_history', label: 'Lỗi thường gặp (nếu có)', type: 'textarea', placeholder: 'Các lỗi đã xảy ra trước đây...' },
    ],
  },
  {
    id: 'pro_defect', department: 'production',
    name: 'Phân Tích Lỗi & Cải Tiến', icon: 'trending',
    desc: 'Tìm nguyên nhân gốc rễ lỗi sản phẩm & đề xuất cải tiến quy trình',
    type: 'chat',
    fields: [
      { key: 'defect', label: 'Mô tả lỗi xảy ra', type: 'textarea', required: true, placeholder: 'Lỗi gì, xảy ra ở đâu, tần suất...' },
      { key: 'data', label: 'Dữ liệu liên quan', type: 'textarea', placeholder: 'Số lô, ngày sản xuất, điều kiện sản xuất...' },
      { key: 'method', label: 'Phương pháp phân tích', type: 'select', options: ['5 Why (5 Tại Sao)', 'Fishbone (Ishikawa)', 'FMEA', 'Phân tích tổng quan'] },
    ],
  },
  {
    id: 'pro_warehouse', department: 'production',
    name: 'Quản Lý Kho Thành Phẩm', icon: 'package',
    desc: 'Theo dõi xuất nhập tồn, lập báo cáo kho & cảnh báo hàng sắp hết',
    type: 'chat',
    fields: [
      { key: 'inventory_data', label: 'Dữ liệu tồn kho', type: 'textarea', required: true, placeholder: 'Sản phẩm, số lượng tồn, nhập trong kỳ, xuất trong kỳ...' },
      { key: 'period', label: 'Kỳ báo cáo', type: 'select', options: ['Ngày', 'Tuần', 'Tháng'] },
      { key: 'min_stock', label: 'Ngưỡng tồn kho tối thiểu', type: 'textarea', placeholder: 'Sản phẩm A tối thiểu 100 cái, sản phẩm B tối thiểu 50 cái...' },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getAgentsByDept(deptKey) {
  return AGENTS.filter(a => a.department === deptKey);
}

export function getAgentsByDepartment(deptKey) {
  return getAgentsByDept(deptKey);
}

export function searchAgents(query) {
  const q = query.toLowerCase();
  return AGENTS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    a.desc.toLowerCase().includes(q)
  );
}

// Legacy compat
export const POSITIONS = {};
export function getPositionsByDept() { return []; }
export function getAgentsByPosition() { return []; }
export function getAgentById(id) { return AGENTS.find(a => a.id === id) || null; }

export function buildPrompt(agent, formData) {
  const lines = [`Yêu cầu: ${agent.name}`, `Mô tả: ${agent.desc}`, ''];
  if (agent.fields && formData) {
    for (const field of agent.fields) {
      const val = formData[field.key];
      if (val) lines.push(`${field.label}: ${val}`);
    }
  }
  return lines.join('\n');
}
