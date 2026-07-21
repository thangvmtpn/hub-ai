import Anthropic from '@anthropic-ai/sdk';

// ─── Initialize Anthropic if key exists ──────────────────────────────────────
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

/**
 * Streams LLM response, attempting Anthropic first, falling back to OpenAI
 * if Anthropic fails or is disabled.
 *
 * @param {Object} options
 * @param {string} options.systemPrompt
 * @param {string} options.userPrompt
 * @param {Function} options.onChunk - Callback for each text chunk (str) => void
 * @param {Function} options.onComplete - Callback when stream finishes
 * @param {Function} options.onError - Callback on error (err) => void
 */
export async function streamLLM(options) {
  const { systemPrompt, userPrompt, onChunk, onComplete, onError } = options;

  let useOpenAI = !anthropic;

  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        stream: true,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
      });

      for await (const event of response) {
        if (event.type === 'content_block_delta' && event.delta?.text) {
          onChunk(event.delta.text);
        }
      }
      onComplete();
      return;
    } catch (err) {
      console.warn('Anthropic API failed, checking if fallback to OpenAI is possible...', err);
      // If organization is disabled or invalid key, we fallback
      if (
        err.message?.includes('disabled') ||
        err.message?.includes('key') ||
        err.status === 400 ||
        err.status === 401
      ) {
        useOpenAI = true;
      } else {
        onError(err);
        return;
      }
    }
  }

  if (useOpenAI) {
    if (!process.env.OPENAI_API_KEY) {
      onError(new Error('Cả Anthropic API Key và OpenAI API Key đều không khả dụng hoặc bị lỗi.'));
      return;
    }

    try {
      console.log('Using OpenAI fallback (gpt-4o)...');
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: userPrompt });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `OpenAI API returned status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep the last partial line in the buffer

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;
          if (cleanLine === 'data: [DONE]') continue;

          if (cleanLine.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(cleanLine.slice(6));
              const chunkText = parsed.choices?.[0]?.delta?.content || '';
              if (chunkText) {
                onChunk(chunkText);
              }
            } catch (e) {
              // Ignore parse errors on incomplete chunks
            }
          }
        }
      }

      onComplete();
    } catch (err) {
      console.error('OpenAI fallback also failed:', err);
      onError(err);
    }
  }
}
