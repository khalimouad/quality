"use client"

import { Users2, Building2, User, TrendingUp, Star } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const personas = [
  {
    id: 1,
    name: "Marc Directeur",
    role: "Directeur des Achats",
    segment: "B2B Grand compte",
    icon: Building2,
    color: "#3b82f6",
    nps: 52,
    churn: "3%",
    goals: ["Réduire les coûts d'approvisionnement", "Optimiser les délais de livraison", "Assurer la conformité fournisseurs"],
    painPoints: ["Manque de visibilité sur le pipeline", "Processus de validation trop long", "Reporting insuffisant"],
    channels: ["Email", "Téléphone", "Portail web"],
    satisfaction: 75,
  },
  {
    id: 2,
    name: "Sophie PME",
    role: "Responsable opérations",
    segment: "B2B PME",
    icon: Building2,
    color: "#f97316",
    nps: 38,
    churn: "12%",
    goals: ["Simplifier les commandes", "Obtenir un support réactif", "Avoir des prix transparents"],
    painPoints: ["Interface trop complexe", "Support difficile à joindre", "Délais de livraison imprévisibles"],
    channels: ["Site web", "Chat", "Email"],
    satisfaction: 60,
  },
  {
    id: 3,
    name: "Jean Client B2C",
    role: "Particulier",
    segment: "B2C",
    icon: User,
    color: "#10b981",
    nps: 45,
    churn: "8%",
    goals: ["Achat simple et rapide", "Livraison fiable", "Support disponible"],
    painPoints: ["Temps d'attente service client", "Manque de suivi colis", "Retours compliqués"],
    channels: ["Application mobile", "Réseaux sociaux", "Email"],
    satisfaction: 68,
  },
  {
    id: 4,
    name: "Anne Grand Compte",
    role: "VP Supply Chain",
    segment: "B2B International",
    icon: Building2,
    color: "#8b5cf6",
    nps: 62,
    churn: "2%",
    goals: ["Partenariat long terme", "Innovation collaborative", "KPI et reporting avancé"],
    painPoints: ["Turnover des interlocuteurs", "Délais de personnalisation", "Intégration API manquante"],
    channels: ["Account Manager dédié", "Portail B2B", "Réunions trimestrielles"],
    satisfaction: 82,
  },
]

export default function CxPersonasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Personas clients"
        description="Profils types de clients — segments, objectifs et points de friction"
        icon={Users2}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Personas définis" value={4} icon={Users2} iconColor="text-pink-600" iconBg="bg-pink-50" />
        <StatCard title="Segments couverts" value={4} icon={Building2} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="NPS moyen" value={49} icon={TrendingUp} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Satisfaction moy." value="71 %" icon={Star} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {personas.map((persona) => (
          <Card key={persona.id} className="overflow-hidden border">
            <div className="h-1" style={{ backgroundColor: persona.color }} />
            <CardHeader className="pb-3 pt-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: persona.color + "20" }}
                >
                  <persona.icon className="h-6 w-6" style={{ color: persona.color }} />
                </div>
                <div>
                  <CardTitle className="text-base">{persona.name}</CardTitle>
                  <p className="text-sm text-gray-500">{persona.role}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{persona.segment}</Badge>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-bold" style={{ color: persona.color }}>
                    NPS {persona.nps}
                  </p>
                  <p className="text-xs text-gray-500">Churn {persona.churn}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-600">Satisfaction</p>
                <div className="flex items-center gap-2">
                  <Progress value={persona.satisfaction} className="h-2 flex-1" />
                  <span className="text-xs font-medium text-gray-700">{persona.satisfaction}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-600">Objectifs</p>
                  <ul className="space-y-1">
                    {persona.goals.map((g) => (
                      <li key={g} className="flex items-start gap-1 text-xs text-gray-600">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-green-400" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-600">Points de friction</p>
                  <ul className="space-y-1">
                    {persona.painPoints.map((p) => (
                      <li key={p} className="flex items-start gap-1 text-xs text-gray-600">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-gray-600">Canaux préférés</p>
                <div className="flex flex-wrap gap-1">
                  {persona.channels.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border px-2 py-0.5 text-xs"
                      style={{ borderColor: persona.color + "40", color: persona.color, backgroundColor: persona.color + "10" }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
