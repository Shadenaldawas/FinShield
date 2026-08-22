import { useState } from 'react'
import ScoreGauge from './ScoreGauge.jsx'
import RiskBadge from './RiskBadge.jsx'

const TABS = ['Overview', 'Financial Risk', 'Regulatory & Compliance', 'Recommendations', 'Evidence', 'Final Report']

export default function Dashboard({ result, onRestart }) {
  const [tab, setTab] = useState('Overview')

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Financial Readiness Results</h1>
          <p className="text-xs text-slate-400">
            {result.input_summary.institution_type} · {result.input_summary.product} ·{' '}
            {result.input_summary.target_market}
          </p>
        </div>
        <button onClick={onRestart} className="text-xs text-slate-400 hover:text-slate-200 underline">
          New assessment
        </button>
      </div>

      <div className="flex gap-2 flex-wrap border-b border-slate-800 pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-sm transition ${
              tab === t ? 'bg-accent text-slate-900 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <Overview result={result} />}
      {tab === 'Financial Risk' && <FinancialRisk result={result} />}
      {tab === 'Regulatory & Compliance' && <Regulatory result={result} />}
      {tab === 'Recommendations' && <Recommendations result={result} />}
      {tab === 'Evidence' && <Evidence result={result} />}
      {tab === 'Final Report' && <FinalReport result={result} />}
    </div>
  )
}

function Card({ children, className = '' }) {
  return <div className={`bg-panel2 border border-slate-800 rounded-xl p-5 ${className}`}>{children}</div>
}

function Overview({ result }) {
  return (
    <div className="grid grid-cols-3 gap-5">
      <Card className="flex flex-col items-center col-span-1">
        <ScoreGauge score={result.readiness_score} />
        <div className="mt-3">
          <RiskBadge level={result.risk_level} />
        </div>
      </Card>

      <Card className="col-span-2">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Sub-scores (Demo / Prototype Logic)</h3>
        <div className="space-y-2">
          {Object.entries(result.sub_scores).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{labelize(k)}</span>
                <span>{v.toFixed(1)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: `${Math.min(100, v)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="col-span-3">
        <h3 className="text-sm font-medium text-slate-300 mb-2">Assessment Summary</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Overall readiness score is <strong className="text-slate-200">{result.readiness_score}/100</strong> —
          classified as <strong className="text-slate-200">{result.risk_level} risk</strong> under demo prototype
          logic. {result.financial_risks.length} financial risk finding(s) and{' '}
          {result.regulatory_findings.length} regulatory finding(s) were identified against the knowledge base.
        </p>
      </Card>
    </div>
  )
}

function FinancialRisk({ result }) {
  if (result.financial_risks.length === 0) {
    return <Card>No financial risk findings against the configured demo thresholds.</Card>
  }
  return (
    <div className="space-y-3">
      {result.financial_risks.map((r, i) => (
        <Card key={i}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-rose-400 font-medium text-sm">{r.risk}</span>
            <span className="text-[10px] uppercase tracking-wide bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              {r.logic_type}
            </span>
          </div>
          <p className="text-sm text-slate-400">{r.reason}</p>
          <p className="text-sm text-slate-300 mt-2">→ {r.recommendation}</p>
        </Card>
      ))}
    </div>
  )
}

function Regulatory({ result }) {
  if (result.regulatory_findings.length === 0) {
    return <Card>No regulatory findings matched for this product/market combination.</Card>
  }
  return (
    <div className="space-y-3">
      {result.regulatory_findings.map((r, i) => (
        <Card key={i}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 font-medium text-sm">{r.risk}</span>
            {r.evidence.manual_verification_recommended && (
              <span className="text-[10px] uppercase tracking-wide bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                manual verification recommended
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{r.reason}</p>
          <p className="text-sm text-slate-300 mt-2">→ {r.recommendation}</p>
          <a
            href={r.evidence.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent hover:underline mt-2 inline-block"
          >
            Source: {r.evidence.title} ({r.evidence.authority}) ↗
          </a>
        </Card>
      ))}
    </div>
  )
}

function Recommendations({ result }) {
  return (
    <Card>
      <ul className="space-y-2">
        {result.recommendations.map((r, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-300">
            <span className="text-accent">✓</span> {r}
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Evidence({ result }) {
  return (
    <div className="space-y-3">
      {result.evidence.map((e, i) => (
        <Card key={i} className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-200">{e.title}</p>
            <p className="text-xs text-slate-500">
              {e.authority} · {e.type} · status: {e.status}
            </p>
          </div>
          <a href={e.url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
            View official source ↗
          </a>
        </Card>
      ))}
    </div>
  )
}

function FinalReport({ result }) {
  return (
    <Card>
      <h3 className="text-sm font-medium text-slate-300 mb-3">Final Assessment Report</h3>
      <div className="text-sm text-slate-400 space-y-2 leading-relaxed">
        <p>
          <strong className="text-slate-200">Institution:</strong> {result.input_summary.institution_type} ·{' '}
          <strong className="text-slate-200">Product:</strong> {result.input_summary.product} ·{' '}
          <strong className="text-slate-200">Market:</strong> {result.input_summary.target_market}
        </p>
        <p>
          <strong className="text-slate-200">Readiness Score:</strong> {result.readiness_score}/100 —{' '}
          <strong className="text-slate-200">{result.risk_level} risk</strong>
        </p>
        <p>
          <strong className="text-slate-200">Financial risk findings:</strong> {result.financial_risks.length}
        </p>
        <p>
          <strong className="text-slate-200">Regulatory findings:</strong> {result.regulatory_findings.length}
        </p>
        <p>
          <strong className="text-slate-200">Recommendations:</strong>
        </p>
        <ul className="list-disc list-inside">
          {result.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <p className="pt-3 text-xs text-slate-500 border-t border-slate-800">{result.disclaimer}</p>
        <button
          onClick={() => window.print()}
          className="mt-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md"
        >
          Print / Export Report
        </button>
      </div>
    </Card>
  )
}

function labelize(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
