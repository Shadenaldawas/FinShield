import { useState } from 'react'

const DEMO_DEFAULT = {
  institution_type: 'fintech',
  product: 'digital_investment',
  target_market: 'ksa_domestic',
  annual_revenue: 42000000,
  operating_costs: 31000000,
  capital_adequacy_ratio: 8.5,
  liquidity_ratio: 70,
  npl_ratio: 6.0,
}

export default function AssessmentForm({ onSubmit }) {
  const [form, setForm] = useState(DEMO_DEFAULT)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...form,
      annual_revenue: Number(form.annual_revenue),
      operating_costs: Number(form.operating_costs),
      capital_adequacy_ratio: Number(form.capital_adequacy_ratio),
      liquidity_ratio: Number(form.liquidity_ratio),
      npl_ratio: Number(form.npl_ratio),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-panel2 border border-slate-800 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-semibold text-slate-100">Institution, Product &amp; Financials</h2>
      <p className="text-xs text-slate-400 -mt-3">
        Pre-filled with the hackathon demo scenario (digital investment product launch). Edit any field.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Institution type">
          <select className="input" value={form.institution_type} onChange={(e) => update('institution_type', e.target.value)}>
            <option value="bank">Bank</option>
            <option value="fintech">Fintech</option>
            <option value="insurer">Insurer</option>
            <option value="investment_firm">Investment firm</option>
          </select>
        </Field>

        <Field label="Proposed product">
          <select className="input" value={form.product} onChange={(e) => update('product', e.target.value)}>
            <option value="digital_investment">Digital investment product</option>
            <option value="lending">Lending</option>
            <option value="payments">Payments</option>
            <option value="insurance">Insurance</option>
          </select>
        </Field>

        <Field label="Target market">
          <select className="input" value={form.target_market} onChange={(e) => update('target_market', e.target.value)}>
            <option value="ksa_domestic">Saudi Arabia (domestic)</option>
            <option value="gcc_expansion">GCC regional expansion</option>
          </select>
        </Field>

        <div />

        <Field label="Annual revenue (SAR)">
          <input className="input" type="number" min="0" value={form.annual_revenue} onChange={(e) => update('annual_revenue', e.target.value)} />
        </Field>

        <Field label="Operating costs (SAR)">
          <input className="input" type="number" min="0" value={form.operating_costs} onChange={(e) => update('operating_costs', e.target.value)} />
        </Field>

        <Field label="Capital adequacy ratio (%)">
          <input className="input" type="number" step="0.1" value={form.capital_adequacy_ratio} onChange={(e) => update('capital_adequacy_ratio', e.target.value)} />
        </Field>

        <Field label="Liquidity ratio (%)">
          <input className="input" type="number" step="0.1" value={form.liquidity_ratio} onChange={(e) => update('liquidity_ratio', e.target.value)} />
        </Field>

        <Field label="Non-performing loans ratio (%)">
          <input className="input" type="number" step="0.1" value={form.npl_ratio} onChange={(e) => update('npl_ratio', e.target.value)} />
        </Field>
      </div>

      <button type="submit" className="w-full bg-accent hover:bg-emerald-400 text-slate-900 font-semibold py-2.5 rounded-lg transition">
        Analyze My Business →
      </button>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="text-slate-400 block mb-1">{label}</span>
      {children}
    </label>
  )
}
