// ═══════════════════════════════════════════════════════════════════════════════
// AI AGENT HUB — Banner Prompt Builder Engine (Structured Visual Prompting)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Builds a structured English prompt for AI image generation (DALL-E 3, Midjourney, etc.)
 * based on 9 design parameters.
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

  let assetContext = '';
  if (visualAssets && visualAssets.length > 0) {
    const assetDesc = visualAssets.map(a => a.visualDescription || a.suggestedPrompt).filter(Boolean).join('. ');
    if (assetDesc) {
      assetContext = `Brand Visual Reference Knowledge: ${assetDesc}.`;
    }
  }

  const subjectSection = visual_elements
    ? `Main Subject & Background: ${visual_elements}. ${assetContext}`
    : `Main Subject: Premium Vietnamese tea experience, elegant arrangement of tea product. ${assetContext}`;

  const headlineSection = headline
    ? `Typography & Title: Includes headline text "${headline}" in ${headline_color || 'gold'}, styled with ${headline_effect || 'handcrafted calligraphic script font'}.`
    : '';

  const subtextSection = subtext
    ? `Subtitle Text: "${subtext}".`
    : '';

  const colorSection = (primary_color || secondary_color)
    ? `Color Palette: Dominant color ${primary_color || 'deep green'}, accent color ${secondary_color || 'gold'}.`
    : (visualAssets?.[0]?.colorPalette ? `Color Palette: ${visualAssets[0].colorPalette}.` : 'Color Palette: Natural tea green, warm golden amber accents, clean commercial color grading.');

  const compositionSection = `Style & Layout Reference: ${ref_style}. Professional advertising banner layout, balanced negative space for high readability, cinematic studio lighting.`;

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
