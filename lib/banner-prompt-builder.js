// ═══════════════════════════════════════════════════════════════════════════════
// AI AGENT HUB — Banner Prompt Builder Engine (100% English Output)
// ═══════════════════════════════════════════════════════════════════════════════

// ── Comprehensive Vietnamese → English dictionary ─────────────────────────────
const VI_EN_DICTIONARY = [
  // === Product names & brands ===
  [/vạn lộc trà/gi, 'Van Loc Tra premium green tea'],
  [/vạn thọ trà/gi, 'Van Tho Tra herbal medicinal tea'],
  [/vạn hỷ trà/gi, 'Van Hy Tra Vietnamese tea collection'],
  [/vạn thịnh trà/gi, 'Van Thinh Tra luxury gift tea'],
  [/trà dược việt nam/gi, 'Vietnamese Herbal Tea brand'],
  [/trà bà vân/gi, 'Tra Ba Van brand'],
  [/traba/gi, 'TRABA artisanal tea pastries'],

  // === Tea-related nouns ===
  [/sản phẩm trà/gi, 'premium tea products'],
  [/trà xanh thái nguyên/gi, 'Thai Nguyen green tea'],
  [/trà xanh/gi, 'green tea'],
  [/trà dược/gi, 'herbal medicinal tea'],
  [/trà biếu/gi, 'premium gift tea'],
  [/trà việt nam/gi, 'Vietnamese tea'],
  [/trà việt/gi, 'Vietnamese tea'],
  [/đồi chè xanh thái nguyên/gi, 'lush green Thai Nguyen tea plantation hills'],
  [/đồi chè xanh/gi, 'lush green tea hills landscape'],
  [/đồi chè/gi, 'tea plantation hills'],
  [/búp chè/gi, 'fresh green tea buds'],
  [/cánh trà/gi, 'dried tea leaves'],
  [/lá trà/gi, 'tea leaves'],
  [/chén trà/gi, 'porcelain teacup with tea'],
  [/ấm trà/gi, 'traditional Vietnamese teapot'],
  [/bàn trà/gi, 'elegant tea table setup'],
  [/hộp trà/gi, 'premium tea box packaging'],
  [/hộp quà/gi, 'luxury gift box with silk lining and gold lacquer finish'],
  [/bánh trà/gi, 'traditional Vietnamese tea pastries and sweets'],
  [/bánh ngọt/gi, 'artisanal pastries and sweets'],
  [/bánh ăn cùng trà/gi, 'artisanal pastries paired with tea'],
  [/không gian trà/gi, 'serene tea ceremony space'],
  [/văn hóa trà/gi, 'Vietnamese tea culture heritage'],
  [/thưởng trà/gi, 'tea tasting experience'],
  [/người thưởng trà/gi, 'a person gracefully enjoying tea'],
  [/người đàn ông trung niên/gi, 'a distinguished middle-aged Vietnamese gentleman'],
  [/nhâm nhi chén trà ngoài sân/gi, 'sipping tea in a peaceful traditional courtyard'],
  [/nhâm nhi/gi, 'savoring and sipping'],

  // === Descriptive adjectives ===
  [/sản phẩm gốc/gi, 'original product'],
  [/sản phẩm/gi, 'product'],
  [/cao cấp/gi, 'premium luxury'],
  [/chất lượng cao/gi, 'high quality'],
  [/thượng hạng/gi, 'top-tier premium grade'],
  [/sang trọng/gi, 'luxurious and elegant'],
  [/tinh tế/gi, 'refined and sophisticated'],
  [/truyền thống/gi, 'traditional authentic'],
  [/hiện đại/gi, 'modern contemporary'],
  [/chuyên nghiệp/gi, 'professional'],
  [/đẳng cấp/gi, 'prestigious high-class'],
  [/tự nhiên/gi, 'natural organic'],
  [/nguyên chất/gi, 'pure and unprocessed'],
  [/đậm đà/gi, 'rich and bold'],
  [/thơm ngon/gi, 'aromatic and delicious'],
  [/thanh mát/gi, 'refreshing and cool'],
  [/dịu nhẹ/gi, 'gentle and mild'],
  [/hương vị/gi, 'flavors and aromas'],
  [/đặc biệt/gi, 'special exclusive'],

  // === Colors ===
  [/màu vàng gold/gi, 'metallic gold'],
  [/vàng gold/gi, 'metallic gold'],
  [/màu đỏ ruby/gi, 'ruby red metallic'],
  [/đỏ ruby/gi, 'ruby red'],
  [/màu trắng/gi, 'pure white'],
  [/màu xanh ngọc trà/gi, 'jade tea green'],
  [/xanh ngọc/gi, 'jade green'],
  [/xanh đậm/gi, 'deep green'],
  [/xanh lá/gi, 'leaf green'],
  [/xanh đồi chè/gi, 'tea hill green'],
  [/vàng kim/gi, 'metallic gold'],
  [/vàng nhạt/gi, 'light golden'],

  // === headline_color select options (exact matches) ===
  [/màu vàng gold \(golden yellow\)/gi, 'metallic golden yellow'],
  [/màu như ảnh banner tham khảo/gi, 'matching the reference banner color palette'],
  [/màu đỏ ruby sang trọng/gi, 'luxurious ruby red metallic'],
  [/màu trắng tinh tế/gi, 'refined elegant white'],
  [/màu xanh ngọc trà/gi, 'jade tea green'],

  // === headline_effect select options (exact matches) ===
  [/hiệu ứng chữ cổ dạng viết tay \(vintage calligraphic script\)/gi, 'vintage handcrafted calligraphic script typography'],
  [/hiệu ứng chữ cổ dạng viết tay/gi, 'vintage handcrafted calligraphic script typography'],
  [/như ảnh banner tham khảo/gi, 'matching the reference banner style'],
  [/hiệu ứng mạ vàng ánh kim \(metallic gold embossing\)/gi, 'metallic gold embossing effect'],
  [/hiệu ứng mạ vàng ánh kim/gi, 'metallic gold embossing effect'],
  [/mạ vàng ánh kim/gi, 'metallic gold embossing'],
  [/hiệu ứng 3d đổ bóng sang trọng/gi, 'luxury 3D drop shadow effect'],
  [/hiệu ứng phát sáng nghệ thuật \(soft ambient glow\)/gi, 'soft ambient glow effect'],
  [/hiệu ứng phát sáng nghệ thuật/gi, 'soft artistic glow effect'],
  [/hiệu ứng/gi, 'effect'],

  // === ref_style select options ===
  [/phong cách thương mại cao cấp, bố cục đối xứng, ánh sáng ấm/gi, 'premium commercial style, symmetrical layout, warm lighting'],
  [/nghệ thuật trà việt truyền thống, bố cục tối giản \(minimalism\)/gi, 'traditional Vietnamese tea art, minimalist layout'],
  [/nghệ thuật trà việt truyền thống/gi, 'traditional Vietnamese tea ceremony aesthetic'],
  [/infographic hiện đại, bố cục chia mảng thông tin rõ ràng/gi, 'modern infographic, clear grid-based information layout'],
  [/nhiếp ảnh sản phẩm đồi chè, góc máy chiều sâu nghệ thuật/gi, 'product photography on tea hills, artistic depth of field camera angle'],

  // === Layout & style terms ===
  [/phong cách/gi, 'design style'],
  [/bố cục cân đối/gi, 'balanced composition'],
  [/bố cục đối xứng/gi, 'symmetrical composition'],
  [/bố cục/gi, 'layout composition'],
  [/ánh sáng tự nhiên/gi, 'natural golden hour sunlight'],
  [/ánh sáng ấm/gi, 'warm studio lighting'],
  [/ánh sáng/gi, 'lighting'],
  [/tối giản/gi, 'minimalist'],
  [/nghệ thuật/gi, 'artistic'],

  // === General Vietnamese words that might appear ===
  [/những điều thú vị về/gi, 'fascinating facts about'],
  [/những điều/gi, 'things about'],
  [/lợi ích/gi, 'benefits of'],
  [/đặc sản/gi, 'specialty'],
  [/quà tặng/gi, 'gift set'],
  [/bộ sưu tập/gi, 'collection'],
  [/khuyến mãi/gi, 'promotion'],
  [/ưu đãi/gi, 'special offer'],
  [/miễn phí/gi, 'free'],
  [/mới/gi, 'new'],
  [/nổi bật/gi, 'featured'],
  [/yêu thích/gi, 'favorite'],
  [/tốt nhất/gi, 'best'],
  [/số 1/gi, 'number one'],
  [/chính hãng/gi, 'authentic genuine'],
  [/hình ảnh/gi, 'image of'],
  [/hình/gi, 'image'],
  [/không có/gi, 'none'],
  [/hoặc/gi, 'or'],
  [/và/gi, 'and'],
  [/của/gi, 'of'],
  [/với/gi, 'with'],
  [/cho/gi, 'for'],
  [/trong/gi, 'in'],
  [/trên/gi, 'on'],
  [/việt nam/gi, 'Vietnam'],
];

