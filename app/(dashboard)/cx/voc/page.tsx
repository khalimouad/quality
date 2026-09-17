"use client"

import { MessageSquareWarning, TrendingUp, Star, Users, AlertCircle } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts"

const npsDistribution = [
  { category: "Détracteurs (0-6)", count: 18, color: "#ef4444" },
  { category: "Passifs (7-8)", count: 32, color: "#f59e0b" },
  { category: "Promoteurs (9-10)", count: 50, color: "#10b981" },
]

const recentFeedbacks = [
  { id: 1, score: 9, channel: "Email", segment: "B2B Grand compte", date: "10 juin 2026", verbatim: "Excellent service, équipe très réactive et professionnelle.", sentiment: "positive" },
  { id: 2, score: 7, channel: "Site web", segment: "PME", date: "9 juin 2026", verbatim: "Bon produit mais délais de livraison parfois longs.", sentiment: "neutral" },
  { id: 3, score: 4, channel: "Téléphone", segment: "B2C", date: "8 juin 2026", verbatim: "Difficile de joindre le support, temps d'attente trop long.", sentiment: "negative" },
  { id: 4, score: 10, channel: "Email", segment: "B2B PME", date: "7 juin 2026", verbatim: "Très satisfait, je recommande vivement.", sentiment: "positive" },
  { id: 5, score: 8, channel: "Chat", segment: "B2C", date: "6 juin 2026", verbatim: "Produit conforme à mes attentes, bonne expérience globale.", sentiment: "positive" },
]

export default function CxVocPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="NPS & Enquêtes VoC"
        description="Voice of Customer — feedback clients, NPS, CSAT et verbatims"
        icon={MessageSquareWarning}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="NPS global" value={42} icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-50" change="+4 pts vs T1" trend="up" />
        <StatCard title="CSAT moyen" value="7.8 / 10" icon={Star} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Réponses ce mois" value={187} icon={Users} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Détracteurs actifs" value={18} icon={AlertCircle} iconColor="text-red-600" iconBg="bg-red-50" hint="Close-the-loop requis" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Distribution NPS</CardTitle>
            <CardDescription>Répartition Détracteurs / Passifs / Promoteurs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={npsDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="category" width={160} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} réponses`, ""]} />
                <Bar dataKey="count" name="Réponses" radius={[0, 4, 4, 0]} barSize={28}>
                  {npsDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Derniers verbatims</CardTitle>
            <CardDescription>Feedbacks récents tous canaux</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFeedbacks.map((fb) => (
              <div key={fb.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                        fb.score >= 9 ? "bg-green-500" : fb.score >= 7 ? "bg-amber-500" : "bg-red-500"
                      }`}
                    >
                      {fb.score}
                    </span>
                    <span className="text-xs text-gray-500">{fb.channel}</span>
                    <Badge variant="outline" className="text-xs">{fb.segment}</Badge>
                  </div>
                  <span className="text-xs text-gray-400">{fb.date}</span>
                </div>
                <p className="text-sm text-gray-700 italic">&quot;{fb.verbatim}&quot;</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
