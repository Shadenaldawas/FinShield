import { useState } from 'react'

export default function App() {
  const [view, setView] = useState('landing')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleStart = () => setView('form')

  const handleSubmit = (e) => {
    e.preventDefault()
    setView('loading')
    
    // شبيكة محاكاة للتحليل
    setTimeout(() => {
      setResult({
        overallScore: 85,
        status: 'PASS',
        riskLevel: 'Low Risk',
        summary: 'The institution demonstrates strong financial readiness and capital adequacy under ITU guidelines.',
        recommendations: [
          'Maintain current liquidity buffers.',
          'Ensure continuous monitoring of operational expenses.',
          'Align cybersecurity frameworks with SAMA standards.'
        ]
      })
      setView('results')
    }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1119', color: '#f8fafc', fontFamily: 'sans-serif', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ backgroundColor: '#10b981', color: '#0f172a', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>FS</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>FinShield</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>ITU AI Readiness 2.0 Hackathon — Prototype</span>
        </header>

        {/* Disclaimer Banner */}
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fef3c7', padding: '12px', borderRadius: '8px', fontSize: '12px', marginBottom: '32px' }}>
          Decision-support prototype only — not a certified financial or regulatory assessment tool. Built for the ITU AI Readiness 2.0 Hackathon.
        </div>

        {/* 1. LANDING VIEW */}
        {view === 'landing' && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>AI-Powered Financial Readiness Assessment</h1>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 24px auto', fontSize: '14px' }}>
              FinShield combines your institution's financial profile with an official-sources-only regulatory knowledge base to produce an explainable readiness score, risk breakdown, and evidence-backed recommendations.
            </p>
            <button 
              onClick={handleStart} 
              style={{ backgroundColor: '#10b981', color: '#0f172a', fontWeight: 'bold', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}
            >
              Start Assessment →
            </button>
          </div>
        )}

        {/* 2. FORM VIEW */}
        {view === 'form' && (
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 6px 0' }}>Institution, Product & Financials</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>Pre-filled with the hackathon demo scenario. Edit any field.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Institution type</label>
                <input type="text" defaultValue="Fintech Sandbox Applicant" style={{ width: '100%', padding: '8px 12px', backgroundColor: '#030712', border: '1px solid #1e293b', color: '#fff', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Proposed product</label>
                <input type="text" defaultValue="Digital Investment Platform" style={{ width: '100%', padding: '8px 12px', backgroundColor: '#030712', border: '1px solid #1e293b', color: '#fff', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Annual revenue (SAR)</label>
                <input type="text" defaultValue="15,000,000" style={{ width: '100%', padding: '8px 12px', backgroundColor: '#030712', border: '1px solid #1e293b', color: '#fff', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Capital adequacy ratio (%)</label>
                <input type="text" defaultValue="18.5" style={{ width: '100%', padding: '8px 12px', backgroundColor: '#030712', border: '1px solid #1e293b', color: '#fff', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
            >
              Run Readiness Assessment
            </button>
          </form>
        )}

        {/* 3. LOADING PIPELINE VIEW */}
        {view === 'loading' && (
          <div style={{ maxWidth: '400px', margin: '48px auto', textAlign: 'center' }}>
            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '16px' }}>Evaluating Assessment Pipeline...</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontSize: '13px', color: '#94a3b8' }}>
              <div>• SRC — receiving institution data</div>
              <div>• C — collecting submission</div>
              <div>• PP — validating & normalizing</div>
              <div>• M — scoring financial readiness</div>
              <div>• P — applying policy thresholds & retrieving regulations</div>
            </div>
          </div>
        )}

        {/* 4. RESULTS VIEW */}
        {view === 'results' && result && (
          <div style={{ backgroundColor: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Assessment Results</h2>
                <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 'bold' }}>Status: {result.status}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{result.overallScore}</span>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>/ 100 Score</span>
              </div>
            </div>

            <p style={{ backgroundColor: '#030712', padding: '14px', borderRadius: '8px', fontSize: '13px', color: '#cbd5e1', border: '1px solid #1e293b', lineHeight: '1.5' }}>
              {result.summary}
            </p>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Recommendations:</h4>
              <ul style={{ fontSize: '12px', color: '#cbd5e1', paddingLeft: '20px' }}>
                {result.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{rec}</li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => setView('form')} 
              style={{ marginTop: '20px', padding: '8px 16px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
            >
              ← Back to Assessment
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
