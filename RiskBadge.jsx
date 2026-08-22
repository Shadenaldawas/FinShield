const STYLES = {
  Low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  High: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
}

export default function RiskBadge({ level }) {
  const style = STYLES[level] || STYLES.Medium
  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${style}`}>
      {level} Risk
    </span>
  )
}
