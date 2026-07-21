// ═══════════════════════════════════════════════════
// TEA KNOWLEDGE BASE — Kho Kiến Thức Trà Toàn Diện
// Dùng cho AI Content Creator Agent
// ═══════════════════════════════════════════════════

// ─── Thông tin sản phẩm ─────────────────────────────────────────────────────
export const PRODUCTS = {
  van_loc_tra: {
    name: 'Vạn Lộc Trà',
    category: 'Trà xanh Thái Nguyên',
    tagline: 'Tinh hoa trà xanh vùng đất Thái Nguyên',
    items: [
      {
        name: 'Móc Câu',
        desc: 'Trà có cánh xoăn hình móc câu, vị đậm, hương thơm nồng. Phù hợp người ưa vị đậm, uống hằng ngày.',
        features: 'Cánh xoăn, vị chát đậm, hậu ngọt nhẹ, hương cốm',
        audience: 'Người uống trà lâu năm, ưa vị đậm'
      },
      {
        name: 'Nõn Tôm',
        desc: 'Trà được hái từ búp non nhất, cánh nhỏ cuộn tròn như tôm. Vị dịu, thơm thanh, nước xanh trong.',
        features: 'Búp non, cánh cuộn tròn, vị dịu, hương thanh, nước xanh',
        audience: 'Người mới uống trà, ưa vị nhẹ nhàng'
      },
      {
        name: 'Đinh Nõn',
        desc: 'Trà hạng cao, chỉ lấy phần búp đỉnh. Cánh nhỏ, thẳng như đinh. Hương thơm tinh tế, vị ngọt hậu.',
        features: 'Chỉ búp đỉnh, cánh thẳng nhỏ, hương tinh tế, ngọt hậu sâu',
        audience: 'Người sành trà, tiếp khách quý'
      },
      {
        name: 'Trà Đinh',
        desc: 'Phẩm trà cao cấp nhất, búp nhỏ nhất, ít sản lượng. Nước vàng ánh xanh, hương thơm lâu, ngọt hậu sâu.',
        features: 'Phẩm cấp cao nhất, sản lượng ít, nước vàng ánh, ngọt hậu sâu lâu',
        audience: 'Trà biếu, sưu tầm, dịp đặc biệt'
      }
    ]
  },
  van_tho_tra: {
    name: 'Vạn Thọ Trà',
    category: 'Trà Dược',
    tagline: 'Trà dược liệu từ nguyên liệu thiên nhiên Việt Nam',
    items: [
      {
        name: 'Trà Atiso',
        desc: 'Trà từ hoa và lá atiso Đà Lạt. Vị thanh nhẹ, hơi đắng đặc trưng, mát gan giải độc.',
        features: 'Vị thanh đắng nhẹ, mát gan, thanh lọc cơ thể, hỗ trợ tiêu hóa',
        audience: 'Người quan tâm sức khỏe, cần thanh lọc cơ thể'
      },
      {
        name: 'Trà Dây Tuyết',
        desc: 'Trà từ dây tuyết vùng cao Tây Bắc. Vị ngọt tự nhiên, dễ uống, tốt cho dạ dày.',
        features: 'Vị ngọt tự nhiên, hỗ trợ dạ dày, dễ uống, nguyên liệu quý hiếm',
        audience: 'Người có vấn đề dạ dày, muốn đồ uống thiên nhiên'
      },
      {
        name: 'Trà Mãng Cầu Xiêm',
        desc: 'Trà từ lá mãng cầu xiêm. Vị hơi chát, hương thơm đặc trưng, nhiều công dụng sức khỏe.',
        features: 'Vị chát nhẹ, hương đặc trưng, giàu dưỡng chất, hỗ trợ miễn dịch',
        audience: 'Người tìm kiếm trà dược liệu tự nhiên'
      }
    ]
  },
  van_hy_tra: {
    name: 'Vạn Hỷ Trà',
    category: 'Trà Việt Nam',
    tagline: 'Khám phá đa dạng trà Việt — từ Hồng Trà đến Bạch Trà',
    items: [
      {
        name: 'Hồng Trà',
        desc: 'Trà oxy hóa hoàn toàn, nước đỏ hổ phách, vị đậm ấm áp, hương mạch nha.',
        features: 'Oxy hóa 100%, nước đỏ hổ phách, vị đậm ấm, hương mạch nha & mật ong',
        audience: 'Người thích trà đậm, uống buổi sáng, pha sữa'
      },
      {
        name: 'Oolong',
        desc: 'Trà bán oxy hóa, cánh cuộn tròn đặc trưng. Hương hoa quả, vị cân bằng giữa xanh và đỏ.',
        features: 'Bán oxy hóa, cánh cuộn tròn, hương hoa quả, vị cân bằng, pha được nhiều nước',
        audience: 'Người yêu trà tinh tế, muốn khám phá'
      },
      {
        name: 'Bạch Trà',
        desc: 'Trà chế biến tối giản nhất, chỉ héo và sấy. Vị nhẹ nhàng, thanh tao, hương hoa trắng.',
        features: 'Chế biến tối giản, vị thanh nhẹ, hương hoa trắng, giàu antioxidant',
        audience: 'Người yêu sự tinh tế, tối giản'
      }
    ]
  },
  traba: {
    name: 'TRABA',
    category: 'Bánh ăn cùng trà',
    tagline: 'Hương vị truyền thống Việt — bạn đồng hành hoàn hảo của trà',
    items: [
      {
        name: 'Chè Lam Mật',
        desc: 'Chè Lam truyền thống vị mật ong, dẻo thơm, phủ bột nếp. Gợi nhớ hương vị tuổi thơ.',
        features: 'Dẻo thơm, vị mật ong, phủ bột nếp, truyền thống Bắc Bộ'
      },
      {
        name: 'Chè Lam Matcha',
        desc: 'Kết hợp truyền thống và hiện đại — Chè Lam phủ matcha Nhật Bản.',
        features: 'Fusion truyền thống-hiện đại, vị matcha thanh, phù hợp giới trẻ'
      },
      {
        name: 'Kẹo Lạc',
        desc: 'Kẹo lạc giòn tan, ngọt vừa phải, bùi béo của lạc rang.',
        features: 'Giòn tan, ngọt vừa, bùi béo, snack trà chiều hoàn hảo'
      },
      {
        name: 'Kẹo Vừng',
        desc: 'Kẹo vừng thơm bùi, giòn nhẹ, hương vừng rang đặc trưng.',
        features: 'Thơm bùi vừng rang, giòn nhẹ, ít ngọt'
      },
      {
        name: 'Kẹo Dồi',
        desc: 'Kẹo dồi truyền thống với mạch nha và lạc, dẻo mềm.',
        features: 'Dẻo mềm, mạch nha truyền thống, hương lạc'
      }
    ]
  },
  van_thinh_tra: {
    name: 'Vạn Thịnh Trà',
    category: 'Trà biếu',
    tagline: 'Mỗi hộp quà — một lời chúc ý nghĩa',
    items: [
      {
        name: 'Gia Thịnh',
        desc: 'Lời chúc gia đình ấm êm, hưng vượng. Phù hợp biếu gia đình.',
        features: 'Hộp quà sang trọng, ý nghĩa gia đình, trà chọn lọc'
      },
      {
        name: 'Phồn Thịnh',
        desc: 'Lời chúc cho hành trình ngày càng phát triển. Phù hợp biếu đối tác.',
        features: 'Thiết kế cao cấp, ý nghĩa phát triển, phù hợp đối tác kinh doanh'
      },
      {
        name: 'Hưng Thịnh',
        desc: 'Lời chúc thành công bền vững. Phù hợp biếu lãnh đạo, đối tác lớn.',
        features: 'Premium packaging, ý nghĩa thành công, trà hạng cao'
      },
      {
        name: 'Thịnh Vượng',
        desc: 'Lời chúc cho một tương lai viên mãn. Bộ quà cao cấp nhất.',
        features: 'Ultra premium, ý nghĩa viên mãn, sưu tầm, bộ trà đỉnh cao'
      }
    ]
  }
};

