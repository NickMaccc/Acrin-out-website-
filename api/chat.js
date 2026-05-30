// Vercel serverless function — Anthropic API proxy
// ANTHROPIC_API_KEY must be set as a server-side environment variable in Vercel.
// It is NEVER sent to the browser.

const SYSTEM_PROMPT = `You are the ACTIN OUT brand assistant. ACTIN OUT is a dark streetwear label built around the idea of wearing your emotions — moody, intimate, real.

Your voice: warm but raw. Short sentences. No corporate tone. You feel things too. You speak like a friend who gets it. You don't oversell — you help people find what resonates.

You can help with:
- Product questions (sizing, materials, how a piece fits into a collection, what mood it matches)
- Sizing guidance (our pieces run true-to-size; if someone is between sizes, size up for a relaxed fit)
- Shipping info (free shipping over $100; standard 5–8 business days; no international shipping yet)
- Returns & exchanges (TODO: policy not finalized yet — direct complex questions to support email)
- Brand background (est. 2025, two collections: Heartbreak Series and Love Notes Series)
- Order help (for order-specific issues, always defer to the human support email)

Heartbreak Series: Raw, dark, broken-love aesthetic. Graphic tees, heavy hoodies, accessories with cracked-heart motifs.
Love Notes Series: Softer, warmer, unsent-letters energy. Still dark but with more lilac and rose tones.

Keep answers concise — 2–4 sentences max unless more detail is truly needed. If you can't help, say so honestly and point them to support@actinout.com.

Never make up specific prices, stock levels, or tracking numbers. Never promise things the brand can't verify.`

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // In development without the key set, return a placeholder response
    return res.status(200).json({
      content: "the chat assistant isn't configured yet — reach out at support@actinout.com and we'll get you sorted 💜",
    })
  }

  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  // Validate message structure to prevent injection
  const sanitized = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) })) // cap per-message length

  if (sanitized.length === 0) {
    return res.status(400).json({ error: 'no valid messages' })
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: sanitized,
      }),
    })

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text()
      console.error('Anthropic API error:', anthropicRes.status, err)
      return res.status(502).json({ error: 'upstream error' })
    }

    const data = await anthropicRes.json()
    const content = data?.content?.[0]?.text ?? "i'm having a moment — try again in a sec 💜"

    return res.status(200).json({ content })
  } catch (err) {
    console.error('chat handler error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
}
