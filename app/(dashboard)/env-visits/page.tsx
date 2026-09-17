"use client"

import { Map, ClipboardList, CheckCircle2, XCircle, AlertCircle, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type VisitStatut = "Réalisée" | "Planifiée" | "Annulée"

interface EnvVisit {
  id: string
  date: string
  secteur: string
  auditeur: string
  theme: string
  conformite: number
  nonConformites: number
  actionsOuvertes: number
  statut: VisitStatut
}

const visits: EnvVisit[] = [
  { id: "VE-001", date: "2026-01-20", secteur: "Station d'épuration", auditeur: "Pierre Bernard", theme: "Rejets aqueux", conformite: 80, nonConformites: 1, actionsOuvertes: 1, statut: "Réalisée" },
  { id: "VE-002", date: "2026-02-05", secteur: "Entrepôt chimique", auditeur: "Isabelle Rousseau", theme: "Stockage produits dangereux", conformite: 67, nonConformites: 2, actionsOuvertes: 2, statut: "Réalisée" },
  { id: "VE-003", date: "2026-02-24", secteur: "Zone déchets", auditeur: "Pierre Bernard", theme: "Gestion des déchets", conformite: 75, nonConformites: 1, actionsOuvertes: 1, statut: "Réalisée" },
  { id: "VE-004", date: "2026-03-18", secteur: "Toiture / espaces verts", auditeur: "Isabelle Rousseau", theme: "Eaux pluviales", conformite: 90, nonConformites: 0, actionsOuvertes: 0, statut: "Réalisée" },
  { id: "VE-005", date: "2026-04-15", secteur: "Zone de production", auditeur: "Pierre Bernard", theme: "Émissions atmosphériques", conformite: 60, nonConformites: 2, actionsOuvertes: 2, statut: "Réalisée" },
  { id: "VE-006", date: "2026-07-08", secteur: "Station d'épuration", auditeur: "Pierre Bernard", theme: "Rejets aqueux", conformite: 0, nonConformites: 0, actionsOuvertes: 0, statut: "Planifiée" },
  { id: "VE-007", date: "2026-07-22", secteur: "Zone déchets", auditeur: "Isabelle Rousseau", theme: "Gestion des déchets", conformite: 0, nonConformites: 0, actionsOuvertes: 0, statut: "Planifiée" },
  { id: "VE-008", date: "2026-08-12", secteur: "Entrepôt chimique", auditeur: "Pierre Bernard", theme: "Stockage produits dangereux", conformite: 0, nonConformites: 0, actionsOuvertes: 0, statut: "Planifiée" },
]

const STATUT_COLORS: Record<VisitStatut, string> = {
  Réalisée: "bg-green-100 text-green-700",
  Planifiée: "bg-blue-100 text-blue-700",
  Annulée: "bg-gray-100 text-gray-600",
}

const columns: DataTableColumn<EnvVisit>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "date", header: "Date", sortable: true, sortValue: (r) => r.date },
  { key: "secteur", header: "Secteur", sortable: true, sortValue: (r) => r.secteur },
  { key: "auditeur", header: "Auditeur", sortable: true, sortValue: (r) => r.auditeur },
  { key: "theme", header: "Thème audité" },
  {
    key: "conformite", header: "Conformité %",
    cell: (r) => r.statut === "Réalisée" ? (
      <div className="flex items-center gap-2 min-w-[90px]">
        <Progress value={r.conformite} className="h-1.5 flex-1" />
        <span className={`text-xs font-semibold ${r.conformite >= 80 ? "text-green-600" : r.conformite >= 60 ? "text-amber-600" : "text-red-600"}`}>
          {r.conformite}%
        </span>
      </div>
    ) : <span className="text-gray-300">—</span>,
    sortValue: (r) => r.conformite,
  },
  {
    key: "nonConformites", header: "NC", align: "center",
    cell: (r) => r.nonConformites > 0
      ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">{r.nonConformites}</span>
      : <span className="text-gray-300">0</span>,
    sortValue: (r) => r.nonConformites,
  },
  {
    key: "actionsOuvertes", header: "Actions", align: "center",
    cell: (r) => r.actionsOuvertes > 0
      ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{r.actionsOuvertes}</span>
      : <span className="text-gray-300">0</span>,
    sortValue: (r) => r.actionsOuvertes,
  },
  {
    key: "statut", header: "Statut",
    cell: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[r.statut]}`}>{r.statut}</span>,
  },
]

const filters: DataTableFilter[] = [
  {
    key: "secteur", label: "Secteur",
    options: [...new Set(visits.map((v) => v.secteur))].map((s) => ({ value: s, label: s })),
    value: (r) => r.secteur,
  },
  {
    key: "statut", label: "Statut",
    options: [
      { value: "Réalisée", label: "Réalisée" },
      { value: "Planifiée", label: "Planifiée" },
    ],
    value: (r) => r.statut,
  },
]

export default function EnvVisitsPage() {
  const realized = visits.filter((v) => v.statut === "Réalisée").length
  const totalNc = visits.reduce((s, v) => s + v.nonConformites, 0)
  const totalActions = visits.reduce((s, v) => s + v.actionsOuvertes, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visites environnement terrain"
        description="Inspections terrain pour la conformité environnementale ISO 14001"
        icon={Map}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("visites-env.csv",
            ["Réf", "Date", "Secteur", "Auditeur", "Thème", "Conformité %", "NC", "Actions", "Statut"],
            visits.map((v) => [v.id, v.date, v.secteur, v.auditeur, v.theme, v.conformite, v.nonConformites, v.actionsOuvertes, v.statut])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Visites planifiées" value={visits.length} icon={ClipboardList} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Réalisées" value={realized} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Non-conformités" value={totalNc} icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Actions ouvertes" value={totalActions} icon={AlertCircle} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Conformité par secteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { secteur: "Toiture / espaces verts", conf: 90 },
              { secteur: "Station d'épuration", conf: 80 },
              { secteur: "Zone déchets", conf: 75 },
              { secteur: "Entrepôt chimique", conf: 67 },
              { secteur: "Zone de production", conf: 60 },
            ].map((z) => (
              <div key={z.secteur} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{z.secteur}</span>
                  <span className={`font-semibold text-xs ${z.conf >= 80 ? "text-green-600" : z.conf >= 60 ? "text-amber-600" : "text-red-600"}`}>
                    {z.conf}%
                  </span>
                </div>
                <Progress value={z.conf} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Principales non-conformités détectées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { nc: "Stockage produits chimiques sans rétention", theme: "Stockage", gravite: "Majeure", statut: "En cours" },
                { nc: "Absence de registre de suivi des rejets", theme: "Rejets aqueux", gravite: "Majeure", statut: "Clôturée" },
                { nc: "Étiquetage déchets non conforme", theme: "Déchets", gravite: "Mineure", statut: "Clôturée" },
                { nc: "Dépassement valeur limite émissions COV", theme: "Émissions", gravite: "Critique", statut: "En cours" },
                { nc: "Absence de bac de rétention mobile", theme: "Stockage", gravite: "Majeure", statut: "En cours" },
              ].map((nc, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                  <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${nc.statut === "Clôturée" ? "bg-green-400" : nc.gravite === "Critique" ? "bg-red-500" : "bg-amber-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{nc.nc}</p>
                    <p className="text-xs text-gray-500">{nc.theme} · {nc.gravite} · {nc.statut}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Journal des visites environnement</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={visits}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher..."
            searchAccessor={(r) => `${r.id} ${r.secteur} ${r.auditeur} ${r.theme}`}
            filters={filters}
            pageSize={8}
          />
        </CardContent>
      </Card>
    </div>
  )
}
