import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAgentById, buildPrompt } from '@/lib/agents';
import { getAgentTraining } from '@/lib/training';
import {
  PRODUCTS, CONTENT_MATRIX, TEA_SCIENCE,
  IMAGE_PROMPTS, FORMAT_GUIDELINES,
  getContentIdeas, getProductInfo, getImagePrompt
} from '@/lib/tea-knowledge';
import { streamLLM } from '@/lib/llm';

// ─── Map user selections → internal keys ─────────────────────────────────────
const GROUP_MAP = {
  'Gây Chú Ý': 'gay_chu_y',
  'Tạo Cảm Xúc': 'tao_cam_xuc',
  'Xây Niềm Tin': 'xay_niem_tin',
  'Giải Thích Logic': 'giai_thich_logic',
  'Tạo Mong Muốn': 'tao_mong_muon',
  'Xã Hội Chứng Nhận': 'xa_hoi_chung_nhan',
  'Thúc Đẩy Hành Động': 'thuc_day_hanh_dong',
};

const PRODUCT_MAP = {
  'Vạn Lộc Trà': 'van_loc_tra',
  'Vạn Thọ Trà': 'van_tho_tra',
  'Vạn Hỷ Trà': 'van_hy_tra',
  'TRABA': 'traba',
  'Vạn Thịnh Trà': 'van_thinh_tra',
  'Tất cả': 'general',
};

const STYLE_MAP = {
  'Nhiếp ảnh chuyên nghiệp': 'photography',
  'Watercolor nghệ thuật': 'watercolor',
  'Flat illustration': 'flat',
  'Lifestyle photography': 'lifestyle',
  'Closeup macro': 'macro',
};

const FORMAT_MAP = {
  'Dòng trạng thái ngắn': 'status_short',
  'Bài đăng chi tiết': 'post_detail',
  'Podcast script': 'podcast_script',
  'Series 3 bài liên tiếp': 'series_3',
  'Infographic text': 'infographic_text',
};

function parseKey(value, map) {
  if (!value) return null;
  for (const [label, key] of Object.entries(map)) {
    if (value.includes(label)) return key;
  }
  return null;
}

