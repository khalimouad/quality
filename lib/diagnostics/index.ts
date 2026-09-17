import { smqhseConfig } from "./smqhse-config"
import { smsiConfig } from "./smsi-config"
import { kmConfig } from "./km-config"
import { cxConfig } from "./cx-config"
import { esgConfig } from "./esg-config"
import { fsscConfig } from "./fssc-config"
import { iso37001Config } from "./iso37001-config"

export type { FrameworkConfig, DiagnosticDimension, DiagnosticItem, RoadmapPhase, DimensionScore, FrameworkScore, RadarDataPoint, ScoreScale } from "./types"
export { getMaturityLevel, accentHex, MATURITY_LEVELS_5, MATURITY_LEVELS_4 } from "./types"
export { extractBaselineScores, computeDimensionScores, computeGlobalScore, computeFrameworkScore, toRadarData } from "./scoring"

export const frameworks = [
  smqhseConfig,
  smsiConfig,
  kmConfig,
  cxConfig,
  esgConfig,
  fsscConfig,
  iso37001Config,
]

export function getFrameworkById(id: string) {
  return frameworks.find((f) => f.id === id)
}
