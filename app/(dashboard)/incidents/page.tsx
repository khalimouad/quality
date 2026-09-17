"use client"

import { AlertCircle, HardHat, Bell, TrendingDown, BedDouble, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { downloadCsv } from "@/lib/csv"

type Gravite = "Grave" | "Moyen" | "Mineur"
type IncidentType = "Accident avec arrêt" | "Accident sans arrêt" | "Presqu'accident" | "Situation dangereuse"
type Statut = "Clôturé" | "En cours" | "Ouvert"

interface Incident {
  id: string
  type: IncidentType
  gravite: Gravite
  date: string
  lieu: string
  personne: string
  joursPerdu: number
  statut: Statut
  causeRacine: string
}

const incidents: Incident[] = [
  { id: "INC-001", type: "Accident avec arrêt", gravite: "Grave", date: "2026-04-03", lieu: "Atelier soudage", personne: "Marc Dubois", joursPerdu: 5, statut: "Clôturé", causeRacine: "EPI non port" },
  { id: "INC-002", type: "Accident sans arrêt", gravite: "Moyen", date: "2026-04-18", lieu: "Entrepôt logistique", personne: "Sophie Renard", joursPerdu: 0, statut: "Clôturé", causeRacine: "Sol glissant" },
  { id: "INC-003", type: "Accident avec arrêt", gravite: "Grave", date: "2026-05-07", lieu: "Zone maintenance", personne: "Pierre Morel", joursPerdu: 7, statut: "En cours", causeRacine: "Consignation manquante" },
  { id: "INC-004", type: "Presqu'accident", gravite: "Moyen", date: "2026-05-12", lieu: "Quai de chargement", personne: "Luc Bernard", joursPerdu: 0, statut: "Clôturé", causeRacine: "Visibilité réduite" },
  { id: "INC-005", type: "Situation dangereuse", gravite: "Mineur", date: "2026-05-15", lieu: "Laboratoire qualité", personne: "Claire Petit", joursPerdu: 0, statut: "Ouvert", causeRacine: "Rangement non conforme" },
  { id: "INC-006", type: "Presqu'accident", gravite: "Moyen", date: "2026-05-22", lieu: "Atelier soudage", personne: "Antoine Girard", joursPerdu: 0, statut: "En cours", causeRacine: "Procédure non respectée" },
  { id: "INC-007", type: "Situation dangereuse", gravite: "Mineur", date: "2026-05-28", lieu: "Bureau administratif", personne: "Isabelle Roy", joursPerdu: 0, statut: "Clôturé", causeRacine: "Câbles traînants" },
  { id: "INC-008", type: "Accident sans arrêt", gravite: "Moyen", date: "2026-06-02", lieu: "Zone production", personne: "Thomas Blanc", joursPerdu: 0, statut: "En cours", causeRacine: "Machine non protégée" },
  { id: "INC-009", type: "Presqu'accident", gravite: "Grave", date: "2026-06-05", lieu: "Entrepôt chimique", personne: "Marie Leclerc", joursPerdu: 0, statut: "Ouvert", causeRacine: "Fuite produit chimique" },
  { id: "INC-010", type: "Situation dangereuse", gravite: "Mineur", date: "2026-06-08", lieu: "Parking extérieur", personne: "Jean Fontaine", joursPerdu: 0, statut: "Clôturé", causeRacine: "Éclairage déficient" },
]

const monthlyData = [
  { mois: "Jan", accidents: 1, presquAccidents: 2, situations: 3 },
  { mois: "Fév", accidents: 0, presquAccidents: 1, situations: 2 },
  { mois: "Mar", accidents: 1, presquAccidents: 3, situations: 4 },
  { mois: "Avr", accidents: 2, presquAccidents: 2, situations: 2 },
  { mois: "Mai", accidents: 1, presquAccidents: 2, situations: 2 },
  { mois: "Jun", accidents: 1, presquAccidents: 1, situations: 1 },
]

const GRAVITE_COLORS: Record<Gravite, string> = {
  Grave: "bg-red-100 text-red-700 border-red-200",
  Moyen: "bg-amber-100 text-amber-700 border-amber-200",
  Mineur: "bg-green-100 text-green-700 border-green-200",
}

const STATUT_COLORS: Record<Statut, string> = {
  Clôturé: "bg-green-100 text-green-700",
  "En cours": "bg-amber-100 text-amber-700",
  Ouvert: "bg-red-100 text-red-700",
}

const columns: DataTableColumn<Incident>[] = [
  { key: "id", header: "Référence", sortable: true, sortValue: (r) => r.id },
  { key: "type", header: "Type", sortable: true, sortValue: (r) => r.type },
  {
    key: "gravite", header: "Gravité",
    cell: (r) => (
      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${GRAVITE_COLORS[r.gravite]}`}>
        {r.gravite}
      </span>
    ),
  },
  { key: "date", header: "Date", sortable: true, sortValue: (r) => r.date },
  { key: "lieu", header: "Lieu", sortable: true, sortValue: (r) => r.lieu },
  { key: "personne", header: "Personne concernée", hideOnMobile: true },
  {
    key: "joursPerdu", header: "Jours perdus", align: "center",
    cell: (r) => <span className={r.joursPerdu > 0 ? "font-semibold text-red-600" : "text-gray-400"}>{r.joursPerdu}</span>,
    sortValue: (r) => r.joursPerdu,
  },
  {
    key: "statut", header: "Statut",
    cell: (r) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[r.statut]}`}>
        {r.statut}
      </span>
    ),
  },
  { key: "causeRacine", header: "Cause racine", hideOnMobile: true },
]

