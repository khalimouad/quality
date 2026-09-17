"use client"

import { BarChart2, TrendingDown, Leaf, Zap, Truck } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"

const scopeData = [
  { scope: "Scope 1", tCO2e: 1250, color: "#10b981" },
  { scope: "Scope 2", tCO2e: 890, color: "#3b82f6" },
  { scope: "Scope 3", tCO2e: 8420, color: "#8b5cf6" },
]

const trendData = [
  { year: "2022", s1: 1450, s2: 1050, s3: 9200 },
  { year: "2023", s1: 1380, s2: 980, s3: 8900 },
  { year: "2024", s1: 1310, s2: 920, s3: 8600 },
  { year: "2025", s1: 1250, s2: 890, s3: 8420 },
  { year: "2026 (cible)", s1: 1100, s2: 750, s3: 7800 },
]

const scope3Categories = [
  { name: "Achats de biens/services", tCO2e: 3200 },
  { name: "Déplacements professionnels", tCO2e: 1800 },
  { name: "Transport & distribution", tCO2e: 1500 },
  { name: "Utilisation des produits vendus", tCO2e: 1100 },
  { name: "Fin de vie des produits", tCO2e: 820 },
]

export default function EsgGhgPage() {
  const totalGHG = scopeData.reduce((s, d) => s + d.tCO2e, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Émissions GES"
        description="Bilan carbone Scope 1, 2 et 3 — trajectoire de décarbonation"
        icon={BarChart2}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="GES total (tCO2e)" value={totalGHG.toLocaleString("fr")} icon={Leaf} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard title="Scope 1 direct" value="1 250 tCO2e" icon={Zap} iconColor="text-green-600" iconBg="bg-green-50" change="-4.6%" trend="down" />
        <StatCard title="Scope 2 énergie" value="890 tCO2e" icon={Zap} iconColor="text-blue-600" iconBg="bg-blue-50" change="-3.3%" trend="down" />
        <StatCard title="Scope 3 chaîne val." value="8 420 tCO2e" icon={Truck} iconColor="text-violet-600" iconBg="bg-violet-50" change="-2.0%" trend="down" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tendance carbone 2022–2026</CardTitle>
            <CardDescription>Évolution des émissions par scope (tCO2e)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${Number(v).toLocaleString("fr")} tCO2e`, ""]} />
                <Legend />
                <Bar dataKey="s1" name="Scope 1" fill="#10b981" stackId="a" />
                <Bar dataKey="s2" name="Scope 2" fill="#3b82f6" stackId="a" />
                <Bar dataKey="s3" name="Scope 3" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top catégories Scope 3</CardTitle>
            <CardDescription>Principales sources d&apos;émissions indirectes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scope3Categories.map((cat) => {
              const pct = Math.round((cat.tCO2e / 8420) * 100)
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 truncate pr-2">{cat.name}</span>
                    <span className="shrink-0 text-xs font-medium text-gray-600">
                      {cat.tCO2e.toLocaleString("fr")} tCO2e ({pct}%)
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              )
            })}
            <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
              <TrendingDown className="inline mr-1 h-3 w-3" />
              Objectif : <strong>-15% Scope 1+2</strong> et <strong>-10% Scope 3</strong> d&apos;ici 2027
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
