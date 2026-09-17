"use client"

import { cn } from "@/lib/utils"
import type { DiagnosticItem } from "@/lib/diagnostics/types"

interface ClauseScoreInputProps {
  item: DiagnosticItem
  maxScore: 4 | 5
  value: number
  onChange: (id: string, score: number) => void
  accentColor?: string
  showLegend?: boolean
}

const LEGEND_5 = [
  { score: 0, label: "Inexistant" },
  { score: 1, label: "Initial" },
  { score: 2, label: "En place" },
  { score: 3, label: "Maîtrisé" },
  { score: 4, label: "Performant" },
  { score: 5, label: "Excellence" },
]

const LEGEND_4 = [
  { score: 0, label: "Absent" },
  { score: 1, label: "Faible" },
  { score: 2, label: "Partiel" },
  { score: 3, label: "Bon" },
  { score: 4, label: "Excellent" },
]

export function ClauseScoreInput({
  item,
  maxScore,
  value,
  onChange,
  accentColor = "#3b82f6",
  showLegend = false,
}: ClauseScoreInputProps) {
  const levels = maxScore === 5 ? LEGEND_5 : LEGEND_4
  const buttons = Array.from({ length: maxScore + 1 }, (_, i) => i)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-3 rounded-lg py-2 px-3 hover:bg-gray-50">
        {/* Left: ID + label */}
        <div className="flex flex-1 items-start gap-2 min-w-0">
          <span className="font-mono text-xs text-gray-400 shrink-0 pt-0.5">
            {item.id}
          </span>
          <span className="text-sm font-medium text-gray-800 leading-snug">
            {item.label}
          </span>
        </div>

        {/* Right: score buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {buttons.map((n) => {
            const isActive = value === n
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(item.id, n)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                  isActive
                    ? "text-white border-transparent"
                    : "bg-white text-gray-500 border-gray-300 hover:border-transparent"
                )}
                style={
                  isActive
                    ? { backgroundColor: accentColor, borderColor: accentColor }
                    : { ["--hover-bg" as string]: accentColor + "18" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      accentColor + "18"
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      accentColor + "60"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      ""
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                      ""
                  }
                }}
                aria-label={`Score ${n}`}
                aria-pressed={isActive}
              >
                {n}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mini legend — shown only when showLegend is true */}
      {showLegend && (
        <div className="flex flex-wrap gap-3 px-3 pb-1 text-[10px] text-gray-400">
          {levels.map((lvl) => (
            <span key={lvl.score}>
              {lvl.score}={lvl.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
