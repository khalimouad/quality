"use client"

import Link from "next/link"
import { Star, TrendingUp, TrendingDown, Users, Map, MessageSquareWarning, Users2, BarChart2, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts"
import { DiagnosticRadar } from "@/components/diagnostics/radar-chart"
import { cxConfig } from "@/lib/diagnostics/cx-config"
import { extractBaselineScores, computeFrameworkScore, toRadarData } from "@/lib/diagnostics/scoring"
import { getMaturityLevel } from "@/lib/diagnostics/types"

const npsTrendData = [
  { month: "Jan", nps: 28, cible: 45 },
  { month: "Fév", nps: 32, cible: 45 },
  { month: "Mar", nps: 35, cible: 45 },
  { month: "Avr", nps: 38, cible: 45 },
  { month: "Mai", nps: 40, cible: 45 },
  { month: "Jun", nps: 42, cible: 45 },
]

const quickLinks = [
  { label: "Parcours clients", href: "/cx/journey", icon: Map, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Personas", href: "/cx/personas", icon: Users2, color: "text-pink-600", bg: "bg-pink-50" },
  { label: "NPS & Enquêtes", href: "/cx/voc", icon: MessageSquareWarning, color: "text-blue-600", bg: "bg-blue-50" },
]

export default function CxDashboardPage() {
  const scores = extractBaselineScores(cxConfig)
  const frameworkScore = computeFrameworkScore(cxConfig, scores)
  const radarData = toRadarData(frameworkScore, cxConfig)
  const color = "#f97316"

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expérience Client (CX)"
        description="Pilotage de la maturité CX, NPS, fidélisation et parcours client"
        icon={Star}
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/diagnostics/cx">
            <BarChart2 className="mr-2 h-4 w-4" />
            Diagnostic CX
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Maturité CX"
          value={`${frameworkScore.globalScore.toFixed(2)} / 5`}
          icon={Star}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
          hint={getMaturityLevel(frameworkScore.globalScore, 5).label}
        />
        <StatCard
          title="NPS relationnel"
          value={42}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          change="+4 pts vs T1"
          trend="up"
        />
        <StatCard
          title="CSAT moyen"
          value="7.8 / 10"
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          change="+0.3 pts"
          trend="up"
        />
        <StatCard
          title="Taux churn"
          value="8.2 %"
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          change="-1.1 pts"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Maturité CX — 8 dimensions</CardTitle>
            <CardDescription>Radar de maturité basé sur les scores de référence</CardDescription>
          </CardHeader>
          <CardContent>
            <DiagnosticRadar data={radarData} maxScore={5} color={color} height={300} showTarget />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Évolution du NPS</CardTitle>
            <CardDescription>Tendance relationnel — objectif 45</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={npsTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 60]} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={0} stroke="#d1d5db" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="nps" name="NPS" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cible" name="Cible" stroke="#d1d5db" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Scores par dimension CX</CardTitle>
          <CardDescription>Maturité détaillée — 8 dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {frameworkScore.dimensions.map((dim) => {
              const maturity = getMaturityLevel(dim.score, 5)
              return (
                <div key={dim.dimensionId} className="flex items-center gap-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-800 truncate pr-2">{dim.label}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="rounded-full border px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: maturity.color + "22",
                            color: maturity.color,
                            borderColor: maturity.color + "40",
                          }}
                        >
                          {maturity.label}
                        </span>
                        <span className="text-xs font-semibold text-gray-600">
                          {dim.score.toFixed(2)} / 5
                        </span>
                      </div>
                    </div>
                    <Progress value={dim.pct} className="h-1.5" />
                  </div>
                  {dim.gapCount > 0 && (
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${link.bg}`}>
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-800">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
