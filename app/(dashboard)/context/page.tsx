"use client"

import { useState, useEffect } from "react"
import { Compass, Target, Users, TrendingUp, ArrowUpCircle, Download, Plus, Pencil, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { downloadCsv } from "@/lib/csv"
import { loadState, saveState } from "@/lib/storage"

type PestelCategory = "Politique" | "Économique" | "Sociétal" | "Technologique" | "Environnemental" | "Légal"
type ImpactType = "Opportunité" | "Menace"
type ImpactLevel = "Élevé" | "Modéré" | "Faible"
type StakeholderType = "Interne" | "Externe"
type Influence = "Forte" | "Modérée" | "Faible"

interface PestelFactor {
  id: string
  categorie: PestelCategory
  facteur: string
  type: ImpactType
  niveau: ImpactLevel
  implication: string
}

interface Stakeholder {
  id: string
  nom: string
  type: StakeholderType
  influence: Influence
  interet: Influence
  attentes: string[]
  risque: string
}

type SwotKey = "forces" | "faiblesses" | "opportunites" | "menaces"
type SwotState = Record<SwotKey, string[]>

const PESTEL_CATEGORIES: PestelCategory[] = ["Politique", "Économique", "Sociétal", "Technologique", "Environnemental", "Légal"]
const IMPACT_TYPES: ImpactType[] = ["Opportunité", "Menace"]
const IMPACT_LEVELS: ImpactLevel[] = ["Élevé", "Modéré", "Faible"]
const STAKEHOLDER_TYPES: StakeholderType[] = ["Interne", "Externe"]
const INFLUENCES: Influence[] = ["Forte", "Modérée", "Faible"]

const DEFAULT_PESTEL: PestelFactor[] = [
  { id: "P-01", categorie: "Politique", facteur: "Réglementation CSRD / Taxonomie verte UE", type: "Menace", niveau: "Élevé", implication: "Reporting ESG obligatoire dès 2026 — structurer la collecte de données." },
  { id: "P-02", categorie: "Politique", facteur: "Aides gouvernementales décarbonation industrie", type: "Opportunité", niveau: "Modéré", implication: "Accès à des subventions pour investissements équipements bas-carbone." },
  { id: "E-01", categorie: "Économique", facteur: "Inflation matières premières + énergie", type: "Menace", niveau: "Élevé", implication: "Pression sur les marges, révision des prix fournisseurs, optimisation énergétique." },
  { id: "E-02", categorie: "Économique", facteur: "Croissance marché aéronautique / défense", type: "Opportunité", niveau: "Élevé", implication: "Développement commercial et diversification clients grands comptes." },
  { id: "S-01", categorie: "Sociétal", facteur: "Attentes collaborateurs : QVT, télétravail, sens", type: "Menace", niveau: "Modéré", implication: "Risque de turn-over si politique RH insuffisante — plan QVT à renforcer." },
  { id: "S-02", categorie: "Sociétal", facteur: "Sensibilité clients à la performance RSE", type: "Opportunité", niveau: "Modéré", implication: "Différenciation concurrentielle via la maturité ESG et certifications." },
  { id: "T-01", categorie: "Technologique", facteur: "Automatisation / robotisation production", type: "Opportunité", niveau: "Élevé", implication: "Amélioration compétitivité, réduction TMS, reconversion compétences." },
  { id: "T-02", categorie: "Technologique", facteur: "Cybersécurité / SI industriel (OT)", type: "Menace", niveau: "Élevé", implication: "Risque cyberattaque sur systèmes de production — plan sécurité OT requis." },
  { id: "ENV-01", categorie: "Environnemental", facteur: "Réglementation ICPE — seuils émissions", type: "Menace", niveau: "Modéré", implication: "Mise en conformité COV / rejets aqueux avant inspection DREAL." },
  { id: "ENV-02", categorie: "Environnemental", facteur: "Raréfaction ressources eau / énergie", type: "Menace", niveau: "Modéré", implication: "Plan de sobriété hydrique et énergétique à intégrer dans les objectifs." },
  { id: "L-01", categorie: "Légal", facteur: "Renforcement exigences santé-sécurité (décrets)", type: "Menace", niveau: "Élevé", implication: "Veille réglementaire renforcée, mise à jour DUERP, formation habilitations." },
  { id: "L-02", categorie: "Légal", facteur: "Loi Sapin II / ISO 37001 anti-corruption", type: "Menace", niveau: "Faible", implication: "Programme conformité anti-corruption à formaliser pour marchés publics." },
]

const DEFAULT_STAKEHOLDERS: Stakeholder[] = [
  { id: "PI-01", nom: "Direction générale", type: "Interne", influence: "Forte", interet: "Forte", attentes: ["Performance financière", "Conformité réglementaire", "Réputation"], risque: "Faible — alignement stratégique" },
  { id: "PI-02", nom: "Collaborateurs / IRP", type: "Interne", influence: "Modérée", interet: "Forte", attentes: ["Sécurité au travail", "QVT", "Développement des compétences"], risque: "Conflit social si QVT dégradée" },
  { id: "PE-01", nom: "Clients grands comptes", type: "Externe", influence: "Forte", interet: "Forte", attentes: ["Qualité produit", "Délais", "Performance ESG fournisseur"], risque: "Perte de marché si notation RSE insuffisante" },
  { id: "PE-02", nom: "Autorités / DREAL / CARSAT", type: "Externe", influence: "Forte", interet: "Modérée", attentes: ["Conformité réglementaire", "Transparence reporting"], risque: "Mise en demeure / astreinte en cas de non-conformité" },
  { id: "PE-03", nom: "Fournisseurs stratégiques", type: "Externe", influence: "Modérée", interet: "Modérée", attentes: ["Partenariat long terme", "Conditions commerciales stables"], risque: "Rupture approvisionnement" },
  { id: "PE-04", nom: "Riverains / associations env.", type: "Externe", influence: "Faible", interet: "Forte", attentes: ["Absence de nuisances", "Transparence environnementale"], risque: "Opposition aux projets d'extension" },
  { id: "PE-05", nom: "Actionnaires / investisseurs", type: "Externe", influence: "Forte", interet: "Forte", attentes: ["Retour sur investissement", "Performance ESG"], risque: "Désengagement si performance ESG mauvaise" },
  { id: "PE-06", nom: "Organismes de certification (LRQA…)", type: "Externe", influence: "Modérée", interet: "Faible", attentes: ["Conformité ISO 9001/14001/45001"], risque: "Suspension de certification" },
]

const DEFAULT_SWOT: SwotState = {
  forces: [
    "Certifications ISO 9001 / 14001 / 45001 actives",
    "Expertise technique reconnue (soudage, usinage)",
    "Portefeuille clients diversifié — grands comptes aéronautique",
    "Culture sécurité en progression constante",
    "Équipe RH engagée — faible absentéisme",
  ],
  faiblesses: [
    "Maturité ESG insuffisante (score 1.89/5)",
    "Dépendance forte sur quelques expertises clés (risque départ)",
    "SI production partiellement obsolète",
    "Taux de rebut production > objectif",
    "Veille réglementaire formalisée insuffisante",
  ],
  opportunites: [
    "Marchés aéronautique / défense en forte croissance",
    "Subventions décarbonation industrie (FTJ, ADEME)",
    "Différenciation RSE / ESG auprès clients",
    "Digitalisation production (ROI robotisation)",
    "Recrutement talents sensibles au projet d'entreprise",
  ],
  menaces: [
    "Concurrence internationale à faible coût",
    "Inflation énergie / matières premières persistante",
    "Renforcement réglementaire ICPE / CSRD",
    "Risque cybersécurité en hausse (OT/IT)",
    "Pénurie main-d'œuvre qualifiée (soudeurs, techniciens)",
  ],
}

const PESTEL_COLORS: Record<PestelCategory, string> = {
  Politique: "bg-purple-100 text-purple-700 border-purple-200",
  Économique: "bg-blue-100 text-blue-700 border-blue-200",
  Sociétal: "bg-pink-100 text-pink-700 border-pink-200",
  Technologique: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Environnemental: "bg-green-100 text-green-700 border-green-200",
  Légal: "bg-gray-100 text-gray-700 border-gray-200",
}

const IMPACT_COLORS: Record<ImpactType, string> = {
  Opportunité: "bg-green-100 text-green-700",
  Menace: "bg-red-100 text-red-700",
}

const NIVEAU_COLORS: Record<ImpactLevel, string> = {
  Élevé: "text-red-600 font-bold",
  Modéré: "text-amber-600 font-semibold",
  Faible: "text-green-600",
}

const INFLUENCE_DOT: Record<Influence, string> = {
  Forte: "bg-red-500",
  Modérée: "bg-amber-500",
  Faible: "bg-green-500",
}

const TABS = ["PESTEL", "Parties prenantes", "SWOT", "Politique & Vision"] as const
type Tab = (typeof TABS)[number]

const SWOT_META: { key: SwotKey; label: string; bg: string; border: string; color: string; dot: string }[] = [
  { key: "forces", label: "Forces", bg: "bg-green-50", border: "border-green-200", color: "text-green-800", dot: "bg-green-500" },
  { key: "faiblesses", label: "Faiblesses", bg: "bg-red-50", border: "border-red-200", color: "text-red-800", dot: "bg-red-500" },
  { key: "opportunites", label: "Opportunités", bg: "bg-blue-50", border: "border-blue-200", color: "text-blue-800", dot: "bg-blue-500" },
  { key: "menaces", label: "Menaces", bg: "bg-amber-50", border: "border-amber-200", color: "text-amber-800", dot: "bg-amber-500" },
]

const PESTEL_KEY = "qhse_context_pestel"
const STAKEHOLDER_KEY = "qhse_context_stakeholders"
const SWOT_KEY = "qhse_context_swot"

const EMPTY_PESTEL: PestelFactor = { id: "", categorie: "Politique", facteur: "", type: "Menace", niveau: "Modéré", implication: "" }
const EMPTY_STAKEHOLDER: Stakeholder = { id: "", nom: "", type: "Externe", influence: "Modérée", interet: "Modérée", attentes: [], risque: "" }

export default function ContextPage() {
  const [activeTab, setActiveTab] = useState<Tab>("PESTEL")

  const [pestelFactors, setPestelFactors] = useState<PestelFactor[]>(DEFAULT_PESTEL)
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(DEFAULT_STAKEHOLDERS)
  const [swot, setSwot] = useState<SwotState>(DEFAULT_SWOT)

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage is only readable client-side after mount */
    setPestelFactors(loadState<PestelFactor[]>(PESTEL_KEY, DEFAULT_PESTEL))
    setStakeholders(loadState<Stakeholder[]>(STAKEHOLDER_KEY, DEFAULT_STAKEHOLDERS))
    setSwot(loadState<SwotState>(SWOT_KEY, DEFAULT_SWOT))
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  // ── PESTEL CRUD ──
  const [pestelDialog, setPestelDialog] = useState(false)
  const [pestelDraft, setPestelDraft] = useState<PestelFactor>(EMPTY_PESTEL)
  const [pestelEditId, setPestelEditId] = useState<string | null>(null)

  const persistPestel = (next: PestelFactor[]) => {
    setPestelFactors(next)
    saveState(PESTEL_KEY, next)
  }

  const openAddPestel = () => {
    setPestelDraft(EMPTY_PESTEL)
    setPestelEditId(null)
    setPestelDialog(true)
  }

  const openEditPestel = (f: PestelFactor) => {
    setPestelDraft(f)
    setPestelEditId(f.id)
    setPestelDialog(true)
  }

  const savePestel = () => {
    if (!pestelDraft.facteur.trim()) return
    if (pestelEditId) {
      persistPestel(pestelFactors.map((f) => (f.id === pestelEditId ? { ...pestelDraft, id: pestelEditId } : f)))
    } else {
      const id = `PE-${Date.now().toString().slice(-5)}`
      persistPestel([...pestelFactors, { ...pestelDraft, id }])
    }
    setPestelDialog(false)
  }

  const deletePestel = (id: string) => persistPestel(pestelFactors.filter((f) => f.id !== id))

  // ── Stakeholder CRUD ──
  const [shDialog, setShDialog] = useState(false)
  const [shDraft, setShDraft] = useState<Stakeholder>(EMPTY_STAKEHOLDER)
  const [shAttentes, setShAttentes] = useState("")
  const [shEditId, setShEditId] = useState<string | null>(null)

  const persistStakeholders = (next: Stakeholder[]) => {
    setStakeholders(next)
    saveState(STAKEHOLDER_KEY, next)
  }

  const openAddStakeholder = () => {
    setShDraft(EMPTY_STAKEHOLDER)
    setShAttentes("")
    setShEditId(null)
    setShDialog(true)
  }

  const openEditStakeholder = (s: Stakeholder) => {
    setShDraft(s)
    setShAttentes(s.attentes.join("\n"))
    setShEditId(s.id)
    setShDialog(true)
  }

  const saveStakeholder = () => {
    if (!shDraft.nom.trim()) return
    const attentes = shAttentes.split("\n").map((a) => a.trim()).filter(Boolean)
    if (shEditId) {
      persistStakeholders(stakeholders.map((s) => (s.id === shEditId ? { ...shDraft, attentes, id: shEditId } : s)))
    } else {
      const id = `PI-${Date.now().toString().slice(-5)}`
      persistStakeholders([...stakeholders, { ...shDraft, attentes, id }])
    }
    setShDialog(false)
  }

  const deleteStakeholder = (id: string) => persistStakeholders(stakeholders.filter((s) => s.id !== id))

  // ── SWOT CRUD ──
  const [swotInputs, setSwotInputs] = useState<Record<SwotKey, string>>({ forces: "", faiblesses: "", opportunites: "", menaces: "" })

  const persistSwot = (next: SwotState) => {
    setSwot(next)
    saveState(SWOT_KEY, next)
  }

  const addSwotItem = (key: SwotKey) => {
    const v = swotInputs[key].trim()
    if (!v) return
    persistSwot({ ...swot, [key]: [...swot[key], v] })
    setSwotInputs((p) => ({ ...p, [key]: "" }))
  }

  const removeSwotItem = (key: SwotKey, idx: number) => {
    persistSwot({ ...swot, [key]: swot[key].filter((_, i) => i !== idx) })
  }

  const opportunites = pestelFactors.filter((f) => f.type === "Opportunité").length
  const menaces = pestelFactors.filter((f) => f.type === "Menace").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contexte et enjeux"
        description="Analyse PESTEL, parties intéressées et SWOT — ISO 9001:2015 §4.1 / §4.2"
        icon={Compass}
      >
        <Button
          size="sm" variant="outline"
          onClick={() => downloadCsv("contexte-pestel.csv",
            ["Réf", "Catégorie", "Facteur", "Type", "Niveau", "Implication"],
            pestelFactors.map((f) => [f.id, f.categorie, f.facteur, f.type, f.niveau, f.implication])
          )}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Enjeux identifiés" value={pestelFactors.length} icon={Target} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Parties prenantes" value={stakeholders.length} icon={Users} iconColor="text-purple-600" iconBg="bg-purple-50" />
        <StatCard title="Opportunités" value={opportunites} icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Menaces" value={menaces} icon={ArrowUpCircle} iconColor="text-amber-600" iconBg="bg-amber-50" />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "PESTEL" && (
          <Button size="sm" onClick={openAddPestel} className="mb-1">
            <Plus className="mr-1.5 h-4 w-4" /> Ajouter un enjeu
          </Button>
        )}
        {activeTab === "Parties prenantes" && (
          <Button size="sm" onClick={openAddStakeholder} className="mb-1">
            <Plus className="mr-1.5 h-4 w-4" /> Ajouter une partie prenante
          </Button>
        )}
      </div>

      {activeTab === "PESTEL" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pestelFactors.map((f) => (
            <Card key={f.id} className="group overflow-hidden">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${PESTEL_COLORS[f.categorie]}`}>
                    {f.categorie}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${IMPACT_COLORS[f.type]}`}>
                    {f.type}
                  </span>
                  <span className={`ml-auto text-xs ${NIVEAU_COLORS[f.niveau]}`}>{f.niveau}</span>
                </div>
                <p className="font-semibold text-sm text-gray-900">{f.facteur}</p>
                <p className="text-xs text-gray-600">{f.implication}</p>
                <div className="flex justify-end gap-1 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => openEditPestel(f)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600" aria-label="Modifier">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => deletePestel(f.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Supprimer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "Parties prenantes" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stakeholders.map((s) => (
              <Card key={s.id} className="group overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-900">{s.nom}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.type === "Interne" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                      {s.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className={`h-2 w-2 rounded-full ${INFLUENCE_DOT[s.influence]}`} />
                      Influence : <strong>{s.influence}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className={`h-2 w-2 rounded-full ${INFLUENCE_DOT[s.interet]}`} />
                      Intérêt : <strong>{s.interet}</strong>
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Attentes :</p>
                    <ul className="space-y-0.5">
                      {s.attentes.map((a) => (
                        <li key={a} className="text-xs text-gray-600">· {a}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">{s.risque}</p>
                  <div className="flex justify-end gap-1 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEditStakeholder(s)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600" aria-label="Modifier">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteStakeholder(s.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label="Supprimer">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "SWOT" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SWOT_META.map((quadrant) => (
            <Card key={quadrant.key} className={`border ${quadrant.border}`}>
              <CardHeader className={`${quadrant.bg} pb-2 pt-4 rounded-t-lg`}>
                <CardTitle className={`text-sm font-bold ${quadrant.color}`}>{quadrant.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 pb-4">
                <ul className="space-y-2">
                  {swot[quadrant.key].map((item, idx) => (
                    <li key={`${item}-${idx}`} className="group flex items-start gap-2 text-sm text-gray-700">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${quadrant.dot}`} />
                      <span className="flex-1">{item}</span>
                      <button
                        onClick={() => removeSwotItem(quadrant.key, idx)}
                        className="shrink-0 rounded p-0.5 text-gray-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={swotInputs[quadrant.key]}
                    onChange={(e) => setSwotInputs((p) => ({ ...p, [quadrant.key]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") addSwotItem(quadrant.key) }}
                    placeholder={`Ajouter — ${quadrant.label.toLowerCase()}`}
                    className="h-8 rounded-lg text-xs"
                  />
                  <Button size="sm" variant="outline" className="h-8 shrink-0" onClick={() => addSwotItem(quadrant.key)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "Politique & Vision" && (
        <div className="space-y-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-800 uppercase tracking-wider">
                  ISO 9001:2015 · Clause 5.2 (Leadership & Engagement)
                </span>
                <Badge variant="outline" className="font-mono text-xs">POL-DIR-2026</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 mt-2">
                Déclaration de Politique Qualité & Engagement de la Direction
              </CardTitle>
              <CardDescription className="text-xs text-gray-600">
                Approuvée et signée par Thomas Laurent, Directeur Général — Exercice 2026
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-gray-800">
              <p className="italic text-gray-700 bg-white/85 p-4 rounded-xl border border-blue-100 shadow-sm">
                &ldquo;Notre ambition est d&apos;asseoir notre position de leader industriel de référence dans la fabrication d&apos;ensembles mécaniques et mécano-soudés de haute précision, en plaçant la satisfaction de nos clients, la sécurité sans concession de nos équipes et la décarbonation de nos procédés au cœur de chacune de nos décisions opérationnelles. Cet engagement se traduit par des investissements technologiques continus, l&apos;autonomisation de nos collaborateurs et le respect absolu de nos engagements contractuels et réglementaires.&rdquo;
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-blue-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">1</span>
                    Excellence Opérationnelle & Zéro Défaut
                  </div>
                  <p className="mt-2 text-gray-600">
                    Maîtrise statistique des procédés, qualification FAI rigoureuse et maintien de nos certifications ISO 9001 et EN 9100.
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-blue-900">Cible : Taux de conformité &gt; 95% · Rebut &lt; 1.5%</p>
                </div>

                <div className="rounded-xl border border-red-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-800">2</span>
                    Sécurité & Prévention Zéro Accident
                  </div>
                  <p className="mt-2 text-gray-600">
                    Culture de vigilance partagée, visites sécurité terrain mensuelles, élimination des situations à risque et DUERP dynamique.
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-red-900">Cible : Taux de fréquence AT &lt; 2.0 · 0 accident grave</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">3</span>
                    Transition Écologique & Sobriété (ISO 14001)
                  </div>
                  <p className="mt-2 text-gray-600">
                    Réduction de 20% des émissions de CO2 d&apos;ici 2027, valorisation de 95% des déchets d&apos;usinage et conformité stricte ICPE.
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-emerald-900">Cible : 100% conformité réglementaire DREAL</p>
                </div>

                <div className="rounded-xl border border-purple-200 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-800">4</span>
                    Fidélisation & Satisfaction Client
                  </div>
                  <p className="mt-2 text-gray-600">
                    Respect des délais de livraison (OTIF), réactivité sous 48h aux réclamations et co-développement technique de solutions sur-mesure.
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-purple-900">Cible : Score CSAT &gt; 8.0/10 · OTIF &gt; 98%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── PESTEL dialog ── */}
      <Dialog open={pestelDialog} onOpenChange={setPestelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pestelEditId ? "Modifier l'enjeu" : "Nouvel enjeu PESTEL"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-600">Facteur</Label>
              <Input
                value={pestelDraft.facteur}
                onChange={(e) => setPestelDraft({ ...pestelDraft, facteur: e.target.value })}
                placeholder="Ex. Réglementation CSRD / Taxonomie verte UE"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600">Catégorie</Label>
                <Select value={pestelDraft.categorie} onValueChange={(v) => setPestelDraft({ ...pestelDraft, categorie: v as PestelCategory })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PESTEL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600">Type</Label>
                <Select value={pestelDraft.type} onValueChange={(v) => setPestelDraft({ ...pestelDraft, type: v as ImpactType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {IMPACT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600">Niveau</Label>
                <Select value={pestelDraft.niveau} onValueChange={(v) => setPestelDraft({ ...pestelDraft, niveau: v as ImpactLevel })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {IMPACT_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-600">Implication</Label>
              <Textarea
                value={pestelDraft.implication}
                onChange={(e) => setPestelDraft({ ...pestelDraft, implication: e.target.value })}
                placeholder="Conséquence pour l'organisme et action à prévoir…"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPestelDialog(false)}>Annuler</Button>
            <Button onClick={savePestel} disabled={!pestelDraft.facteur.trim()}>
              {pestelEditId ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Stakeholder dialog ── */}
      <Dialog open={shDialog} onOpenChange={setShDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{shEditId ? "Modifier la partie prenante" : "Nouvelle partie prenante"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600">Nom</Label>
                <Input
                  value={shDraft.nom}
                  onChange={(e) => setShDraft({ ...shDraft, nom: e.target.value })}
                  placeholder="Ex. Clients grands comptes"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600">Type</Label>
                <Select value={shDraft.type} onValueChange={(v) => setShDraft({ ...shDraft, type: v as StakeholderType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STAKEHOLDER_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600">Influence</Label>
                <Select value={shDraft.influence} onValueChange={(v) => setShDraft({ ...shDraft, influence: v as Influence })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INFLUENCES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-600">Intérêt</Label>
                <Select value={shDraft.interet} onValueChange={(v) => setShDraft({ ...shDraft, interet: v as Influence })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INFLUENCES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-600">Attentes (une par ligne)</Label>
              <Textarea
                value={shAttentes}
                onChange={(e) => setShAttentes(e.target.value)}
                placeholder={"Qualité produit\nDélais\nPerformance ESG"}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-600">Risque associé</Label>
              <Input
                value={shDraft.risque}
                onChange={(e) => setShDraft({ ...shDraft, risque: e.target.value })}
                placeholder="Ex. Perte de marché si notation RSE insuffisante"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShDialog(false)}>Annuler</Button>
            <Button onClick={saveStakeholder} disabled={!shDraft.nom.trim()}>
              {shEditId ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
