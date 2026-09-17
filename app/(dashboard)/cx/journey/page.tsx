"use client"

import { Map, Users, AlertTriangle, CheckCircle2 } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const journeys = [
  {
    id: 1,
    name: "Parcours acquisition B2B",
    persona: "Directeur Achat",
    stages: ["Découverte", "Évaluation", "Décision", "Onboarding", "Fidélisation"],
    currentStage: 2,
    nps: 38,
    frictions: 3,
    status: "active",
    lastUpdated: "Mars 2026",
  },
  {
    id: 2,
    name: "Parcours service client",
    persona: "Client existant",
    stages: ["Demande", "Traitement", "Résolution", "Suivi", "Clôture"],
    currentStage: 1,
    nps: 52,
    frictions: 1,
    status: "active",
    lastUpdated: "Avr 2026",
  },
  {
    id: 3,
    name: "Parcours renouvellement contrat",
    persona: "Client grand compte",
    stages: ["Alerte", "Négociation", "Signature", "Activation"],
    currentStage: 0,
    nps: 45,
    frictions: 2,
    status: "review",
    lastUpdated: "Fév 2026",
  },
]

export default function CxJourneyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Parcours clients"
        description="Cartographie des journey maps par persona et canal"
        icon={Map}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Journey maps actives" value={3} icon={Map} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Personas couverts" value={5} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Points de friction" value={6} icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Étapes optimisées" value={12} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {journeys.map((journey) => (
          <Card key={journey.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold">{journey.name}</CardTitle>
                  <CardDescription className="text-xs">Persona : {journey.persona}</CardDescription>
                </div>
                <Badge variant={journey.status === "active" ? "success" : "warning"}>
                  {journey.status === "active" ? "Actif" : "En révision"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stages */}
              <div className="flex gap-1">
                {journey.stages.map((stage, i) => (
                  <div
                    key={stage}
                    className="flex-1 text-center"
                    title={stage}
                  >
                    <div
                      className={`h-2 rounded-full transition-colors ${
                        i <= journey.currentStage
                          ? "bg-orange-400"
                          : "bg-gray-200"
                      }`}
                    />
                    <span className="mt-1 block text-[9px] text-gray-500 truncate">
                      {stage}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-orange-600">{journey.nps}</p>
                  <p className="text-xs text-gray-500">NPS moyen</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-500">{journey.frictions}</p>
                  <p className="text-xs text-gray-500">Frictions</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">{journey.stages.length}</p>
                  <p className="text-xs text-gray-500">Étapes</p>
                </div>
              </div>

              <p className="text-xs text-gray-400">Mise à jour : {journey.lastUpdated}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
