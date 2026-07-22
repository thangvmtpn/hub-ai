// ═══════════════════════════════════════════════════════════════════════════════
// AI AGENT HUB — Visual Retrieval Engine (Visual RAG for Brand Assets & Banner References)
// ═══════════════════════════════════════════════════════════════════════════════

import { query } from './db.js';

// Default visual presets for Trà Dược Việt Nam when DB assets are minimal
const BRAND_VISUAL_PRESETS = {
  van_loc_tra: {
    title: 'Vạn Lộc Trà — Đồi chè Nõn Tôm Thái Nguyên',
    visualDescription: 'Lush green Thai Nguyen tea hills in morning mist, fresh young tea buds with dew drops, serene Vietnamese countryside atmosphere.',
    colorPalette: '#1B4332, #D4AF37, #E8F5E9',
    suggestedPrompt: 'High quality shot of fresh green tea leaves on a sunlit hillside, warm golden morning light, vibrant emerald greens.'
  },
  van_tho_tra: {
    title: 'Vạn Thọ Trà — Trà Dược Thảo Thảo',
    visualDescription: 'Traditional medicinal tea herbal ingredients, dried artichoke, lotus seeds, herbal teacup on dark rustic wood table.',
    colorPalette: '#2D3748, #D69E2E, #4A5568',
    suggestedPrompt: 'Still life photo of herbal medicinal tea ingredients with warm candlelight, authentic Asian wellness atmosphere.'
  },
  van_hy_tra: {
    title: 'Vạn Hỷ Trà — Trải nghiệm Trà Việt',
    visualDescription: 'Ceramic teapot set on bamboo mat, traditional tea brewing ritual, gentle steam rising, peaceful courtyard scene.',
    colorPalette: '#742A2A, #C53030, #EDF2F7',
    suggestedPrompt: 'Traditional Vietnamese tea ceremony setup, steaming cup of green tea on bamboo table, soft natural daylight.'
  },
  traba: {
    title: 'TRABA — Bánh ăn cùng trà',
    visualDescription: 'Artisanal traditional tea cakes served alongside clear green tea, elegant porcelain plate, cozy afternoon tea time.',
    colorPalette: '#7B341E, #DD6B20, #FEFCBF',
    suggestedPrompt: 'Flatlay photography of Vietnamese tea pastries and fresh green tea cup, warm bakery aesthetic.'
  },
  van_thinh_tra: {
    title: 'Vạn Thịnh Trà — Hộp quà trà biếu cao cấp',
    visualDescription: 'Luxury wooden gift box filled with premium tea tins, metallic gold lacquer finish, silk lining, high-end corporate gift.',
    colorPalette: '#1A202C, #D4AF37, #9B2C2C',
    suggestedPrompt: 'Luxury corporate gift set box with golden tea canisters, velvet background, studio product photography.'
  },
  general: {
    title: 'Trà Dược Việt Nam — Tinh hoa Trà Việt',
    visualDescription: 'Authentic Vietnamese tea experience, green tea plantation, artisan teapot, natural organic wellness theme.',
    colorPalette: '#1B4332, #D4AF37',
    suggestedPrompt: 'Commercial tea advertisement background, lush tea farm landscape, crystal clear tea cup.'
  }
};

/**
 * Retrieves matching visual assets for a given product line from PostgreSQL or falls back to brand presets.
 */
export async function getMatchingVisualAssets(productLine = 'general') {
  try {
    const res = await query(
      `SELECT title, category, image_url, visual_description, suggested_prompt, color_palette 
       FROM visual_assets 
       WHERE is_active = true 
         AND (product_line = $1 OR product_line = 'general' OR product_line = 'all') 
       ORDER BY id DESC 
       LIMIT 3`,
      [productLine]
    );

    if (res && res.rows && res.rows.length > 0) {
      return res.rows.map(row => ({
        title: row.title,
        category: row.category,
        imageUrl: row.image_url,
        visualDescription: row.visual_description,
        suggestedPrompt: row.suggested_prompt,
        colorPalette: row.color_palette
      }));
    }
  } catch (err) {
    console.warn('[VISUAL RAG] Database query skipped/fallback:', err.message);
  }

  // Fallback to static brand preset
  const preset = BRAND_VISUAL_PRESETS[productLine] || BRAND_VISUAL_PRESETS.general;
  return [preset];
}
