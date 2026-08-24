export default function ScoreGauge({ score }) {
  const pct = Math.max(0, Math.min(100, score))
  const color = pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#f43f5e'
  const circumference = 2 * Math.PI * 54

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" stroke="#1e293b" strokeWidth="12" fill="none" />
        <circle
          cx="70"
          cy="70"
          r="54"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (pct / 100) * circumference}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="700" fill="#f1f5f9">
          {pct.toFixed(0)}
        </text>
        <text x="70" y="85" textAnchor="middle" fontSize="11" fill="#94a3b8">
          / 100
        </text>
      </svg>
      <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
        Financial Readiness Score
      </p>
    </div>
  )
}
