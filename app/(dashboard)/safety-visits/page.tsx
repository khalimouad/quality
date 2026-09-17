"use client"

import { MapPin, CalendarDays, CheckCircle2, Eye, ClipboardList, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type VisitStatut = "Réalisée" | "Planifiée" | "Annulée"

interface SafetyVisit {
  id: string
  date: string
  zone: string
  auditeur: string
  nbObservations: number
  conformite: number
  actionsOuvertes: number
  statut: VisitStatut
}

const visits: SafetyVisit[] = [
  { id: "VST-001", date: "2026-01-14", zone: "Atelier soudage", auditeur: "Jean Dupont", nbObservations: 8, conformite: 75, actionsOuvertes: 2, statut: "Réalisée" },
  { id: "VST-002", date: "2026-01-28", zone: "Entrepôt logistique", auditeur: "Marie Martin", nbObservations: 5, conformite: 60, actionsOuvertes: 2, statut: "Réalisée" },
  { id: "VST-003", date: "2026-02-11", zone: "Zone maintenance", auditeur: "Jean Dupont", nbObservations: 6, conformite: 83, actionsOuvertes: 1, statut: "Réalisée" },
  { id: "VST-004", date: "2026-02-25", zone: "Laboratoire qualité", auditeur: "Sophie Moreau", nbObservations: 4, conformite: 100, actionsOuvertes: 0, statut: "Réalisée" },
  { id: "VST-005", date: "2026-03-10", zone: "Quai de chargement", auditeur: "Marc Durand", nbObservations: 7, conformite: 57, actionsOuvertes: 3, statut: "Réalisée" },
  { id: "VST-006", date: "2026-03-24", zone: "Atelier soudage", auditeur: "Marie Martin", nbObservations: 6, conformite: 67, actionsOuvertes: 2, statut: "Réalisée" },
  { id: "VST-007", date: "2026-04-08", zone: "Zone production", auditeur: "Jean Dupont", nbObservations: 9, conformite: 78, actionsOuvertes: 2, statut: "Réalisée" },
  { id: "VST-008", date: "2026-04-22", zone: "Entrepôt chimique", auditeur: "Sophie Moreau", nbObservations: 5, conformite: 80, actionsOuvertes: 1, statut: "Réalisée" },
  { id: "VST-009", date: "2026-06-17", zone: "Zone maintenance", auditeur: "Marc Durand", nbObservations: 0, conformite: 0, actionsOuvertes: 0, statut: "Planifiée" },
  { id: "VST-010", date: "2026-07-01", zone: "Atelier soudage", auditeur: "Jean Dupont", nbObservations: 0, conformite: 0, actionsOuvertes: 0, statut: "Planifiée" },
  { id: "VST-011", date: "2026-07-15", zone: "Quai de chargement", auditeur: "Marie Martin", nbObservations: 0, conformite: 0, actionsOuvertes: 0, statut: "Planifiée" },
  { id: "VST-012", date: "2026-07-29", zone: "Zone production", auditeur: "Sophie Moreau", nbObservations: 0, conformite: 0, actionsOuvertes: 0, statut: "Planifiée" },
]

const STATUT_COLORS: Record<VisitStatut, string> = {
  Réalisée: "bg-green-100 text-green-700",
  Planifiée: "bg-blue-100 text-blue-700",
  Annulée: "bg-gray-100 text-gray-600",
}

const columns: DataTableColumn<SafetyVisit>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "date", header: "Date", sortable: true, sortValue: (r) => r.date },
  { key: "zone", header: "Zone / Secteur", sortable: true, sortValue: (r) => r.zone },
  { key: "auditeur", header: "Auditeur", sortable: true, sortValue: (r) => r.auditeur },
  {
    key: "nbObservations", header: "Observations", align: "center",
    cell: (r) => r.statut === "Réalisée" ? <span className="font-semibold text-gray-800">{r.nbObservations}</span> : <span className="text-gray-300">—</span>,
    sortValue: (r) => r.nbObservations,
  },
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
    key: "zone", label: "Zone",
    options: [...new Set(visits.map((v) => v.zone))].map((z) => ({ value: z, label: z })),
    value: (r) => r.zone,
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

const zoneStats = [
  { zone: "Atelier soudage", avgConf: 71, visits: 3 },
  { zone: "Entrepôt logistique", avgConf: 60, visits: 1 },
  { zone: "Zone maintenance", avgConf: 83, visits: 1 },
  { zone: "Quai de chargement", avgConf: 57, visits: 1 },
  { zone: "Laboratoire qualité", avgConf: 100, visits: 1 },
]

export default function SafetyVisitsPage() {
  const realized = visits.filter((v) => v.statut === "Réalisée").length
  const totalObs = visits.reduce((s, v) => s + v.nbObservations, 0)
  const totalActions = visits.reduce((s, v) => s + v.actionsOuvertes, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visites sécurité terrain"
        description="Inspections terrain, observations comportementales et résultats"
        icon={MapPin}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("visites-securite.csv",
            ["Réf", "Date", "Zone", "Auditeur", "Observations", "Conformité %", "Actions ouvertes", "Statut"],
            visits.map((v) => [v.id, v.date, v.zone, v.auditeur, v.nbObservations, v.conformite, v.actionsOuvertes, v.statut])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Visites planifiées" value={visits.length} icon={CalendarDays} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Réalisées" value={realized} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Observations" value={totalObs} icon={Eye} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="Actions ouvertes" value={totalActions} icon={ClipboardList} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Conformité par zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {zoneStats.map((z) => (
              <div key={z.zone} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{z.zone}</span>
                  <span className={`font-semibold text-xs ${z.avgConf >= 80 ? "text-green-600" : z.avgConf >= 60 ? "text-amber-600" : "text-red-600"}`}>
                    {z.avgConf}%
                  </span>
                </div>
                <Progress value={z.avgConf} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Points de vigilance fréquents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { obs: "Port des EPI non systématique", freq: 12, pct: 35 },
                { obs: "Signalétique manquante ou dégradée", freq: 8, pct: 24 },
                { obs: "Allées de circulation encombrées", freq: 6, pct: 18 },
                { obs: "Consignations non appliquées", freq: 5, pct: 15 },
                { obs: "Registres non à jour", freq: 3, pct: 9 },
              ].map((item) => (
                <div key={item.obs} className="flex items-center gap-3">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: `${item.pct * 2}px`, minWidth: 8 }} />
                  <span className="flex-1 text-xs text-gray-700">{item.obs}</span>
                  <span className="text-xs font-semibold text-gray-500">{item.freq}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Journal des visites sécurité</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={visits}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher une visite..."
            searchAccessor={(r) => `${r.id} ${r.zone} ${r.auditeur}`}
            filters={filters}
            pageSize={8}
          />
        </CardContent>
      </Card>
    </div>
  )
}
