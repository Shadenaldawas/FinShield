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
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto', color: '#f8fafc', backgroundColor: '#0b1119', minHeight: '100vh' }}>
      
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', margin: 0, color: '#38bdf8' }}>FS | FinShield</h1>
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>ITU AI Readiness 2.0 Hackathon — Prototype</span>
      </div>

      <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fef3c7', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '20px' }}>
        Decision-support prototype only — not a certified financial assessment tool.
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '16px', marginTop: 0, marginBottom: '6px' }}>Institution, Product & Financials</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: 0, marginBottom: '20px' }}>Pre-filled with the hackathon demo scenario. Edit any field.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>Institution type</label>
              <input type="text" defaultValue="Fintech Sandbox Applicant" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>Proposed product</label>
              <input type="text" defaultValue="Digital Investment Platform" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>Annual revenue (SAR)</label>
              <input type="text" defaultValue="15,000,000" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#cbd5e1' }}>Capital adequacy ratio (%)</label>
              <input type="text" defaultValue="18.5" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Evaluating Readiness...' : 'Run Readiness Assessment'}
          </button>
        </form>
      ) : (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Assessment Results</h2>
              <span style={{ fontSize: '12px', color: '#4ade80' }}>Status: {result.status}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#38bdf8' }}>{result.overallScore}</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>/ 100 Overall Score</span>
            </div>
          </div>

          <p style={{ background: '#0f172a', padding: '12px', borderRadius: '6px', fontSize: '13px', lineHeight: '1.5', color: '#cbd5e1' }}>
            {result.summary}
          </p>

          <button 
            onClick={() => setResult(null)} 
            style={{ marginTop: '16px', padding: '8px 16px', background: '#475569', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Back to Assessment
          </button>
        </div>
      )}

    </div>
  )
}
