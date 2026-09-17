"use client"

import Link from "next/link"
import { BookOpen, Users2, FileText, GraduationCap, Award, Brain, TrendingUp, AlertTriangle } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DiagnosticRadar } from "@/components/diagnostics/radar-chart"
import { MaturityBadge } from "@/components/diagnostics/maturity-badge"
import { kmConfig } from "@/lib/diagnostics/km-config"
import { extractBaselineScores, computeFrameworkScore, toRadarData } from "@/lib/diagnostics/scoring"
import { getMaturityLevel } from "@/lib/diagnostics/types"

const quickLinks = [
  { label: "Compétences & polyvalence", href: "/skills", icon: Award, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Entretiens individuels", href: "/interviews", icon: Users2, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Gestion documentaire", href: "/documents", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Plan de formation", href: "/training", icon: GraduationCap, color: "text-amber-600", bg: "bg-amber-50" },
]

export default function KmHubPage() {
  const scores = extractBaselineScores(kmConfig)
  const frameworkScore = computeFrameworkScore(kmConfig, scores)
  const radarData = toRadarData(frameworkScore, kmConfig)
  const color = "#f59e0b"

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Management"
        description="Pilotage de la gestion des connaissances — maturité, capitalisation et expertise"
        icon={BookOpen}
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/diagnostics/km">
            <Brain className="mr-2 h-4 w-4" />
            Diagnostic KM
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Maturité KM"
          value={`${frameworkScore.globalScore.toFixed(2)} / 4`}
          icon={BookOpen}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          hint={getMaturityLevel(frameworkScore.globalScore, 4).label}
        />
        <StatCard
          title="Dimensions évaluées"
          value={frameworkScore.dimensions.length}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Experts identifiés"
          value={23}
          icon={Award}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
          hint="dont 4 en risque départ"
        />
        <StatCard
          title="Savoirs critiques"
          value={8}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          hint="à documenter"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Radar de maturité KM</CardTitle>
            <CardDescription>Score global — {frameworkScore.globalScore.toFixed(2)} / 4</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-3">
              <MaturityBadge score={frameworkScore.globalScore} maxScore={4} />
            </div>
            <DiagnosticRadar data={radarData} maxScore={4} color={color} height={280} showTarget />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Scores par dimension KM</CardTitle>
            <CardDescription>Évaluation des 6 piliers KM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {frameworkScore.dimensions.map((dim) => {
              const maturity = getMaturityLevel(dim.score, 4)
              return (
                <div key={dim.dimensionId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 truncate pr-2">{dim.label}</span>
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
                        {dim.score.toFixed(2)} / 4
                      </span>
                    </div>
                  </div>
                  <Progress value={dim.pct} className="h-1.5" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${link.bg}`}>
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