// ─── Build system prompt cho Claude ───────────────────────────────────────────
function buildSystemPrompt(groupKey, productKey, formatKey, tone) {
  const group = CONTENT_MATRIX[groupKey];
  const product = getProductInfo(productKey);
  const ideas = getContentIdeas(groupKey, productKey);
  const format = FORMAT_GUIDELINES[formatKey] || FORMAT_GUIDELINES.post_detail;

  let sys = `BẠN LÀ MỘT CHUYÊN GIA SÁNG TẠO NỘI DUNG CAO CẤP cho thương hiệu trà Việt Nam.
Bạn tạo content cho nhân viên chăm sóc khách hàng gửi cho khách hàng hàng ngày.

## VAI TRÒ
- Bạn viết dưới góc nhìn của nhân viên CSKH chia sẻ với khách hàng
- Giọng văn tự nhiên, ấm áp, như đang trò chuyện
- Không bán hàng lộ liễu, mà chia sẻ giá trị thật

## THƯƠNG HIỆU
- Công ty: Trà Dược Việt Nam (Trà Bà Vân - trabavan.vn)
- Sứ mệnh: Lan tỏa văn hóa trà Việt, mang đến sản phẩm trà chất lượng cao
- Phong cách: Truyền thống nhưng hiện đại, tinh tế, đẳng cấp

## KIẾN THỨC NỀN TẢNG
${TEA_SCIENCE}

`;

  if (product) {
    sys += `\n## DÒNG SẢN PHẨM ĐANG VIẾT: ${product.name} — ${product.category}
${product.tagline}

Sản phẩm trong dòng:
${product.items.map(i => `- **${i.name}**: ${i.desc}`).join('\n')}
`;
  }

  if (group) {
    sys += `\n## NHÓM CONTENT: ${group.label}
${group.desc}
`;
  }

  if (ideas.length > 0) {
    sys += `\n## Ý TƯỞNG CHỦ ĐỀ GỢI Ý (tham khảo hoặc sáng tạo thêm):
${ideas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}
`;
  }

  sys += `\n## ĐỊNH DẠNG YÊU CẦU: ${format.label}
${format.guidelines}
`;

  if (tone) {
    sys += `\n## GIỌNG ĐIỆU: ${tone}\n`;
  }

  sys += `
## QUY TẮC VIẾT
1. **BÀI VIẾT HOÀN CHỈNH**: Tạo ra duy nhất 1 bài viết hoàn chỉnh liền mạch (gồm tiêu đề thu hút và nội dung chi tiết). KHÔNG phân tách thành các mục phân tích cấu trúc như "Tiêu đề", "Mở bài", "Thân bài", "Lời khuyên", "Ý nghĩa". Bài viết phải sẵn sàng để người dùng copy-paste gửi ngay cho khách hàng.
2. **SỬ DỤNG EMOJI SINH ĐỘNG**: Chèn các icon/emoji phù hợp một cách phong phú và tự nhiên vào bài viết (ví dụ: 🍵, 🌱, ✨, 💚, 🌸, 🎁, 📝, ☕, 🌄) để bài viết trông sinh động, bắt mắt và dễ đọc hơn.
3. **GIÁ TRỊ NỘI DUNG**: Nội dung phải hay, có chiều sâu, mang lại giá trị thật cho người đọc, có "aha moment". KHÔNG dùng các từ sáo rỗng quảng cáo lộ liễu ("hoàn hảo", "số 1", "tuyệt vời nhất").
4. **KHÔNG QUẢNG CÁO LỘ LIỄU**: Không đưa giá tiền hay link mua hàng vào bài viết.
5. **ĐỊNH DẠNG SOCIAL MEDIA CHUYÊN NGHIỆP**:
   - **Tiêu đề (Hook) cuốn hút**: Sử dụng các icon/emoji nổi bật ở đầu tiêu đề, viết hoa một số từ khóa chính để thu hút mắt người đọc ngay lập tức.
   - **Phân tách đoạn rõ ràng**: Luôn sử dụng 2 lần xuống dòng (dòng trống) giữa các đoạn văn để bài viết thông thoáng, dễ đọc trên điện thoại. Tránh viết các khối chữ quá dài.
   - **Danh sách bullet points bằng Emoji**: Thay vì dùng dấu gạch ngang (-) thông thường, hãy sử dụng các emoji phù hợp (như 🌱, 🍵, ✦, ✔, 📌, 💡) để làm nổi bật các ý liệt kê.
   - **Hashtags ở cuối**: Luôn thêm các hashtag liên quan ở cuối bài viết, tách biệt với nội dung chính bằng 1-2 dòng trống. Các hashtag viết dạng CamelCase hoặc liền không dấu (ví dụ: #VanLocTra, #TraXanhThaiNguyen).

## ĐẶC BIỆT QUAN TRỌNG
Cuối bài viết, bạn PHẢI tạo ra một Visual Prompt (bằng TIẾNG ANH) tóm tắt nội dung chính của bài viết để vẽ ảnh. 
Đặt Visual Prompt này vào giữa thẻ [IMAGE_PROMPT] và [/IMAGE_PROMPT], ví dụ:

[IMAGE_PROMPT]
A high quality photo of a traditional Vietnamese teapot on a wooden table, warm morning light, lush green background.
[/IMAGE_PROMPT]

Ảnh PHẢI ăn khớp với nội dung bài viết trên và KHÔNG chứa chữ/text.`;

  return sys;
}

// ─── Build image prompt từ style + context ────────────────────────────────────
function selectImageVariant(productKey) {
  const variantMap = {
    van_loc_tra: 'tea_leaves',
    van_tho_tra: 'teapot',
    van_hy_tra: 'tea_moment',
    traba: 'tea_cake',
    van_thinh_tra: 'tea_gift',
    general: 'tea_hill',
  };
  return variantMap[productKey] || 'teapot';
}

// ─── Generate image with DALL-E 3 ────────────────────────────────────────────
const FALLBACK_IMAGES = {
  van_loc_tra: [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1024&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1024&auto=format&fit=crop'
  ],
  van_tho_tra: [
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1024&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594920764501-7e5de7726a4c?q=80&w=1024&auto=format&fit=crop'
  ],
  van_hy_tra: [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1024&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=1024&auto=format&fit=crop'
  ],
  traba: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1024&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=1024&auto=format&fit=crop'
  ],
  van_thinh_tra: [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1024&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1024&auto=format&fit=crop'
  ],
  general: [
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1024&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=1024&auto=format&fit=crop'
  ]
};

