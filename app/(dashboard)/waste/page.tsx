"use client"

import { Trash2, Layers, AlertTriangle, FileText, BadgeDollarSign, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { downloadCsv } from "@/lib/csv"

type TypeDechet = "DID" | "DIB" | "DEEE" | "DIS"
type Filiere = "Recyclage" | "Valorisation énergétique" | "Élimination" | "Réemploi"

interface WasteFlow {
  id: string
  designation: string
  codeEWC: string
  type: TypeDechet
  source: string
  filiere: Filiere
  prestataire: string
  volumeYtd: number
  unite: string
  coutKg: number
  bsdDem: boolean
}

const wastes: WasteFlow[] = [
  { id: "D-001", designation: "Copeaux métalliques (acier)", codeEWC: "12 01 01", type: "DIB", source: "Atelier usinage", filiere: "Recyclage", prestataire: "Recymetal SAS", volumeYtd: 8200, unite: "kg", coutKg: -0.05, bsdDem: true },
  { id: "D-002", designation: "Huiles usagées", codeEWC: "13 02 08", type: "DID", source: "Maintenance", filiere: "Valorisation énergétique", prestataire: "Veolia ES", volumeYtd: 320, unite: "L", coutKg: 0.28, bsdDem: true },
  { id: "D-003", designation: "Solvants halogénés usagés", codeEWC: "14 06 01", type: "DID", source: "Atelier dégraissage", filiere: "Élimination", prestataire: "Séché Eco Services", volumeYtd: 95, unite: "L", coutKg: 1.85, bsdDem: true },
  { id: "D-004", designation: "Cartons / emballages", codeEWC: "15 01 01", type: "DIB", source: "Logistique", filiere: "Recyclage", prestataire: "Paprec Group", volumeYtd: 1400, unite: "kg", coutKg: -0.02, bsdDem: false },
  { id: "D-005", designation: "Plastiques industriels", codeEWC: "12 01 05", type: "DIB", source: "Production", filiere: "Recyclage", prestataire: "Paprec Group", volumeYtd: 320, unite: "kg", coutKg: 0.10, bsdDem: false },
  { id: "D-006", designation: "Chiffons souillés hydrocarbures", codeEWC: "15 02 02", type: "DID", source: "Maintenance / production", filiere: "Élimination", prestataire: "Veolia ES", volumeYtd: 210, unite: "kg", coutKg: 1.20, bsdDem: true },
  { id: "D-007", designation: "Déchets d'équipements électriques", codeEWC: "16 02 13", type: "DEEE", source: "Informatique / maintenance", filiere: "Réemploi", prestataire: "Ecologic", volumeYtd: 85, unite: "kg", coutKg: 0.00, bsdDem: true },
  { id: "D-008", designation: "Boues de STEP", codeEWC: "19 08 12", type: "DID", source: "Station d'épuration", filiere: "Valorisation énergétique", prestataire: "Suez Recyclage", volumeYtd: 1800, unite: "kg", coutKg: 0.45, bsdDem: true },
  { id: "D-009", designation: "Déchets de bois non traité", codeEWC: "03 01 05", type: "DIB", source: "Emballage / palettes", filiere: "Valorisation énergétique", prestataire: "Paprec Group", volumeYtd: 600, unite: "kg", coutKg: 0.05, bsdDem: false },
  { id: "D-010", designation: "Batteries au plomb", codeEWC: "16 06 01", type: "DID", source: "Chariots élévateurs", filiere: "Recyclage", prestataire: "Recyclage Batterie SAS", volumeYtd: 160, unite: "kg", coutKg: -0.15, bsdDem: true },
  { id: "D-011", designation: "Emballages souillés produits chimiques", codeEWC: "15 01 10", type: "DID", source: "Laboratoire / production", filiere: "Élimination", prestataire: "Séché Eco Services", volumeYtd: 120, unite: "kg", coutKg: 1.50, bsdDem: true },
  { id: "D-012", designation: "Ordures ménagères assimilées", codeEWC: "20 03 01", type: "DIS", source: "Bureaux + réfectoire", filiere: "Élimination", prestataire: "Commune / syndicat", volumeYtd: 2400, unite: "kg", coutKg: 0.18, bsdDem: false },
]

const monthlyVolumes = [
  { mois: "Jan", did: 210, dib: 1450, deee: 15 },
  { mois: "Fév", did: 185, dib: 1380, deee: 0 },
  { mois: "Mar", did: 220, dib: 1520, deee: 20 },
  { mois: "Avr", did: 195, dib: 1400, deee: 0 },
  { mois: "Mai", did: 230, dib: 1600, deee: 30 },
  { mois: "Jun", did: 175, dib: 1250, deee: 20 },
]

const TYPE_COLORS: Record<TypeDechet, string> = {
  DID: "bg-red-100 text-red-700",
  DIB: "bg-blue-100 text-blue-700",
  DEEE: "bg-purple-100 text-purple-700",
  DIS: "bg-gray-100 text-gray-600",
}

const TYPE_LABELS: Record<TypeDechet, string> = {
  DID: "Déchet Industriel Dangereux",
  DIB: "Déchet Industriel Banal",
  DEEE: "Déchet Électrique/Électronique",
  DIS: "Déchet Ménager Assimilé",
}

const columns: DataTableColumn<WasteFlow>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "designation", header: "Désignation du déchet", sortable: true, sortValue: (r) => r.designation },
  { key: "codeEWC", header: "Code EWC", hideOnMobile: true },
  {
    key: "type", header: "Type",
    cell: (r) => (
      <span title={TYPE_LABELS[r.type]} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[r.type]}`}>
        {r.type}
      </span>
    ),
    sortValue: (r) => r.type,
  },
  { key: "source", header: "Source", hideOnMobile: true },
  { key: "filiere", header: "Filière" },
  { key: "prestataire", header: "Prestataire", hideOnMobile: true },
  {
    key: "volumeYtd", header: "Volume YTD",
    cell: (r) => <span className="font-semibold">{r.volumeYtd.toLocaleString("fr-FR")} {r.unite}</span>,
    sortValue: (r) => r.volumeYtd,
  },
  {
    key: "coutKg", header: "Coût / kg",
    cell: (r) => (
      <span className={r.coutKg < 0 ? "text-green-600 font-semibold" : "text-gray-700"}>
        {r.coutKg < 0 ? `${r.coutKg} €` : r.coutKg === 0 ? "—" : `${r.coutKg} €`}
      </span>
    ),
    sortValue: (r) => r.coutKg,
  },
  {
    key: "bsdDem", header: "BSD dem.", align: "center",
    cell: (r) => r.bsdDem
      ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Oui</span>
      : <span className="text-gray-300 text-xs">N/A</span>,
  },
]

const filters: DataTableFilter[] = [
  {
    key: "type", label: "Type",
    options: [
      { value: "DID", label: "DID — Dangereux" },
      { value: "DIB", label: "DIB — Banal" },
      { value: "DEEE", label: "DEEE" },
      { value: "DIS", label: "DIS — Ménager" },
    ],
    value: (r) => r.type,
  },
  {
    key: "filiere", label: "Filière",
    options: ["Recyclage", "Valorisation énergétique", "Élimination", "Réemploi"].map((f) => ({ value: f, label: f })),
    value: (r) => r.filiere,
  },
]

export default function WastePage() {
  const did = wastes.filter((w) => w.type === "DID").length
  const totalCout = wastes.reduce((s, w) => {
    const coutTotal = w.coutKg * w.volumeYtd * (w.unite === "L" ? 0.85 : 1)
    return s + coutTotal
  }, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des déchets"
        description="Suivi des flux de déchets, traçabilité BSD et conformité réglementaire"
        icon={Trash2}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("dechets.csv",
            ["Réf", "Désignation", "Code EWC", "Type", "Source", "Filière", "Prestataire", "Volume YTD", "Unité", "Coût/kg", "BSD dem."],
            wastes.map((w) => [w.id, w.designation, w.codeEWC, w.type, w.source, w.filiere, w.prestataire, w.volumeYtd, w.unite, w.coutKg, w.bsdDem ? "Oui" : "Non"])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Flux de déchets" value={wastes.length} icon={Layers} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Déchets dangereux" value={did} icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="BSD dématérialisés" value="94 %" icon={FileText} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Coût traitement estimé" value={`${Math.abs(Math.round(totalCout / 1000))} k€`} icon={BadgeDollarSign} iconColor="text-amber-600" iconBg="bg-amber-50" hint="YTD" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Volumes mensuels (kg) par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyVolumes} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="did" name="DID" fill="#ef4444" radius={[2, 2, 0, 0]} />
                <Bar dataKey="dib" name="DIB" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="deee" name="DEEE" fill="#a855f7" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Répartition par filière de traitement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["Recyclage", "Valorisation énergétique", "Élimination", "Réemploi"] as Filiere[]).map((f) => {
              const count = wastes.filter((w) => w.filiere === f).length
              const pct = Math.round((count / wastes.length) * 100)
              const colors: Record<Filiere, string> = {
                Recyclage: "bg-green-500",
                "Valorisation énergétique": "bg-amber-500",
                Élimination: "bg-red-500",
                Réemploi: "bg-blue-500",
              }
              return (
                <div key={f} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{f}</span>
                    <span className="font-semibold text-gray-600">{count} flux ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className={`h-2 rounded-full ${colors[f]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre des flux de déchets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={wastes}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher un déchet..."
            searchAccessor={(r) => `${r.designation} ${r.codeEWC} ${r.source} ${r.prestataire}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
