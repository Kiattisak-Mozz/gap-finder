// Vercel serverless proxy — forwards requests to the HTTP bot server.
// Needed because Vercel serves on HTTPS and browsers block mixed-content
// (HTTPS page → HTTP fetch). Server-to-server has no such restriction.
export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'missing url param' })

  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return res.status(400).json({ error: 'invalid url' })
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return res.status(400).json({ error: 'invalid protocol' })
  }

  try {
    const ctrl  = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    const upstream = await fetch(parsed.toString(), { signal: ctrl.signal })
    clearTimeout(timer)

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'upstream error' })
    }

    const data = await upstream.json()
    res.setHeader('Cache-Control', 'no-store')
    res.json(data)
  } catch (e) {
    res.status(502).json({ error: 'proxy failed', detail: String(e.message) })
  }
}
