import { useState } from 'react'
import { assess } from './api.js'

export default function App() {
const [loading, setLoading] = useState(false)
const [result, setResult] = useState(null)

const handleSubmit = async (e) => {
e.preventDefault()
setLoading(true)
const data = await assess({})
setResult(data)
setLoading(false)
}

return (
<div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
<h1>FinShield Prototype</h1>
<p style={{ color: '#94a3b8' }}>Decision-support evaluation tool for ITU AI Readiness 2.0</p>

{!result ? (
<button 
onClick={handleSubmit} 
style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
>
{loading ? 'Evaluating...' : 'Run Assessment'}
</button>
) : (
<div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
<h2>Score: {result.overallScore} / 100</h2>
<p>Status: <strong style={{ color: '#4ade80' }}>{result.status}</strong></p>
<p>Risk Level: {result.riskLevel}</p>
<p>{result.summary}</p>
<button 
onClick={() => setResult(null)} 
style={{ padding: '8px 16px', background: '#475569', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
>
Reset
</button>
</div>
)}
</div>
)
}