const filters: DataTableFilter[] = [
  {
    key: "type", label: "Type",
    options: [
      { value: "Accident avec arrêt", label: "Accident avec arrêt" },
      { value: "Accident sans arrêt", label: "Accident sans arrêt" },
      { value: "Presqu'accident", label: "Presqu'accident" },
      { value: "Situation dangereuse", label: "Situation dangereuse" },
    ],
    value: (r) => r.type,
  },
  {
    key: "gravite", label: "Gravité",
    options: [
      { value: "Grave", label: "Grave" },
      { value: "Moyen", label: "Moyen" },
      { value: "Mineur", label: "Mineur" },
    ],
    value: (r) => r.gravite,
  },
  {
    key: "statut", label: "Statut",
    options: [
      { value: "Ouvert", label: "Ouvert" },
      { value: "En cours", label: "En cours" },
      { value: "Clôturé", label: "Clôturé" },
    ],
    value: (r) => r.statut,
  },
]

export default function IncidentsPage() {
  const accidents = incidents.filter((i) => i.type.startsWith("Accident")).length
  const joursTotal = incidents.reduce((s, i) => s + i.joursPerdu, 0)
  const heuresExposition = 185000
  const tf = parseFloat(((accidents / heuresExposition) * 1_000_000).toFixed(2))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accidents et incidents"
        description="Déclaration, analyse et suivi des accidents de travail et incidents"
        icon={AlertCircle}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("incidents.csv",
            ["Réf", "Type", "Gravité", "Date", "Lieu", "Personne", "Jours perdus", "Statut", "Cause racine"],
            incidents.map((i) => [i.id, i.type, i.gravite, i.date, i.lieu, i.personne, i.joursPerdu, i.statut, i.causeRacine])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Accidents YTD" value={accidents} icon={HardHat} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Incidents déclarés" value={incidents.length} icon={Bell} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Taux de fréquence" value={tf} icon={TrendingDown} iconColor="text-amber-600" iconBg="bg-amber-50" hint="TF1 /million h" />
        <StatCard title="Jours perdus" value={joursTotal} icon={BedDouble} iconColor="text-gray-600" iconBg="bg-gray-100" hint="YTD" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tendance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="accidents" name="Accidents" fill="#ef4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="presquAccidents" name="Presqu'accidents" fill="#f97316" radius={[2, 2, 0, 0]} />
                <Bar dataKey="situations" name="Sit. dangereuses" fill="#fbbf24" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Répartition par cause racine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 pt-1">
              {[
                { cause: "EPI non portés / inadaptés", n: 3, pct: 30 },
                { cause: "Procédure non respectée", n: 2, pct: 20 },
                { cause: "Consignation / LOTO", n: 2, pct: 20 },
                { cause: "Environnement de travail", n: 2, pct: 20 },
                { cause: "Autres", n: 1, pct: 10 },
              ].map((item) => (
                <div key={item.cause} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">{item.cause}</span>
                    <span className="font-medium text-gray-600">{item.n} ({item.pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-red-500" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre des accidents et incidents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={incidents}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher..."
            searchAccessor={(r) => `${r.id} ${r.type} ${r.lieu} ${r.personne} ${r.causeRacine}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