/**
 * Remove Vietnamese diacritics as final fallback —
 * ensures NO Vietnamese characters remain in the output
 */
function stripVietnameseDiacritics(str) {
  return str
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[ÌÍỊỈĨ]/g, 'I')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[ỲÝỴỶỸ]/g, 'Y')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Translate Vietnamese text → English using dictionary + diacritics fallback
 */
function toEnglish(text) {
  if (!text) return '';
  let str = text;
  for (const [regex, replacement] of VI_EN_DICTIONARY) {
    str = str.replace(regex, replacement);
  }
  // Final safety: strip any remaining Vietnamese diacritics
  str = stripVietnameseDiacritics(str);
  return str.trim();
}

/**
 * Builds a 100% ENGLISH structured prompt for AI image generation
 * (DALL-E 3, Midjourney, FLUX) from user's input parameters + Visual RAG assets.
 */
export function buildBannerPrompt(data = {}, visualAssets = []) {
  const {
    prompt_objective = '',
    product_line = '',
    ref_style = '',
    headline = '',
    headline_color = '',
    headline_effect = '',
    subtext = '',
    extra_text = '',
    visual_elements = '',
    custom_topic = '',
    content_group = '',
    content_format = '',
    image_style = '',
    tone = '',
    primary_color = '',
    secondary_color = ''
  } = data;

  // ── Smart product-line → visual subject mapping ──────────────────────────
  const productVisualMap = {
    'Vạn Lộc Trà': 'lush green Thai Nguyen tea plantation hills with fresh spring tea buds, a traditional Vietnamese teapot and porcelain cups arranged on a carved wooden tray, steam rising gently, surrounded by vibrant tea leaves',
    'Vạn Thọ Trà': 'an elegant herbal tea blend with dried flowers, chrysanthemum, goji berries and artichoke leaves beautifully arranged around a ceramic teapot, warm amber tones, traditional Vietnamese medicinal tea aesthetic',
    'Vạn Hỷ Trà': 'a curated Vietnamese tea collection featuring multiple premium tea tins with ornate designs, bamboo serving trays, and a refined tea ceremony setting in a modern minimalist space',
    'TRABA': 'artisanal Vietnamese pastries and tea cakes beautifully plated alongside a delicate teacup, golden sesame cookies, green tea mochi, elegant food photography with soft bokeh',
    'Vạn Thịnh Trà': 'a luxury wooden gift box filled with premium tea tins, metallic gold lacquer finish, silk ribbon wrapping, high-end corporate gift presentation, Vietnamese New Year celebration aesthetic',
    'Tất cả': 'a premium Vietnamese tea brand showcase with diverse products, traditional teapots, green tea leaves, and cultural elements celebrating Vietnamese tea heritage'
  };

  // ── Smart image-style → composition mapping ──────────────────────────────
  const styleVisualMap = {
    'Nhiếp ảnh chuyên nghiệp': 'professional commercial photography, studio lighting, crisp focus, shallow depth of field, cinematic color grading',
    'Watercolor nghệ thuật': 'watercolor painting style, soft brush strokes, traditional Vietnamese artistic aesthetic, muted pastel tones with vibrant accents',
    'Flat illustration': 'modern flat illustration, clean vector graphics, bold geometric shapes, infographic-ready, vibrant color blocks',
    'Lifestyle photography': 'lifestyle photography, natural golden hour light, person enjoying tea in a cozy setting, warm atmospheric mood',
    'Closeup macro': 'extreme closeup macro photography, ultra-detailed textures, visible tea leaf veins, water droplets on porcelain, razor sharp focus'
  };

  // ── Smart content-group → mood/atmosphere mapping ────────────────────────
  const groupMoodMap = {
    'Gây Chú Ý': 'bold and eye-catching composition, dramatic lighting, high visual impact',
    'Tạo Cảm Xúc': 'emotional and nostalgic atmosphere, warm tones, storytelling composition, evocative lighting',
    'Xây Niềm Tin': 'authentic and trustworthy aesthetic, documentary-style clarity, showing origin and craftsmanship',
    'Giải Thích Logic': 'clean informational layout, well-organized visual hierarchy, educational and clear',
    'Tạo Mong Muốn': 'aspirational lifestyle aesthetic, luxurious mood, desire-inducing presentation',
    'Xã Hội Chứng Nhận': 'authentic social proof aesthetic, testimonial-friendly layout, genuine and relatable',
    'Thúc Đẩy Hành Động': 'dynamic and urgent composition, strong call-to-action energy, promotional banner feel'
  };

  // ── Determine visual subject (100% English) ──────────────────────────────
  let translatedVisuals = '';
  if (visual_elements) {
    translatedVisuals = toEnglish(visual_elements);
  } else if (custom_topic) {
    translatedVisuals = toEnglish(custom_topic);
  } else {
    const matchedProduct = Object.entries(productVisualMap).find(([k]) => product_line.includes(k));
    translatedVisuals = matchedProduct ? matchedProduct[1] : 'premium Vietnamese tea products artfully displayed with traditional Vietnamese elements';
  }

  // ── Determine composition style (100% English) ───────────────────────────
  let compositionStyle = '';
  if (ref_style) {
    compositionStyle = toEnglish(ref_style);
  } else {
    const matchedStyle = Object.entries(styleVisualMap).find(([k]) => image_style.includes(k));
    compositionStyle = matchedStyle ? matchedStyle[1] : 'professional commercial photography, cinematic studio lighting, balanced composition';
  }

  // ── Determine mood from content group ────────────────────────────────────
  let moodHint = '';
  const matchedGroup = Object.entries(groupMoodMap).find(([k]) => content_group.includes(k));
  if (matchedGroup) {
    moodHint = matchedGroup[1];
  }

  // ── Translate headline color & effect (100% English) ─────────────────────
  const englishHeadlineColor = toEnglish(headline_color);
  const englishHeadlineEffect = toEnglish(headline_effect);

  // ── Visual RAG asset context ─────────────────────────────────────────────
  let assetContext = '';
  if (visualAssets && visualAssets.length > 0) {
    const assetDesc = visualAssets.map(a => a.visualDescription || a.suggestedPrompt).filter(Boolean).join('. ');
    if (assetDesc) {
      assetContext = `Brand Visual Reference Knowledge: ${toEnglish(assetDesc)}.`;
    }
  }

  // ══ Assemble prompt sections (ALL ENGLISH) ═══════════════════════════════
  const subjectSection = `Main Subject & Context: ${translatedVisuals}.${assetContext ? ' ' + assetContext : ''}`;

  const headlineSection = headline
    ? `Typography & Title: Decorative banner text reading "${toEnglish(headline)}" in ${englishHeadlineColor || 'metallic gold'} color, styled with ${englishHeadlineEffect || 'vintage handcrafted calligraphic script typography'}.`
    : '';

  const subtextSection = subtext
    ? `Subtitle Text: "${toEnglish(subtext)}".`
    : '';

  const colorSection = (primary_color || secondary_color)
    ? `Color Palette: Dominant color ${primary_color || 'deep green'}, accent color ${secondary_color || 'gold'}.`
    : (visualAssets?.[0]?.colorPalette ? `Color Palette: ${visualAssets[0].colorPalette}.` : 'Color Palette: #1B4332 (deep tea green), #D4AF37 (gold), #9B2C2C (ruby accent).');

  const compositionSection = `Style & Layout Reference: ${compositionStyle}. Professional advertising banner layout, balanced negative space for high readability.`;

  const moodSection = moodHint ? `Mood & Atmosphere: ${moodHint}.` : '';

  const qualitySection = 'Commercial photography quality, 8k resolution, ultra-detailed textures, crisp focus, hyper-realistic, award-winning graphic design.';

  const negativeSection = 'Negative constraints: No unwanted text clutter, no low resolution, no blurry details, no distorted elements.';

  // ── Determine Prompt Objective (PRO1-PRO4) ──────────────────────────────
  const objectiveCode = prompt_objective.match(/PRO\d/)?.[0] || 'PRO1';

  const objectiveMap = {
    PRO1: {
      opener: 'A professional commercial banner design featuring the product prominently in the center.',
      productInstruction: 'Product Placement: The actual product packaging/item must be the HERO element, shown in full detail with accurate shape, texture, color, and branding. The product should occupy 40-60% of the visual frame.',
    },
    PRO2: {
      opener: 'A professional commercial banner design with NO product packaging visible — focus entirely on atmosphere, lifestyle, and brand mood.',
      productInstruction: 'Product Exclusion: Do NOT show any product packaging, boxes, or tins. Instead, show raw ingredients, lifestyle scenes, or abstract brand aesthetics.',
    },
    PRO3: {
      opener: 'An edited version of an existing banner image. Apply the following modifications while preserving the overall composition:',
      productInstruction: 'Edit Instruction: Modify ONLY the specified components (colors, text, layout elements) while keeping all other elements unchanged. Maintain visual coherence.',
    },
    PRO4: {
      opener: 'Resize and recompose the banner to fit the new dimensions while maintaining visual quality and key elements.',
      productInstruction: 'Resize Instruction: Adapt the layout, crop, and recompose elements to fit the new aspect ratio. Ensure no key visual elements are cut off and the composition remains balanced.',
    },
  };

  const objective = objectiveMap[objectiveCode] || objectiveMap.PRO1;

  const masterPrompt = [
    objective.opener,
    objective.productInstruction,
    subjectSection,
    headlineSection,
    subtextSection,
    colorSection,
    compositionSection,
    moodSection,
    qualitySection,
    negativeSection
  ].filter(Boolean).join(' ');

  return {
    masterPrompt,
    summary: {
      promptObjective: objectiveCode,
      headline,
      headlineColor: headline_color,
      headlineEffect: headline_effect,
      visualElements: visual_elements || custom_topic || product_line,
      refStyle: ref_style || image_style,
      primaryColor: primary_color,
      secondaryColor: secondary_color
    }
  };
}
