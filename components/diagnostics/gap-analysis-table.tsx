"use client"

import { DataTable } from "@/components/ui/data-table"
import type { DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getMaturityLevel } from "@/lib/diagnostics/types"
import type { DiagnosticItem, ScoreScale } from "@/lib/diagnostics/types"
import { Download } from "lucide-react"

interface GapAnalysisTableProps {
  items: (DiagnosticItem & { dimensionLabel: string })[]
  maxScore: number
  frameworkId: string
  threshold?: number
}

type GapItem = DiagnosticItem & {
  dimensionLabel: string
  pct: number
  severity: string
}

function getSeverity(score: number): string {
  if (score < 1) return "critical"
  if (score < 2) return "low"
  return "medium"
}

export function GapAnalysisTable({
  items,
  maxScore,
  frameworkId,
}: GapAnalysisTableProps) {
  const gapItems: GapItem[] = items.map((item) => ({
    ...item,
    pct: Math.round((item.score / maxScore) * 100),
    severity: getSeverity(item.score),
  }))

  const columns: DataTableColumn<GapItem>[] = [
    {
      key: "id",
      header: "ID",
      cell: (d) => (
        <span className="font-mono text-xs text-gray-500">{d.id}</span>
      ),
      sortValue: (d) => d.id,
    },
    {
      key: "dimensionLabel",
      header: "Dimension",
      cell: (d) => <span className="text-sm">{d.dimensionLabel}</span>,
      sortValue: (d) => d.dimensionLabel,
    },
    {
      key: "label",
      header: "Critère / Clause",
      cell: (d) => (
        <span className="text-sm font-medium text-gray-900">{d.label}</span>
      ),
      sortValue: (d) => d.label,
    },
    {
      key: "score",
      header: "Score",
      cell: (d) => {
        const level = getMaturityLevel(d.score, maxScore as ScoreScale)
        return (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border"
            style={{
              backgroundColor: level.color + "22",
              color: level.color,
              borderColor: level.color + "40",
            }}
          >
            {d.score} / {maxScore} — {level.label}
          </span>
        )
      },
      sortValue: (d) => d.score,
    },
    {
      key: "pct",
      header: "Progression",
      cell: (d) => (
        <div className="w-24">
          <Progress value={d.pct} className="h-2" />
        </div>
      ),
      sortValue: (d) => d.pct,
    },
  ]

  const filters: DataTableFilter[] = [
    {
      key: "severity",
      label: "Sévérité",
      options: [
        { value: "critical", label: "Critique (< 1)" },
        { value: "low", label: "Faible (1–2)" },
        { value: "medium", label: "Moyen (2–3)" },
      ],
      value: (row: GapItem) => row.severity,
    },
  ]

  const handleExportCsv = () => {
    const headers = ["ID", "Dimension", "Critère / Clause", "Score", "Max", "Progression (%)", "Sévérité"]
    const rows = gapItems.map((item) => [
      item.id,
      item.dimensionLabel,
      item.label,
      item.score,
      maxScore,
      item.pct,
      item.severity,
    ])
    downloadCsv(`gap-analysis-${frameworkId}`, headers, rows)
  }

  const exportButton = (
    <Button variant="outline" size="sm" onClick={handleExportCsv} className="shrink-0">
      <Download className="mr-1.5 h-3.5 w-3.5" />
      Exporter CSV
    </Button>
  )

  return (
    <DataTable<GapItem>
      data={gapItems}
      columns={columns}
      getRowId={(row) => row.id}
      searchPlaceholder="Rechercher un critère..."
      searchAccessor={(row) =>
        `${row.id} ${row.dimensionLabel} ${row.label}`.toLowerCase()
      }
      filters={filters}
      emptyMessage="Aucun écart détecté."
      toolbarActions={exportButton}
    />
  )
}