async function generateImage(prompt, style, productKey) {
  const styleObj = IMAGE_PROMPTS[style] || IMAGE_PROMPTS.photography;
  const variant = selectImageVariant(productKey);
  const fallbackPrompt = `${styleObj.variants[variant] || styleObj.variants.teapot}. ${styleObj.basePrompt}`;

  // Use the AI-generated prompt if available, otherwise fallback
  const negativePrompt = "No text, no words, no letters, no typography, no watermarks, clean focus.";
  const finalPrompt = prompt
    ? `${prompt}. Style: ${styleObj.basePrompt}. ${negativePrompt}`
    : `${fallbackPrompt}. ${negativePrompt}`;

  const getUnsplashFallback = () => {
    const list = FALLBACK_IMAGES[productKey] || FALLBACK_IMAGES.general;
    return list[Math.floor(Math.random() * list.length)];
  };

  const callGeminiImageAPI = async () => {
    return await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: finalPrompt,
              }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["IMAGE"]
        }
      }),
    });
  };

  const callOpenAIImageAPI = async (modelName) => {
    return await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024'
      }),
    });
  };

  try {
    let response;
    let isFallback = false;
    let originalError = null;
    let provider = null;

    if (process.env.OPENAI_API_KEY) {
      console.log('Generating image with OpenAI DALL-E 3...');
      provider = 'openai';
      response = await callOpenAIImageAPI('dall-e-3');
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errMsg = err.error?.message || JSON.stringify(err);
        console.warn('OpenAI DALL-E 3 failed:', errMsg);
        originalError = errMsg;

        // Try falling back to Gemini if OpenAI fails
        if (process.env.GEMINI_API_KEY) {
          console.log('OpenAI failed, falling back to Gemini Imagen 3 (Nano Banana 2)...');
          provider = 'gemini';
          response = await callGeminiImageAPI();
        } else {
          // If no Gemini key, try DALL-E 2 as OpenAI fallback before final fallback
          console.log('Falling back to DALL-E 2...');
          provider = 'openai_dalle2';
          response = await callOpenAIImageAPI('dall-e-2');
          if (!response.ok) {
            isFallback = true;
          }
        }
      }
    } else if (process.env.GEMINI_API_KEY) {
      console.log('OPENAI_API_KEY not found. Using Gemini Imagen 3 (Nano Banana 2)...');
      provider = 'gemini';
      response = await callGeminiImageAPI();
      if (!response.ok) {
        isFallback = true;
      }
    } else {
      console.warn('No image API keys available. Using Unsplash fallback.');
      isFallback = true;
    }

    // Process OpenAI response (DALL-E 3 or DALL-E 2)
    if (!isFallback && (provider === 'openai' || provider === 'openai_dalle2')) {
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errMsg = err.error?.message || '';
        console.warn(`${provider} API failed:`, errMsg);
        originalError = errMsg;

        // If DALL-E 3 failed, try DALL-E 2
        if (provider === 'openai' && (errMsg.includes('does not exist') || errMsg.includes('model_not_found') || errMsg.includes('billing') || errMsg.includes('credit'))) {
          console.log('Falling back to DALL-E 2...');
          provider = 'openai_dalle2';
          response = await callOpenAIImageAPI('dall-e-2');
          if (!response.ok) {
            // Try Gemini as last resort if we have Gemini key
            if (process.env.GEMINI_API_KEY) {
              console.log('DALL-E 2 also failed, falling back to Gemini Imagen 3...');
              provider = 'gemini';
              response = await callGeminiImageAPI();
            } else {
              isFallback = true;
            }
          }
        } else {
          // If it's already DALL-E 2 or a non-recoverable error, try Gemini if key exists
          if (process.env.GEMINI_API_KEY) {
            console.log('OpenAI failed, falling back to Gemini Imagen 3...');
            provider = 'gemini';
            response = await callGeminiImageAPI();
          } else {
            isFallback = true;
          }
        }
      }
      
      // If we successfully called and parsed an OpenAI request
      if (!isFallback && (provider === 'openai' || provider === 'openai_dalle2')) {
        const data = await response.json();
        return {
          url: data.data?.[0]?.url,
          revised_prompt: data.data?.[0]?.revised_prompt || finalPrompt,
          isFallback: false
        };
      }
    }

    if (!isFallback && provider === 'gemini') {
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errMsg = err.error?.message || JSON.stringify(err);
        console.warn('Gemini Imagen 3 failed:', errMsg);
        originalError = errMsg;
        isFallback = true;
      } else {
        const data = await response.json();
        const part = data.candidates?.[0]?.content?.parts?.[0];
        const inlineData = part?.inlineData;
        if (inlineData && inlineData.data) {
          const mimeType = inlineData.mimeType || 'image/png';
          return {
            url: `data:${mimeType};base64,${inlineData.data}`,
            revised_prompt: finalPrompt,
            isFallback: false
          };
        } else {
          console.warn('Invalid Gemini response format:', data);
          originalError = 'Invalid response format';
          isFallback = true;
        }
      }
    }

    if (isFallback) {
      return {
        url: getUnsplashFallback(),
        isFallback: true,
        originalError: originalError || 'All models failed'
      };
    }
  } catch (err) {
    console.error('Image generation error, falling back to Unsplash:', err);
    return {
      url: getUnsplashFallback(),
      isFallback: true,
      originalError: err.message
    };
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { formData } = await request.json();
    const {
      content_group = '',
      product_line = '',
      content_format = '',
      tone = '',
      image_style = '',
      custom_topic = '',
    } = formData || {};

    // Parse keys
    const groupKey = parseKey(content_group, GROUP_MAP) || 'gay_chu_y';
    const productKey = parseKey(product_line, PRODUCT_MAP) || 'general';
    const formatKey = parseKey(content_format, FORMAT_MAP) || 'post_detail';
    const styleKey = parseKey(image_style, STYLE_MAP) || 'photography';

    // Build system prompt
    const systemPrompt = buildSystemPrompt(groupKey, productKey, formatKey, tone);

    // Build user prompt
    let userPrompt = `Hãy viết một bài content thuộc nhóm "${content_group}" cho dòng sản phẩm "${product_line}".`;
    if (custom_topic) {
      userPrompt += `\n\nChủ đề cụ thể: ${custom_topic}`;
    } else {
      // Pick a random idea from the matrix
      const ideas = getContentIdeas(groupKey, productKey);
      if (ideas.length > 0) {
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
        userPrompt += `\n\nGợi ý chủ đề: ${randomIdea}`;
      }
    }
    userPrompt += `\n\nĐịnh dạng: ${content_format}\nGiọng điệu: ${tone || 'Thân thiện, gần gũi'}`;

    // Check for custom training
    const training = getAgentTraining('biz_content_creator');

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Step 1: Stream text content from LLM (Claude with OpenAI fallback)
          let fullText = '';
          let sentText = '';
          await streamLLM({
            systemPrompt: training?.systemPrompt
              ? `${systemPrompt}\n\n${training.systemPrompt}`
              : systemPrompt,
            userPrompt,
            onChunk(chunk) {
              fullText += chunk;
              const markerIdx = fullText.indexOf('[IMAGE_PROMPT]');
              if (markerIdx === -1) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
                sentText += chunk;
              } else {
                const beforeMarker = fullText.substring(0, markerIdx);
                const chunkToStream = beforeMarker.substring(sentText.length);
                if (chunkToStream) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkToStream })}\n\n`));
                  sentText += chunkToStream;
                }
              }
            },
            onComplete() {},
            onError(err) {
              throw err;
            }
          });

          // Step 2: Extract image prompt from Claude's response
          let aiImagePrompt = null;
          
          // Lấy nội dung nằm trong [IMAGE_PROMPT]...[/IMAGE_PROMPT] hoặc ---IMAGE_PROMPT---
          const imgMatch = fullText.match(/\[IMAGE_PROMPT\]([\s\S]*?)\[\/IMAGE_PROMPT\]/i) || 
                           fullText.match(/---IMAGE_PROMPT---([\s\S]*?)---END_IMAGE_PROMPT---/i) ||
                           fullText.match(/IMAGE_PROMPT:([\s\S]*)$/i);
                           
          if (imgMatch && imgMatch[1]) {
            aiImagePrompt = imgMatch[1].trim();
          }

          // Send the clean text (without image prompt markers)
          let cleanText = fullText
            .replace(/\s*\[IMAGE_PROMPT\][\s\S]*?\[\/IMAGE_PROMPT\]\s*/ig, '')
            .replace(/\s*---IMAGE_PROMPT---[\s\S]*?---END_IMAGE_PROMPT---\s*/ig, '')
            .trim();

          // Notify client that text is complete
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ textComplete: true, cleanText })}\n\n`));

          // Step 3: Generate image with DALL-E 3
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ imageLoading: true })}\n\n`));

          const imageResult = await generateImage(aiImagePrompt, styleKey, productKey);

          if (imageResult.error) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              imageError: imageResult.error,
              imageFallback: true
            })}\n\n`));
          } else {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              image: {
                url: imageResult.url,
                prompt: aiImagePrompt || 'Auto-generated',
                revised_prompt: imageResult.revised_prompt,
                style: styleKey
              }
            })}\n\n`));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          console.error('Content creator error:', err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── GET: Return content ideas for the frontend ──────────────────────────────
export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const group = searchParams.get('group');
  const product = searchParams.get('product');

  if (group && product) {
    const ideas = getContentIdeas(group, product);
    return NextResponse.json({ ideas });
  }

  // Return full matrix structure for the UI
  return NextResponse.json({
    groups: Object.entries(CONTENT_MATRIX).map(([key, val]) => ({
      key,
      label: val.label,
      desc: val.desc,
    })),
    products: Object.entries(PRODUCTS).map(([key, val]) => ({
      key,
      name: val.name,
      category: val.category,
    })),
    styles: Object.entries(IMAGE_PROMPTS).map(([key, val]) => ({
      key,
      label: val.label,
    })),
    formats: Object.entries(FORMAT_GUIDELINES).map(([key, val]) => ({
      key,
      label: val.label,
    })),
  });
}
