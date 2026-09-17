import type {
  FrameworkConfig,
  DiagnosticItem,
  DimensionScore,
  FrameworkScore,
  RadarDataPoint,
} from "./types"

export function extractBaselineScores(config: FrameworkConfig): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const dim of config.dimensions) {
    for (const item of dim.items) {
      scores[item.id] = item.score
    }
  }
  return scores
}

export function computeDimensionScores(
  config: FrameworkConfig,
  scores: Record<string, number>,
  gapThreshold = config.maxScore === 4 ? 1.6 : 2
): DimensionScore[] {
  return config.dimensions.map((dim) => {
    const items = dim.items
    let weightedSum = 0
    let totalWeight = 0
    let gapCount = 0
    for (const item of items) {
      const s = scores[item.id] ?? item.score
      const w = item.weight ?? 1
      weightedSum += s * w
      totalWeight += w
      if (s < gapThreshold) gapCount++
    }
    const score = totalWeight > 0 ? weightedSum / totalWeight : 0
    return {
      dimensionId: dim.id,
      label: dim.label,
      score: Math.round(score * 100) / 100,
      maxScore: config.maxScore,
      pct: Math.round((score / config.maxScore) * 100),
      color: dim.color,
      itemCount: items.length,
      gapCount,
    }
  })
}

export function computeGlobalScore(
  config: FrameworkConfig,
  scores: Record<string, number>
): number {
  const dimScores = computeDimensionScores(config, scores)
  if (dimScores.length === 0) return 0
  const total = dimScores.reduce((sum, d) => sum + d.score, 0)
  return Math.round((total / dimScores.length) * 100) / 100
}

export function computeFrameworkScore(
  config: FrameworkConfig,
  scores: Record<string, number>,
  gapThreshold?: number
): FrameworkScore {
  const threshold = gapThreshold ?? (config.maxScore === 4 ? 1.6 : 2)
  const dimensions = computeDimensionScores(config, scores, threshold)
  const globalScore = computeGlobalScore(config, scores)
  const gapItems: (DiagnosticItem & { dimensionLabel: string })[] = []
  for (const dim of config.dimensions) {
    for (const item of dim.items) {
      const s = scores[item.id] ?? item.score
      if (s < threshold) {
        gapItems.push({ ...item, score: s, dimensionLabel: dim.label })
      }
    }
  }
  gapItems.sort((a, b) => a.score - b.score)
  return {
    frameworkId: config.id,
    globalScore,
    maxScore: config.maxScore,
    globalPct: Math.round((globalScore / config.maxScore) * 100),
    dimensions,
    gapItems,
  }
}

export function toRadarData(
  score: FrameworkScore,
  config: FrameworkConfig
): RadarDataPoint[] {
  return score.dimensions.map((d, i) => ({
    dimension: config.dimensions[i]?.radarLabel ?? d.label,
    score: d.score,
    target: config.maxScore,
    fullMark: config.maxScore,
  }))
}
