"use client"

import Link from "next/link"
import { ClipboardCheck, Eye, PlayCircle, TrendingDown, TrendingUp, BarChart2 } from "lucide-react"
import {
  ShieldCheck, ShieldAlert, BookOpen, Star,
  Globe, UtensilsCrossed, Scale,
} from "lucide-react"
import type React from "react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { frameworks } from "@/lib/diagnostics"
import { accentHex, getMaturityLevel } from "@/lib/diagnostics/types"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck, ShieldAlert, BookOpen, Star, Globe, UtensilsCrossed, Scale,
}

function getIcon(name: string): React.ComponentType<{ className?: string }> {
  return ICON_MAP[name] ?? ShieldCheck
}

export default function DiagnosticsHubPage() {
  const fiveScale = frameworks.filter((f) => f.maxScore === 5)
  const avgScore = fiveScale.reduce((s, f) => s + f.globalScoreMock, 0) / fiveScale.length
  const below2 = frameworks.filter((f) => f.globalScoreMock < 2.0).length
  const above25 = frameworks.filter((f) => f.globalScoreMock >= 2.5).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hub Diagnostics & Conformité"
        description="Évaluez et pilotez la maturité de vos systèmes de management sur 7 référentiels"
        icon={ClipboardCheck}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Référentiels actifs"
          value={frameworks.length}
          icon={ClipboardCheck}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Score moyen /5"
          value={`${avgScore.toFixed(2)} / 5`}
          icon={BarChart2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          hint="échelle /5 uniquement"
        />
        <StatCard
          title="En dessous de 2.0"
          value={below2}
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          hint="référentiels à risque"
        />
        <StatCard
          title="Niveau ≥ 2.5"
          value={above25}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          hint="référentiels avancés"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {frameworks.map((fw) => {
          const Icon = getIcon(fw.iconName)
          const color = accentHex[fw.accentColor] ?? "#3b82f6"
          const maturity = getMaturityLevel(fw.globalScoreMock, fw.maxScore)
          const pct = Math.round((fw.globalScoreMock / fw.maxScore) * 100)

          return (
            <Card key={fw.id} className="overflow-hidden border shadow-sm transition-shadow hover:shadow-md">
              <div className="h-1" style={{ backgroundColor: color }} />
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: color + "20", color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm font-semibold leading-snug">{fw.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs line-clamp-2">{fw.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Maturité globale</span>
                    <span className="font-semibold text-gray-900">
                      {fw.globalScoreMock.toFixed(2)} / {fw.maxScore}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <span
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: maturity.color + "22",
                      color: maturity.color,
                      borderColor: maturity.color + "40",
                    }}
                  >
                    {maturity.label}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 text-xs h-8">
                    <Link href={`/diagnostics/${fw.id}`}>
                      <Eye className="mr-1.5 h-3 w-3" />
                      Voir
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 text-xs h-8 text-white border-0"
                    style={{ backgroundColor: color }}
                  >
                    <Link href={`/diagnostics/${fw.id}/new`}>
                      <PlayCircle className="mr-1.5 h-3 w-3" />
                      Lancer
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
