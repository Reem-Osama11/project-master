import app from '../server.js'

export default function handler(req, res) {
  // رجّع المسار الأصلي من الـ query اللي ضفناه في الـ rewrite
  const url = new URL(req.url, 'http://localhost')
  const path = url.searchParams.get('path')

  if (path !== null) {
    url.searchParams.delete('path')
    const qs = url.searchParams.toString()
    req.url = '/' + path + (qs ? '?' + qs : '')
  }

  return app(req, res)
}