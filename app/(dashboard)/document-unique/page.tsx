"use client"

import { ShieldCheck, LayoutGrid, AlertTriangle, ClipboardList, CalendarCheck, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type Criticite = "Inacceptable" | "Tolérable sous contrôle" | "Acceptable avec mesures" | "Acceptable"
type Maitrise = "Maîtrisé" | "En cours" | "Non maîtrisé"

interface DuerpRisk {
  id: string
  uniteTravail: string
  situation: string
  risque: string
  probabilite: number
  gravite: number
  criticite: number
  criticiteLabel: Criticite
  mesuresExistantes: string
  maitrise: Maitrise
  actionPrioritaire: string
  echeance: string
}

function calcCriticite(p: number, g: number): Criticite {
  const c = p * g
  if (c >= 15) return "Inacceptable"
  if (c >= 9) return "Tolérable sous contrôle"
  if (c >= 4) return "Acceptable avec mesures"
  return "Acceptable"
}

const risks: DuerpRisk[] = [
  { id: "DU-001", uniteTravail: "Atelier soudage", situation: "Opérations de soudage TIG/MIG", risque: "Fumées de soudage (CMR)", probabilite: 4, gravite: 4, criticite: 16, criticiteLabel: calcCriticite(4, 4), mesuresExistantes: "Aspiration à la source, EPI masque FFP3", maitrise: "En cours", actionPrioritaire: "Renforcer ventilation générale — audit annuel air", echeance: "2026-09" },
  { id: "DU-002", uniteTravail: "Atelier soudage", situation: "Manipulation pièces lourdes", risque: "TMS / lombalgies", probabilite: 4, gravite: 3, criticite: 12, criticiteLabel: calcCriticite(4, 3), mesuresExistantes: "Formation gestes et postures", maitrise: "En cours", actionPrioritaire: "Investir en manutention mécanisée (palan)", echeance: "2026-12" },
  { id: "DU-003", uniteTravail: "Atelier dégraissage", situation: "Utilisation solvants chlorés", risque: "Intoxication chimique (TCE)", probabilite: 3, gravite: 5, criticite: 15, criticiteLabel: calcCriticite(3, 5), mesuresExistantes: "Ventilation forcée, EPI gants butyle, masque ABEK", maitrise: "En cours", actionPrioritaire: "Substituer TCE d'ici fin 2026", echeance: "2026-12" },
  { id: "DU-004", uniteTravail: "Entrepôt logistique", situation: "Circulation chariots élévateurs et piétons", risque: "Collision chariot / piéton", probabilite: 3, gravite: 5, criticite: 15, criticiteLabel: calcCriticite(3, 5), mesuresExistantes: "Marquage au sol, miroirs, vitesse limitée", maitrise: "Maîtrisé", actionPrioritaire: "Séparation physique zones piétons / engins", echeance: "2026-07" },
  { id: "DU-005", uniteTravail: "Maintenance / travaux en hauteur", situation: "Intervention sur toiture ou échafaudages", risque: "Chute de hauteur", probabilite: 2, gravite: 5, criticite: 10, criticiteLabel: calcCriticite(2, 5), mesuresExistantes: "Permis de travail, harnais EPI", maitrise: "Maîtrisé", actionPrioritaire: "Installer garde-corps permanents zone toiture N", echeance: "2026-08" },
  { id: "DU-006", uniteTravail: "Laboratoire qualité", situation: "Manipulation acides / bases concentrés", risque: "Brûlures chimiques", probabilite: 2, gravite: 4, criticite: 8, criticiteLabel: calcCriticite(2, 4), mesuresExistantes: "Lunettes étanches, gants, douche oculaire", maitrise: "Maîtrisé", actionPrioritaire: "Vérifier conformité douche sécurité mensuelle", echeance: "2026-06" },
  { id: "DU-007", uniteTravail: "Zone traitement de surface", situation: "Contact acide sulfurique en rétention", risque: "Brûlure grave / intoxication", probabilite: 2, gravite: 5, criticite: 10, criticiteLabel: calcCriticite(2, 5), mesuresExistantes: "Procédure LOTO, combinaison chimique", maitrise: "Maîtrisé", actionPrioritaire: "Formation équipe urgence chimique annuelle", echeance: "2026-10" },
  { id: "DU-008", uniteTravail: "Bureaux administratifs", situation: "Travail sur écran prolongé", risque: "TMS / fatigue visuelle", probabilite: 5, gravite: 2, criticite: 10, criticiteLabel: calcCriticite(5, 2), mesuresExistantes: "Charte télétravail, pause réglementaire", maitrise: "En cours", actionPrioritaire: "Audit ergonomie postes bureaux", echeance: "2026-09" },
  { id: "DU-009", uniteTravail: "Production générale", situation: "Exposition au bruit machines", risque: "Surdité professionnelle", probabilite: 4, gravite: 3, criticite: 12, criticiteLabel: calcCriticite(4, 3), mesuresExistantes: "Protection auditive obligatoire zones > 85 dB", maitrise: "Maîtrisé", actionPrioritaire: "Mesure phonométrique annuelle planifiée", echeance: "2026-07" },
  { id: "DU-010", uniteTravail: "Entrepôt chimique", situation: "Stockage produits inflammables", risque: "Incendie / explosion", probabilite: 2, gravite: 5, criticite: 10, criticiteLabel: calcCriticite(2, 5), mesuresExistantes: "Local anti-feu, extincteurs, détecteur gaz", maitrise: "Maîtrisé", actionPrioritaire: "Renouveler formation extinction incendie", echeance: "2026-06" },
  { id: "DU-011", uniteTravail: "Maintenance électrique", situation: "Consignation insuffisante (LOTO)", risque: "Électrisation / électrocution", probabilite: 2, gravite: 5, criticite: 10, criticiteLabel: calcCriticite(2, 5), mesuresExistantes: "Habilitations électriques, consignation", maitrise: "Maîtrisé", actionPrioritaire: "Renouveler habilitations échues 2026", echeance: "2026-08" },
  { id: "DU-012", uniteTravail: "Travail isolé / astreinte", situation: "Technicien seul en horaires décalés", risque: "Absence de secours en cas d'accident", probabilite: 3, gravite: 4, criticite: 12, criticiteLabel: calcCriticite(3, 4), mesuresExistantes: "PTI (protection travailleur isolé) partiel", maitrise: "En cours", actionPrioritaire: "Déployer PTI connecté pour tous travaillants isolés", echeance: "2026-09" },
]

const CRIT_COLORS: Record<Criticite, string> = {
  Inacceptable: "bg-red-100 text-red-700 border-red-200",
  "Tolérable sous contrôle": "bg-orange-100 text-orange-700 border-orange-200",
  "Acceptable avec mesures": "bg-amber-100 text-amber-700 border-amber-200",
  Acceptable: "bg-green-100 text-green-700 border-green-200",
}

const MAITRISE_COLORS: Record<Maitrise, string> = {
  Maîtrisé: "bg-green-100 text-green-700",
  "En cours": "bg-amber-100 text-amber-700",
  "Non maîtrisé": "bg-red-100 text-red-700",
}

const unitesTravail = [...new Set(risks.map((r) => r.uniteTravail))]

const columns: DataTableColumn<DuerpRisk>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "uniteTravail", header: "Unité de travail", sortable: true, sortValue: (r) => r.uniteTravail },
  { key: "risque", header: "Risque identifié" },
  {
    key: "probabilite", header: "P", align: "center",
    cell: (r) => <span className="font-mono font-bold text-gray-700">{r.probabilite}</span>,
    sortValue: (r) => r.probabilite,
  },
  {
    key: "gravite", header: "G", align: "center",
    cell: (r) => <span className="font-mono font-bold text-gray-700">{r.gravite}</span>,
    sortValue: (r) => r.gravite,
  },
  {
    key: "criticite", header: "Criticité", align: "center",
    cell: (r) => (
      <span className={`font-mono font-bold text-sm ${r.criticite >= 15 ? "text-red-600" : r.criticite >= 9 ? "text-orange-600" : r.criticite >= 4 ? "text-amber-600" : "text-green-600"}`}>
        {r.criticite}
      </span>
    ),
    sortValue: (r) => r.criticite,
  },
  {
    key: "criticiteLabel", header: "Niveau",
    cell: (r) => <span className={`rounded-full border px-1.5 py-0.5 text-xs font-medium ${CRIT_COLORS[r.criticiteLabel]}`}>{r.criticiteLabel}</span>,
  },
  {
    key: "maitrise", header: "Maîtrise",
    cell: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${MAITRISE_COLORS[r.maitrise]}`}>{r.maitrise}</span>,
  },
  { key: "echeance", header: "Échéance", sortable: true, sortValue: (r) => r.echeance },
]

const filters: DataTableFilter[] = [
  {
    key: "uniteTravail", label: "Unité de travail",
    options: unitesTravail.map((u) => ({ value: u, label: u })),
    value: (r) => r.uniteTravail,
  },
  {
    key: "criticiteLabel", label: "Criticité",
    options: [
      { value: "Inacceptable", label: "Inacceptable" },
      { value: "Tolérable sous contrôle", label: "Tolérable" },
      { value: "Acceptable avec mesures", label: "Acceptable" },
    ],
    value: (r) => r.criticiteLabel,
  },
  {
    key: "maitrise", label: "Maîtrise",
    options: [
      { value: "Maîtrisé", label: "Maîtrisé" },
      { value: "En cours", label: "En cours" },
      { value: "Non maîtrisé", label: "Non maîtrisé" },
    ],
    value: (r) => r.maitrise,
  },
]

export default function DocumentUniquePage() {
  const inacceptables = risks.filter((r) => r.criticiteLabel === "Inacceptable").length
  const actions = risks.filter((r) => r.maitrise !== "Maîtrisé").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document unique (DUERP)"
        description="Évaluation des risques professionnels par unité de travail — mise à jour Mars 2026"
        icon={ShieldCheck}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("duerp.csv",
            ["Réf", "Unité de travail", "Risque", "P", "G", "Criticité", "Niveau", "Maîtrise", "Action prioritaire", "Échéance"],
            risks.map((r) => [r.id, r.uniteTravail, r.risque, r.probabilite, r.gravite, r.criticite, r.criticiteLabel, r.maitrise, r.actionPrioritaire, r.echeance])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Unités de travail" value={unitesTravail.length} icon={LayoutGrid} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Risques inacceptables" value={inacceptables} icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" hint="criticité ≥15" />
        <StatCard title="Actions prioritaires" value={actions} icon={ClipboardList} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Mise à jour" value="Mars 2026" icon={CalendarCheck} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Risques prioritaires (criticité ≥ 12)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {risks
              .filter((r) => r.criticite >= 12)
              .sort((a, b) => b.criticite - a.criticite)
              .map((r) => (
                <div key={r.id} className={`rounded-lg border p-3 ${r.criticite >= 15 ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{r.risque}</p>
                      <p className="text-xs text-gray-600">{r.uniteTravail}</p>
                    </div>
                    <span className={`font-mono font-bold text-lg ${r.criticite >= 15 ? "text-red-600" : "text-orange-600"}`}>{r.criticite}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">→ {r.actionPrioritaire} <span className="text-gray-400">({r.echeance})</span></p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Répartition des risques par criticité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {([
              { label: "Inacceptable (P×G ≥ 15)", count: risks.filter((r) => r.criticite >= 15).length, color: "bg-red-500", total: risks.length },
              { label: "Tolérable sous contrôle (≥9)", count: risks.filter((r) => r.criticite >= 9 && r.criticite < 15).length, color: "bg-orange-500", total: risks.length },
              { label: "Acceptable avec mesures (≥4)", count: risks.filter((r) => r.criticite >= 4 && r.criticite < 9).length, color: "bg-amber-400", total: risks.length },
              { label: "Acceptable (<4)", count: risks.filter((r) => r.criticite < 4).length, color: "bg-green-500", total: risks.length },
            ]).map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-bold text-gray-600">{item.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${(item.count / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre d&apos;évaluation des risques professionnels</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={risks}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher un risque, une unité..."
            searchAccessor={(r) => `${r.uniteTravail} ${r.risque} ${r.situation}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
