// Ollama local HTTP provider for AI chat
// Uses local Ollama HTTP API at http://localhost:11434 and model llama3.2:3b
const fetch = globalThis.fetch || (() => {
  try {
    return require('node-fetch');
  } catch (err) {
    return undefined;
  }
})();

const OLLAMA_BASE = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

function buildMessages(message, history = []) {
  const messages = [];
  messages.push({ role: 'system', content: 'You are a helpful shopping assistant. Keep answers concise and user-friendly.' });

  if (Array.isArray(history)) {
    history.forEach(h => {
      const role = (h.sender === 'ai' || h.sender === 'assistant') ? 'assistant' : 'user';
      const content = String(h.text || h.message || '');
      messages.push({ role, content });
    });
  }

  messages.push({ role: 'user', content: String(message || '') });
  return messages;
}

async function extractTextFromOllamaJson(json) {
  if (!json) return '';

  if (Array.isArray(json.results)) {
    let out = '';
    for (const r of json.results) {
      if (Array.isArray(r.content)) {
        for (const c of r.content) {
          if (c.type === 'message' && c.author === 'assistant' && c.text) {
            out += c.text;
          } else if (c.text) {
            out += c.text;
          } else if (c.message) {
            out += c.message;
          }
        }
      }
    }
    if (out) return out.trim();
  }

  // Ollama single-response shape: { message: { role: 'assistant', content: '...' } }
  if (json.message && json.message.content) return String(json.message.content).trim();
  if (json.response && json.response.message && json.response.message.content) return String(json.response.message.content).trim();
  if (json.output && json.output.message && json.output.message.content) return String(json.output.message.content).trim();

  if (typeof json.reply === 'string') return json.reply.trim();
  if (typeof json.response === 'string') return json.response.trim();
  if (typeof json.output_text === 'string') return json.output_text.trim();

  if (Array.isArray(json.choices) && json.choices[0]) {
    const c = json.choices[0];
    if (c.message && c.message.content) return String(c.message.content).trim();
    if (c.text) return String(c.text).trim();
  }

  if (typeof json.text === 'string') return json.text.trim();

  return '';
}

/**
 * Generate AI text via Ollama local HTTP API.
 * @param {{message:string, history:Array}} params
 * @returns {Promise<string>}
 */
async function generateResponse({ message, history = [] } = {}) {
  if (!fetch) {
    throw new Error('No fetch available in this environment. Please ensure node-fetch is installed or Node has global fetch.');
  }

  const url = `${OLLAMA_BASE}/api/chat`;
  const messages = buildMessages(message, history);

  const body = {
    model: OLLAMA_MODEL,
    messages,
    // request a single JSON response rather than streaming NDJSON
    stream: false
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Ollama API request failed: ${res.status} ${res.statusText} ${txt}`);
  }

  // Read raw text so we can support both single JSON and NDJSON streaming
  const raw = await res.text().catch(() => '');

  let json = null;
  let aiText = '';

  if (raw) {
    try {
      json = JSON.parse(raw);
    } catch (e) {
      // not a single JSON payload; may be NDJSON/streamed
      json = null;
    }
  }

  if (json) {
    aiText = await extractTextFromOllamaJson(json);
  }

  // If empty, attempt NDJSON/stream parsing: consider last non-empty JSON line
  if (!aiText || String(aiText).trim().length === 0) {
    try {
      const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const parsed = JSON.parse(lines[i]);
          const alt = await extractTextFromOllamaJson(parsed);
          if (alt && String(alt).trim().length > 0) {
            aiText = alt;
            break;
          }

          // handle delta fragments sometimes emitted in streams
          if (parsed.delta) {
            if (typeof parsed.delta === 'string') {
              aiText = (aiText || '') + parsed.delta;
            } else if (parsed.delta && parsed.delta.message && parsed.delta.message.content) {
              aiText = (aiText || '') + String(parsed.delta.message.content);
            }
          }
        } catch (e) {
          // ignore parse errors per-line
        }
      }
    } catch (e) {
      console.error('Ollama NDJSON parsing error:', e && e.stack ? e.stack : e);
    }
  }

  if (!aiText || String(aiText).trim().length === 0) {
    console.warn('Ollama provider returned empty text after parsing.');
  }

  return String(aiText || '').trim();
}

module.exports = { generateResponse };
