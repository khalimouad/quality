"use client"

import Link from "next/link"
import { Leaf, BarChart2, FileText, GitMerge, Users, Shield, Globe } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DiagnosticRadar } from "@/components/diagnostics/radar-chart"
import { esgConfig } from "@/lib/diagnostics/esg-config"
import { extractBaselineScores, computeFrameworkScore, toRadarData } from "@/lib/diagnostics/scoring"
import { getMaturityLevel } from "@/lib/diagnostics/types"

const pillarModules = [
  { label: "Émissions GES", href: "/esg/ghg", icon: BarChart2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Matérialité double", href: "/esg/materiality", icon: GitMerge, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Rapport CSRD", href: "/esg/report", icon: FileText, color: "text-green-600", bg: "bg-green-50" },
]

export default function EsgDashboardPage() {
  const scores = extractBaselineScores(esgConfig)
  const frameworkScore = computeFrameworkScore(esgConfig, scores)
  const radarData = toRadarData(frameworkScore, esgConfig)
  const color = "#10b981"

  // Pillar scores by dimension group
  const envDims = frameworkScore.dimensions.filter((d) => d.dimensionId.startsWith("e"))
  const socialDims = frameworkScore.dimensions.filter((d) => d.dimensionId.startsWith("s"))
  const govDims = frameworkScore.dimensions.filter((d) => d.dimensionId.startsWith("g"))

  const avgEnv = envDims.length ? envDims.reduce((s, d) => s + d.score, 0) / envDims.length : 0
  const avgSocial = socialDims.length ? socialDims.reduce((s, d) => s + d.score, 0) / socialDims.length : 0
  const avgGov = govDims.length ? govDims.reduce((s, d) => s + d.score, 0) / govDims.length : 0

  const pillars = [
    { label: "Environnement (E)", score: avgEnv, color: "#10b981", icon: Leaf },
    { label: "Social (S)", score: avgSocial, color: "#3b82f6", icon: Users },
    { label: "Gouvernance (G)", score: avgGov, color: "#8b5cf6", icon: Shield },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="ESG & Développement Durable"
        description="Pilotage de la stratégie ESG — Environnement, Social, Gouvernance et conformité CSRD"
        icon={Leaf}
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/diagnostics/esg">
            <Globe className="mr-2 h-4 w-4" />
            Diagnostic ESG
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Maturité ESG"
          value={`${frameworkScore.globalScore.toFixed(2)} / 5`}
          icon={Globe}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          hint={getMaturityLevel(frameworkScore.globalScore, 5).label}
        />
        <StatCard
          title="Score Environnement"
          value={`${avgEnv.toFixed(2)} / 5`}
          icon={Leaf}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          title="Score Social"
          value={`${avgSocial.toFixed(2)} / 5`}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Score Gouvernance"
          value={`${avgGov.toFixed(2)} / 5`}
          icon={Shield}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Radar ESG</CardTitle>
            <CardDescription>Maturité par thème ESRS / GRI</CardDescription>
          </CardHeader>
          <CardContent>
            <DiagnosticRadar data={radarData} maxScore={5} color={color} height={300} showTarget />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Scores par pilier</CardTitle>
            <CardDescription>Environnement · Social · Gouvernance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {pillars.map((pillar) => {
              const pct = Math.round((pillar.score / 5) * 100)
              const maturity = getMaturityLevel(pillar.score, 5)
              return (
                <div key={pillar.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <pillar.icon className="h-4 w-4" style={{ color: pillar.color }} />
                      <span className="text-sm font-medium text-gray-800">{pillar.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
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
                        {pillar.score.toFixed(2)} / 5
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: pillar.color }}
                    />
                  </div>
                  {/* Sub-dimensions for this pillar */}
                  <div className="space-y-1 pl-2">
                    {frameworkScore.dimensions
                      .filter((d) => d.dimensionId.startsWith(pillar.label[0].toLowerCase()))
                      .map((dim) => (
                        <div key={dim.dimensionId} className="flex items-center gap-2 text-xs text-gray-500">
                          <div
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: pillar.color }}
                          />
                          <span className="flex-1 truncate">{dim.label}</span>
                          <span className="shrink-0 font-medium text-gray-700">
                            {dim.score.toFixed(1)} / 5
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {pillarModules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${mod.bg}`}>
                  <mod.icon className={`h-5 w-5 ${mod.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-800">{mod.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
