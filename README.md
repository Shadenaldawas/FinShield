# FinShield

AI-powered financial readiness and risk-assessment **decision-support prototype**,
built for the ITU AI Readiness 2.0 Hackathon (Kingdom of Saudi Arabia).

**This is a hackathon prototype, not a certified financial or regulatory tool.**
All scoring thresholds are labeled "Demo / Prototype Logic" and are illustrative.
See `REQUIREMENTS_TRACEABILITY.md` for how every brief requirement maps to a
specific file in this repo.

---

## What it does

1. You enter a small set of institution/product/financial fields (the hackathon
   demo scenario — a digital investment product launch in KSA — is pre-filled).
2. The backend runs those fields through a transparent pipeline, conceptually
   mapped to the ITU-T Y.3172 ML pipeline (SRC → C → PP → M → P → D → SINK).
3. You get a Financial Readiness Score, Risk Level, explainable financial risk
   findings, regulatory findings retrieved from an **official-sources-only**
   knowledge base, recommendations, and a Final Report — all in one dashboard.

## Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Internet access (for `pip install` and `npm install` — this environment had
  network disabled while building, so those commands have not been run here;
  they will work normally on your machine)

## How to run it

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will be live at `http://localhost:8000`. Check `http://localhost:8000/api/health`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will be live at `http://localhost:5173`. Open it in your browser.

That's it — no database, no Docker, no cloud infra required.

## Repository structure

```
FinShield/
├── backend/                  # FastAPI app
│   ├── main.py                # API endpoints
│   ├── pipeline.py            # SRC/C/PP/M/P/D pipeline (Y.3172-mapped)
│   ├── kb.py                  # Knowledge base loader + retrieval
│   └── requirements.txt
├── frontend/                  # React (Vite + Tailwind) app
│   └── src/
│       ├── App.jsx             # Landing → Form → Loading → Dashboard
│       ├── components/
│       └── api.js
├── knowledge_base/
│   ├── domain_data/            # Part 1 of the KB — SYNTHETIC demo data
│   │   ├── demo_institutions.json
│   │   ├── market_indicators.json
│   │   └── README.md
│   └── regulations/            # Part 2 of the KB — OFFICIAL sources only
│       ├── sources_log.json    # machine-readable ledger (backend loads this)
│       ├── sources_log.md      # human-readable ledger (for KB submission)
│       ├── itu/                # place your Y.3172 + AI Readiness 2.0 PDFs here
│       ├── saudi_pdpl/summary.md
│       ├── saudi_sama/summary.md
│       ├── saudi_cma/summary.md
│       └── saudi_vision2030/summary.md
├── REQUIREMENTS_TRACEABILITY.md
└── README.md
```

## ITU-T Y.3172 pipeline mapping (Clause 8.1)

| Y.3172 node | FinShield function | File |
|---|---|---|
| SRC | `src_ingest()` | `backend/pipeline.py` |
| C | `collector_collect()` | `backend/pipeline.py` |
| PP | `preprocessor_normalize()` | `backend/pipeline.py` |
| M | `model_score()` | `backend/pipeline.py` |
| P | `policy_apply()` | `backend/pipeline.py` |
| D | `distributor_format()` | `backend/pipeline.py` |
| SINK | Results Dashboard | `frontend/src/components/Dashboard.jsx` |
| MLFO | `run_pipeline()` orchestrator | `backend/pipeline.py` |

## Knowledge Base — two-part structure (per hackathon brief)

- **Part 1 — Domain data:** `knowledge_base/domain_data/` — synthetic institution
  and market data, clearly labeled as demo data, not real.
- **Part 2 — Policies/regulations:** `knowledge_base/regulations/` — official
  sources only (SDAIA for PDPL, SAMA and CMA for financial regulation,
  Vision 2030/FSDP for the strategy program, ITU for Y.3172 and AI Readiness
  2.0). The regulation *summaries* in each subfolder are my own paraphrase for
  retrieval purposes — not the legal text itself — always cite the official
  URL in `sources_log.md`/`.json` as the authoritative source.

## Known open items — flagged, not invented around

1. **SDAIA pages** — automated fetching was blocked by SDAIA's site in the
   environment used to research this. The URLs in `sources_log.md`/`.json`
   are correct (confirmed via search-index citation of the official domain),
   but open each one manually in a browser before your final submission.
2. **AML primary statute** — currently cited via SAMA's rulebook treatment of
   the Anti-Money Laundering Law. `aml.gov.sa` (the AML Permanent Committee's
   own site) may hold the primary statute text and is worth a manual check.
3. **`npm install` / `pip install` have not been run in this build environment**
   (no network access here) — run them on your own machine; the code has been
   syntax-checked and the backend pipeline logic has been tested end-to-end.

## What was intentionally left out (to avoid over-engineering)

- No database — the assessment is stateless by design (matches "simple
  storage if sufficient" from the brief).
- No literal distributed MLFO microservice — one orchestrator function is
  sufficient for a hackathon prototype's single pipeline instance.
- No AI chat assistant, macro "what-if" scenario simulator with live sliders,
  or trading/watchlist features seen in early UI mockups — outside the
  12-step brief's scope; noted here as possible future enhancements, not
  silently dropped.

## FinShield_Interactive_Demo.html — instant, no-setup demo

A single, self-contained HTML file (`FinShield_Interactive_Demo.html`) is
included at the repo root. It runs the **exact same UI components** as
`frontend/src/` and a **byte-for-byte behavioral port** of
`backend/pipeline.py` + `backend/kb.py` — same thresholds, same scoring
formula, same official-source citations — but executes entirely client-side
in the browser (no server, no install, no network required). Open it directly
in any browser to click through the full assessment flow immediately.

This exists for fast, zero-setup presentation/demo purposes. The graded
submission architecture — separate FastAPI backend + React frontend, per the
hackathon's required tech stack — is `backend/` + `frontend/`, unchanged.
