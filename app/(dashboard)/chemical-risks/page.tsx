"use client"

import { FlaskConical, Package, Biohazard, FileCheck, ArrowLeftRight, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type Danger = "Inflammable" | "Toxique" | "CMR" | "Corrosif" | "Irritant" | "Nocif"
type FdsStatut = "À jour" | "À renouveler" | "Manquante"

interface ChemicalProduct {
  id: string
  nom: string
  fournisseur: string
  numeroCas: string
  danger: Danger[]
  zone: string
  quantite: string
  epi: string
  fdsDate: string
  fdsStatut: FdsStatut
  substitution: boolean
}

const products: ChemicalProduct[] = [
  { id: "CH-001", nom: "Acétone", fournisseur: "Sigma-Aldrich", numeroCas: "67-64-1", danger: ["Inflammable", "Irritant"], zone: "Laboratoire qualité", quantite: "20 L", epi: "Gants nitrile, lunettes, masque A2", fdsDate: "2025-11-01", fdsStatut: "À jour", substitution: false },
  { id: "CH-002", nom: "Trichloroéthylène", fournisseur: "Brenntag", numeroCas: "79-01-6", danger: ["CMR", "Nocif"], zone: "Atelier dégraissage", quantite: "50 L", epi: "Gants butyle, masque ABEK, combinaison", fdsDate: "2024-06-15", fdsStatut: "À renouveler", substitution: true },
  { id: "CH-003", nom: "Acide chlorhydrique 30%", fournisseur: "Brenntag", numeroCas: "7647-01-0", danger: ["Corrosif", "Nocif"], zone: "Traitement de surface", quantite: "100 L", epi: "Gants PVC, visière, tablier PVC", fdsDate: "2025-03-10", fdsStatut: "À jour", substitution: false },
  { id: "CH-004", nom: "Méthanol", fournisseur: "Merck", numeroCas: "67-56-1", danger: ["Inflammable", "Toxique", "CMR"], zone: "Laboratoire qualité", quantite: "10 L", epi: "Gants nitrile, masque A2, lunettes", fdsDate: "2025-08-20", fdsStatut: "À jour", substitution: true },
  { id: "CH-005", nom: "Soude caustique 30%", fournisseur: "Brenntag", numeroCas: "1310-73-2", danger: ["Corrosif"], zone: "Station d'épuration", quantite: "500 L", epi: "Gants PVC, lunettes étanches, tablier", fdsDate: "2025-10-15", fdsStatut: "À jour", substitution: false },
  { id: "CH-006", nom: "Benzène", fournisseur: "Sigma-Aldrich", numeroCas: "71-43-2", danger: ["CMR", "Inflammable", "Toxique"], zone: "Laboratoire qualité", quantite: "2 L", epi: "Gants butyle, masque ABEK P3, combinaison", fdsDate: "2023-05-01", fdsStatut: "À renouveler", substitution: true },
  { id: "CH-007", nom: "Huile hydraulique HLP 46", fournisseur: "Total Lubricants", numeroCas: "—", danger: ["Irritant"], zone: "Ateliers + maintenance", quantite: "300 L", epi: "Gants nitrile", fdsDate: "2025-09-01", fdsStatut: "À jour", substitution: false },
  { id: "CH-008", nom: "Résine époxy", fournisseur: "Huntsman", numeroCas: "25068-38-6", danger: ["Irritant", "Nocif"], zone: "Atelier assemblage", quantite: "15 kg", epi: "Gants nitrile, lunettes, masque A2P2", fdsDate: "2025-12-01", fdsStatut: "À jour", substitution: false },
  { id: "CH-009", nom: "Perchloroéthylène", fournisseur: "Brenntag", numeroCas: "127-18-4", danger: ["CMR", "Nocif"], zone: "Atelier dégraissage", quantite: "80 L", epi: "Gants butyle, masque ABEK, combinaison", fdsDate: "2024-02-10", fdsStatut: "À renouveler", substitution: true },
  { id: "CH-010", nom: "Acide sulfurique 96%", fournisseur: "Brenntag", numeroCas: "7664-93-9", danger: ["Corrosif", "Toxique"], zone: "Traitement de surface", quantite: "200 L", epi: "Gants PVC, visière, tablier anti-acide", fdsDate: "2025-07-30", fdsStatut: "À jour", substitution: false },
]

const DANGER_COLORS: Record<Danger, string> = {
  CMR: "bg-red-100 text-red-700",
  Toxique: "bg-red-100 text-red-700",
  Corrosif: "bg-orange-100 text-orange-700",
  Inflammable: "bg-amber-100 text-amber-700",
  Nocif: "bg-yellow-100 text-yellow-700",
  Irritant: "bg-gray-100 text-gray-600",
}

const FDS_COLORS: Record<FdsStatut, string> = {
  "À jour": "bg-green-100 text-green-700",
  "À renouveler": "bg-amber-100 text-amber-700",
  "Manquante": "bg-red-100 text-red-700",
}

const columns: DataTableColumn<ChemicalProduct>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "nom", header: "Produit", sortable: true, sortValue: (r) => r.nom },
  { key: "numeroCas", header: "N° CAS", hideOnMobile: true },
  {
    key: "danger", header: "Danger(s)",
    cell: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.danger.map((d) => (
          <span key={d} className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${DANGER_COLORS[d]}`}>{d}</span>
        ))}
      </div>
    ),
  },
  { key: "zone", header: "Zone d'utilisation", sortable: true, sortValue: (r) => r.zone },
  { key: "quantite", header: "Quantité stockée", hideOnMobile: true },
  { key: "epi", header: "EPI requis", hideOnMobile: true },
  {
    key: "fdsStatut", header: "FDS",
    cell: (r) => (
      <div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${FDS_COLORS[r.fdsStatut]}`}>{r.fdsStatut}</span>
        <div className="text-xs text-gray-400 mt-0.5">{r.fdsDate}</div>
      </div>
    ),
  },
  {
    key: "substitution", header: "Substitution", align: "center",
    cell: (r) => r.substitution
      ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Planifiée</span>
      : <span className="text-gray-300 text-xs">Non</span>,
  },
]

