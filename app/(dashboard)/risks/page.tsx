"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus, ShieldAlert, Eye, RefreshCw, Download,
  AlertOctagon, Flame, AlertTriangle, ShieldCheck,
  BarChart3, Table2,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ── Risk register data ────────────────────────────────────────────────────────

interface Risk {
  id: string; reference: string; title: string; category: string
  probability: number; impact: number; owner: string
  status: "active" | "treated" | "monitored"; treatment: string
}

const mockRisks: Risk[] = [
  { id: "1",  reference: "R-2026-045", title: "Rupture d'approvisionnement matières premières",  category: "Supply Chain", probability: 3, impact: 4, owner: "Pierre Bernard", status: "active",    treatment: "Diversification des fournisseurs" },
  { id: "2",  reference: "R-2026-044", title: "Panne équipement critique de production",          category: "Production",   probability: 2, impact: 5, owner: "Jean Dupont",    status: "active",    treatment: "Plan de maintenance préventive" },
  { id: "3",  reference: "R-2026-043", title: "Contamination produit chimique",                   category: "HSE",          probability: 1, impact: 5, owner: "Luc Petit",      status: "treated",   treatment: "Procédure de manipulation et EPI renforcés" },
  { id: "4",  reference: "R-2026-042", title: "Non-conformité documentaire lors audit",           category: "Qualité",      probability: 3, impact: 3, owner: "Sophie Moreau",  status: "active",    treatment: "Révision système documentaire" },
  { id: "5",  reference: "R-2026-041", title: "Accident de travail chute de hauteur",             category: "HSE",          probability: 2, impact: 5, owner: "Marie Martin",   status: "treated",   treatment: "Formation et équipements anti-chute" },
  { id: "6",  reference: "R-2026-040", title: "Dépassement des niveaux sonores",                  category: "HSE",          probability: 4, impact: 2, owner: "Luc Petit",      status: "monitored", treatment: "Port obligatoire des protections auditives" },
  { id: "7",  reference: "R-2026-039", title: "Cyberattaque sur système de production",           category: "SI",           probability: 3, impact: 5, owner: "Marc Leroy",     status: "active",    treatment: "Renforcement pare-feu et sauvegardes" },
  { id: "8",  reference: "R-2026-038", title: "Erreur de dosage automate",                        category: "Production",   probability: 2, impact: 4, owner: "Jean Dupont",    status: "monitored", treatment: "Contrôle métrologique renforcé" },
  { id: "9",  reference: "R-2026-037", title: "Départ de personnel clé",                          category: "RH",           probability: 3, impact: 3, owner: "Sophie Moreau",  status: "active",    treatment: "Plan de succession et documentation" },
  { id: "10", reference: "R-2026-036", title: "Pollution accidentelle des sols",                  category: "HSE",          probability: 1, impact: 4, owner: "Luc Petit",      status: "treated",   treatment: "Bacs de rétention et procédure d'urgence" },
  { id: "11", reference: "R-2026-035", title: "Retard de livraison client majeur",                category: "Supply Chain", probability: 4, impact: 3, owner: "Pierre Bernard", status: "active",    treatment: "Stock de sécurité et planification" },
  { id: "12", reference: "R-2026-034", title: "Défaillance système de ventilation",               category: "Production",   probability: 2, impact: 2, owner: "Claire Durand",  status: "monitored", treatment: "Maintenance et contrôles périodiques" },
  { id: "13", reference: "R-2026-033", title: "Incendie zone de stockage solvants",               category: "HSE",          probability: 1, impact: 5, owner: "Marie Martin",   status: "treated",   treatment: "Système d'extinction et zonage ATEX" },
  { id: "14", reference: "R-2026-032", title: "Obsolescence d'un équipement de mesure",           category: "Qualité",      probability: 3, impact: 2, owner: "Marie Martin",   status: "monitored", treatment: "Plan de renouvellement métrologie" },
]

