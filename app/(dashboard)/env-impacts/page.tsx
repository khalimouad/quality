"use client"

import { Leaf, Search, AlertTriangle, ShieldCheck, Wrench, Download } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableColumn, DataTableFilter } from "@/components/ui/data-table"
import { downloadCsv } from "@/lib/csv"

type Significatif = "Oui" | "Non"
type Maitrise = "Maîtrisé" | "En cours" | "Non maîtrisé"
type Condition = "Normale" | "Anormale" | "Urgence"

interface EnvAspect {
  id: string
  activite: string
  aspect: string
  impact: string
  condition: Condition
  probabilite: number
  gravite: number
  criticite: number
  significatif: Significatif
  maitrise: Maitrise
  mesures: string
}

const aspects: EnvAspect[] = [
  { id: "AE-001", activite: "Production / usinage", aspect: "Émissions de COV (peinture)", impact: "Pollution atmosphérique", condition: "Normale", probabilite: 3, gravite: 4, criticite: 12, significatif: "Oui", maitrise: "Maîtrisé", mesures: "Cabine de peinture filtrée + mesures périodiques" },
  { id: "AE-002", activite: "Atelier dégraissage", aspect: "Rejet solvants chlorés", impact: "Pollution eaux souterraines", condition: "Normale", probabilite: 2, gravite: 5, criticite: 10, significatif: "Oui", maitrise: "En cours", mesures: "Substitution TCE planifiée + rétention conforme" },
  { id: "AE-003", activite: "Traitement de surface", aspect: "Rejets acides en STEP", impact: "Pollution eaux superficielles", condition: "Normale", probabilite: 2, gravite: 4, criticite: 8, significatif: "Oui", maitrise: "Maîtrisé", mesures: "Neutralisation avant rejet + contrôle pH quotidien" },
  { id: "AE-004", activite: "Stockage hydrocarbures", aspect: "Déversement accidentel", impact: "Contamination sol / nappe", condition: "Urgence", probabilite: 1, gravite: 5, criticite: 5, significatif: "Non", maitrise: "Maîtrisé", mesures: "Cuve double paroi + POI déversement" },
  { id: "AE-005", activite: "Maintenance équipements", aspect: "Fuites d'huile hydraulique", impact: "Pollution sol", condition: "Anormale", probabilite: 3, gravite: 3, criticite: 9, significatif: "Oui", maitrise: "En cours", mesures: "Inspection mensuelle + kits absorbants disponibles" },
  { id: "AE-006", activite: "Gestion des déchets", aspect: "Mauvais tri / mélange DD", impact: "Pollution sol / décharge illicite", condition: "Normale", probabilite: 2, gravite: 3, criticite: 6, significatif: "Non", maitrise: "Maîtrisé", mesures: "Tri sélectif + filières agréées + BSD" },
  { id: "AE-007", activite: "Chauffage / énergie", aspect: "Émissions CO₂ / NOₓ", impact: "Changement climatique", condition: "Normale", probabilite: 5, gravite: 4, criticite: 20, significatif: "Oui", maitrise: "En cours", mesures: "Plan de réduction GES + audit énergétique en cours" },
  { id: "AE-008", activite: "Transport / livraisons", aspect: "Émissions de NOₓ / PM", impact: "Pollution atmosphérique", condition: "Normale", probabilite: 5, gravite: 3, criticite: 15, significatif: "Oui", maitrise: "En cours", mesures: "Optimisation des tournées + flotte Euro 6" },
  { id: "AE-009", activite: "Espaces verts / toiture", aspect: "Ruissellement eaux pluviales", impact: "Entraînement polluants vers nappe", condition: "Anormale", probabilite: 2, gravite: 3, criticite: 6, significatif: "Non", maitrise: "Maîtrisé", mesures: "Débourbeur / déshuileur sur réseau EP" },
  { id: "AE-010", activite: "Consommation eau process", aspect: "Prélèvement eau souterraine", impact: "Épuisement ressource hydrique", condition: "Normale", probabilite: 4, gravite: 3, criticite: 12, significatif: "Oui", maitrise: "Maîtrisé", mesures: "Compteurs divisionnaires + objectif -10% / an" },
  { id: "AE-011", activite: "Bruit machines / production", aspect: "Émissions sonores extérieures", impact: "Nuisance sonore riverains", condition: "Normale", probabilite: 3, gravite: 2, criticite: 6, significatif: "Non", maitrise: "Maîtrisé", mesures: "Mesure bruit en limite de propriété annuelle" },
  { id: "AE-012", activite: "Éclairage extérieur", aspect: "Pollution lumineuse nocturne", impact: "Perturbation faune nocturne", condition: "Normale", probabilite: 3, gravite: 2, criticite: 6, significatif: "Non", maitrise: "Maîtrisé", mesures: "Détecteurs de présence + luminaires orientés" },
]