const filters: DataTableFilter[] = [
  {
    key: "zone", label: "Zone",
    options: [...new Set(products.map((p) => p.zone))].map((z) => ({ value: z, label: z })),
    value: (r) => r.zone,
  },
  {
    key: "fdsStatut", label: "FDS",
    options: [
      { value: "À jour", label: "À jour" },
      { value: "À renouveler", label: "À renouveler" },
    ],
    value: (r) => r.fdsStatut,
  },
]

export default function ChemicalRisksPage() {
  const cmr = products.filter((p) => p.danger.includes("CMR")).length
  const fdsOk = products.filter((p) => p.fdsStatut === "À jour").length
  const substitutions = products.filter((p) => p.substitution).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risques chimiques"
        description="Inventaire, évaluation et maîtrise des produits chimiques dangereux"
        icon={FlaskConical}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("risques-chimiques.csv",
            ["Réf", "Produit", "N° CAS", "Danger(s)", "Zone", "Quantité", "EPI", "FDS date", "FDS statut", "Substitution"],
            products.map((p) => [p.id, p.nom, p.numeroCas, p.danger.join(", "), p.zone, p.quantite, p.epi, p.fdsDate, p.fdsStatut, p.substitution ? "Oui" : "Non"])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Produits référencés" value={products.length} icon={Package} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Produits CMR" value={cmr} icon={Biohazard} iconColor="text-red-600" iconBg="bg-red-50" hint="cancérogènes" />
        <StatCard title="FDS à jour" value={`${fdsOk} / ${products.length}`} icon={FileCheck} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Substitutions planifiées" value={substitutions} icon={ArrowLeftRight} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Répartition par famille de danger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Inflammable", count: products.filter((p) => p.danger.includes("Inflammable")).length, color: "bg-amber-500" },
              { label: "CMR", count: products.filter((p) => p.danger.includes("CMR")).length, color: "bg-red-500" },
              { label: "Corrosif", count: products.filter((p) => p.danger.includes("Corrosif")).length, color: "bg-orange-500" },
              { label: "Toxique", count: products.filter((p) => p.danger.includes("Toxique")).length, color: "bg-red-400" },
              { label: "Irritant / Nocif", count: products.filter((p) => p.danger.includes("Irritant") || p.danger.includes("Nocif")).length, color: "bg-yellow-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.count / products.length) * 120}px`, minWidth: 8 }} />
                <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                <span className="text-sm font-bold text-gray-600">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Produits prioritaires CMR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products.filter((p) => p.danger.includes("CMR")).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 p-3">
                  <Biohazard className="h-5 w-5 shrink-0 text-red-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{p.nom}</p>
                    <p className="text-xs text-gray-600">{p.zone} · {p.quantite}</p>
                  </div>
                  {p.substitution && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Substitution planifiée</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Inventaire des produits chimiques</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={products}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher un produit..."
            searchAccessor={(r) => `${r.nom} ${r.numeroCas} ${r.zone} ${r.fournisseur}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
