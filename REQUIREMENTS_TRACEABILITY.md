# Requirements Traceability

Maps every requirement from the original hackathon brief and subsequent
instructions to where it's implemented in this repo. Used for the final
reconciliation pass before this build — kept in the repo so judges/teammates
can verify nothing was dropped.

| # | Requirement | Implementation |
|---|---|---|
| 1 | Financial Readiness Score, Risk Level, financial risks, regulatory risks, recommendations, evidence | `backend/pipeline.py` → `distributor_format()`; rendered in `Dashboard.jsx` |
| 2 | Decision-support only, not certification | `DisclaimerBanner.jsx` on every screen + `disclaimer` field in every API response |
| 3 | Two-part Knowledge Base | `knowledge_base/domain_data/` (Part 1) + `knowledge_base/regulations/` (Part 2) |
| 4 | Y.3172 Clause 8.1 pipeline mapping | `backend/pipeline.py` — see README pipeline table |
| 5 | AI Readiness 2.0 report referenced | `knowledge_base/regulations/itu/README.md`, `sources_log.json` id `itu-ai-readiness-2` |
| 6 | No fabricated regulations/citations | All regulation content sourced from `sources_log.json`/`.md` (official domains only); summaries explicitly labeled paraphrase, not legal text |
| 7 | Demo/Prototype Logic labeling | `pipeline.py` `DEMO_THRESHOLDS`, every financial risk item tagged `logic_type` |
| 8 | Explainable Risk/Reason/Recommendation/Evidence structure | `policy_apply()` output shape, matches brief's worked example exactly |
| 9 | 8 minimum input fields, not overwhelming | `AssessmentForm.jsx` — exactly 8 data fields |
| 10 | 12-step user flow | Collapsed to Landing → Form → Loading (visualizes SRC→D) → Dashboard with 6 tabs covering steps 7–12; documented decision in README |
| 11 | Professional fintech UI, dark theme, gauge, risk indicators | `ScoreGauge.jsx`, `RiskBadge.jsx`, Tailwind dark palette matching the team's own mockup |
| 12 | React/Next.js + FastAPI + simple storage | `frontend/` (Vite+React), `backend/` (FastAPI), no DB (stateless) |
| 13 | No banking/trading system, no advanced DevOps | No transaction engine, no Docker/K8s; `pip install` + `npm install` only |
| 14 | Repo structure (frontend/backend/knowledge_base/README) | Matches exactly |
| 15 | Official sources only (Section 7 reconciliation) | `sources_log.json`/`.md`; third-party sources explicitly excluded and logged as excluded |
| 16 | SDAIA fetch block flagged, not invented around | `sources_log.json` `manual_verification_recommended: true` + note field; surfaced in UI via the "manual verification recommended" badge on regulatory findings |
| 17 | AML.gov.sa gap flagged, not invented around | Noted in `sources_log.json`/`.md` and README "Known open items" |
| 18 | Demo scenario (digital investment product, KSA) | Default values in `AssessmentForm.jsx`; `demo-01` in `demo_institutions.json` |
| 19 | Mockup-inspired widgets not in original brief (AI Assistant, scenario simulator, watchlist) | Deliberately excluded — documented as future enhancement in README, not silently dropped |
| 20 | Copyright — no verbatim reproduction of regulator text | All `regulations/*/summary.md` files are original paraphrases, explicitly labeled as such |
