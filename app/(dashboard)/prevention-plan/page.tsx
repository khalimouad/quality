"use client"

import { ShieldCheck, FileText, AlertOctagon, Building2, Truck, Download, CalendarDays, Users } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type PlanStatut = "Actif" | "Expiré" | "À renouveler" | "En cours de rédaction"
type TypePlan = "Plan de prévention" | "Protocole de sécurité" | "Permis de feu"

interface PreventionPlan {
  id: string
  type: TypePlan
  entreprise: string
  activite: string
  donneur: string
  dateDebut: string
  dateFin: string
  nbIntervenants: number
  risquesPrincipaux: string[]
  statut: PlanStatut
  signatureClient: boolean
  signatureEE: boolean
}

const plans: PreventionPlan[] = [
  {
    id: "PP-001", type: "Plan de prévention", entreprise: "Electro Maintenance SAS", activite: "Maintenance électrique HT/BT",
    donneur: "Marc Durand", dateDebut: "2026-01-01", dateFin: "2026-12-31", nbIntervenants: 3,
    risquesPrincipaux: ["Électrique", "Chute de hauteur"], statut: "Actif", signatureClient: true, signatureEE: true,
  },
  {
    id: "PP-002", type: "Plan de prévention", entreprise: "Indus Nettoyage Pro", activite: "Nettoyage industriel ateliers",
    donneur: "Jean Dupont", dateDebut: "2026-01-01", dateFin: "2026-06-30", nbIntervenants: 5,
    risquesPrincipaux: ["Produits chimiques", "Glissade"], statut: "À renouveler", signatureClient: true, signatureEE: true,
  },
  {
    id: "PP-003", type: "Plan de prévention", entreprise: "BTP Génie Civil Rhône", activite: "Travaux de génie civil (extension bâtiment B)",
    donneur: "Thomas Laurent", dateDebut: "2026-03-01", dateFin: "2026-09-30", nbIntervenants: 12,
    risquesPrincipaux: ["Chute de hauteur", "Co-activité", "Engins"], statut: "Actif", signatureClient: true, signatureEE: true,
  },
  {
    id: "PP-004", type: "Protocole de sécurité", entreprise: "Transport Girard Frères", activite: "Livraisons / enlèvements (chariots EE)",
    donneur: "Luc Petit", dateDebut: "2026-01-01", dateFin: "2026-12-31", nbIntervenants: 8,
    risquesPrincipaux: ["Coactivité véhicules / piétons"], statut: "Actif", signatureClient: true, signatureEE: true,
  },
  {
    id: "PP-005", type: "Plan de prévention", entreprise: "HVAC Solutions", activite: "Entretien CVC et ventilation",
    donneur: "Marc Durand", dateDebut: "2025-07-01", dateFin: "2025-12-31", nbIntervenants: 2,
    risquesPrincipaux: ["Chute", "Confinement"], statut: "Expiré", signatureClient: true, signatureEE: true,
  },
  {
    id: "PP-006", type: "Plan de prévention", entreprise: "Soudure Expert SARL", activite: "Soudage / découpe sur site",
    donneur: "Jean Dupont", dateDebut: "2026-05-01", dateFin: "2026-07-31", nbIntervenants: 2,
    risquesPrincipaux: ["Incendie", "Fumées soudage", "Brûlures"], statut: "Actif", signatureClient: true, signatureEE: false,
  },
  {
    id: "PP-007", type: "Permis de feu", entreprise: "Plomberie Industrielle SA", activite: "Travaux de soudage canalisations",
    donneur: "Marc Durand", dateDebut: "2026-06-09", dateFin: "2026-06-13", nbIntervenants: 2,
    risquesPrincipaux: ["Incendie"], statut: "Actif", signatureClient: true, signatureEE: true,
  },
  {
    id: "PP-008", type: "Plan de prévention", entreprise: "Desamiante Solutions", activite: "Désamiantage zone technique",
    donneur: "Thomas Laurent", dateDebut: "2026-08-15", dateFin: "2026-09-15", nbIntervenants: 4,
    risquesPrincipaux: ["Amiante", "Produits chimiques"], statut: "En cours de rédaction", signatureClient: false, signatureEE: false,
  },
  {
    id: "PP-009", type: "Protocole de sécurité", entreprise: "Logistique Express SAS", activite: "Collecte déchets industriels",
    donneur: "Jean Dupont", dateDebut: "2026-01-01", dateFin: "2026-12-31", nbIntervenants: 3,
    risquesPrincipaux: ["Coactivité", "Déchets dangereux"], statut: "Actif", signatureClient: true, signatureEE: true,
  },
]