// ─── Ma trận Content Ideas (từ Google Sheets) ────────────────────────────────
export const CONTENT_MATRIX = {
  gay_chu_y: {
    label: 'GÂY CHÚ Ý',
    desc: 'Hook, sự thật thú vị, câu hỏi gây tò mò — thu hút sự chú ý khách hàng',
    general: [
      'Những sự thật thú vị ít người biết về trà',
      '5 hiểu lầm phổ biến của người Việt khi uống trà',
      'Trà càng đắt có thực sự càng ngon?',
      'Người Việt đang uống những loại trà nào?',
      'Những xu hướng thưởng trà đang được người trẻ yêu thích',
      '7 điều tưởng đúng nhưng chưa chắc đúng về trà',
      'Bạn hiểu về trà đến đâu?',
      'Những loại trà nổi tiếng của Việt Nam'
    ],
    van_loc_tra: [
      'Vì sao có tên Móc Câu, Nõn Tôm và Trà Đinh?',
      '4 phẩm trà Thái Nguyên khác nhau thế nào?',
      'Trà càng chát có phải càng ngon?',
      'Nhìn hình dáng cánh trà để phân biệt từng phẩm trà',
      'Vì sao cùng là trà Thái Nguyên nhưng giá có thể chênh lệch nhiều lần?',
      'Một búp chè có thể tạo nên những phẩm trà nào?',
      'Những điều người mới uống trà Thái Nguyên thường chưa biết',
      'Bạn phù hợp với phẩm trà nào?'
    ],
    van_tho_tra: [
      '3 dòng Trà Dược – đâu là lựa chọn phù hợp với bạn?',
      'Bạn đã từng biết đến Trà Dây Tuyết?',
      'Mãng Cầu Xiêm cũng có thể tạo nên một loại trà?',
      'Những nguyên liệu thiên nhiên quen mà lạ trong chén trà',
      'Trà Dược có thực sự khó uống như nhiều người nghĩ?',
      'Một nguyên liệu – nhiều cách thưởng thức',
      '3 loại trà cho 3 gu hương vị khác nhau',
      'Bạn thuộc "gu" Atiso, Dây Tuyết hay Mãng Cầu Xiêm?'
    ],
    van_hy_tra: [
      'Việt Nam không chỉ có trà xanh',
      'Hồng Trà có phải là trà màu hồng?',
      'Bạch Trà có thực sự màu trắng?',
      'Oolong khác trà xanh ở điểm nào?',
      '3 dòng trà – 3 phong cách thưởng thức',
      'Bạn thuộc gu Hồng Trà, Oolong hay Bạch Trà?',
      'Những điều ít người biết về các dòng trà Việt',
      'Nhìn cánh trà – đoán tên trà'
    ],
    traba: [
      'Vì sao Chè Lam thường được thưởng thức cùng trà?',
      'Khi Chè Lam truyền thống kết hợp cùng Matcha',
      'Bạn thuộc "team" Lạc hay Vừng?',
      '5 món bánh kẹo – 5 hương vị cho bàn trà',
      'Những món bánh gợi nhớ tuổi thơ người Việt',
      'Vì sao vị ngọt và vị chát lại hợp nhau?',
      'Chọn món bánh nào cho chén trà của bạn?',
      'Một khay bánh trà Việt có những gì?'
    ],
    van_thinh_tra: [
      '4 bộ trà biếu – 4 lời chúc ý nghĩa',
      'Quà đắt tiền chưa chắc là món quà phù hợp',
      'Bạn đang chọn một món quà hay chọn một lời muốn nói?',
      'Những sai lầm thường gặp khi chọn quà biếu',
      'Tặng gì cho người đã có gần như mọi thứ?',
      'Một món quà nói lên điều gì về người tặng?',
      'Chọn quà theo người nhận hay theo ngân sách?',
      'Ý nghĩa phía sau tên gọi Gia Thịnh – Phồn Thịnh – Hưng Thịnh – Thịnh Vượng'
    ]
  },
  tao_cam_xuc: {
    label: 'TẠO CẢM XÚC',
    desc: 'Câu chuyện, ký ức, kết nối cảm xúc — chạm vào trái tim người đọc',
    general: [
      'Người Việt và câu chuyện bên chén trà',
      'Ký ức về ấm trà của ông, của cha',
      'Chén trà trong mỗi nếp nhà Việt',
      'Có những cuộc gặp bắt đầu từ một lời mời trà',
      'Những ký ức tuổi thơ gắn với hương trà',
      'Câu chuyện những người giữ nghề làm trà',
      'Bình minh trên vùng chè Việt Nam',
      'Một chén trà – một khoảng bình yên'
    ],
    van_loc_tra: [
      'Chén trà sáng – một thói quen của nhiều thế hệ người Việt',
      'Nhớ ấm trà ngày nhỏ của ông',
      'Trà ngon nhất là khi được uống cùng đúng người',
      'Có những câu chuyện chỉ bắt đầu khi ấm trà được rót',
      'Mời người tri kỷ một chén trà ngon',
      'Một buổi sáng chậm bên hương trà Thái Nguyên',
      'Trà quý dành cho người mình trân quý',
      'Càng trưởng thành càng hiểu giá trị của một chén trà ngon'
    ],
    van_tho_tra: [
      'Một chén trà – một khoảng thời gian dành cho chính mình',
      'Quan tâm cha mẹ bắt đầu từ những điều nhỏ mỗi ngày',
      'Một món quà từ thiên nhiên dành cho người thân',
      'Khoảng nghỉ nhẹ nhàng giữa một ngày bận rộn',
      'Sống chậm hơn từ những thói quen nhỏ',
      'Chăm sóc bản thân qua những lựa chọn mỗi ngày',
      'Một bình trà cho những phút giây cả gia đình bên nhau',
      'Mang một chút thiên nhiên vào nhịp sống thường ngày'
    ],
    van_hy_tra: [
      'Khám phá Việt Nam qua những hương trà',
      'Mỗi vùng đất mang trong mình một hương vị riêng',
      'Một loại trà cho mỗi tâm trạng',
      'Một chiều thư thái bên hương Oolong',
      'Vẻ đẹp của sự tối giản trong một chén Bạch Trà',
      'Hồng Trà và cảm giác ấm áp của những ngày chậm rãi',
      'Một khoảng lặng dành riêng cho bản thân',
      'Chậm lại để cảm nhận từng tầng hương vị'
    ],
    traba: [
      'Hương vị tuổi thơ trong một miếng Chè Lam',
      'Khay bánh trà ngày Tết trong ký ức',
      'Bánh của bà – trà của ông',
      'Một chiều mưa, một ấm trà và một đĩa bánh',
      'Những món ngon kết nối nhiều thế hệ',
      'Hương vị truyền thống trong một diện mạo mới',
      'Một khay trà – khoảng thời gian cả gia đình ngồi lại',
      'Những món quà quê giản dị nhưng khiến người ta nhớ lâu'
    ],
    van_thinh_tra: [
      'Trao trà – gửi một lời chúc',
      'Món quà cho cha mẹ thay lời cảm ơn khó nói',
      'Cảm ơn người đã đồng hành cùng mình trên một chặng đường',
      'Món quà dành cho những mối quan hệ đáng trân trọng',
      'Gia Thịnh – lời chúc gia đình ấm êm, hưng vượng',
      'Phồn Thịnh – lời chúc cho hành trình ngày càng phát triển',
      'Hưng Thịnh – lời chúc thành công bền vững',
      'Thịnh Vượng – lời chúc cho một tương lai viên mãn'
    ]
  },
  xay_niem_tin: {
    label: 'XÂY NIỀM TIN',
    desc: 'Nguồn gốc, quy trình, chất lượng, minh bạch — xây dựng uy tín',
    general: [
      'Chia sẻ của nghệ nhân về cách nhận biết một loại trà ngon',
      'Câu chuyện về những vùng trà nổi tiếng Việt Nam',
      'Chia sẻ về nghề làm trà qua nhiều thế hệ',
      'Hành trình từ búp chè đến chén trà',
      'Kiến thức từ chuyên gia về cách thưởng trà đúng',
      'Câu chuyện gìn giữ những giống trà Việt',
      'Những tiêu chí đánh giá chất lượng trà',
      'Giải đáp những quan niệm phổ biến về trà'
    ],
    van_loc_tra: [
      'Hành trình từ vùng chè Thái Nguyên đến chén trà',
      'Tiêu chuẩn tuyển chọn nguyên liệu của từng phẩm trà',
      'Chia sẻ của người làm trà về thời điểm hái chè ngon',
      'Cận cảnh hình dáng cánh trà trước và sau khi pha',
      'Vì sao mỗi phẩm trà cần một tiêu chuẩn nguyên liệu khác nhau?',
      'Các yếu tố tạo nên chất lượng trà Thái Nguyên',
      'Cách bảo quản để giữ hương vị trà tốt hơn',
      'Chia sẻ trải nghiệm từ những khách hàng yêu trà lâu năm'
    ],
    van_tho_tra: [
      'Câu chuyện về nguồn gốc từng loại nguyên liệu',
      'Atiso, Dây Tuyết, Mãng Cầu Xiêm thực tế trông như thế nào?',
      'Hành trình từ nguyên liệu thiên nhiên đến sản phẩm trà',
      'Minh bạch thành phần của từng dòng sản phẩm',
      'Tiêu chuẩn lựa chọn nguyên liệu',
      'Chia sẻ kiến thức về từng nguyên liệu',
      'Những câu hỏi thường gặp khi lựa chọn Trà Dược',
      'Chia sẻ trải nghiệm sử dụng từ khách hàng'
    ],
    van_hy_tra: [
      'Câu chuyện nguồn gốc của Hồng Trà, Oolong và Bạch Trà',
      'Chia sẻ về cách tạo nên hương vị đặc trưng của từng dòng trà',
      'Vì sao Oolong có hình dáng đặc biệt?',
      'Vì sao Bạch Trà được chế biến theo hướng tối giản?',
      'Cận cảnh sự thay đổi của cánh trà khi pha',
      'Những yếu tố tạo nên hương thơm của trà',
      'Chia sẻ của người làm trà về cách thưởng thức từng dòng',
      'Trải nghiệm của những người yêu trà'
    ],
    traba: [
      'Câu chuyện về nguyên liệu tạo nên từng loại bánh',
      'Chè Lam được làm từ những nguyên liệu nào?',
      'Chia sẻ về cách tạo nên độ dẻo, thơm của Chè Lam',
      'Điều gì tạo nên độ giòn của Kẹo Lạc và Kẹo Vừng?',
      'Câu chuyện phía sau những món bánh truyền thống',
      'Thành phần và đặc điểm từng loại sản phẩm',
      'Cách đóng gói để giữ hương vị sản phẩm',
      'Chia sẻ trải nghiệm của khách hàng'
    ],
    van_thinh_tra: [
      'Bên trong mỗi bộ trà biếu có gì?',
      'Giá trị của trà bên trong một hộp quà',
      'Câu chuyện ý tưởng thiết kế từng bộ quà',
      'Ý nghĩa của từng tên gọi bộ quà',
      'Những chi tiết tạo nên một hộp quà chỉn chu',
      'Các tiêu chí lựa chọn trà cho dòng quà biếu',
      'Câu chuyện những doanh nghiệp lựa chọn trà Việt làm quà tặng',
      'Chính sách và tiêu chuẩn phục vụ đơn hàng quà tặng'
    ]
  },
  giai_thich_logic: {
    label: 'GIẢI THÍCH LOGIC',
    desc: 'Kiến thức, so sánh, hướng dẫn chi tiết — cung cấp giá trị chuyên môn',
    general: [
      'Trà 101 – những kiến thức cơ bản cho người mới',
      'Các nhóm trà được phân biệt như thế nào?',
      'Vì sao trà có vị chát?',
      'Nhiệt độ nước ảnh hưởng đến hương vị trà ra sao?',
      'Vì sao cùng một loại trà nhưng mỗi người pha một vị?',
      'Cách bảo quản trà đúng cách',
      'Từ điển những thuật ngữ phổ biến về trà',
      'Các yếu tố quyết định chất lượng một chén trà'
    ],
    van_loc_tra: [
      'Móc Câu – Nõn Tôm – Đinh Nõn – Trà Đinh khác nhau ở đâu?',
      'Vì sao giá của 4 phẩm trà khác nhau?',
      'Cách chọn phẩm trà theo khẩu vị',
      'Nhiệt độ và thời gian pha phù hợp',
      'Một gói trà có thể pha được khoảng bao nhiêu ấm?',
      'Vì sao mỗi lần pha trà lại có hương vị khác nhau?',
      'Cách bảo quản trà sau khi mở hộp',
      'Chọn trà uống hằng ngày, tiếp khách hay biếu tặng'
    ],
    van_tho_tra: [
      'Atiso – Dây Tuyết – Mãng Cầu Xiêm khác nhau thế nào?',
      'Hương vị đặc trưng của từng loại',
      'Cách pha nóng và pha lạnh',
      'Cách chọn trà dựa trên sở thích hương vị',
      'Gợi ý thời điểm thưởng thức từng dòng trà',
      'Cách kết hợp trà vào thói quen đồ uống hằng ngày',
      'Một gói trà có thể sử dụng trong bao lâu?',
      'Hướng dẫn bảo quản đúng cách'
    ],
    van_hy_tra: [
      'Hồng Trà – Oolong – Bạch Trà khác nhau thế nào?',
      'Quá trình oxy hóa ảnh hưởng đến trà ra sao?',
      'Vì sao Oolong thường có hình dáng cuộn tròn?',
      'Điều gì tạo nên hương vị nhẹ nhàng của Bạch Trà?',
      'Cách pha phù hợp với từng dòng',
      'Người mới uống trà nên bắt đầu với loại nào?',
      'Pha nóng và Cold Brew tạo ra khác biệt gì?',
      'Cách chọn trà theo gu hương vị'
    ],
    traba: [
      'Vì sao vị ngọt của bánh lại hợp với vị chát của trà?',
      'Loại bánh nào phù hợp với từng dòng trà?',
      'Chè Lam Mật và Chè Lam Matcha khác nhau thế nào?',
      'Kẹo Lạc – Kẹo Vừng – Kẹo Dồi khác nhau ở đâu?',
      'Cách bảo quản từng loại bánh',
      'Cách kết hợp một khay trà và bánh hài hòa',
      'Gợi ý định lượng bánh cho từng số lượng khách',
      'Bản đồ kết hợp trà và bánh'
    ],
    van_thinh_tra: [
      'Gia Thịnh – Phồn Thịnh – Hưng Thịnh – Thịnh Vượng khác nhau thế nào?',
      'Chọn bộ quà dựa trên đối tượng người nhận',
      'Chọn quà phù hợp với từng dịp',
      'Gợi ý quà theo từng mức ngân sách',
      'Quà cá nhân và quà doanh nghiệp khác nhau thế nào?',
      'Giá trị khác biệt của từng bộ quà',
      'Cách lựa chọn trà biếu cho người yêu trà',
      'Các lựa chọn cá nhân hóa cho doanh nghiệp'
    ]
  },
  tao_mong_muon: {
    label: 'TẠO MONG MUỐN',
    desc: 'Trải nghiệm, bộ sưu tập, lifestyle — khơi gợi khao khát sở hữu',
    general: [
      'Xây dựng một góc thưởng trà của riêng bạn',
      'Hành trình khám phá bản đồ trà Việt Nam',
      'Bộ sưu tập những phong cách thưởng trà đẹp',
      'Những không gian lý tưởng để thưởng trà',
      '7 ngày khám phá 7 hương vị trà',
      'Nghệ thuật tạo nên một bàn trà đẹp',
      'Tìm kiếm "gu trà" của riêng mình',
      'Biến việc uống trà thành một phong cách sống'
    ],
    van_loc_tra: [
      'Trải nghiệm 4 cấp độ trà Thái Nguyên',
      'Nâng cấp chén trà uống hằng ngày',
      'Một ấm trà ngon cho những vị khách quý',
      'Xây dựng góc thưởng trà tại nhà',
      'Trải nghiệm Trà Đinh để cảm nhận sự khác biệt',
      'Bộ sưu tập 4 phẩm trà dành cho người yêu trà',
      'Một buổi chiều cuối tuần dành riêng cho việc thưởng trà',
      'Chọn một phẩm trà đại diện cho gu của riêng bạn'
    ],
    van_tho_tra: [
      'Xây dựng thói quen thưởng trà mỗi ngày',
      'Một bình trà dành cho ngày làm việc bận rộn',
      'Bộ trà để cả gia đình cùng khám phá',
      'Làm phong phú lựa chọn đồ uống hằng ngày',
      'Mỗi tuần khám phá một hương vị mới',
      'Những cách thưởng thức trà nóng và lạnh đẹp mắt',
      'Tạo một khoảng thời gian chăm sóc bản thân mỗi ngày',
      'Bộ 3 hương vị cho 3 thời điểm khác nhau'
    ],
    van_hy_tra: [
      'Bộ sưu tập khám phá 3 dòng trà Việt',
      'Tạo một buổi Tea Tasting ngay tại nhà',
      'Một bình Oolong Cold Brew cho ngày hè',
      'Hồng Trà cho một buổi chiều thư thái',
      'Bạch Trà cho những người yêu sự tinh tế',
      'Chọn trà theo từng thời điểm trong ngày',
      'Xây dựng bộ sưu tập trà của riêng bạn',
      'Khám phá đâu là hương vị phù hợp nhất với mình'
    ],
    traba: [
      'Một set trà chiều hoàn chỉnh tại nhà',
      'Khay Tea Break cho văn phòng',
      'Một khay bánh đẹp dành cho khách quý',
      'Bộ sưu tập 5 hương vị bánh truyền thống',
      'Tạo góc thưởng trà và bánh tại nhà',
      'Một món quà nhỏ mang hương vị Việt',
      'Bộ bánh gợi nhớ những hương vị tuổi thơ',
      'Gợi ý 5 cách kết hợp trà và bánh'
    ],
    van_thinh_tra: [
      'Khoảnh khắc trao một món quà xứng đáng',
      'Một món quà sang trọng nhưng vẫn mang bản sắc Việt',
      'Cá nhân hóa lời chúc dành riêng cho người nhận',
      'Hộp quà mang dấu ấn riêng của doanh nghiệp',
      'Chọn món quà xứng đáng cho một mối quan hệ quan trọng',
      'Nghệ thuật tạo nên một khoảnh khắc trao quà đáng nhớ',
      'Bộ trà biếu cho không gian tiếp khách sang trọng',
      'Một món quà đẹp từ hình thức đến ý nghĩa'
    ]
  },
  xa_hoi_chung_nhan: {
    label: 'XÃ HỘI CHỨNG NHẬN',
    desc: 'Review, feedback, cộng đồng — chứng minh bằng thực tế',
    general: [
      'Chia sẻ của người yêu trà về thói quen thưởng trà',
      'Những dòng trà được cộng đồng yêu thích',
      'Góc nhìn của nghệ nhân về trà ngon',
      'Chia sẻ kiến thức từ chuyên gia',
      'Những câu chuyện thật của người làm trà',
      'Top hương vị được người yêu trà lựa chọn',
      'Gu thưởng trà của người Việt hiện nay',
      'Những hình ảnh đẹp từ cộng đồng yêu trà'
    ],
    van_loc_tra: [
      'Chia sẻ của người sành trà về từng phẩm trà',
      'Những lý do khách hàng lâu năm lựa chọn Vạn Lộc Trà',
      'Cảm nhận của khách hàng về 4 phẩm trà',
      'Trà nào được khách hàng lựa chọn nhiều nhất?',
      'Những đánh giá thực tế từ khách hàng mua lại',
      'Góc thưởng trà của khách hàng Vạn Lộc',
      'Top sản phẩm được yêu thích theo từng nhu cầu',
      'Những câu chuyện khách hàng lựa chọn trà làm quà'
    ],
    van_tho_tra: [
      'Chia sẻ trải nghiệm từ khách hàng',
      'Thói quen thưởng Trà Dược của người dùng',
      'Những công thức pha được khách hàng yêu thích',
      'Cảm nhận về hương vị từng dòng trà',
      'Những lựa chọn được khách hàng mua lại nhiều',
      'Góc thưởng trà của khách hàng',
      'Những cách khách hàng kết hợp trà trong cuộc sống',
      'Top hương vị được yêu thích'
    ],
    van_hy_tra: [
      'Chia sẻ của người yêu trà về Hồng Trà, Oolong và Bạch Trà',
      'Dòng trà nào được khách hàng yêu thích nhất?',
      'Cảm nhận của khách hàng về từng hương vị',
      'Những cách pha được cộng đồng yêu thích',
      'Chia sẻ kiến thức từ người am hiểu trà',
      'Góc thưởng trà Việt của khách hàng',
      'Những lựa chọn dành cho người mới bắt đầu',
      'Top 3 hương vị theo từng gu thưởng trà'
    ],
    traba: [
      'Những món bánh được khách hàng yêu thích nhất',
      'Chè Lam Mật hay Chè Lam Matcha được lựa chọn nhiều hơn?',
      'Chia sẻ của khách hàng về hương vị tuổi thơ',
      'Những khay Tea Break từ khách hàng',
      'Top bánh được mua cùng từng loại trà',
      'Những cách kết hợp trà và bánh được yêu thích',
      'Cảm nhận của khách hàng về Mix Box',
      'Những món bánh được mua lại nhiều nhất'
    ],
    van_thinh_tra: [
      'Những doanh nghiệp đã lựa chọn trà làm quà tặng',
      'Chia sẻ từ khách hàng sau khi nhận quà',
      'Những bộ quà được lựa chọn nhiều nhất',
      'Câu chuyện phía sau những đơn hàng quà tặng lớn',
      'Những dịp khách hàng thường lựa chọn trà biếu',
      'Chia sẻ từ khách hàng doanh nghiệp',
      'Top bộ quà theo từng nhóm người nhận',
      'Những lý do khách hàng quay lại lựa chọn Vạn Thịnh Trà'
    ]
  },
  thuc_day_hanh_dong: {
    label: 'THÚC ĐẨY HÀNH ĐỘNG',
    desc: 'CTA, quiz, ưu đãi, tư vấn — hướng khách hàng đến hành động cụ thể',
    general: [
      'Quiz: Khám phá gu trà của bạn',
      'Bộ câu hỏi: Bạn hiểu trà đến đâu?',
      'Theo dõi chuyên đề kiến thức trà',
      'Lưu lại cẩm nang pha trà đúng cách',
      'Khám phá bản đồ trà Việt',
      'Chọn chủ đề bạn muốn tìm hiểu tiếp theo',
      'Khám phá dòng trà phù hợp với bạn',
      'Tham gia cộng đồng yêu trà'
    ],
    van_loc_tra: [
      'Khám phá bộ 4 phẩm trà Thái Nguyên',
      'Chọn phẩm trà phù hợp với gu của bạn',
      'Bộ trải nghiệm dành cho người mới',
      'Nhận ưu đãi cho lần đầu khám phá Vạn Lộc Trà',
      'Gợi ý combo trà và bánh phù hợp',
      'Khám phá quyền lợi thành viên',
      'Chọn trà theo nhu cầu sử dụng',
      'Nhận tư vấn lựa chọn phẩm trà'
    ],
    van_tho_tra: [
      'Khám phá loại trà phù hợp với gu của bạn',
      'Bộ trải nghiệm 3 hương vị',
      'Bắt đầu thử thách xây dựng thói quen thưởng trà',
      'Nhận ưu đãi dành cho lần đầu trải nghiệm',
      'Chọn combo dành cho gia đình',
      'Khám phá các cách pha từng loại trà',
      'Lưu công thức pha yêu thích',
      'Chọn hương vị bạn muốn thử đầu tiên'
    ],
    van_hy_tra: [
      'Khám phá bộ 3 dòng trà Việt',
      'Tìm loại trà phù hợp với gu của bạn',
      'Bộ thử dành cho người mới',
      'Khám phá cách pha từng dòng trà',
      'Chọn combo trà và bánh',
      'Lưu lại cẩm nang thưởng trà',
      'Chọn hương vị yêu thích',
      'Bắt đầu hành trình khám phá trà Việt'
    ],
    traba: [
      'Chọn combo bánh phù hợp với loại trà bạn đang uống',
      'Khám phá Mix Box 5 hương vị',
      'Xây dựng set Tea Break của riêng bạn',
      'Chọn combo cho văn phòng',
      'Khám phá bản đồ pairing trà – bánh',
      'Chọn món bánh gợi nhớ tuổi thơ của bạn',
      'Tạo khay bánh trà theo sở thích',
      'Khám phá ưu đãi khi mua cùng trà'
    ],
    van_thinh_tra: [
      'Tìm bộ quà phù hợp với người bạn muốn tặng',
      'Chọn quà theo từng mức ngân sách',
      'Nhận tư vấn lựa chọn quà 1:1',
      'Khám phá chính sách dành cho doanh nghiệp',
      'Cá nhân hóa lời chúc và dấu ấn thương hiệu',
      'Lựa chọn bộ quà theo từng dịp',
      'Nhận đề xuất quà theo số lượng',
      'Khám phá 4 lời chúc – chọn món quà phù hợp'
    ]
  }
};