const MAITRISE_COLORS: Record<Maitrise, string> = {
  Maîtrisé: "bg-green-100 text-green-700",
  "En cours": "bg-amber-100 text-amber-700",
  "Non maîtrisé": "bg-red-100 text-red-700",
}

const SIG_COLORS: Record<Significatif, string> = {
  Oui: "bg-orange-100 text-orange-700",
  Non: "bg-gray-100 text-gray-600",
}

const columns: DataTableColumn<EnvAspect>[] = [
  { key: "id", header: "Réf.", sortable: true, sortValue: (r) => r.id },
  { key: "activite", header: "Activité", sortable: true, sortValue: (r) => r.activite },
  { key: "aspect", header: "Aspect env." },
  { key: "impact", header: "Impact", hideOnMobile: true },
  { key: "condition", header: "Condition", hideOnMobile: true },
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
      <span className={`font-mono font-bold text-sm ${r.criticite >= 12 ? "text-red-600" : r.criticite >= 8 ? "text-amber-600" : "text-green-600"}`}>
        {r.criticite}
      </span>
    ),
    sortValue: (r) => r.criticite,
  },
  {
    key: "significatif", header: "Significatif", align: "center",
    cell: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SIG_COLORS[r.significatif]}`}>{r.significatif}</span>,
  },
  {
    key: "maitrise", header: "Maîtrise",
    cell: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${MAITRISE_COLORS[r.maitrise]}`}>{r.maitrise}</span>,
  },
]

const filters: DataTableFilter[] = [
  {
    key: "significatif", label: "Significatif",
    options: [
      { value: "Oui", label: "Significatif" },
      { value: "Non", label: "Non significatif" },
    ],
    value: (r) => r.significatif,
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
  {
    key: "condition", label: "Condition",
    options: [
      { value: "Normale", label: "Normale" },
      { value: "Anormale", label: "Anormale" },
      { value: "Urgence", label: "Urgence" },
    ],
    value: (r) => r.condition,
  },
]

export default function EnvImpactsPage() {
  const significatifs = aspects.filter((a) => a.significatif === "Oui").length
  const maitrise = aspects.filter((a) => a.maitrise === "Maîtrisé").length
  const enCours = aspects.filter((a) => a.maitrise === "En cours").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Impacts et risques environnementaux"
        description="Analyse des aspects et impacts environnementaux significatifs — ISO 14001"
        icon={Leaf}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("aspects-impacts-env.csv",
            ["Réf", "Activité", "Aspect", "Impact", "Condition", "P", "G", "Criticité", "Significatif", "Maîtrise"],
            aspects.map((a) => [a.id, a.activite, a.aspect, a.impact, a.condition, a.probabilite, a.gravite, a.criticite, a.significatif, a.maitrise])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Aspects identifiés" value={aspects.length} icon={Search} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Significatifs" value={significatifs} icon={AlertTriangle} iconColor="text-orange-600" iconBg="bg-orange-50" />
        <StatCard title="Maîtrisés" value={maitrise} icon={ShieldCheck} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Actions correctives" value={enCours} icon={Wrench} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Aspects significatifs prioritaires (criticité ≥ 10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aspects
              .filter((a) => a.criticite >= 10)
              .sort((a, b) => b.criticite - a.criticite)
              .map((a) => (
                <div key={a.id} className="rounded-lg border border-orange-100 bg-orange-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900">{a.aspect}</p>
                    <span className={`rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700`}>C={a.criticite}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{a.activite} · {a.impact}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.mesures}</p>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Matrice risque env. (P × G)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-xs text-gray-500">Criticité = Probabilité × Gravité — Seuil significatif : ≥ 8</div>
            <div className="grid grid-cols-5 gap-1 text-xs">
              {[5, 4, 3, 2, 1].map((p) =>
                [1, 2, 3, 4, 5].map((g) => {
                  const c = p * g
                  const count = aspects.filter((a) => a.probabilite === p && a.gravite === g).length
                  const bg = c >= 16 ? "bg-red-500 text-white" : c >= 8 ? "bg-amber-400 text-white" : c >= 4 ? "bg-yellow-200 text-gray-700" : "bg-green-100 text-gray-600"
                  return (
                    <div key={`${p}-${g}`} className={`rounded flex flex-col items-center justify-center p-2 ${bg}`} style={{ minHeight: 44 }}>
                      <span className="font-bold">{c}</span>
                      {count > 0 && <span className="text-xs opacity-80">×{count}</span>}
                    </div>
                  )
                })
              )}
            </div>
            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-red-500 inline-block" /> Critique ≥16</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-400 inline-block" /> Élevé ≥8</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-yellow-200 inline-block" /> Modéré ≥4</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Registre des aspects et impacts environnementaux</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={aspects}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Rechercher un aspect..."
            searchAccessor={(r) => `${r.activite} ${r.aspect} ${r.impact}`}
            filters={filters}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  )
}