const STATUT_COLORS: Record<PlanStatut, string> = {
  Actif: "bg-green-100 text-green-700",
  Expiré: "bg-red-100 text-red-700",
  "À renouveler": "bg-amber-100 text-amber-700",
  "En cours de rédaction": "bg-blue-100 text-blue-700",
}

const columns: DataTableColumn<PreventionPlan>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "type", header: "Type", sortable: true, sortValue: (r) => r.type },
  { key: "entreprise", header: "Entreprise extérieure", sortable: true, sortValue: (r) => r.entreprise },
  { key: "activite", header: "Activité / Travaux", hideOnMobile: true },
  { key: "donneur", header: "Donneur d'ordre", hideOnMobile: true },
  { key: "dateDebut", header: "Début", sortable: true, sortValue: (r) => r.dateDebut },
  { key: "dateFin", header: "Fin", sortable: true, sortValue: (r) => r.dateFin },
  {
    key: "nbIntervenants", header: "Intervenants", align: "center",
    cell: (r) => (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
        {r.nbIntervenants}
      </span>
    ),
    sortValue: (r) => r.nbIntervenants,
  },
  {
    key: "signatures", header: "Signatures",
    cell: (r) => (
      <div className="flex gap-1">
        <span className={`rounded px-1.5 py-0.5 text-xs ${r.signatureClient ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>DO</span>
        <span className={`rounded px-1.5 py-0.5 text-xs ${r.signatureEE ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>EE</span>
      </div>
    ),
  },
  {
    key: "statut", header: "Statut",
    cell: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[r.statut]}`}>{r.statut}</span>,
  },
]

const filters: DataTableFilter[] = [
  {
    key: "type", label: "Type",
    options: [
      { value: "Plan de prévention", label: "Plan de prévention" },
      { value: "Protocole de sécurité", label: "Protocole de sécurité" },
      { value: "Permis de feu", label: "Permis de feu" },
    ],
    value: (r) => r.type,
  },
  {
    key: "statut", label: "Statut",
    options: [
      { value: "Actif", label: "Actif" },
      { value: "À renouveler", label: "À renouveler" },
      { value: "Expiré", label: "Expiré" },
      { value: "En cours de rédaction", label: "En rédaction" },
    ],
    value: (r) => r.statut,
  },
]

export default function PreventionPlanPage() {
  const actifs = plans.filter((p) => p.statut === "Actif").length
  const expires = plans.filter((p) => p.statut === "Expiré").length
  const entreprises = new Set(plans.map((p) => p.entreprise)).size
  const protocoles = plans.filter((p) => p.type === "Protocole de sécurité").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plan de prévention"
        description="Plans de prévention, protocoles de sécurité et permis de feu — entreprises extérieures"
        icon={ShieldCheck}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("plans-prevention.csv",
            ["Réf", "Type", "Entreprise", "Activité", "Donneur", "Début", "Fin", "Intervenants", "Statut"],
            plans.map((p) => [p.id, p.type, p.entreprise, p.activite, p.donneur, p.dateDebut, p.dateFin, p.nbIntervenants, p.statut])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Plans actifs" value={actifs} icon={FileText} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Expirés / À renouveler" value={expires + plans.filter((p) => p.statut === "À renouveler").length} icon={AlertOctagon} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Entreprises ext." value={entreprises} icon={Building2} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="Protocoles chargement" value={protocoles} icon={Truck} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Plans actifs en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plans.filter((p) => p.statut === "Actif").map((p) => (
              <div key={p.id} className="rounded-lg border border-gray-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{p.entreprise}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{p.activite}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <CalendarDays className="inline h-3 w-3 mr-0.5" />
                      {p.dateDebut} → {p.dateFin}
                      <Users className="inline h-3 w-3 ml-2 mr-0.5" />
                      {p.nbIntervenants} intervenant(s)
                    </p>
                  </div>
                  <span className="rounded px-1.5 py-0.5 text-xs bg-blue-50 text-blue-700 shrink-0">{p.type}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {p.risquesPrincipaux.map((r) => (
                    <span key={r} className="rounded-full bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-xs text-amber-700">{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Plans à traiter en urgence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plans.filter((p) => p.statut === "Expiré" || p.statut === "À renouveler" || !p.signatureEE).map((p) => (
              <div key={p.id} className={`rounded-lg border p-3 ${p.statut === "Expiré" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{p.entreprise}</p>
                    <p className="text-xs text-gray-600">{p.activite}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_COLORS[p.statut]}`}>{p.statut}</span>
                </div>
                {!p.signatureEE && (
                  <p className="mt-1 text-xs text-amber-700 font-medium">Signature entreprise extérieure manquante</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre des plans de prévention</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={plans}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher une entreprise, travaux..."
            searchAccessor={(r) => `${r.entreprise} ${r.activite} ${r.donneur} ${r.id}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