// ─── Kiến thức khoa học về trà ───────────────────────────────────────────────
export const TEA_SCIENCE = `
## Kiến thức khoa học về trà (Camellia sinensis)

### Thành phần hóa học chính
- **Polyphenol (25-35% trọng lượng khô)**: Nhóm hợp chất chống oxy hóa mạnh nhất trong trà
  - Catechin: Chiếm 60-80% polyphenol, gồm EGCG, EGC, ECG, EC
  - EGCG (Epigallocatechin gallate): Catechin mạnh nhất, chiếm 50-75% tổng catechin
  - Flavonoid: Quercetin, kaempferol, myricetin
- **Caffeine (2-5%)**: Kết hợp L-theanine tạo tỉnh táo nhẹ nhàng, không gây hồi hộp như cà phê
- **L-theanine (1-2%)**: Amino acid đặc biệt chỉ có trong trà, giúp thư giãn, tập trung
- **Vitamin & khoáng**: Vitamin C, E, K, kali, fluoride, mangan

### Lợi ích sức khỏe (có nghiên cứu khoa học)
- Chống oxy hóa mạnh (ORAC cao hơn rau quả)
- Hỗ trợ sức khỏe tim mạch (giảm cholesterol xấu LDL)
- Hỗ trợ kiểm soát cân nặng (tăng cường trao đổi chất)
- Tốt cho sức khỏe răng miệng (fluoride tự nhiên)
- Hỗ trợ hệ tiêu hóa
- Cải thiện chức năng não bộ (L-theanine + caffeine)
- Chống viêm

### Phân loại trà theo mức oxy hóa
- **Bạch trà (0-5%)**: Chế biến tối giản, giàu catechin nhất
- **Lục trà / Trà xanh (0-5%)**: Diệt men bằng nhiệt, giữ catechin
- **Oolong (15-85%)**: Bán oxy hóa, hương hoa quả phong phú
- **Hồng trà (85-100%)**: Oxy hóa hoàn toàn, vị đậm, theaflavin
- **Phổ nhĩ: Trà lên men vi sinh, hương đất, vị mellow

### Trà Thái Nguyên
- Vùng trà nổi tiếng nhất Việt Nam, đặc biệt Tân Cương
- Giống chè chủ yếu: Chè trung du (PH1, TRI 777)
- Đặc trưng: Vị chát thanh, hậu ngọt, hương cốm
- 4 phẩm trà theo kích thước búp: Móc Câu > Nõn Tôm > Đinh Nõn > Trà Đinh
- Yếu tố chất lượng: Thổ nhưỡng, khí hậu, giống, thời vụ, kỹ thuật sao

### Cách pha trà đúng
- Nhiệt độ: Trà xanh 80-85°C, Oolong 85-95°C, Hồng trà 90-100°C, Bạch trà 70-80°C
- Tỷ lệ: 2-3g trà / 150ml nước
- Thời gian: Trà xanh 1-3 phút, Oolong 2-5 phút, Hồng trà 3-5 phút
- Bảo quản: Nơi khô, mát, tối, kín, tránh mùi lạ
`;

