"use client"

import { getMaturityLevel } from "@/lib/diagnostics/types"
import type { ScoreScale } from "@/lib/diagnostics/types"

interface MaturityBadgeProps {
  score: number
  maxScore: 4 | 5
  showScore?: boolean
  size?: "sm" | "md"
}

export function MaturityBadge({
  score,
  maxScore,
  showScore = true,
  size = "md",
}: MaturityBadgeProps) {
  const { label, color } = getMaturityLevel(score, maxScore as ScoreScale)

  const fontSize = size === "sm" ? "11px" : "13px"
  const padding = size === "sm" ? "2px 8px" : "3px 10px"

  return (
    <span
      style={{
        backgroundColor: color + "22",
        color: color,
        border: `1px solid ${color}40`,
        borderRadius: "9999px",
        padding,
        fontSize,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {showScore
        ? `${score.toFixed(2)} / ${maxScore} — ${label}`
        : label}
    </span>
  )
}
