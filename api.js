/**
 * Standalone build's version of api.js — same exported function signatures
 * as the real fetch-based api.js, but calls the local, in-browser pipeline
 * (pipelineLogic.js) instead of making an HTTP request. App.jsx is
 * completely unaware of the difference; it just calls assess(payload).
 */
import { runPipeline, getDemoInstitutions, getSources } from './pipelineLogic.js'

export async function assess(payload) {
  // small artificial delay so the pipeline-stage loading screen is visible,
  // matching the real network-backed experience
  await new Promise((resolve) => setTimeout(resolve, 900))
  return runPipeline(payload)
}

export async function fetchDemoInstitutions() {
  return getDemoInstitutions()
}

export async function fetchSources() {
  return getSources()
}
