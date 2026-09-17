"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { TrendingUp, TrendingDown, Minus, Target, BarChart2, CheckCircle2, AlertCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"

const indicators = [
  {
    id: 1,
    name: "Taux de non-conformités",
    unit: "%",
    target: 2.0,
    actual: 2.8,
    previous: 3.2,
    trend: "down",
    status: "warning",
    description: "NC / Total inspections",
    data: [
      { month: "Jan", valeur: 4.1, cible: 2.0 },
      { month: "Fév", valeur: 3.8, cible: 2.0 },
      { month: "Mar", valeur: 3.5, cible: 2.0 },
      { month: "Avr", valeur: 3.2, cible: 2.0 },
      { month: "Mai", valeur: 3.0, cible: 2.0 },
      { month: "Jun", valeur: 2.8, cible: 2.0 },
    ],
  },
  {
    id: 2,
    name: "Délai moyen de traitement NC",
    unit: "jours",
    target: 15,
    actual: 18,
    previous: 22,
    trend: "down",
    status: "warning",
    description: "Délai moyen de clôture des NC",
    data: [
      { month: "Jan", valeur: 28, cible: 15 },
      { month: "Fév", valeur: 25, cible: 15 },
      { month: "Mar", valeur: 22, cible: 15 },
      { month: "Avr", valeur: 22, cible: 15 },
      { month: "Mai", valeur: 20, cible: 15 },
      { month: "Jun", valeur: 18, cible: 15 },
    ],
  },
  {
    id: 3,
    name: "Taux de réalisation CAPA",
    unit: "%",
    target: 90,
    actual: 87,
    previous: 82,
    trend: "up",
    status: "warning",
    description: "CAPA fermées dans les délais",
    data: [
      { month: "Jan", valeur: 72, cible: 90 },
      { month: "Fév", valeur: 75, cible: 90 },
      { month: "Mar", valeur: 78, cible: 90 },
      { month: "Avr", valeur: 82, cible: 90 },
      { month: "Mai", valeur: 85, cible: 90 },
      { month: "Jun", valeur: 87, cible: 90 },
    ],
  },
  {
    id: 4,
    name: "Taux de conformité documentaire",
    unit: "%",
    target: 95,
    actual: 96,
    previous: 93,
    trend: "up",
    status: "success",
    description: "Documents à jour / Total documents",
    data: [
      { month: "Jan", valeur: 88, cible: 95 },
      { month: "Fév", valeur: 90, cible: 95 },
      { month: "Mar", valeur: 91, cible: 95 },
      { month: "Avr", valeur: 93, cible: 95 },
      { month: "Mai", valeur: 94, cible: 95 },
      { month: "Jun", valeur: 96, cible: 95 },
    ],
  },
  {
    id: 5,
    name: "Satisfaction clients",
    unit: "/10",
    target: 8.5,
    actual: 8.2,
    previous: 7.9,
    trend: "up",
    status: "warning",
    description: "Score moyen enquêtes satisfaction",
    data: [
      { month: "Jan", valeur: 7.5, cible: 8.5 },
      { month: "Fév", valeur: 7.7, cible: 8.5 },
      { month: "Mar", valeur: 7.8, cible: 8.5 },
      { month: "Avr", valeur: 7.9, cible: 8.5 },
      { month: "Mai", valeur: 8.0, cible: 8.5 },
      { month: "Jun", valeur: 8.2, cible: 8.5 },
    ],
  },
  {
    id: 6,
    name: "Taux d'accidents de travail",
    unit: "‰",
    target: 0,
    actual: 0,
    previous: 1,
    trend: "down",
    status: "success",
    description: "Accidents / Heures travaillées × 1000",
    data: [
      { month: "Jan", valeur: 1.5, cible: 0 },
      { month: "Fév", valeur: 1.0, cible: 0 },
      { month: "Mar", valeur: 1.0, cible: 0 },
      { month: "Avr", valeur: 0.5, cible: 0 },
      { month: "Mai", valeur: 0, cible: 0 },
      { month: "Jun", valeur: 0, cible: 0 },
    ],
  },
]

function getProgressColor(status: string): string {
  switch (status) {
    case "success": return "[&>div]:bg-green-500"
    case "warning": return "[&>div]:bg-amber-500"
    case "danger": return "[&>div]:bg-red-500"
    default: return ""
  }
}

function getAchievementPct(actual: number, target: number, unit: string): number {
  if (unit === "%" || unit === "/10") {
    if (target === 0) return actual === 0 ? 100 : 0
    return Math.min(Math.round((actual / target) * 100), 100)
  }
  // For "lower is better" metrics like delay or NC rate
  if (actual <= target) return 100
  return Math.max(0, Math.round((target / actual) * 100))
}

export default function IndicatorsPage() {
  const onTarget = indicators.filter(i => i.status === "success").length
  const improving = indicators.filter(i => i.trend === "up" && i.status !== "success").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indicateurs de Performance"
        description="Suivi des KPI qualité et QHSE"
        icon={BarChart2}
      >
        <Badge className="bg-blue-100 px-3 py-1 text-sm text-blue-700">Juin 2026</Badge>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Objectifs atteints" value={onTarget} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Objectifs non atteints" value={indicators.length - onTarget} icon={AlertCircle} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="En amélioration" value={improving} icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-50" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {indicators.map((kpi) => {
          const achievementPct = getAchievementPct(kpi.actual, kpi.target, kpi.unit)
          const isLowerBetter = ["jours", "%"].includes(kpi.unit) && kpi.name.includes("non-conf") || kpi.name.includes("délai") || kpi.name.includes("accident")

          return (
            <Card key={kpi.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      {kpi.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">{kpi.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {kpi.trend === "up" ? (
                      <TrendingUp className={`h-4 w-4 ${kpi.status === "success" ? "text-green-500" : "text-blue-500"}`} />
                    ) : kpi.trend === "down" ? (
                      <TrendingDown className={`h-4 w-4 ${kpi.status === "success" ? "text-green-500" : "text-amber-500"}`} />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-400" />
                    )}
                    <Badge
                      variant={kpi.status === "success" ? "success" : "warning"}
                      className="text-xs"
                    >
                      {kpi.status === "success" ? "Atteint" : "En cours"}
                    </Badge>
                  </div>
                </div>

                {/* Values */}
                <div className="flex items-end gap-4 mt-2">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{kpi.actual}</span>
                    <span className="text-sm text-gray-500 ml-1">{kpi.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Target className="h-3.5 w-3.5" />
                    <span>Cible: {kpi.target}{kpi.unit}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Atteinte de l&apos;objectif</span>
                    <span className="font-medium">{achievementPct}%</span>
                  </div>
                  <Progress
                    value={achievementPct}
                    className={`h-2 ${kpi.status === "success" ? "[&>div]:bg-green-500" : "[&>div]:bg-amber-500"}`}
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={kpi.data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value ?? ""} ${kpi.unit}`,
                        name === "valeur" ? "Réel" : "Cible",
                      ]}
                    />
                    <ReferenceLine
                      y={kpi.target}
                      stroke="#3b82f6"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Line
                      type="monotone"
                      dataKey="valeur"
                      stroke={kpi.status === "success" ? "#10b981" : "#f59e0b"}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="valeur"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
