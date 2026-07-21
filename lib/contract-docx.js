import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, BorderStyle, UnderlineType, convertInchesToTwip,
} from 'docx';

const FONT      = 'Times New Roman';
const SZ        = 26;   // 13pt (half-points)
const SZ_SM     = 24;   // 12pt
const SZ_TITLE  = 32;   // 16pt
const COMPANY   = 'CÔNG TY TNHH THƯƠNG MẠI & TRÀ DƯỢC VIỆT NAM';
const ADDR      = '............................................................................';
const DIRECTOR  = '............................................................................';

const run = (text, o = {}) => new TextRun({
  text, font: FONT, size: o.sz || SZ,
  bold: !!o.bold, italics: !!o.italic,
  underline: o.underline ? { type: UnderlineType.SINGLE } : undefined,
});

const p = (children, o = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  alignment: o.align || AlignmentType.LEFT,
  spacing: { before: o.before || 0, after: o.after || 60, line: o.line || 324 },
  indent: o.indent ? { left: convertInchesToTwip(o.indent) } : undefined,
});

const blank = () => p(run('', { sz: SZ }), { after: 40 });

const heading = (text) => new Paragraph({
  children: [run(text, { bold: true })],
  alignment: AlignmentType.LEFT,
  spacing: { before: 180, after: 60, line: 324 },
});

const clause = (text, indent = 0.3) => new Paragraph({
  children: [run(text)],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { before: 30, after: 30, line: 324 },
  indent: indent ? { left: convertInchesToTwip(indent) } : undefined,
});

const NONE_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorder = { top: NONE_BORDER, bottom: NONE_BORDER, left: NONE_BORDER, right: NONE_BORDER };

