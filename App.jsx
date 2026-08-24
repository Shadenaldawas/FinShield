import { useState } from 'react'
import DisclaimerBanner from './DisclaimerBanner.jsx'
import AssessmentForm from './AssessmentForm.jsx'
import Dashboard from './Dashboard.jsx'
import { assess } from './api.js'

const VIEWS = { LANDING: 'landing', FORM: 'form', LOADING: 'loading', RESULTS: 'results' }

export default function App() {
  const [view, setView] = useState(VIEWS.LANDING)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(payload) {
    setView(VIEWS.LOADING)
    setError(null)
    try {
      const data = await assess(payload)
      setResult(data)
      setView(VIEWS.RESULTS)
    } catch (e) {
      setError(e.message)
      setView(VIEWS.FORM)
    }
  }

  function restart() {
    setResult(null)
    setView(VIEWS.FORM)
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold">
            FS
          </div>
          <span className="font-semibold text-lg">FinShield</span>
        </div>
        <span className="text-xs text-slate-500">ITU AI Readiness 2.0 Hackathon — Prototype</span>
      </header>

      <div className="max-w-5xl mx-auto mb-8">
        <DisclaimerBanner />
      </div>

      {view === VIEWS.LANDING && <Landing onStart={() => setView(VIEWS.FORM)} />}

      {view === VIEWS.FORM && (
        <div className="space-y-4">
          {error && (
            <p className="max-w-2xl mx-auto text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md px-4 py-2">
              {error} — is the backend running on http://localhost:8000?
            </p>
          )}
          <AssessmentForm onSubmit={handleSubmit} />
        </div>
      )}

      {view === VIEWS.LOADING && <LoadingPipeline />}

      {view === VIEWS.RESULTS && result && <Dashboard result={result} onRestart={restart} />}
    </div>
  )
}

function Landing({ onStart }) {
  return (
    <div className="max-w-2xl mx-auto text-center mt-16 space-y-5">
      <h1 className="text-3xl font-bold">AI-Powered Financial Readiness Assessment</h1>
      <p className="text-slate-400">
        FinShield combines your institution's financial profile with an official-sources-only
        regulatory knowledge base to produce an explainable readiness score, risk breakdown,
        and evidence-backed recommendations — as a decision-support prototype, not a
        certified regulatory tool.
      </p>
      <button
        onClick={onStart}
        className="bg-accent hover:bg-emerald-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition"
      >
        Start Assessment →
      </button>
    </div>
  )
}

function LoadingPipeline() {
  const steps = [
    'SRC — receiving institution data',
    'C — collecting submission',
    'PP — validating & normalizing',
    'M — scoring financial readiness',
    'P — applying policy thresholds & retrieving regulations',
    'D — formatting results',
  ]
  return (
    <div className="max-w-md mx-auto mt-16 space-y-3">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {s}
        </div>
      ))}
    </div>
  )
}
