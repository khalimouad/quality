"use client"

import { FlaskConical, Package, AlertOctagon, Droplets, FileCheck, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type NiveauRisque = "Critique" | "Élevé" | "Modéré" | "Faible"
type Milieu = "Eaux souterraines" | "Eaux superficielles" | "Sol" | "Atmosphère" | "Faune / flore"

interface EnvChemical {
  id: string
  substance: string
  classificationIcpe: string
  stockageMax: string
  stockageActuel: string
  milieuxImpactes: Milieu[]
  niveauRisque: NiveauRisque
  retentionConforme: boolean
  mesuresPrevention: string
  dateVerification: string
}

const substances: EnvChemical[] = [
  { id: "EC-001", substance: "Gazole / Fioul domestique", classificationIcpe: "1430 (DC)", stockageMax: "10 000 L", stockageActuel: "8 000 L", milieuxImpactes: ["Eaux souterraines", "Sol"], niveauRisque: "Modéré", retentionConforme: true, mesuresPrevention: "Cuve double paroi + détecteur fuite + rétention 110%", dateVerification: "2026-01-15" },
  { id: "EC-002", substance: "Trichloroéthylène (TCE)", classificationIcpe: "1173 (E)", stockageMax: "100 L", stockageActuel: "50 L", milieuxImpactes: ["Eaux souterraines", "Sol", "Faune / flore"], niveauRisque: "Critique", retentionConforme: true, mesuresPrevention: "Armoire ventilée + rétention intégrale + substitution planifiée 2026", dateVerification: "2026-03-01" },
  { id: "EC-003", substance: "Acide chlorhydrique", classificationIcpe: "1131 (E)", stockageMax: "500 L", stockageActuel: "100 L", milieuxImpactes: ["Eaux superficielles", "Atmosphère"], niveauRisque: "Élevé", retentionConforme: true, mesuresPrevention: "Cuve inox + rétention béton + neutralisation en cas de fuite", dateVerification: "2026-02-20" },
  { id: "EC-004", substance: "Huiles usagées", classificationIcpe: "1710 (DC)", stockageMax: "600 L", stockageActuel: "320 L", milieuxImpactes: ["Eaux souterraines", "Sol"], niveauRisque: "Modéré", retentionConforme: true, mesuresPrevention: "Fût hermétique sur palette rétention + collecte agréée mensuelle", dateVerification: "2026-04-10" },
  { id: "EC-005", substance: "Perchloroéthylène (PERC)", classificationIcpe: "1173 (E)", stockageMax: "100 L", stockageActuel: "80 L", milieuxImpactes: ["Eaux souterraines", "Sol", "Faune / flore"], niveauRisque: "Critique", retentionConforme: false, mesuresPrevention: "À mettre en conformité — rétention insuffisante actuellement", dateVerification: "2026-03-15" },
  { id: "EC-006", substance: "Acide sulfurique", classificationIcpe: "1131 (E)", stockageMax: "400 L", stockageActuel: "200 L", milieuxImpactes: ["Eaux superficielles", "Sol"], niveauRisque: "Élevé", retentionConforme: true, mesuresPrevention: "Cuve anti-acide + rétention béton + neutralisation calcium", dateVerification: "2026-01-28" },
  { id: "EC-007", substance: "Solvants organiques mélangés", classificationIcpe: "1173 (DC)", stockageMax: "200 L", stockageActuel: "150 L", milieuxImpactes: ["Atmosphère", "Eaux souterraines"], niveauRisque: "Élevé", retentionConforme: true, mesuresPrevention: "Local ventilé + rétention 110% + kits absorbants", dateVerification: "2026-04-05" },
  { id: "EC-008", substance: "Peintures / vernis (COV)", classificationIcpe: "2940 (DC)", stockageMax: "500 kg", stockageActuel: "300 kg", milieuxImpactes: ["Atmosphère"], niveauRisque: "Modéré", retentionConforme: true, mesuresPrevention: "Local coupe-feu + ventilation forcée + registre consommation COV", dateVerification: "2026-02-14" },
]

const RISK_COLORS: Record<NiveauRisque, string> = {
  Critique: "bg-red-100 text-red-700 border-red-200",
  Élevé: "bg-orange-100 text-orange-700 border-orange-200",
  Modéré: "bg-amber-100 text-amber-700 border-amber-200",
  Faible: "bg-green-100 text-green-700 border-green-200",
}

const columns: DataTableColumn<EnvChemical>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "substance", header: "Substance / Famille", sortable: true, sortValue: (r) => r.substance },
  { key: "classificationIcpe", header: "Rubrique ICPE", hideOnMobile: true },
  { key: "stockageActuel", header: "Stockage actuel", hideOnMobile: true },
  {
    key: "milieuxImpactes", header: "Milieux impactés",
    cell: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.milieuxImpactes.map((m) => (
          <span key={m} className="rounded-full bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">{m}</span>
        ))}
      </div>
    ),
  },
  {
    key: "niveauRisque", header: "Niveau de risque",
    cell: (r) => (
      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[r.niveauRisque]}`}>
        {r.niveauRisque}
      </span>
    ),
    sortValue: (r) => r.niveauRisque,
  },
  {
    key: "retentionConforme", header: "Rétention", align: "center",
    cell: (r) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.retentionConforme ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
        {r.retentionConforme ? "Conforme" : "Non conforme"}
      </span>
    ),
  },
  { key: "dateVerification", header: "Vérification", sortable: true, sortValue: (r) => r.dateVerification },
]

const filters: DataTableFilter[] = [
  {
    key: "niveauRisque", label: "Niveau risque",
    options: ["Critique", "Élevé", "Modéré", "Faible"].map((v) => ({ value: v, label: v })),
    value: (r) => r.niveauRisque,
  },
  {
    key: "retentionConforme", label: "Rétention",
    options: [
      { value: "true", label: "Conforme" },
      { value: "false", label: "Non conforme" },
    ],
    value: (r) => String(r.retentionConforme),
  },
]

export default function EnvChemicalPage() {
  const critiques = substances.filter((s) => s.niveauRisque === "Critique" || s.niveauRisque === "Élevé").length
  const nonConformes = substances.filter((s) => !s.retentionConforme).length
  const deversements = 1

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risques chimiques environnementaux"
        description="Gestion des substances dangereuses pour l'environnement — rubrique ICPE"
        icon={FlaskConical}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("risques-chimiques-env.csv",
            ["Réf", "Substance", "ICPE", "Stockage", "Milieux", "Niveau risque", "Rétention", "Vérification"],
            substances.map((s) => [s.id, s.substance, s.classificationIcpe, s.stockageActuel, s.milieuxImpactes.join(", "), s.niveauRisque, s.retentionConforme ? "Conforme" : "NC", s.dateVerification])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Substances identifiées" value={substances.length} icon={Package} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Risque critique / élevé" value={critiques} icon={AlertOctagon} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="Déversements YTD" value={deversements} icon={Droplets} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Rétentions non conformes" value={nonConformes} icon={FileCheck} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Substances à risque critique / élevé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {substances.filter((s) => s.niveauRisque === "Critique" || s.niveauRisque === "Élevé").map((s) => (
              <div key={s.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm text-gray-900">{s.substance}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[s.niveauRisque]}`}>{s.niveauRisque}</span>
                </div>
                <p className="text-xs text-gray-600">{s.classificationIcpe} · {s.stockageActuel}</p>
                {!s.retentionConforme && (
                  <p className="mt-1 text-xs text-red-600 font-medium">⚠ Rétention non conforme</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Milieux récepteurs impactés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(["Eaux souterraines", "Sol", "Eaux superficielles", "Atmosphère", "Faune / flore"] as Milieu[]).map((m) => {
              const count = substances.filter((s) => s.milieuxImpactes.includes(m)).length
              return (
                <div key={m} className="flex items-center gap-3">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(count / substances.length) * 150}px`, minWidth: 8 }} />
                  <span className="flex-1 text-sm text-gray-700">{m}</span>
                  <span className="text-sm font-bold text-gray-600">{count} substances</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre des substances dangereuses pour l&apos;environnement</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={substances}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher une substance..."
            searchAccessor={(r) => `${r.substance} ${r.classificationIcpe}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
