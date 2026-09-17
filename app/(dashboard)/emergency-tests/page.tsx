"use client"

import { BellRing, CalendarDays, CheckSquare, BarChart2, Calendar, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type TestStatut = "Réussi" | "Partiellement réussi" | "Échoué" | "Planifié"
type TestType = "Incendie / évacuation" | "Plan d'urgence chimique" | "Déversement accidentel" | "Malveillance / intrusion" | "Accident grave"

interface EmergencyTest {
  id: string
  type: TestType
  date: string
  lieu: string
  responsable: string
  participants: number
  delaiEvacuation: string
  resultat: number
  statut: TestStatut
  actionsAmeliorations: string
}

const tests: EmergencyTest[] = [
  { id: "EX-001", type: "Incendie / évacuation", date: "2026-02-18", lieu: "Bâtiment A", responsable: "Jean Dupont", participants: 45, delaiEvacuation: "3 min 12 s", resultat: 88, statut: "Réussi", actionsAmeliorations: "Afficher plans évacuation zone B" },
  { id: "EX-002", type: "Plan d'urgence chimique", date: "2026-03-05", lieu: "Entrepôt chimique", responsable: "Sophie Moreau", participants: 12, delaiEvacuation: "—", resultat: 72, statut: "Partiellement réussi", actionsAmeliorations: "Renouveler formation premiers secours" },
  { id: "EX-003", type: "Incendie / évacuation", date: "2026-04-22", lieu: "Bâtiment B + Ateliers", responsable: "Jean Dupont", participants: 67, delaiEvacuation: "2 min 48 s", resultat: 93, statut: "Réussi", actionsAmeliorations: "RAS" },
  { id: "EX-004", type: "Accident grave", date: "2026-05-14", lieu: "Zone maintenance", responsable: "Marc Durand", participants: 8, delaiEvacuation: "—", resultat: 65, statut: "Partiellement réussi", actionsAmeliorations: "Mettre à jour liste SAMU / numéros urgence" },
  { id: "EX-005", type: "Malveillance / intrusion", date: "2026-05-28", lieu: "Site entier", responsable: "Thomas Laurent", participants: 5, delaiEvacuation: "—", resultat: 58, statut: "Partiellement réussi", actionsAmeliorations: "Revoir procédure confinement + communication crise" },
  { id: "EX-006", type: "Incendie / évacuation", date: "2026-07-15", lieu: "Bâtiment A", responsable: "Jean Dupont", participants: 0, delaiEvacuation: "—", resultat: 0, statut: "Planifié", actionsAmeliorations: "—" },
  { id: "EX-007", type: "Plan d'urgence chimique", date: "2026-09-09", lieu: "Entrepôt chimique", responsable: "Sophie Moreau", participants: 0, delaiEvacuation: "—", resultat: 0, statut: "Planifié", actionsAmeliorations: "—" },
]

const STATUT_COLORS: Record<TestStatut, string> = {
  Réussi: "bg-green-100 text-green-700",
  "Partiellement réussi": "bg-amber-100 text-amber-700",
  Échoué: "bg-red-100 text-red-700",
  Planifié: "bg-blue-100 text-blue-700",
}

const columns: DataTableColumn<EmergencyTest>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "type", header: "Type d'exercice", sortable: true, sortValue: (r) => r.type },
  { key: "date", header: "Date", sortable: true, sortValue: (r) => r.date },
  { key: "lieu", header: "Lieu" },
  { key: "responsable", header: "Responsable", hideOnMobile: true },
  {
    key: "participants", header: "Participants", align: "center",
    cell: (r) => r.statut === "Planifié" ? <span className="text-gray-300">—</span> : <span>{r.participants}</span>,
    sortValue: (r) => r.participants,
  },
  { key: "delaiEvacuation", header: "Délai évac.", align: "center" },
  {
    key: "resultat", header: "Résultat",
    cell: (r) => r.statut === "Planifié" ? <span className="text-gray-300">—</span> : (
      <div className="flex items-center gap-2 min-w-[80px]">
        <Progress value={r.resultat} className="h-1.5 flex-1" />
        <span className={`text-xs font-semibold ${r.resultat >= 80 ? "text-green-600" : r.resultat >= 60 ? "text-amber-600" : "text-red-600"}`}>
          {r.resultat}%
        </span>
      </div>
    ),
    sortValue: (r) => r.resultat,
  },
  {
    key: "statut", header: "Statut",
    cell: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[r.statut]}`}>{r.statut}</span>,
  },
]

const filters: DataTableFilter[] = [
  {
    key: "type", label: "Type",
    options: [...new Set(tests.map((t) => t.type))].map((t) => ({ value: t, label: t })),
    value: (r) => r.type,
  },
  {
    key: "statut", label: "Statut",
    options: ["Réussi", "Partiellement réussi", "Planifié"].map((s) => ({ value: s, label: s })),
    value: (r) => r.statut,
  },
]

export default function EmergencyTestsPage() {
  const realized = tests.filter((t) => t.statut !== "Planifié").length
  const successful = tests.filter((t) => t.statut === "Réussi").length
  const tauxReussite = realized > 0 ? Math.round((successful / realized) * 100) : 0
  const next = tests.find((t) => t.statut === "Planifié")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests de situation d'urgence"
        description="Planification, réalisation et résultats des exercices d'urgence sécurité"
        icon={BellRing}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("exercices-urgence.csv",
            ["Réf", "Type", "Date", "Lieu", "Responsable", "Participants", "Délai évac.", "Résultat %", "Statut"],
            tests.map((t) => [t.id, t.type, t.date, t.lieu, t.responsable, t.participants, t.delaiEvacuation, t.resultat, t.statut])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Exercices planifiés" value={tests.length} icon={CalendarDays} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Réalisés" value={realized} icon={CheckSquare} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Taux de réussite" value={`${tauxReussite} %`} icon={BarChart2} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Prochaine simulation" value={next?.date.slice(5) ?? "—"} icon={Calendar} iconColor="text-purple-600" iconBg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Résultats par exercice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tests.filter((t) => t.statut !== "Planifié").map((t) => (
              <div key={t.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{t.type}</span>
                  <span className={`text-xs font-semibold ${t.resultat >= 80 ? "text-green-600" : t.resultat >= 60 ? "text-amber-600" : "text-red-600"}`}>
                    {t.resultat}%
                  </span>
                </div>
                <Progress value={t.resultat} className="h-2" />
                <span className="text-xs text-gray-400">{t.date} · {t.lieu}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Actions d&apos;amélioration identifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tests
                .filter((t) => t.actionsAmeliorations && t.actionsAmeliorations !== "—" && t.actionsAmeliorations !== "RAS")
                .map((t) => (
                  <div key={t.id} className="rounded-lg border border-gray-100 p-3">
                    <p className="text-xs font-semibold text-gray-500 mb-1">{t.id} · {t.type}</p>
                    <p className="text-sm text-gray-800">{t.actionsAmeliorations}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre des exercices d&apos;urgence</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={tests}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher un exercice..."
            searchAccessor={(r) => `${r.id} ${r.type} ${r.lieu} ${r.responsable}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
