"use client"

import type { RadarDataPoint } from "@/lib/diagnostics/types"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

interface DiagnosticRadarProps {
  data: RadarDataPoint[]
  maxScore: number
  color: string
  height?: number
  showTarget?: boolean
}

export function DiagnosticRadar({
  data,
  maxScore,
  color,
  height = 300,
  showTarget = true,
}: DiagnosticRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        <PolarGrid gridType="polygon" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fontSize: 11, fill: "#374151" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxScore]}
          tickCount={maxScore + 1}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
        />
        {showTarget && (
          <Radar
            dataKey="target"
            name="Cible"
            stroke="#d1d5db"
            fill="transparent"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        )}
        <Radar
          dataKey="score"
          name="Maturité"
          stroke={color}
          fill={color}
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{ r: 3, fill: color }}
        />
        <Tooltip
          formatter={(value) => {
            const num = typeof value === "number" ? value : Number(value)
            return [`${num.toFixed(2)} / ${maxScore}`, undefined]
          }}
        />
        <Legend verticalAlign="bottom" />
      </RadarChart>
    </ResponsiveContainer>
  )
}
