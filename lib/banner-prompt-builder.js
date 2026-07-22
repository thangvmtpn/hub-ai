// ═══════════════════════════════════════════════════════════════════════════════
// AI AGENT HUB — Banner Prompt Builder Engine (Structured Visual Prompting)
// ═══════════════════════════════════════════════════════════════════════════════

function translateVisualText(text) {
  if (!text) return '';
  let str = text;
  
  const mappings = [
    [/đồi chè xanh thái nguyên/gi, 'lush green Thai Nguyen tea plantation hills landscape'],
    [/đồi chè xanh/gi, 'lush green tea hills landscape'],
    [/người thưởng trà/gi, 'a middle-aged Vietnamese man comfortably sipping tea outdoors'],
    [/người đàn ông trung niên/gi, 'a middle-aged Vietnamese gentleman'],
    [/nhâm nhi chén trà ngoài sân/gi, 'sipping a cup of green tea in a traditional peaceful courtyard'],
    [/búp chè/gi, 'fresh green tea buds'],
    [/chén trà/gi, 'porcelain teacup'],
    [/ấm trà/gi, 'traditional Vietnamese teapot'],
    [/bánh trà/gi, 'traditional Vietnamese tea pastries and sweets'],
    [/bánh ngọt/gi, 'traditional Vietnamese tea pastries'],
    [/hộp quà/gi, 'luxury wooden gift box filled with premium tea tins, metallic gold lacquer finish, silk lining, high-end corporate gift'],
    [/phong cách hiện đại/gi, 'modern high-end commercial design style'],
    [/bố cục cân đối/gi, 'balanced rule of thirds advertising layout'],
    [/ánh sáng tự nhiên/gi, 'warm natural golden hour sunlight'],
    [/màu vàng gold/gi, 'metallic gold lacquer finish'],
    [/màu đỏ ruby/gi, 'ruby red luxury metallic finish'],
    [/màu như ảnh banner tham khảo/gi, 'matching reference banner colors'],
    [/hiệu ứng chữ cổ dạng viết tay/gi, 'vintage handcrafted calligraphic script typography'],
    [/mạ vàng ánh kim/gi, 'metallic gold embossing effect'],
    [/nghệ thuật trà việt truyền thống/gi, 'authentic Vietnamese tea ceremony culture aesthetic'],
    [/tối giản/gi, 'minimalist luxury layout'],
    [/không có/gi, 'none'],
  ];

  for (const [regex, replacement] of mappings) {
    str = str.replace(regex, replacement);
  }
  return str;
}

/**
 * Builds a dynamic structured English prompt for AI image generation (DALL-E 3, Midjourney, FLUX)
 * based on user's exact input parameters + Visual RAG assets.
 */
export function buildBannerPrompt(data = {}, visualAssets = []) {
  const {
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

  // ── Determine visual subject ─────────────────────────────────────────────
  let translatedVisuals = '';
  if (visual_elements) {
    translatedVisuals = translateVisualText(visual_elements);
  } else if (custom_topic) {
    translatedVisuals = translateVisualText(custom_topic);
  } else {
    // Smart derive from product_line
    const matchedProduct = Object.entries(productVisualMap).find(([k]) => product_line.includes(k));
    translatedVisuals = matchedProduct ? matchedProduct[1] : 'premium Vietnamese tea products artfully displayed with traditional Vietnamese elements';
  }

  // ── Determine composition style ──────────────────────────────────────────
  let compositionStyle = '';
  if (ref_style) {
    compositionStyle = translateVisualText(ref_style);
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

  const translatedHeadlineColor = translateVisualText(headline_color || '');
  const translatedHeadlineEffect = translateVisualText(headline_effect || '');

  // ── Visual RAG asset context ─────────────────────────────────────────────
  let assetContext = '';
  if (visualAssets && visualAssets.length > 0) {
    const assetDesc = visualAssets.map(a => a.visualDescription || a.suggestedPrompt).filter(Boolean).join('. ');
    if (assetDesc) {
      assetContext = `Brand Visual Reference Knowledge: ${assetDesc}.`;
    }
  }

  // ── Assemble prompt sections ─────────────────────────────────────────────
  const subjectSection = `Main Subject & Context: ${translatedVisuals}. ${assetContext}`;

  const headlineSection = headline
    ? `Typography & Title: Includes headline text "${headline}" in ${translatedHeadlineColor || 'metallic gold lacquer finish'}, styled with ${translatedHeadlineEffect || 'vintage handcrafted calligraphic script typography'}.`
    : '';

  const subtextSection = subtext
    ? `Subtitle Text: "${subtext}".`
    : '';

  const colorSection = (primary_color || secondary_color)
    ? `Color Palette: Dominant color ${primary_color || 'deep green'}, accent color ${secondary_color || 'gold'}.`
    : (visualAssets?.[0]?.colorPalette ? `Color Palette: ${visualAssets[0].colorPalette}.` : 'Color Palette: #1B4332 (deep tea green), #D4AF37 (gold), #9B2C2C (ruby accent).');

  const compositionSection = `Style & Layout Reference: ${compositionStyle}. Professional advertising banner layout, balanced negative space for high readability.`;

  const moodSection = moodHint ? `Mood & Atmosphere: ${moodHint}.` : '';

  const qualitySection = 'Commercial photography quality, 8k resolution, ultra-detailed textures, crisp focus, hyper-realistic, award-winning graphic design.';

  const negativeSection = 'Negative constraints: No unwanted text clutter, no low resolution, no blurry details, no distorted elements.';

  const masterPrompt = [
    `A professional commercial banner design.`,
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