// ── AMDEC data ────────────────────────────────────────────────────────────────

interface FMEAItem {
  id: string; process: string; function_: string; failureMode: string
  effect: string; gravity: number; cause: string; occurrence: number
  controls: string; detection: number; rpn: number
  action: string; responsible: string; dueDate: Date; status: "open" | "in_progress" | "closed"
}

const mockAMDEC: FMEAItem[] = [
  { id: "1",  process: "Soudage TIG",       function_: "Assembler les pièces par fusion",           failureMode: "Porosités dans le cordon",                effect: "Résistance mécanique insuffisante",     gravity: 8, cause: "Intensité hors paramètre",        occurrence: 4, controls: "Contrôle visuel + US",          detection: 3, rpn: 96,  action: "Révision paramètres + formation",          responsible: "Jean Dupont",    dueDate: new Date("2026-07-31"), status: "in_progress" },
  { id: "2",  process: "Soudage TIG",       function_: "Assembler les pièces par fusion",           failureMode: "Manque de fusion",                        effect: "Rejet pièce en contrôle",               gravity: 9, cause: "Vitesse de soudage trop élevée",  occurrence: 3, controls: "Contrôle visuel",               detection: 4, rpn: 108, action: "Formation opérateurs soudage",             responsible: "Marie Martin",   dueDate: new Date("2026-08-15"), status: "open" },
  { id: "3",  process: "Contrôle réception",function_: "Vérifier la conformité des MP",            failureMode: "Non-détection d'un défaut matière",       effect: "Défaut transmis en production",          gravity: 7, cause: "Plan de contrôle incomplet",      occurrence: 3, controls: "Contrôle visuel aléatoire",     detection: 6, rpn: 126, action: "Révision plan de contrôle réception",      responsible: "Pierre Bernard", dueDate: new Date("2026-07-15"), status: "open" },
  { id: "4",  process: "Usinage CNC",       function_: "Usiner les pièces aux cotes",              failureMode: "Cote hors tolérance",                     effect: "Pièce non conforme, rebus",             gravity: 7, cause: "Outil usé non détecté",           occurrence: 4, controls: "Contrôle en cours + métrologie", detection: 2, rpn: 56,  action: "Surveillance outil renforcée",             responsible: "Luc Petit",      dueDate: new Date("2026-09-01"), status: "closed" },
  { id: "5",  process: "Assemblage",        function_: "Assembler les sous-ensembles",             failureMode: "Couple de serrage insuffisant",           effect: "Démontage produit chez client",          gravity: 9, cause: "Clé dynamométrique non calibrée",  occurrence: 2, controls: "Procédure de serrage + tracé",   detection: 2, rpn: 36,  action: "Étalonnage clés dynamométriques",          responsible: "Jean Dupont",    dueDate: new Date("2026-06-30"), status: "closed" },
  { id: "6",  process: "Traitement surface",function_: "Protéger la pièce contre la corrosion",   failureMode: "Épaisseur de dépôt insuffisante",         effect: "Corrosion prématurée",                  gravity: 6, cause: "Bain hors concentration",          occurrence: 3, controls: "Mesure épaisseur sur échantillons", detection: 3, rpn: 54,  action: "Analyse bain quotidienne",                 responsible: "Sophie Moreau",  dueDate: new Date("2026-08-31"), status: "in_progress" },
  { id: "7",  process: "Soudage MIG",       function_: "Souder les profilés acier",               failureMode: "Projection et éclaboussures excessives",  effect: "Défaut esthétique + risque brûlure",    gravity: 5, cause: "Tension arc inadaptée",            occurrence: 5, controls: "Contrôle visuel",               detection: 2, rpn: 50,  action: "Mise à jour paramètres postes MIG",        responsible: "Jean Dupont",    dueDate: new Date("2026-10-01"), status: "open" },
  { id: "8",  process: "Expédition",        function_: "Conditionner et expédier les produits",   failureMode: "Dommages pendant le transport",           effect: "Réclamation client",                    gravity: 6, cause: "Emballage inadéquat",              occurrence: 3, controls: "Contrôle emballage avant expédition", detection: 3, rpn: 54,  action: "Révision procédure d'emballage",           responsible: "Claire Durand",  dueDate: new Date("2026-09-15"), status: "open" },
  { id: "9",  process: "Calibration",       function_: "Maintenir les instruments en étalonnage", failureMode: "Utilisation instrument hors étalonnage",  effect: "Données de contrôle non fiables",       gravity: 8, cause: "Absence de rappel automatique",   occurrence: 2, controls: "Registre étalonnage manuel",     detection: 4, rpn: 64,  action: "Logiciel de gestion métrologie",           responsible: "Marie Martin",   dueDate: new Date("2026-08-01"), status: "in_progress" },
  { id: "10", process: "Contrôle final",    function_: "Vérifier la conformité du produit fini",  failureMode: "Libération d'un produit non conforme",   effect: "Défaut client, retour produit",          gravity: 10,cause: "Gamme de contrôle incomplète",   occurrence: 2, controls: "Double vérification superviseur",detection: 3, rpn: 60,  action: "Audit gamme contrôle final",               responsible: "Sophie Moreau",  dueDate: new Date("2026-07-31"), status: "open" },
  { id: "11", process: "Stockage MP",       function_: "Conserver les matières dans conditions",  failureMode: "Détérioration matière première",          effect: "MP inutilisable, perte financière",     gravity: 5, cause: "Température ou humidité non contrôlée", occurrence: 2, controls: "Relevé T° hebdomadaire",        detection: 4, rpn: 40,  action: "Capteurs T°/hygrométrie connectés",        responsible: "Luc Petit",      dueDate: new Date("2026-10-31"), status: "open" },
  { id: "12", process: "Peinture",          function_: "Appliquer le revêtement de finition",     failureMode: "Couleur non conforme au RAL exigé",      effect: "Rejet et reprise peinture",             gravity: 4, cause: "Erreur préparation teinte",         occurrence: 3, controls: "Comparaison visuelle RAL",        detection: 2, rpn: 24,  action: "Procédure mélange couleurs + validation",  responsible: "Pierre Bernard", dueDate: new Date("2026-11-01"), status: "closed" },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function getRiskLevel(p: number, i: number) {
  const s = p * i
  if (s >= 12) return "critical"
  if (s >= 6)  return "high"
  if (s >= 3)  return "medium"
  return "low"
}
function getRiskColor(l: string) {
  return l === "critical" ? "bg-red-500" : l === "high" ? "bg-orange-500" : l === "medium" ? "bg-yellow-500" : "bg-green-500"
}
function getRiskLabel(l: string) {
  return l === "critical" ? "Critique" : l === "high" ? "Élevé" : l === "medium" ? "Modéré" : "Faible"
}
function getRPNColor(rpn: number) {
  if (rpn >= 200) return "bg-red-600 text-white"
  if (rpn >= 100) return "bg-orange-500 text-white"
  if (rpn >= 50)  return "bg-yellow-400 text-gray-900"
  return "bg-green-500 text-white"
}

// ── Risk matrix ───────────────────────────────────────────────────────────────

function RiskMatrix() {
  const colors = [
    ["bg-yellow-200","bg-orange-300","bg-red-400","bg-red-500","bg-red-600"],
    ["bg-green-200","bg-yellow-200","bg-orange-300","bg-red-400","bg-red-500"],
    ["bg-green-200","bg-green-200","bg-yellow-200","bg-orange-300","bg-red-400"],
    ["bg-green-100","bg-green-200","bg-green-200","bg-yellow-200","bg-orange-300"],
    ["bg-green-100","bg-green-100","bg-green-100","bg-green-200","bg-yellow-200"],
  ]
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        <div className="flex items-center">
          <div className="text-xs text-gray-500 -rotate-90 whitespace-nowrap w-4 mr-2">Impact</div>
        </div>
        <div>
          <div className="grid grid-cols-5 gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, rowIdx) =>
              Array.from({ length: 5 }).map((_, colIdx) => {
                const impactLevel = 5 - rowIdx
                const probLevel = colIdx + 1
                const riskScore = impactLevel * probLevel
                const here = mockRisks.filter((r) => r.impact === impactLevel && r.probability === probLevel)
                return (
                  <div key={`${rowIdx}-${colIdx}`}
                    className={`${colors[rowIdx][colIdx]} h-14 w-14 rounded flex items-center justify-center relative hover:opacity-80 transition-opacity`}
                    title={`I:${impactLevel} P:${probLevel} Score:${riskScore}`}
                  >
                    <span className="text-xs font-bold text-white/80">{riskScore}</span>
                    {here.length > 0 && (
                      <div className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white/90 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-800">{here.length}</span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
          <div className="grid grid-cols-5 gap-1 mt-1">
            {[1,2,3,4,5].map((n) => <div key={n} className="h-4 w-14 flex items-center justify-center text-xs text-gray-500">{n}</div>)}
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">Probabilité</div>
        </div>
      </div>
      <div className="flex gap-3 mt-3 flex-wrap">
        {[
          { label: "Faible (1-2)", color: "bg-green-200" },
          { label: "Modéré (3-5)", color: "bg-yellow-200" },
          { label: "Élevé (6-11)", color: "bg-orange-300" },
          { label: "Critique (12-25)", color: "bg-red-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={`h-3 w-3 rounded ${item.color}`} />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function RisksPage() {
  const router = useRouter()
  const { toast } = useToast()

  function handleExport(rows: Risk[]) {
    const data = rows.length ? rows : mockRisks
    downloadCsv("risques", ["Référence","Titre","Catégorie","Probabilité","Impact","Score","Statut","Responsable","Traitement"],
      data.map((r) => [r.reference, r.title, r.category, r.probability, r.impact, r.probability * r.impact, r.status, r.owner, r.treatment]))
    toast({ title: "Export réussi", description: `${data.length} risques exportés en CSV.` })
  }

  const critical = mockRisks.filter((r) => getRiskLevel(r.probability, r.impact) === "critical").length
  const high     = mockRisks.filter((r) => getRiskLevel(r.probability, r.impact) === "high").length
  const medium   = mockRisks.filter((r) => getRiskLevel(r.probability, r.impact) === "medium").length
  const low      = mockRisks.filter((r) => getRiskLevel(r.probability, r.impact) === "low").length

  const amdecCritical  = mockAMDEC.filter((a) => a.rpn >= 100).length
  const amdecInProgress = mockAMDEC.filter((a) => a.status === "in_progress").length
  const amdecOpen      = mockAMDEC.filter((a) => a.status === "open").length
  const amdecClosed    = mockAMDEC.filter((a) => a.status === "closed").length

  // Charts data
  const categoryData = ["Supply Chain","Production","HSE","Qualité","SI","RH"].map((cat) => ({
    category: cat,
    count: mockRisks.filter((r) => r.category === cat).length,
  })).filter((d) => d.count > 0)

  const statusData = [
    { name: "Actif",      value: mockRisks.filter((r) => r.status === "active").length,    fill: "#ef4444" },
    { name: "Traité",     value: mockRisks.filter((r) => r.status === "treated").length,   fill: "#22c55e" },
    { name: "Surveillé",  value: mockRisks.filter((r) => r.status === "monitored").length, fill: "#f59e0b" },
  ]

  const riskColumns: DataTableColumn<Risk>[] = [
    { key: "reference", header: "Référence", sortValue: (r) => r.reference, cell: (r) => <span className="font-mono text-xs text-gray-500">{r.reference}</span> },
    {
      key: "title", header: "Risque", sortValue: (r) => r.title,
      cell: (r) => (
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{r.title}</span>
        </div>
      ),
    },
    { key: "category", header: "Catégorie", sortValue: (r) => r.category, hideOnMobile: true, cell: (r) => <Badge variant="outline" className="text-xs">{r.category}</Badge> },
    {
      key: "score", header: "Score", sortValue: (r) => r.probability * r.impact, align: "center",
      cell: (r) => {
        const level = getRiskLevel(r.probability, r.impact)
        return <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold ${getRiskColor(level)}`}>{r.probability * r.impact}</span>
      },
    },
    {
      key: "level", header: "Niveau", sortValue: (r) => r.probability * r.impact,
      cell: (r) => {
        const level = getRiskLevel(r.probability, r.impact)
        const colors: Record<string, string> = { critical: "bg-red-100 text-red-700", high: "bg-orange-100 text-orange-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" }
        return <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[level]}`}>{getRiskLabel(level)}</span>
      },
    },
    {
      key: "status", header: "Statut", sortValue: (r) => r.status,
      cell: (r) => {
        const cfg: Record<string, string> = { active: "bg-red-100 text-red-700", treated: "bg-green-100 text-green-700", monitored: "bg-amber-100 text-amber-700" }
        const lbl: Record<string, string> = { active: "Actif", treated: "Traité", monitored: "Surveillé" }
        return <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg[r.status]}`}>{lbl[r.status]}</span>
      },
    },
    { key: "owner", header: "Responsable", sortValue: (r) => r.owner, hideOnMobile: true, cell: (r) => <span className="text-sm text-gray-600">{r.owner}</span> },
  ]

  const amdecColumns: DataTableColumn<FMEAItem>[] = [
    { key: "process",     header: "Processus",          sortValue: (a) => a.process,     cell: (a) => <span className="text-xs font-medium text-gray-700">{a.process}</span>,       hideOnMobile: true },
    { key: "failureMode", header: "Mode de défaillance", sortValue: (a) => a.failureMode, cell: (a) => <span className="text-xs text-gray-900">{a.failureMode}</span> },
    { key: "effect",      header: "Effet",              sortValue: (a) => a.effect,      cell: (a) => <span className="text-xs text-gray-700">{a.effect}</span>,                    hideOnMobile: true },
    { key: "gravity",     header: "G",                  sortValue: (a) => a.gravity,     align: "center", cell: (a) => <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ${a.gravity >= 8 ? "bg-red-500" : a.gravity >= 5 ? "bg-orange-400" : "bg-green-500"}`}>{a.gravity}</span> },
    { key: "occurrence",  header: "O",                  sortValue: (a) => a.occurrence,  align: "center", cell: (a) => <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ${a.occurrence >= 7 ? "bg-red-500" : a.occurrence >= 4 ? "bg-orange-400" : "bg-green-500"}`}>{a.occurrence}</span>, hideOnMobile: true },
    { key: "detection",   header: "D",                  sortValue: (a) => a.detection,   align: "center", cell: (a) => <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ${a.detection >= 7 ? "bg-red-500" : a.detection >= 4 ? "bg-orange-400" : "bg-green-500"}`}>{a.detection}</span>, hideOnMobile: true },
    {
      key: "rpn", header: "Criticité", sortValue: (a) => a.rpn, align: "center",
      cell: (a) => <span className={`inline-flex h-7 px-2 items-center justify-center rounded-full text-xs font-bold ${getRPNColor(a.rpn)}`}>{a.rpn}</span>,
    },
    {
      key: "status", header: "Statut", sortValue: (a) => a.status,
      cell: (a) => {
        const cfg: Record<string, string> = { open: "bg-red-100 text-red-700", in_progress: "bg-amber-100 text-amber-700", closed: "bg-green-100 text-green-700" }
        const lbl: Record<string, string> = { open: "Ouvert", in_progress: "En cours", closed: "Fermé" }
        return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cfg[a.status]}`}>{lbl[a.status]}</span>
      },
    },
    { key: "responsible", header: "Responsable", sortValue: (a) => a.responsible, hideOnMobile: true, cell: (a) => <span className="text-xs text-gray-600">{a.responsible}</span> },
    { key: "dueDate", header: "Échéance", sortValue: (a) => a.dueDate, hideOnMobile: true, cell: (a) => <span className="text-xs text-gray-600">{format(a.dueDate, "dd MMM yyyy", { locale: fr })}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion des Risques" description="Registre des risques, AMDEC et pilotage des plans de traitement" icon={ShieldAlert}>
        <Link href="/risks/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Nouveau risque
          </Button>
        </Link>
      </PageHeader>

      <Tabs defaultValue="register">
        <TabsList>
          <TabsTrigger value="register"><Table2 className="h-3.5 w-3.5" />Registre des risques</TabsTrigger>
          <TabsTrigger value="amdec"><ShieldAlert className="h-3.5 w-3.5" />AMDEC / FMEA</TabsTrigger>
          <TabsTrigger value="dashboard"><BarChart3 className="h-3.5 w-3.5" />Tableau de bord</TabsTrigger>
        </TabsList>

        {/* ── Registre ── */}
        <TabsContent value="register" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Matrice des risques</CardTitle>
              <CardDescription>Probabilité × Impact — Chiffre = nombre de risques dans la cellule</CardDescription>
            </CardHeader>
            <CardContent><RiskMatrix /></CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="Critiques" value={critical} icon={AlertOctagon} iconColor="text-red-600" iconBg="bg-red-50" />
            <StatCard title="Élevés"    value={high}     icon={Flame}        iconColor="text-orange-600" iconBg="bg-orange-50" />
            <StatCard title="Modérés"   value={medium}   icon={AlertTriangle} iconColor="text-yellow-600" iconBg="bg-yellow-50" />
            <StatCard title="Faibles"   value={low}      icon={ShieldCheck}  iconColor="text-green-600" iconBg="bg-green-50" />
          </div>

          <Card>
            <CardContent className="p-4">
              <DataTable
                data={mockRisks} columns={riskColumns} getRowId={(r) => r.id}
                searchPlaceholder="Rechercher un risque..." searchAccessor={(r) => `${r.title} ${r.reference} ${r.owner} ${r.category}`}
                filters={[
                  { key: "category", label: "Catégorie", value: (r) => r.category, options: ["Supply Chain","Production","HSE","Qualité","SI","RH"].map((v) => ({ value: v, label: v })) },
                  { key: "level", label: "Niveau", value: (r) => getRiskLevel(r.probability, r.impact), options: [{ value: "critical", label: "Critique" },{ value: "high", label: "Élevé" },{ value: "medium", label: "Modéré" },{ value: "low", label: "Faible" }] },
                  { key: "status", label: "Statut", value: (r) => r.status, options: [{ value: "active", label: "Actif" },{ value: "treated", label: "Traité" },{ value: "monitored", label: "Surveillé" }] },
                ]}
                onRowClick={(r) => router.push(`/risks/${r.id}`)}
                rowActions={(r) => <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/risks/${r.id}`)}><Eye className="h-4 w-4" /></Button>}
                bulkActions={[{ label: "Réévaluer", icon: RefreshCw, onClick: (rows) => { toast({ title: `${rows.length} risque(s) marqués pour réévaluation.` }) }, variant: "outline" },{ label: "Exporter CSV", icon: Download, onClick: (rows) => handleExport(rows), variant: "outline" }]}
                emptyMessage="Aucun risque."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── AMDEC ── */}
        <TabsContent value="amdec" className="space-y-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="RPN ≥ 100 (critiques)" value={amdecCritical}  icon={AlertOctagon} iconColor="text-red-600"   iconBg="bg-red-50" />
            <StatCard title="Actions ouvertes"        value={amdecOpen}      icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-50" />
            <StatCard title="En cours"                value={amdecInProgress} icon={RefreshCw}    iconColor="text-blue-600"  iconBg="bg-blue-50" />
            <StatCard title="Actions fermées"         value={amdecClosed}    icon={ShieldCheck}  iconColor="text-green-600" iconBg="bg-green-50" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analyse des Modes de Défaillance, de leurs Effets et de leur Criticité</CardTitle>
              <CardDescription>
                Criticité = Gravité (G) × Occurrence (O) × Détectabilité (D) — Seuil critique : C ≥ 100
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-3 mb-3 flex-wrap">
                {[{ label: "C ≥ 200 — Inacceptable", color: "bg-red-600" },{ label: "C 100–199 — Critique", color: "bg-orange-500" },{ label: "C 50–99 — Modéré", color: "bg-yellow-400" },{ label: "C < 50 — Acceptable", color: "bg-green-500" }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`h-3 w-6 rounded-full ${l.color}`} />
                    <span className="text-xs text-gray-600">{l.label}</span>
                  </div>
                ))}
              </div>
              <DataTable
                data={mockAMDEC} columns={amdecColumns} getRowId={(a) => a.id}
                searchPlaceholder="Rechercher par processus ou mode de défaillance..."
                searchAccessor={(a) => `${a.process} ${a.failureMode} ${a.effect} ${a.responsible}`}
                filters={[
                  { key: "process", label: "Processus", value: (a) => a.process, options: [...new Set(mockAMDEC.map((a) => a.process))].map((v) => ({ value: v, label: v })) },
                  { key: "rpn_level", label: "Niveau criticité", value: (a) => a.rpn >= 200 ? "critical" : a.rpn >= 100 ? "high" : a.rpn >= 50 ? "medium" : "low", options: [{ value: "critical", label: "Inacceptable ≥200" },{ value: "high", label: "Critique 100-199" },{ value: "medium", label: "Modéré 50-99" },{ value: "low", label: "Acceptable <50" }] },
                  { key: "status", label: "Statut", value: (a) => a.status, options: [{ value: "open", label: "Ouvert" },{ value: "in_progress", label: "En cours" },{ value: "closed", label: "Fermé" }] },
                ]}
                emptyMessage="Aucune analyse AMDEC."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Dashboard ── */}
        <TabsContent value="dashboard" className="space-y-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risques par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Risques" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                    <Legend formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribution AMDEC — Criticité</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={[
                      { name: "Acceptable\n<50",   value: mockAMDEC.filter((a) => a.rpn < 50).length,             fill: "#22c55e" },
                      { name: "Modéré\n50–99",      value: mockAMDEC.filter((a) => a.rpn >= 50 && a.rpn < 100).length, fill: "#eab308" },
                      { name: "Critique\n100–199",  value: mockAMDEC.filter((a) => a.rpn >= 100 && a.rpn < 200).length,fill: "#f97316" },
                      { name: "Inacceptable\n≥200", value: mockAMDEC.filter((a) => a.rpn >= 200).length,           fill: "#ef4444" },
                    ]}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Nb modes">
                      {[{ fill: "#22c55e" },{ fill: "#eab308" },{ fill: "#f97316" },{ fill: "#ef4444" }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top 5 risques critiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRisks
                  .sort((a, b) => b.probability * b.impact - a.probability * a.impact)
                  .slice(0, 5)
                  .map((r) => {
                    const level = getRiskLevel(r.probability, r.impact)
                    const score = r.probability * r.impact
                    return (
                      <div key={r.id} className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold ${getRiskColor(level)}`}>{score}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                          <p className="text-xs text-gray-400">{r.category} · {r.owner}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{getRiskLabel(level)}</span>
                      </div>
                    )
                  })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
