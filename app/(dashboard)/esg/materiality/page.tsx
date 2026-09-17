"use client"

import { GitMerge, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const materialTopics = [
  { topic: "Changement climatique (GES)", impactScore: 4.8, financialScore: 4.5, pillar: "E", priority: "critical" },
  { topic: "Sécurité & Santé au travail", impactScore: 4.6, financialScore: 4.2, pillar: "S", priority: "critical" },
  { topic: "Éthique et anti-corruption", impactScore: 4.3, financialScore: 4.8, pillar: "G", priority: "critical" },
  { topic: "Droits humains chaîne valeur", impactScore: 4.1, financialScore: 3.8, pillar: "S", priority: "high" },
  { topic: "Économie circulaire & déchets", impactScore: 3.9, financialScore: 3.5, pillar: "E", priority: "high" },
  { topic: "Diversité et inclusion", impactScore: 3.7, financialScore: 3.2, pillar: "S", priority: "high" },
  { topic: "Eau et biodiversité", impactScore: 3.5, financialScore: 2.8, pillar: "E", priority: "medium" },
  { topic: "Cybersécurité et données", impactScore: 3.2, financialScore: 4.6, pillar: "G", priority: "high" },
  { topic: "Formation et compétences", impactScore: 3.0, financialScore: 3.1, pillar: "S", priority: "medium" },
  { topic: "Pollution atmosphérique", impactScore: 2.8, financialScore: 2.5, pillar: "E", priority: "medium" },
  { topic: "Responsabilité produit", impactScore: 2.5, financialScore: 3.0, pillar: "G", priority: "medium" },
  { topic: "Communautés locales", impactScore: 2.2, financialScore: 2.0, pillar: "S", priority: "low" },
]

const pillarColors: Record<string, string> = { E: "#10b981", S: "#3b82f6", G: "#8b5cf6" }
const priorityConfig = {
  critical: { label: "Priorité critique", color: "bg-red-100 text-red-700" },
  high: { label: "Priorité haute", color: "bg-orange-100 text-orange-700" },
  medium: { label: "Priorité moyenne", color: "bg-amber-100 text-amber-700" },
  low: { label: "Priorité faible", color: "bg-gray-100 text-gray-600" },
}

export default function EsgMaterialityPage() {
  const critical = materialTopics.filter((t) => t.priority === "critical").length
  const high = materialTopics.filter((t) => t.priority === "high").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matérialité double"
        description="Analyse de double matérialité — impacts significatifs et risques financiers ESG"
        icon={GitMerge}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Thèmes évalués" value={materialTopics.length} icon={GitMerge} iconColor="text-teal-600" iconBg="bg-teal-50" />
        <StatCard title="Priorité critique" value={critical} icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Priorité haute" value={high} icon={TrendingUp} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Parties prenantes" value={12} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" hint="consultées" />
      </div>

      {/* Matrix visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Matrice de double matérialité</CardTitle>
          <CardDescription>
            Impact sur l&apos;environnement et la société (axe Y) vs risques/opportunités financiers (axe X)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-80 w-full overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-tr from-gray-50 to-white">
            {/* Quadrant labels */}
            <div className="absolute top-2 left-2 text-xs text-gray-400">Impact élevé / Risque faible</div>
            <div className="absolute top-2 right-2 text-xs text-gray-400">Impact élevé / Risque élevé</div>
            <div className="absolute bottom-2 left-2 text-xs text-gray-400">Impact faible / Risque faible</div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">Impact faible / Risque élevé</div>

            {/* Axes */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200" />

            {/* Bubbles */}
            {materialTopics.map((topic) => {
              const x = (topic.financialScore / 5) * 100
              const y = 100 - (topic.impactScore / 5) * 100
              const color = pillarColors[topic.pillar] ?? "#6b7280"
              return (
                <div
                  key={topic.topic}
                  className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white shadow"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: color,
                    opacity: topic.priority === "critical" ? 1 : topic.priority === "high" ? 0.85 : 0.65,
                    fontSize: topic.priority === "critical" ? "10px" : "9px",
                    width: topic.priority === "critical" ? "28px" : "22px",
                    height: topic.priority === "critical" ? "28px" : "22px",
                  }}
                  title={topic.topic}
                >
                  {topic.pillar}
                </div>
              )
            })}

            {/* Legend */}
            <div className="absolute bottom-6 right-6 flex gap-3">
              {Object.entries(pillarColors).map(([key, color]) => (
                <div key={key} className="flex items-center gap-1 text-xs">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  {key === "E" ? "Envir." : key === "S" ? "Social" : "Gouv."}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Thèmes matériels — classement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {materialTopics.map((topic) => {
              const pConf = priorityConfig[topic.priority as keyof typeof priorityConfig]
              const color = pillarColors[topic.pillar] ?? "#6b7280"
              return (
                <div key={topic.topic} className="flex items-center gap-4 py-2.5">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {topic.pillar}
                  </span>
                  <span className="flex-1 text-sm text-gray-800">{topic.topic}</span>
                  <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
                    <span>Impact : <strong className="text-gray-800">{topic.impactScore}/5</strong></span>
                    <span>Financier : <strong className="text-gray-800">{topic.financialScore}/5</strong></span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${pConf.color}`}>
                    {pConf.label}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
