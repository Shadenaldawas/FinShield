const API_BASE = 'http://localhost:8000'

export async function assess(payload) {
  const res = await fetch(`${API_BASE}/api/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Assessment failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function fetchDemoInstitutions() {
  const res = await fetch(`${API_BASE}/api/demo-institutions`)
  return res.json()
}

export async function fetchSources() {
  const res = await fetch(`${API_BASE}/api/sources`)
  return res.json()
}
