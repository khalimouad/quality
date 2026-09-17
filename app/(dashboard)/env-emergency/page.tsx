"use client"

import { BellRing, ClipboardList, CheckCircle2, TrendingUp, FileCheck, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type TestStatut = "Réussi" | "Partiellement réussi" | "Planifié"

interface EnvEmergencyTest {
  id: string
  scenario: string
  date: string
  lieu: string
  responsable: string
  duree: string
  resultat: number
  statut: TestStatut
  leconRetenue: string
  poi: boolean
}

const tests: EnvEmergencyTest[] = [
  {
    id: "EE-001",
    scenario: "Déversement de carburant en rétention",
    date: "2026-02-12",
    lieu: "Zone stockage hydrocarbures",
    responsable: "Pierre Bernard",
    duree: "45 min",
    resultat: 90,
    statut: "Réussi",
    leconRetenue: "Délai d'intervention conforme. Absorbants en quantité suffisante.",
    poi: true,
  },
  {
    id: "EE-002",
    scenario: "Fuite de solvant vers réseau pluvial",
    date: "2026-04-09",
    lieu: "Atelier peinture",
    responsable: "Isabelle Rousseau",
    duree: "60 min",
    resultat: 78,
    statut: "Partiellement réussi",
    leconRetenue: "Obturation réseau trop lente — mise à jour procédure requise.",
    poi: true,
  },
  {
    id: "EE-003",
    scenario: "Déversement de carburant en rétention",
    date: "2026-09-16",
    lieu: "Zone stockage hydrocarbures",
    responsable: "Pierre Bernard",
    duree: "—",
    resultat: 0,
    statut: "Planifié",
    leconRetenue: "—",
    poi: false,
  },
  {
    id: "EE-004",
    scenario: "Pollution atmosphérique accidentelle",
    date: "2026-11-05",
    lieu: "Zone production",
    responsable: "Isabelle Rousseau",
    duree: "—",
    resultat: 0,
    statut: "Planifié",
    leconRetenue: "—",
    poi: false,
  },
]

const STATUT_COLORS: Record<TestStatut, string> = {
  Réussi: "bg-green-100 text-green-700",
  "Partiellement réussi": "bg-amber-100 text-amber-700",
  Planifié: "bg-blue-100 text-blue-700",
}

const columns: DataTableColumn<EnvEmergencyTest>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "scenario", header: "Scénario" },
  { key: "date", header: "Date", sortable: true, sortValue: (r) => r.date },
  { key: "lieu", header: "Lieu" },
  { key: "responsable", header: "Responsable", hideOnMobile: true },
  { key: "duree", header: "Durée", align: "center" },
  {
    key: "resultat", header: "Score",
    cell: (r) => r.statut === "Planifié" ? <span className="text-gray-300">—</span> : (
      <div className="flex items-center gap-2 min-w-[80px]">
        <Progress value={r.resultat} className="h-1.5 flex-1" />
        <span className={`text-xs font-semibold ${r.resultat >= 80 ? "text-green-600" : "text-amber-600"}`}>{r.resultat}%</span>
      </div>
    ),
    sortValue: (r) => r.resultat,
  },
  {
    key: "poi", header: "POI mis à jour", align: "center",
    cell: (r) => r.statut === "Planifié" ? <span className="text-gray-300">—</span> : (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.poi ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
        {r.poi ? "Oui" : "Non"}
      </span>
    ),
  },
  {
    key: "statut", header: "Statut",
    cell: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[r.statut]}`}>{r.statut}</span>,
  },
]

export default function EnvEmergencyPage() {
  const realized = tests.filter((t) => t.statut !== "Planifié")
  const avgScore = realized.length > 0 ? Math.round(realized.reduce((s, t) => s + t.resultat, 0) / realized.length) : 0
  const poiAJour = realized.filter((t) => t.poi).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests de situation d'urgence environnementale"
        description="Exercices de réponse aux situations d'urgence environnementale — Plan d'Opération Interne"
        icon={BellRing}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("exercices-env-urgence.csv",
            ["Réf", "Scénario", "Date", "Lieu", "Responsable", "Durée", "Score %", "POI à jour", "Statut"],
            tests.map((t) => [t.id, t.scenario, t.date, t.lieu, t.responsable, t.duree, t.resultat, t.poi ? "Oui" : "Non", t.statut])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Exercices planifiés" value={tests.length} icon={ClipboardList} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Réalisés" value={realized.length} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Score moyen" value={`${avgScore} %`} icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="POI mis à jour" value={`${poiAJour} / ${realized.length}`} icon={FileCheck} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Résultats des exercices réalisés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {realized.map((t) => (
              <div key={t.id} className="rounded-lg border border-gray-100 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.scenario}</p>
                    <p className="text-xs text-gray-500">{t.date} · {t.lieu} · {t.duree}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[t.statut]}`}>{t.statut}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={t.resultat} className="h-2 flex-1" />
                  <span className={`text-sm font-bold ${t.resultat >= 80 ? "text-green-600" : "text-amber-600"}`}>{t.resultat}%</span>
                </div>
                {t.leconRetenue !== "—" && (
                  <p className="text-xs text-gray-600 italic">Leçon retenue : {t.leconRetenue}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Scénarios planifiés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tests.filter((t) => t.statut === "Planifié").map((t) => (
              <div key={t.id} className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.scenario}</p>
                    <p className="text-xs text-gray-600 mt-1">{t.date} · {t.lieu}</p>
                    <p className="text-xs text-gray-500">Responsable : {t.responsable}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Planifié</span>
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-500">
              Le Plan d&apos;Opération Interne (POI) doit être révisé après chaque exercice.
              Conformité réglementaire : Art. R. 515-86 Code de l&apos;environnement.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre des exercices environnementaux</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={tests}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher..."
            searchAccessor={(r) => `${r.id} ${r.scenario} ${r.lieu}`}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
