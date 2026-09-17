// ─── Score scale ───────────────────────────────────────────────────────────────
export type ScoreScale = 4 | 5

// ─── A single scoreable item (clause, control, criterion, indicator) ───────────
export interface DiagnosticItem {
  id: string
  label: string
  description?: string
  score: number        // baseline mock score (0..maxScore)
  weight?: number      // default 1.0
}

// ─── A dimension groups items into one radar axis ──────────────────────────────
export interface DiagnosticDimension {
  id: string
  label: string        // shown on radar axis
  radarLabel?: string  // short version for radar axis (≤14 chars), falls back to label
  color: string        // hex color for radar fill
  items: DiagnosticItem[]
}

// ─── Implementation roadmap phase ─────────────────────────────────────────────
export interface RoadmapPhase {
  phase: number
  title: string
  duration: string
  actions: string[]
  milestone: string
}

// ─── Top-level framework config ────────────────────────────────────────────────
export interface FrameworkConfig {
  id: string
  name: string
  shortName: string
  description: string
  iconName: string        // lucide icon name string (resolved in components)
  accentColor: string     // color name key into accentHex map
  maxScore: ScoreScale
  globalScoreMock: number
  dimensions: DiagnosticDimension[]
  roadmap: RoadmapPhase[]
}

// ─── Computed scores (produced by scoring.ts) ──────────────────────────────────
export interface DimensionScore {
  dimensionId: string
  label: string
  score: number
  maxScore: number
  pct: number
  color: string
  itemCount: number
  gapCount: number
}

export interface FrameworkScore {
  frameworkId: string
  globalScore: number
  maxScore: number
  globalPct: number
  dimensions: DimensionScore[]
  gapItems: (DiagnosticItem & { dimensionLabel: string })[]
}

// ─── Recharts radar data point ─────────────────────────────────────────────────
export interface RadarDataPoint {
  dimension: string
  score: number
  target: number
  fullMark: number
}

// ─── Maturity level labels per scale ──────────────────────────────────────────
export const MATURITY_LEVELS_5: Record<number, { label: string; color: string }> = {
  0: { label: "Inexistant",  color: "#9ca3af" },
  1: { label: "Initial",     color: "#ef4444" },
  2: { label: "En place",    color: "#f97316" },
  3: { label: "Maîtrisé",   color: "#eab308" },
  4: { label: "Performant",  color: "#3b82f6" },
  5: { label: "Excellence",  color: "#10b981" },
}

export const MATURITY_LEVELS_4: Record<number, { label: string; color: string }> = {
  0: { label: "Absent",     color: "#9ca3af" },
  1: { label: "Faible",     color: "#ef4444" },
  2: { label: "Partiel",    color: "#f97316" },
  3: { label: "Bon",        color: "#eab308" },
  4: { label: "Excellent",  color: "#10b981" },
}

export function getMaturityLevel(score: number, maxScore: ScoreScale): { label: string; color: string } {
  const levels = maxScore === 4 ? MATURITY_LEVELS_4 : MATURITY_LEVELS_5
  const rounded = Math.round(score)
  const clamped = Math.min(Math.max(rounded, 0), maxScore)
  return levels[clamped] ?? levels[0]
}

// ─── Accent hex colors ─────────────────────────────────────────────────────────
export const accentHex: Record<string, string> = {
  blue:   "#3b82f6",
  violet: "#7c3aed",
  amber:  "#f59e0b",
  orange: "#f97316",
  green:  "#10b981",
  teal:   "#14b8a6",
  red:    "#ef4444",
  indigo: "#6366f1",
  rose:   "#f43f5e",
}
