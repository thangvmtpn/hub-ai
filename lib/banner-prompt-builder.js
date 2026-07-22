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
    [/ấm trà/gi, 'traditional Vietnamese teapot'],
    [/chén trà/gi, 'porcelain teacup'],
    [/hộp quà/gi, 'luxury wooden gift box filled with premium tea tins, metallic gold lacquer finish, silk lining, high-end corporate gift'],
    [/bánh trà/gi, 'traditional Vietnamese tea pastries'],
    [/phong cách hiện đại/gi, 'modern high-end commercial design style'],
    [/bố cục cân đối/gi, 'balanced rule of thirds advertising layout'],
    [/ánh sáng tự nhiên/gi, 'warm natural golden hour sunlight'],
    [/màu vàng gold/gi, 'metallic gold lacquer finish'],
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
 * Builds a structured English prompt for AI image generation (DALL-E 3, Midjourney, etc.)
 * based on 9 design parameters + Visual RAG assets.
 */
export function buildBannerPrompt(data = {}, visualAssets = []) {
  const {
    product_line = '',
    ref_style = 'Phong cách hiện đại, bố cục cân đối, ánh sáng tự nhiên',
    headline = '',
    headline_color = 'Màu vàng gold',
    headline_effect = 'Hiệu ứng chữ cổ dạng viết tay',
    subtext = '',
    extra_text = 'Không có',
    visual_elements = 'Đồi chè xanh, người thưởng trà',
    primary_color = '',
    secondary_color = ''
  } = data;

  const translatedVisuals = translateVisualText(visual_elements);
  const translatedStyle = translateVisualText(ref_style);
  const translatedHeadlineColor = translateVisualText(headline_color);
  const translatedHeadlineEffect = translateVisualText(headline_effect);

  let assetContext = '';
  if (visualAssets && visualAssets.length > 0) {
    const assetDesc = visualAssets.map(a => a.visualDescription || a.suggestedPrompt).filter(Boolean).join('. ');
    if (assetDesc) {
      assetContext = `Brand Visual Reference Knowledge: ${assetDesc}.`;
    }
  }

  const subjectSection = translatedVisuals
    ? `Main Subject & Background: ${translatedVisuals}. ${assetContext}`
    : `Main Subject: Premium Vietnamese tea experience, elegant arrangement of tea product. ${assetContext}`;

  const headlineSection = headline
    ? `Typography & Title: Includes headline text "${headline}" in ${translatedHeadlineColor || 'gold'}, styled with ${translatedHeadlineEffect || 'handcrafted calligraphic script font'}.`
    : '';

  const subtextSection = subtext
    ? `Subtitle Text: "${subtext}".`
    : '';

  const colorSection = (primary_color || secondary_color)
    ? `Color Palette: Dominant color ${primary_color || 'deep green'}, accent color ${secondary_color || 'gold'}.`
    : (visualAssets?.[0]?.colorPalette ? `Color Palette: ${visualAssets[0].colorPalette}.` : 'Color Palette: #1B4332, #D4AF37, #9B2C2C.');

  const compositionSection = `Style & Layout Reference: ${translatedStyle}. Professional advertising banner layout, balanced negative space for high readability, cinematic studio lighting.`;

  const qualitySection = 'Commercial photography quality, 8k resolution, ultra-detailed textures, crisp focus, hyper-realistic, award-winning graphic design.';

  const negativeSection = 'Negative constraints: No unwanted text clutter, no low resolution, no blurry details, no distorted elements.';

  const masterPrompt = [
    `A professional commercial banner design.`,
    subjectSection,
    headlineSection,
    subtextSection,
    colorSection,
    compositionSection,
    qualitySection,
    negativeSection
  ].filter(Boolean).join(' ');

  return {
    masterPrompt,
    summary: {
      headline,
      headlineColor: headline_color,
      headlineEffect: headline_effect,
      visualElements: visual_elements,
      refStyle: ref_style,
      primaryColor: primary_color,
      secondaryColor: secondary_color
    }
  };
}