export async function buildContractDocx({ cccd = {}, contract = {}, duties = [] }) {
  const {
    ho_ten = '', ngay_sinh = '', gioi_tinh = '', que_quan = '',
    noi_thuong_tru = '', so_cccd = '', ngay_cap = '', noi_cap = '',
  } = cccd;
  const { position = '', department = '', salary = '', contractType = '', startDate = '', endDate = '' } = contract;

  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const [dd, mm, yyyy] = today.split('/');

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: SZ } } } },
    sections: [{
      properties: {
        page: {
          margin: {
            top:    convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left:   convertInchesToTwip(1.3),
            right:  convertInchesToTwip(1),
          },
        },
      },
      children: [
        // ── Quốc hiệu ────────────────────────────────────────────────────────
        p(run('CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM', { bold: true }), { align: AlignmentType.CENTER, after: 20 }),
        p(run('Độc lập – Tự do – Hạnh phúc', { bold: true, underline: true }), { align: AlignmentType.CENTER, after: 20 }),
        p(run('———————', { sz: SZ_SM }), { align: AlignmentType.CENTER, after: 60 }),

        // ── Tiêu đề HĐ ───────────────────────────────────────────────────────
        new Paragraph({ children: [run('HỢP ĐỒNG LAO ĐỘNG', { bold: true, sz: SZ_TITLE })], alignment: AlignmentType.CENTER, spacing: { before: 80, after: 30, line: 324 } }),
        p(run(`Loại hợp đồng: ${contractType}`, { italic: true, sz: SZ_SM }), { align: AlignmentType.CENTER, after: 20 }),
        p(run(`Số:........./HĐLĐ-${yyyy}`, { sz: SZ_SM }), { align: AlignmentType.CENTER, after: 80 }),
        p(run(`Hôm nay, ngày ${dd} tháng ${mm} năm ${yyyy}`, { italic: true }), { align: AlignmentType.CENTER, after: 80 }),

        // ── Bên A ────────────────────────────────────────────────────────────
        heading('BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG'),
        clause(`- Tên doanh nghiệp: ${COMPANY}`),
        clause(`- Địa chỉ trụ sở  : ${ADDR}`),
        clause(`- Mã số thuế       : ........................................`),
        clause(`- Điện thoại       : ........................................`),
        clause(`- Đại diện bởi     : ${DIRECTOR}`),
        clause(`- Chức vụ          : Giám Đốc                              `),
        clause(`  (Sau đây gọi là Bên A)`, 0.5),

        blank(),

        // ── Bên B ────────────────────────────────────────────────────────────
        heading('BÊN B: NGƯỜI LAO ĐỘNG'),
        clause(`- Họ và tên    : ${ho_ten || '................................................................'}`),
        clause(`- Ngày sinh    : ${ngay_sinh || '.............'} ${gioi_tinh ? `  Giới tính: ${gioi_tinh}` : ''}`),
        clause(`- Quê quán     : ${que_quan || '................................................................'}`),
        clause(`- Nơi thường trú: ${noi_thuong_tru || '............................................................'}`),
        clause(`- Số CCCD/CMND : ${so_cccd || '.........................'}   Ngày cấp: ${ngay_cap || '.............'}`),
        clause(`- Nơi cấp      : ${noi_cap || '................................................................'}`),
        clause(`  (Sau đây gọi là Bên B)`, 0.5),

        blank(),
        p(run('Hai bên thỏa thuận ký kết hợp đồng lao động với các điều khoản sau:', { italic: true }), { align: AlignmentType.JUSTIFIED }),
        blank(),

        // ── Điều 1 ───────────────────────────────────────────────────────────
        heading('Điều 1. CÔNG VIỆC VÀ ĐỊA ĐIỂM LÀM VIỆC'),
        clause(`1.1. Chức danh / Vị trí: ${position}`),
        clause(`1.2. Phòng ban trực thuộc: ${department}`),
        clause('1.3. Địa điểm làm việc: Tại trụ sở Công ty và các địa điểm do Công ty phân công.'),
        clause('1.4. Nhiệm vụ chính:'),
        ...duties.map((d, i) => clause(`      ${i + 1}. ${d}`, 0.5)),

        blank(),

        // ── Điều 2 ───────────────────────────────────────────────────────────
        heading('Điều 2. THỜI HẠN HỢP ĐỒNG'),
        clause(`2.1. Loại hợp đồng: ${contractType}`),
        clause(`2.2. Ngày bắt đầu làm việc: ${startDate}`),
        ...(endDate ? [clause(`2.3. Ngày kết thúc hợp đồng: ${endDate}`)] : [
          clause('2.3. Hợp đồng không xác định thời hạn, có hiệu lực cho đến khi một trong hai bên chấm dứt theo quy định pháp luật.'),
        ]),

        blank(),

        // ── Điều 3 ───────────────────────────────────────────────────────────
        heading('Điều 3. LƯƠNG, PHỤ CẤP VÀ PHÚC LỢI'),
        clause(`3.1. Mức lương cơ bản: ${salary} VNĐ/tháng`),
        clause('      (Bằng chữ: ......................................................................................)', 0.5),
        clause('3.2. Phụ cấp chức vụ, đi lại, ăn trưa và các khoản khác: Theo quy chế lương thưởng Công ty.'),
        clause('3.3. Hình thức thanh toán: Chuyển khoản ngân hàng vào ngày 05 hàng tháng.'),
        clause('3.4. Lương làm thêm giờ / ca đêm: Theo quy định của Bộ Luật Lao Động 2019.'),

        blank(),

        // ── Điều 4 ───────────────────────────────────────────────────────────
        heading('Điều 4. THỜI GIỜ LÀM VIỆC VÀ NGHỈ NGƠI'),
        clause('4.1. Giờ làm việc: 08 giờ/ngày, 05 ngày/tuần (Thứ Hai đến Thứ Sáu).'),
        clause('4.2. Ca làm việc: Sáng 08:00 – 12:00  |  Chiều 13:30 – 17:30.'),
        clause('4.3. Nghỉ lễ, Tết: Theo quy định của Nhà nước.'),
        clause('4.4. Nghỉ phép năm: 12 ngày/năm (sau khi ký hợp đồng chính thức, theo Điều 113 BLLĐ).'),

        blank(),

        // ── Điều 5 ───────────────────────────────────────────────────────────
        heading('Điều 5. BẢO HIỂM XÃ HỘI, BẢO HIỂM Y TẾ, BẢO HIỂM THẤT NGHIỆP'),
        clause('5.1. Bên B được tham gia BHXH, BHYT, BHTN theo quy định pháp luật hiện hành.'),
        clause('5.2. Tỷ lệ đóng góp: Bên A chịu 21,5% / Bên B chịu 10,5% trên mức lương đóng bảo hiểm.'),
        clause('5.3. Cơ quan tham gia: Bảo hiểm Xã hội theo địa phương đăng ký.'),

        blank(),

        // ── Điều 6 ───────────────────────────────────────────────────────────
        heading('Điều 6. TRANG THIẾT BỊ VÀ BẢO HỘ LAO ĐỘNG'),
        clause('6.1. Bên A cung cấp đầy đủ phương tiện, thiết bị cần thiết để Bên B thực hiện công việc.'),
        clause('6.2. Bên B có trách nhiệm bảo quản, sử dụng đúng mục đích tài sản Công ty giao.'),
        clause('6.3. Bàn giao, nghiệm thu tài sản theo biên bản riêng khi bắt đầu và khi chấm dứt hợp đồng.'),

        blank(),

        // ── Điều 7 ───────────────────────────────────────────────────────────
        heading('Điều 7. CAM KẾT BẢO MẬT THÔNG TIN'),
        clause('7.1. Bên B cam kết bảo mật toàn bộ thông tin kinh doanh, kỹ thuật, tài chính và nhân sự của Công ty trong suốt thời gian làm việc và sau khi chấm dứt hợp đồng.'),
        clause('7.2. Mọi vi phạm điều khoản bảo mật, Bên B phải chịu trách nhiệm bồi thường thiệt hại theo quy định pháp luật.'),

        blank(),

        // ── Điều 8 ───────────────────────────────────────────────────────────
        heading('Điều 8. QUYỀN VÀ NGHĨA VỤ CÁC BÊN'),
        clause('8.1. Bên A đảm bảo điều kiện làm việc, trả lương đúng hạn, thực hiện đầy đủ chế độ bảo hiểm và các quyền lợi khác theo pháp luật.'),
        clause('8.2. Bên B thực hiện đúng chức trách được giao, chấp hành nội quy Công ty, tham gia đào tạo theo yêu cầu.'),
        clause('8.3. Mỗi bên có quyền chấm dứt hợp đồng theo quy định của Bộ Luật Lao Động 2019 với thời gian báo trước theo quy định.'),

        blank(),

        // ── Điều 9 ───────────────────────────────────────────────────────────
        heading('Điều 9. ĐIỀU KHOẢN CHUNG'),
        clause('9.1. Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi, bổ sung phải lập thành phụ lục có chữ ký của cả hai bên.'),
        clause('9.2. Hợp đồng lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản.'),
        clause('9.3. Các tranh chấp được giải quyết trước tiên bằng thương lượng; nếu không thành sẽ đưa ra Tòa án có thẩm quyền tại Việt Nam.'),
        clause('9.4. Các vấn đề không được quy định trong hợp đồng này thực hiện theo quy định của Bộ Luật Lao Động 2019 và pháp luật liên quan.'),

        blank(),
        blank(),

        // ── Chữ ký ───────────────────────────────────────────────────────────
        p(run(`........., ngày ${dd} tháng ${mm} năm ${yyyy}`, { italic: true, sz: SZ_SM }), { align: AlignmentType.RIGHT, after: 40 }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: NONE_BORDER, bottom: NONE_BORDER, left: NONE_BORDER, right: NONE_BORDER, insideH: NONE_BORDER, insideV: NONE_BORDER },
          rows: [
            new TableRow({ children: [
              new TableCell({
                borders: noBorder,
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [run('ĐẠI DIỆN BÊN A', { bold: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [run('NGƯỜI SỬ DỤNG LAO ĐỘNG', { bold: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [run('(Ký, đóng dấu, ghi rõ họ tên)', { italic: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [run('', { sz: SZ_SM })], spacing: { before: 900 } }),
                  new Paragraph({ children: [run(DIRECTOR.trim() || '....................................', { bold: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                ],
              }),
              new TableCell({
                borders: noBorder,
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [run('BÊN B', { bold: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [run('NGƯỜI LAO ĐỘNG', { bold: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [run('(Ký, ghi rõ họ tên)', { italic: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                  new Paragraph({ children: [run('', { sz: SZ_SM })], spacing: { before: 900 } }),
                  new Paragraph({ children: [run(ho_ten || '....................................', { bold: true, sz: SZ_SM })], alignment: AlignmentType.CENTER }),
                ],
              }),
            ]}),
          ],
        }),
      ],
    }],
  });

  return Packer.toBuffer(doc);
}
