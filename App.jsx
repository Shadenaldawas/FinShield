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
← Back to Assessment
</button>
</div>
)}

</div>
)
}