// ─── Image Prompt Templates ─────────────────────────────────────────────────
export const IMAGE_PROMPTS = {
  photography: {
    label: 'Nhiếp ảnh chuyên nghiệp',
    basePrompt: 'Professional food and beverage photography, warm natural lighting, shallow depth of field, Vietnamese tea culture aesthetic. Shot with Sony A7R IV, 85mm f/1.4 lens. Warm golden hour lighting. Clean composition, editorial style.',
    variants: {
      tea_hill: 'Lush green tea plantation hillside in Thai Nguyen Vietnam, morning mist, terraced tea fields, golden sunrise, drone aerial perspective, breathtaking landscape',
      teapot: 'Traditional Vietnamese clay teapot pouring green tea into small porcelain cups, steam rising, dark wooden tea tray, elegant minimalist setting, warm ambient lighting',
      tea_leaves: 'Close-up of premium dried green tea leaves in a bamboo scoop, rich green color, tightly rolled leaves, soft bokeh background with tea set',
      tea_moment: 'Cozy tea corner with traditional Vietnamese tea set, books, warm afternoon light streaming through window, zen atmosphere, wooden table',
      tea_gift: 'Luxurious Vietnamese tea gift box with premium packaging, ribbon, dried tea visible, elegant dark background, product photography style',
      tea_cake: 'Traditional Vietnamese Che Lam (rice cake) and peanut candy arranged on a ceramic plate beside a cup of green tea, rustic wooden surface, overhead shot'
    }
  },
  watercolor: {
    label: 'Watercolor nghệ thuật',
    basePrompt: 'Beautiful watercolor painting, traditional Asian art style, soft flowing colors, delicate brushstrokes, Vietnamese tea culture theme. Artistic and serene, inspired by traditional Vietnamese and Chinese painting techniques.',
    variants: {
      tea_hill: 'Watercolor painting of misty Vietnamese tea mountains at dawn, layers of green hills fading into fog, traditional ink wash technique with green and blue tones',
      teapot: 'Delicate watercolor of a traditional Vietnamese teapot and cups, soft green and brown tones, splashes of color, zen minimalist composition',
      tea_leaves: 'Watercolor illustration of tea leaves and flowers (Camellia sinensis), botanical art style, soft green palette, scientific yet artistic',
      tea_moment: 'Watercolor painting of two people sharing tea in a peaceful Vietnamese garden, traditional clothing, lotus pond, gentle pastel colors',
      tea_gift: 'Watercolor illustration of beautifully wrapped tea gift boxes with Vietnamese floral motifs, elegant red and gold color scheme',
      tea_cake: 'Watercolor still life of Vietnamese traditional sweets and tea, warm earth tones, loose artistic brushwork'
    }
  },
  flat: {
    label: 'Flat illustration',
    basePrompt: 'Modern flat illustration style, clean vector-like aesthetic, vibrant but harmonious color palette, minimal shadows, contemporary design for social media. Clean lines, geometric shapes, trendy digital art.',
    variants: {
      tea_hill: 'Flat illustration of Vietnamese tea plantation landscape with geometric mountains, stylized tea bushes, farmer characters, cheerful color palette of greens and golds',
      teapot: 'Modern flat design illustration of a tea ceremony setup, minimalist teapot and cups, geometric patterns, warm green and cream color scheme',
      tea_leaves: 'Flat vector style infographic about tea types, colorful icons, clean layout, educational diagram with tea leaf illustrations',
      tea_moment: 'Flat illustration of people enjoying tea together, diverse characters, cozy cafe setting, warm inviting colors',
      tea_gift: 'Flat design gift box illustration with tea products, festive elements, ribbon and bow, premium feel with gold accents',
      tea_cake: 'Flat illustration of Vietnamese traditional snacks and tea pairing, cute food characters, playful and modern style'
    }
  },
  lifestyle: {
    label: 'Lifestyle photography',
    basePrompt: 'Lifestyle photography, candid and authentic feel, warm color grading, natural lighting, aspirational but relatable. Shot in a beautiful Vietnamese setting, Instagram-worthy composition.',
    variants: {
      tea_hill: 'Vietnamese woman in ao dai walking through tea plantation, back view, misty morning, cinematic atmosphere, travel photography style',
      teapot: 'Young professional enjoying morning tea at home desk, minimalist apartment, natural light from large window, calm productive morning routine',
      tea_leaves: 'Hands carefully picking tea buds in Thai Nguyen plantation, close-up, morning dew on leaves, artisan craftsmanship',
      tea_moment: 'Friends gathering around a tea table, laughing and sharing stories, warm evening lighting, cozy indoor setting with plants',
      tea_gift: 'Person presenting a premium tea gift box to another, genuine smile, elegant interior, warm emotional moment',
      tea_cake: 'Afternoon tea spread on a beautiful table, Vietnamese cakes and tea, flowers in vase, lifestyle blog photography style'
    }
  },
  macro: {
    label: 'Closeup macro',
    basePrompt: 'Extreme close-up macro photography, razor-sharp focus, beautiful bokeh background, revealing intricate details invisible to naked eye. Shot with macro lens, studio lighting or natural light.',
    variants: {
      tea_hill: 'Macro close-up of fresh tea buds with morning dew drops, crystalline water droplets on fuzzy silver tips, incredible detail, green bokeh background',
      teapot: 'Macro shot of hot tea being poured, steam swirling in slow motion, droplets splashing, warm amber tea color, artistic motion capture',
      tea_leaves: 'Extreme macro of dried premium tea leaves showing texture, trichomes, cellular structure, rich green color variations, studio black background',
      tea_moment: 'Close-up of hands cradling a warm cup of tea, steam rising, fingertips feeling warmth, intimate and personal, shallow depth of field',
      tea_gift: 'Macro detail of premium tea packaging, embossed logo, texture of box material, golden foil details, luxury product photography',
      tea_cake: 'Extreme close-up of Che Lam rice cake cross-section showing texture, peanut pieces visible, powdered surface, studio lighting'
    }
  }
};

