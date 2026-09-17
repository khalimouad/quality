"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import type React from "react"
import {
  ArrowLeft, PlayCircle, ChevronDown, ChevronRight,
  Target, AlertTriangle, TrendingUp, ClipboardList,
  ShieldCheck, ShieldAlert, BookOpen, Star, Globe, UtensilsCrossed, Scale,
} from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getFrameworkById, extractBaselineScores,
  computeFrameworkScore, toRadarData,
} from "@/lib/diagnostics"
import { accentHex, getMaturityLevel } from "@/lib/diagnostics/types"
import { DiagnosticRadar } from "@/components/diagnostics/radar-chart"
import { MaturityBadge } from "@/components/diagnostics/maturity-badge"
import { GapAnalysisTable } from "@/components/diagnostics/gap-analysis-table"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck, ShieldAlert, BookOpen, Star, Globe, UtensilsCrossed, Scale,
}

export default function FrameworkDetailPage() {
  const params = useParams<{ frameworkId: string }>()
  const frameworkId = params?.frameworkId ?? ""
  const config = getFrameworkById(frameworkId)

  const [scores, setScores] = useState<Record<string, number>>({})
  const [openDims, setOpenDims] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!config) return
    const baseline = extractBaselineScores(config)
    try {
      const saved = localStorage.getItem(`diag_scores_${config.id}`)
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable client-side after mount
        setScores({ ...baseline, ...JSON.parse(saved) })
      } else {
        setScores(baseline)
      }
    } catch {
      setScores(baseline)
    }
  }, [config])

  if (!config) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Référentiel introuvable : {frameworkId}</p>
      </div>
    )
  }

  const color = accentHex[config.accentColor] ?? "#3b82f6"
  const Icon = ICON_MAP[config.iconName] ?? ShieldCheck
  const frameworkScore = computeFrameworkScore(config, scores)
  const radarData = toRadarData(frameworkScore, config)
  const globalMaturity = getMaturityLevel(frameworkScore.globalScore, config.maxScore)
  const sorted = [...frameworkScore.dimensions].sort((a, b) => b.score - a.score)
  const bestDim = sorted[0]
  const worstDim = sorted[sorted.length - 1]

  const toggleDim = (id: string) => {
    setOpenDims((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Link href="/diagnostics" className="mt-1.5 shrink-0 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title={config.name}
          description={config.description}
          icon={Icon}
        >
          <MaturityBadge score={frameworkScore.globalScore} maxScore={config.maxScore} />
          <Button
            asChild
            size="sm"
            className="text-white border-0"
            style={{ backgroundColor: color }}
          >
            <Link href={`/diagnostics/${config.id}/new`}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Lancer un diagnostic
            </Link>
          </Button>
        </PageHeader>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Score global"
          value={`${frameworkScore.globalScore.toFixed(2)} / ${config.maxScore}`}
          icon={Target}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Meilleure dimension"
          value={`${bestDim?.score.toFixed(2)} / ${config.maxScore}`}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          hint={bestDim?.label}
        />
        <StatCard
          title="Dimension critique"
          value={`${worstDim?.score.toFixed(2)} / ${config.maxScore}`}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          hint={worstDim?.label}
        />
        <StatCard
          title="Écarts (score < 2)"
          value={frameworkScore.gapItems.length}
          icon={ClipboardList}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          hint="critères à améliorer"
        />
      </div>

      <Tabs defaultValue="apercu">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="ecarts">
            Analyse des écarts ({frameworkScore.gapItems.length})
          </TabsTrigger>
          <TabsTrigger value="roadmap">Feuille de route</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Radar de maturité</CardTitle>
                <CardDescription>
                  Score global{" "}
                  <span className="font-semibold" style={{ color }}>
                    {frameworkScore.globalScore.toFixed(2)} / {config.maxScore}
                  </span>{" "}
                  — {globalMaturity.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DiagnosticRadar
                  data={radarData}
                  maxScore={config.maxScore}
                  color={color}
                  height={320}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Dimensions</CardTitle>
                <CardDescription>Cliquez sur une dimension pour voir le détail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 p-3">
                {frameworkScore.dimensions.map((dim) => {
                  const isOpen = openDims.has(dim.dimensionId)
                  const dimConfig = config.dimensions.find((d) => d.id === dim.dimensionId)
                  return (
                    <div key={dim.dimensionId} className="rounded-lg border border-gray-100">
                      <button
                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => toggleDim(dim.dimensionId)}
                      >
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: dim.color }}
                        />
                        <span className="flex-1 text-sm font-medium text-gray-800 leading-snug">
                          {dim.label}
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-gray-600">
                          {dim.score.toFixed(2)} / {dim.maxScore}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                        )}
                      </button>
                      <div className="px-3 pb-1">
                        <Progress value={dim.pct} className="h-1.5" />
                      </div>
                      {isOpen && dimConfig && (
                        <div className="divide-y divide-gray-50 border-t border-gray-100 pb-2">
                          {dimConfig.items.map((item) => {
                            const itemScore = scores[item.id] ?? item.score
                            const lvl = getMaturityLevel(itemScore, config.maxScore)
                            return (
                              <div
                                key={item.id}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs"
                              >
                                <span className="font-mono text-gray-400 shrink-0 w-12">
                                  {item.id}
                                </span>
                                <span className="flex-1 text-gray-600 leading-snug">
                                  {item.label}
                                </span>
                                <span
                                  className="shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
                                  style={{
                                    backgroundColor: lvl.color + "22",
                                    color: lvl.color,
                                    borderColor: lvl.color + "40",
                                  }}
                                >
                                  {itemScore}/{config.maxScore}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ecarts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Analyse des écarts</CardTitle>
              <CardDescription>
                Critères avec un score inférieur au seuil de maturité (score &lt; 2)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GapAnalysisTable
                items={frameworkScore.gapItems}
                maxScore={config.maxScore}
                frameworkId={config.id}
                threshold={2}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-4 space-y-4">
          {config.roadmap.map((phase) => (
            <Card key={phase.phase}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {phase.phase}
                  </div>
                  <div>
                    <CardTitle className="text-base">{phase.title}</CardTitle>
                    <CardDescription>{phase.duration}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-1.5">
                  {phase.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                      {action}
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
                  <strong>Jalon : </strong>
                  {phase.milestone}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