// ─── Content Format Templates ────────────────────────────────────────────────
export const FORMAT_GUIDELINES = {
  'status_short': {
    label: 'Dòng trạng thái ngắn (50-100 từ)',
    guidelines: `
- Ngắn gọn, súc tích 50-100 từ
- Mở đầu bằng hook gây chú ý (câu hỏi / sự thật bất ngờ / emoji)
- 1-2 đoạn ngắn
- Kết bằng CTA nhẹ (comment / share / lưu lại)
- Dùng emoji phù hợp: 🍵 ☕ 🌿 🎋 ✨ 💚
- Tone: Thân thiện, đời thường, như nhắn tin cho bạn
- Hashtag: 3-5 hashtag liên quan`
  },
  'post_detail': {
    label: 'Bài đăng chi tiết (200-400 từ)',
    guidelines: `
- Dài 200-400 từ, chia 3-5 đoạn
- Hook mạnh ở dòng đầu
- Storytelling hoặc chia sẻ kiến thức
- Bullet points cho thông tin quan trọng
- CTA rõ ràng ở cuối
- Có thể dùng emoji nhưng tiết chế
- Hashtag: 5-8 hashtag
- Phù hợp: Facebook, Zalo, Blog`
  },
  'podcast_script': {
    label: 'Podcast script (400-800 từ)',
    guidelines: `
- Dài 400-800 từ
- Mở: Chào hỏi + giới thiệu chủ đề (hook)
- Thân: 2-3 phần chính, mỗi phần có tiêu đề
- Kết: Tóm tắt + CTA + chào tạm biệt
- Tone: Truyện kể, như đang nói chuyện 1:1
- Dùng câu ngắn, dễ đọc thành tiếng
- Có chỗ dừng tự nhiên (pause markers: ...)
- Đôi khi đặt câu hỏi cho người nghe suy ngẫm`
  },
  'series_3': {
    label: 'Series 3 bài liên tiếp',
    guidelines: `
- Tạo 3 bài liên kết nhau, đăng 3 ngày liên tiếp
- Bài 1: Đặt vấn đề / gây tò mò — "Bạn có biết...?"
- Bài 2: Đi sâu / giải thích — "Hóa ra..."
- Bài 3: Kết luận / CTA — "Vậy nên..."
- Mỗi bài 100-200 từ
- Cuối bài 1, 2: Teaser cho bài tiếp theo
- Tone nhất quán xuyên suốt`
  },
  'infographic_text': {
    label: 'Infographic text (bullet points)',
    guidelines: `
- Nội dung dạng bullet points, phù hợp thiết kế infographic
- Tiêu đề lớn ở đầu
- 5-8 bullet points chính
- Mỗi point: Icon/emoji + tiêu đề ngắn + 1 câu mô tả
- Số liệu cụ thể nếu có
- Footer: nguồn tham khảo hoặc CTA
- Ngôn ngữ: Cô đọng, dễ scan bằng mắt`
  }
};

// ─── Helper: Lấy ý tưởng theo nhóm + dòng SP ────────────────────────────────
export function getContentIdeas(groupKey, productKey) {
  const group = CONTENT_MATRIX[groupKey];
  if (!group) return [];
  // Nếu productKey = 'general' hoặc 'tat_ca', trả về ý tưởng chung
  if (!productKey || productKey === 'general' || productKey === 'tat_ca') {
    return group.general || [];
  }
  return group[productKey] || group.general || [];
}

// ─── Helper: Lấy thông tin sản phẩm ─────────────────────────────────────────
export function getProductInfo(productKey) {
  return PRODUCTS[productKey] || null;
}

// ─── Helper: Lấy image prompt ────────────────────────────────────────────────
export function getImagePrompt(style, variant = 'teapot') {
  const tmpl = IMAGE_PROMPTS[style] || IMAGE_PROMPTS.photography;
  const variantPrompt = tmpl.variants[variant] || tmpl.variants.teapot;
  return `${variantPrompt}. ${tmpl.basePrompt}`;
}
