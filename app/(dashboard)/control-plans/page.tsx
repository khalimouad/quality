"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  CheckSquare,
  ClipboardCheck,
  Plus,
  Search,
  Download,
  Eye,
  Sliders,
  AlertTriangle,
  FileCheck2,
  Layers,
  ArrowRight,
  Sparkles,
  Gauge,
  Factory,
  PackageCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { downloadCsv } from "@/lib/csv"
import { useToast } from "@/components/ui/use-toast"

export type ControlPhase = "reception" | "en_cours" | "produit_fini"
export type Criticality = "Critique" | "Majeur" | "Mineur"
export type InspectionVerdict = "conforme" | "derogation" | "rejete"

export interface ControlCriterion {
  id: string
  code: string
  phase: ControlPhase
  articleFamille: string
  caracteristique: string
  toleranceMin: string
  valeurNominale: string
  toleranceMax: string
  unite: string
  moyenMesure: string
  frequence: string
  criticite: Criticality
  responsable: string
}

export interface InspectionRecord {
  id: string
  pvNumber: string
  date: Date
  phase: ControlPhase
  articleRef: string
  articleName: string
  lotNumber: string
  quantiteControlee: number
  inspecteur: string
  valeurMesuree: string
  criterionCode: string
  verdict: InspectionVerdict
  commentaires: string
  ncLinked?: string
}

const initialCriteria: ControlCriterion[] = [
  // Réception
  {
    id: "C-REC-01",
    code: "CRIT-001",
    phase: "reception",
    articleFamille: "Tôles acier S355",
    caracteristique: "Épaisseur nominale matière première",
    toleranceMin: "4.85",
    valeurNominale: "5.00",
    toleranceMax: "5.15",
    unite: "mm",
    moyenMesure: "Micromètre étalonné (MIC-04)",
    frequence: "5 mesures par lot / certificat CCPU 3.1",
    criticite: "Critique",
    responsable: "Contrôle Entrant (Pierre B.)",
  },
  {
    id: "C-REC-02",
    code: "CRIT-002",
    phase: "reception",
    articleFamille: "Granulés polymères",
    caracteristique: "Taux d'humidité résiduelle avant injection",
    toleranceMin: "0.00",
    valeurNominale: "0.02",
    toleranceMax: "0.05",
    unite: "%",
    moyenMesure: "Dessiccateur halogène (DES-01)",
    frequence: "1 prélèvement par big-bag",
    criticite: "Majeur",
    responsable: "Laboratoire Réception",
  },
  {
    id: "C-REC-03",
    code: "CRIT-003",
    phase: "reception",
    articleFamille: "Visserie & Fixations",
    caracteristique: "Classe de résistance et marquage tête",
    toleranceMin: "8.8",
    valeurNominale: "8.8",
    toleranceMax: "10.9",
    unite: "Classe",
    moyenMesure: "Contrôle visuel + certificat de conformité",
    frequence: "Échantillonnage AQL 1.0 Niveau II",
    criticite: "Critique",
    responsable: "Contrôle Entrant",
  },

  // En cours de fabrication
  {
    id: "C-ENC-01",
    code: "CRIT-004",
    phase: "en_cours",
    articleFamille: "Châssis mécano-soudés",
    caracteristique: "Gorge de soudure et absence de porosités",
    toleranceMin: "3.5",
    valeurNominale: "4.0",
    toleranceMax: "4.5",
    unite: "mm",
    moyenMesure: "Jauge de soudage + ressuage visuel",
    frequence: "Premier article (FAI) + 100% visuel",
    criticite: "Critique",
    responsable: "Opérateur Soudeur qualifié",
  },
  {
    id: "C-ENC-02",
    code: "CRIT-005",
    phase: "en_cours",
    articleFamille: "Pièces usinées CNC",
    caracteristique: "Alésage intérieur Ø25 H7",
    toleranceMin: "25.000",
    valeurNominale: "25.010",
    toleranceMax: "25.021",
    unite: "mm",
    moyenMesure: "Tampon lisse Ø25 H7 + Alésomètre 3 touches",
    frequence: "Toutes les 10 pièces",
    criticite: "Critique",
    responsable: "Régleur Ligne CNC (Luc P.)",
  },
  {
    id: "C-ENC-03",
    code: "CRIT-006",
    phase: "en_cours",
    articleFamille: "Ensembles peints",
    caracteristique: "Épaisseur de peinture poudre époxy",
    toleranceMin: "60",
    valeurNominale: "80",
    toleranceMax: "110",
    unite: "µm",
    moyenMesure: "Mesureur d'épaisseur magnétique PosiTector",
    frequence: "3 pièces par chariot de cuisson",
    criticite: "Majeur",
    responsable: "Opérateur Peinture",
  },

  // Produits finis
  {
    id: "C-FIN-01",
    code: "CRIT-007",
    phase: "produit_fini",
    articleFamille: "Actionneurs électromécaniques",
    caracteristique: "Courant à vide et couple de maintien",
    toleranceMin: "1.8",
    valeurNominale: "2.1",
    toleranceMax: "2.4",
    unite: "A / Nm",
    moyenMesure: "Banc d'essai automatisé d'endurance (BANC-02)",
    frequence: "100% de la production (test de fin de ligne)",
    criticite: "Critique",
    responsable: "Contrôleur Final",
  },
  {
    id: "C-FIN-02",
    code: "CRIT-008",
    phase: "produit_fini",
    articleFamille: "Tous produits finis",
    caracteristique: "Conformité étiquetage, N° de série et code Datamatrix",
    toleranceMin: "Lisible",
    valeurNominale: "Grade A",
    toleranceMax: "Grade B",
    unite: "Grade",
    moyenMesure: "Douchette scanner 2D vérificateur ISO/IEC 15415",
    frequence: "100% avant conditionnement",
    criticite: "Majeur",
    responsable: "Opérateur Emballage & Expédition",
  },
  {
    id: "C-FIN-03",
    code: "CRIT-009",
    phase: "produit_fini",
    articleFamille: "Modules étanches IP67",
    caracteristique: "Test d'étanchéité à l'air sous pression (fuite < 0.2 mbar/s)",
    toleranceMin: "0.00",
    valeurNominale: "0.08",
    toleranceMax: "0.20",
    unite: "mbar/s",
    moyenMesure: "Détecteur de fuite ATEQ",
    frequence: "100% des pièces",
    criticite: "Critique",
    responsable: "Contrôle Qualité Final",
  },
]

const initialRecords: InspectionRecord[] = [
  {
    id: "PV-2026-088",
    pvNumber: "PV-REC-088",
    date: new Date("2026-06-15"),
    phase: "reception",
    articleRef: "MAT-AC-355",
    articleName: "Tôle acier S355 5mm",
    lotNumber: "LOT-99214",
    quantiteControlee: 50,
    inspecteur: "Pierre Bernard",
    valeurMesuree: "4.98 mm",
    criterionCode: "CRIT-001",
    verdict: "conforme",
    commentaires: "Certificat 3.1 conforme, épaisseur moyenne 4.98 mm.",
  },
  {
    id: "PV-2026-089",
    pvNumber: "PV-ENC-142",
    date: new Date("2026-06-16"),
    phase: "en_cours",
    articleRef: "USIN-AL-25",
    articleName: "Bague support usinée Ø25",
    lotNumber: "OF-2026-441",
    quantiteControlee: 10,
    inspecteur: "Luc Petit",
    valeurMesuree: "25.025 mm",
    criterionCode: "CRIT-005",
    verdict: "rejete",
    commentaires: "Cote hors tolérance maxi (+4µm au-dessus du max). Arrêt machine.",
    ncLinked: "NC-2026-024",
  },
  {
    id: "PV-2026-090",
    pvNumber: "PV-FIN-201",
    date: new Date("2026-06-16"),
    phase: "produit_fini",
    articleRef: "ACT-ELEC-400",
    articleName: "Actionneur linéaire 400N",
    lotNumber: "LOT-FIN-188",
    quantiteControlee: 24,
    inspecteur: "Sophie Moreau",
    valeurMesuree: "2.12 A",
    criterionCode: "CRIT-007",
    verdict: "conforme",
    commentaires: "Libération qualité accordée pour expédition client.",
  },
  {
    id: "PV-2026-091",
    pvNumber: "PV-ENC-143",
    date: new Date("2026-06-14"),
    phase: "en_cours",
    articleRef: "PNT-POUDRE-01",
    articleName: "Châssis peint RAL 7016",
    lotNumber: "OF-2026-439",
    quantiteControlee: 15,
    inspecteur: "Marie Martin",
    valeurMesuree: "115 µm",
    criterionCode: "CRIT-006",
    verdict: "derogation",
    commentaires: "Légère sur-épaisseur non bloquante sans coulure, validé sous dérogation D-2026-07.",
  },
]

const phaseConfig: Record<ControlPhase, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  reception: { label: "1. Réception Matières Premières", icon: PackageCheck, color: "text-blue-600 bg-blue-50 border-blue-200" },
  en_cours: { label: "2. En cours de fabrication (Procédés)", icon: Factory, color: "text-amber-600 bg-amber-50 border-amber-200" },
  produit_fini: { label: "3. Contrôle Final & Libération", icon: CheckSquare, color: "text-green-600 bg-green-50 border-green-200" },
}

const verdictBadge: Record<InspectionVerdict, { label: string; variant: "success" | "warning" | "destructive" }> = {
  conforme: { label: "Conforme", variant: "success" },
  derogation: { label: "Accepté sous dérogation", variant: "warning" },
  rejete: { label: "Rejeté (Non-conforme)", variant: "destructive" },
}

export default function ControlPlansPage() {
  const { toast } = useToast()
  const [criteria, setCriteria] = useState<ControlCriterion[]>(initialCriteria)
  const [records, setRecords] = useState<InspectionRecord[]>(initialRecords)
  const [activeTab, setActiveTab] = useState<string>("all_criteria")
  const [search, setSearch] = useState("")
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>("all")

  // PV modal state
  const [isPvOpen, setIsPvOpen] = useState(false)
  const [pvPhase, setPvPhase] = useState<ControlPhase>("reception")
  const [pvCriterionCode, setPvCriterionCode] = useState("CRIT-001")
  const [pvArticleRef, setPvArticleRef] = useState("")
  const [pvArticleName, setPvArticleName] = useState("")
  const [pvLot, setPvLot] = useState("")
  const [pvQty, setPvQty] = useState(10)
  const [pvMeasured, setPvMeasured] = useState("")
  const [pvVerdict, setPvVerdict] = useState<InspectionVerdict>("conforme")
  const [pvComments, setPvComments] = useState("")
  const [pvInspector, setPvInspector] = useState("Jean Dupont")

  // New criterion modal state
  const [isCriterionOpen, setIsCriterionOpen] = useState(false)
  const [newPhase, setNewPhase] = useState<ControlPhase>("reception")
  const [newFamille, setNewFamille] = useState("")
  const [newCarac, setNewCarac] = useState("")
  const [newMin, setNewMin] = useState("")
  const [newNom, setNewNom] = useState("")
  const [newMax, setNewMax] = useState("")
  const [newUnite, setNewUnite] = useState("mm")
  const [newMoyen, setNewMoyen] = useState("")
  const [newFreq, setNewFreq] = useState("")
  const [newCrit, setNewCrit] = useState<Criticality>("Critique")
  const [newResp, setNewResp] = useState("Contrôleur Qualité")

  // Filtered criteria
  const filteredCriteria = criteria.filter((c) => {
    const matchSearch =
      c.caracteristique.toLowerCase().includes(search.toLowerCase()) ||
      c.articleFamille.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.moyenMesure.toLowerCase().includes(search.toLowerCase())
    const matchPhase = selectedPhaseFilter === "all" || c.phase === selectedPhaseFilter
    return matchSearch && matchPhase
  })

  // Statistics
  const totalCriteria = criteria.length
  const totalRecords = records.length
  const conformes = records.filter((r) => r.verdict === "conforme").length
  const acceptationRate = totalRecords > 0 ? Math.round(((conformes + records.filter((r) => r.verdict === "derogation").length) / totalRecords) * 100) : 100
  const rejets = records.filter((r) => r.verdict === "rejete").length

  const handleExportCsv = () => {
    downloadCsv(
      "plans_de_controle_qualite",
      ["Code", "Phase", "Famille/Article", "Caractéristique", "Min", "Nominal", "Max", "Unité", "Moyen de mesure", "Fréquence", "Criticité", "Responsable"],
      criteria.map((c) => [
        c.code,
        phaseConfig[c.phase].label,
        c.articleFamille,
        c.caracteristique,
        c.toleranceMin,
        c.valeurNominale,
        c.toleranceMax,
        c.unite,
        c.moyenMesure,
        c.frequence,
        c.criticite,
        c.responsable,
      ])
    )
    toast({
      title: "Export des critères réussi",
      description: `${criteria.length} critères de contrôle exportés au format CSV.`,
    })
  }

  const handleCreateCriterion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamille || !newCarac || !newMoyen) {
      toast({
        title: "Champs incomplets",
        description: "Veuillez renseigner la famille de produit, la caractéristique et le moyen de mesure.",
        variant: "destructive",
      })
      return
    }

    const created: ControlCriterion = {
      id: `C-${Date.now()}`,
      code: `CRIT-${String(criteria.length + 1).padStart(3, "0")}`,
      phase: newPhase,
      articleFamille: newFamille,
      caracteristique: newCarac,
      toleranceMin: newMin || "N/A",
      valeurNominale: newNom || "N/A",
      toleranceMax: newMax || "N/A",
      unite: newUnite,
      moyenMesure: newMoyen,
      frequence: newFreq || "Selon plan d'échantillonnage",
      criticite: newCrit,
      responsable: newResp,
    }

    setCriteria([...criteria, created])
    setIsCriterionOpen(false)
    setNewFamille("")
    setNewCarac("")
    setNewMin("")
    setNewNom("")
    setNewMax("")
    setNewMoyen("")
    setNewFreq("")

    toast({
      title: "Critère de contrôle créé",
      description: `Le critère ${created.code} a été ajouté au plan de contrôle.`,
    })
  }

  const handleCreatePv = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pvArticleRef || !pvArticleName || !pvLot || !pvMeasured) {
      toast({
        title: "Champs incomplets",
        description: "Veuillez renseigner la référence article, le N° de lot et la valeur mesurée.",
        variant: "destructive",
      })
      return
    }

    const newPvNum = `PV-${pvPhase.substring(0, 3).toUpperCase()}-${String(records.length + 101).padStart(3, "0")}`
    const hasNc = pvVerdict === "rejete" ? `NC-2026-${String(Math.floor(Math.random() * 20) + 25).padStart(3, "0")}` : undefined

    const newRec: InspectionRecord = {
      id: `REC-${Date.now()}`,
      pvNumber: newPvNum,
      date: new Date(),
      phase: pvPhase,
      articleRef: pvArticleRef,
      articleName: pvArticleName,
      lotNumber: pvLot,
      quantiteControlee: pvQty,
      inspecteur: pvInspector,
      valeurMesuree: pvMeasured,
      criterionCode: pvCriterionCode,
      verdict: pvVerdict,
      commentaires: pvComments || "Contrôle effectué selon plan de contrôle en vigueur.",
      ncLinked: hasNc,
    }

    setRecords([newRec, ...records])
    setIsPvOpen(false)
    setPvArticleRef("")
    setPvArticleName("")
    setPvLot("")
    setPvMeasured("")
    setPvComments("")

    toast({
      title: "Procès-Verbal enregistré",
      description: pvVerdict === "rejete"
        ? `PV ${newPvNum} enregistré : VERDICT REJETÉ. Non-conformité ${hasNc} générée automatiquement !`
        : `PV ${newPvNum} enregistré avec verdict : ${verdictBadge[pvVerdict].label}.`,
      variant: pvVerdict === "rejete" ? "destructive" : "default",
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans de Contrôle Qualité"
        description="Pilier 3 · DO — Maîtrise opérationnelle : critères de contrôle réception, en-cours, libération produit fini & PV"
        icon={CheckSquare}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsCriterionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau critère
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsPvOpen(true)}>
            <FileCheck2 className="mr-2 h-4 w-4" />
            Saisir un PV de contrôle
          </Button>
        </div>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Taux d'acceptation"
          value={`${acceptationRate}%`}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          hint={`${conformes} acceptés sur ${totalRecords} PV`}
        />
        <StatCard
          title="Critères de contrôle"
          value={totalCriteria}
          icon={Sliders}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          change="3 phases couvertes"
        />
        <StatCard
          title="Contrôles réalisés ce mois"
          value={totalRecords}
          icon={ClipboardCheck}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          change="+12 cette semaine"
        />
        <StatCard
          title="Lots rejetés / Non conformes"
          value={rejets}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
          hint="Génération NC automatique"
        />
      </div>

      {/* 3 Phases Visual Stepper */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(["reception", "en_cours", "produit_fini"] as ControlPhase[]).map((phaseKey, idx) => {
          const cfg = phaseConfig[phaseKey]
          const phaseCriteriaCount = criteria.filter((c) => c.phase === phaseKey).length
          const phasePvCount = records.filter((r) => r.phase === phaseKey).length
          return (
            <Card
              key={phaseKey}
              className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                selectedPhaseFilter === phaseKey ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200"
              }`}
              onClick={() => setSelectedPhaseFilter(selectedPhaseFilter === phaseKey ? "all" : phaseKey)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${cfg.color}`}>
                      <cfg.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Étape {idx + 1}</p>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{cfg.label.split(". ")[1]}</h3>
                    </div>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                    {phaseCriteriaCount} crit.
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-500">
                  <span>{phasePvCount} PV enregistrés</span>
                  <span className="font-semibold text-blue-600 hover:underline">Filtrer</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tabs: Critères vs PV de contrôle */}
      <Tabs defaultValue="criteria" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="criteria">
              <Sliders className="h-4 w-4 mr-2" />
              Répertoire des Critères ({filteredCriteria.length})
            </TabsTrigger>
            <TabsTrigger value="records">
              <FileCheck2 className="h-4 w-4 mr-2" />
              Procès-Verbaux de Contrôle ({records.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Filtrer les critères..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs w-64"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Criteria */}
        <TabsContent value="criteria" className="space-y-4">
          <Card className="overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50/80 text-xs font-semibold uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Code & Famille</th>
                    <th className="px-4 py-3">Caractéristique à contrôler</th>
                    <th className="px-4 py-3">Phase</th>
                    <th className="px-4 py-3">Spécification & Tolérances</th>
                    <th className="px-4 py-3">Moyen de mesure</th>
                    <th className="px-4 py-3">Échantillonnage / Fréq.</th>
                    <th className="px-4 py-3">Criticité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredCriteria.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        Aucun critère ne correspond aux filtres.
                      </td>
                    </tr>
                  ) : (
                    filteredCriteria.map((c) => (
                      <tr key={c.id} className="transition-colors hover:bg-gray-50/80">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold text-blue-700">{c.code}</span>
                          <p className="text-xs font-medium text-gray-900 truncate max-w-xs">{c.articleFamille}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{c.caracteristique}</p>
                          <p className="text-xs text-gray-400">Resp : {c.responsable}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs font-normal">
                            {phaseConfig[c.phase].label.split(". ")[1]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs text-gray-800">
                            {c.toleranceMin} ≤ <span className="font-bold text-blue-700">{c.valeurNominale}</span> ≤ {c.toleranceMax}{" "}
                            <span className="text-gray-500 font-sans">{c.unite}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                          {c.moyenMesure}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                          {c.frequence}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              c.criticite === "Critique"
                                ? "destructive"
                                : c.criticite === "Majeur"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {c.criticite}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Inspection Records */}
        <TabsContent value="records" className="space-y-4">
          <Card className="overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50/80 text-xs font-semibold uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">N° PV & Date</th>
                    <th className="px-4 py-3">Article / Pièce</th>
                    <th className="px-4 py-3">N° Lot & Qte</th>
                    <th className="px-4 py-3">Critère & Valeur mesurée</th>
                    <th className="px-4 py-3">Inspecteur</th>
                    <th className="px-4 py-3">Verdict</th>
                    <th className="px-4 py-3">Commentaires / Suivi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {records.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50/80">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-gray-900">{r.pvNumber}</span>
                        <div className="text-xs text-gray-400">{format(r.date, "dd/MM/yyyy")}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{r.articleName}</div>
                        <span className="font-mono text-xs text-gray-500">{r.articleRef}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        <span className="font-mono">{r.lotNumber}</span>
                        <p className="text-gray-400">{r.quantiteControlee} pcs contrôlées</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-blue-600">{r.criterionCode}</span>
                          <span className="font-semibold text-gray-900">→ {r.valeurMesuree}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">{r.inspecteur}</td>
                      <td className="px-4 py-3">
                        <Badge variant={verdictBadge[r.verdict].variant}>
                          {verdictBadge[r.verdict].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                        <p className="line-clamp-1">{r.commentaires}</p>
                        {r.ncLinked && (
                          <Link
                            href="/non-conformances"
                            className="mt-1 flex items-center gap-1 font-bold text-red-600 hover:underline"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {r.ncLinked} (Fiche NC ouverte)
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Saisir un PV de Contrôle Modal */}
      <Dialog open={isPvOpen} onOpenChange={setIsPvOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Saisie d&apos;un Procès-Verbal de Contrôle</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Enregistrez les mesures effectuées pour un lot et générez automatiquement le verdict de conformité.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePv} className="space-y-3 py-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Phase de contrôle *</Label>
                <Select value={pvPhase} onValueChange={(val) => setPvPhase(val as ControlPhase)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reception">1. Réception Matières Premières</SelectItem>
                    <SelectItem value="en_cours">2. En cours de fabrication</SelectItem>
                    <SelectItem value="produit_fini">3. Contrôle Final & Libération</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Critère appliqué *</Label>
                <Select value={pvCriterionCode} onValueChange={setPvCriterionCode}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {criteria
                      .filter((c) => c.phase === pvPhase)
                      .map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} — {c.caracteristique.substring(0, 30)}...
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Référence Article / Pièce *</Label>
                <Input
                  placeholder="ex: MAT-AC-355, P-4501..."
                  value={pvArticleRef}
                  onChange={(e) => setPvArticleRef(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Désignation de la pièce *</Label>
                <Input
                  placeholder="ex: Châssis support acier..."
                  value={pvArticleName}
                  onChange={(e) => setPvArticleName(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">N° de Lot / OF *</Label>
                <Input
                  placeholder="ex: LOT-9942, OF-128..."
                  value={pvLot}
                  onChange={(e) => setPvLot(e.target.value)}
                  className="mt-1 h-9 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Quantité contrôlée</Label>
                <Input
                  type="number"
                  value={pvQty}
                  onChange={(e) => setPvQty(Number(e.target.value))}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Valeur mesurée *</Label>
                <Input
                  placeholder="ex: 5.02 mm, 80 µm..."
                  value={pvMeasured}
                  onChange={(e) => setPvMeasured(e.target.value)}
                  className="mt-1 h-9 text-xs font-bold text-blue-800"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Verdict du contrôle *</Label>
                <Select value={pvVerdict} onValueChange={(v) => setPvVerdict(v as InspectionVerdict)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">Conforme (Libération accordée)</SelectItem>
                    <SelectItem value="derogation">Accepté sous dérogation</SelectItem>
                    <SelectItem value="rejete">Rejeté (Déclencher Non-Conformité)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Inspecteur / Contrôleur</Label>
                <Input
                  value={pvInspector}
                  onChange={(e) => setPvInspector(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Commentaires & Constats</Label>
              <Input
                placeholder="Observations métrologiques, déviations constatées..."
                value={pvComments}
                onChange={(e) => setPvComments(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            {pvVerdict === "rejete" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Alerte de Rejet Qualité
                </div>
                <p className="mt-1">
                  L&apos;enregistrement d&apos;un verdict REJETÉ créera automatiquement une fiche de non-conformité dans le
                  module Non-Conformités et bloquera le lot en quarantaine.
                </p>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsPvOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                className={pvVerdict === "rejete" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
              >
                Signer & Enregistrer le PV
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ajouter un Critère de Contrôle Modal */}
      <Dialog open={isCriterionOpen} onOpenChange={setIsCriterionOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Nouveau Critère de Contrôle</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Définissez une exigence de contrôle pour une famille de matières, de composants ou de produits.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCriterion} className="space-y-3 py-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Phase de contrôle</Label>
                <Select value={newPhase} onValueChange={(val) => setNewPhase(val as ControlPhase)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reception">1. Réception Matières Premières</SelectItem>
                    <SelectItem value="en_cours">2. En cours de fabrication</SelectItem>
                    <SelectItem value="produit_fini">3. Contrôle Final & Libération</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Criticité</Label>
                <Select value={newCrit} onValueChange={(v) => setNewCrit(v as Criticality)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critique">Critique (Sécurité / Fonctionnel)</SelectItem>
                    <SelectItem value="Majeur">Majeur</SelectItem>
                    <SelectItem value="Mineur">Mineur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Famille d&apos;article ou désignation *</Label>
              <Input
                placeholder="ex: Tôles acier laminées, Connecteurs étanches..."
                value={newFamille}
                onChange={(e) => setNewFamille(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs">Caractéristique à contrôler *</Label>
              <Input
                placeholder="ex: Épaisseur, Rugosité Ra, Couple de serrage, Test diélectrique..."
                value={newCarac}
                onChange={(e) => setNewCarac(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-xs">Tolérance Min</Label>
                <Input
                  placeholder="ex: 4.8"
                  value={newMin}
                  onChange={(e) => setNewMin(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Valeur Cible</Label>
                <Input
                  placeholder="ex: 5.0"
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  className="mt-1 h-9 text-xs font-bold"
                />
              </div>
              <div>
                <Label className="text-xs">Tolérance Max</Label>
                <Input
                  placeholder="ex: 5.2"
                  value={newMax}
                  onChange={(e) => setNewMax(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Unité</Label>
                <Input
                  placeholder="mm, µm, N.m..."
                  value={newUnite}
                  onChange={(e) => setNewUnite(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Moyen de mesure / Instrument *</Label>
                <Input
                  placeholder="ex: Micromètre, Banc d'essai, Calibre..."
                  value={newMoyen}
                  onChange={(e) => setNewMoyen(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Fréquence / Échantillonnage</Label>
                <Input
                  placeholder="ex: 100%, 5 pièces par lot, AQL 1.0..."
                  value={newFreq}
                  onChange={(e) => setNewFreq(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCriterionOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Enregistrer le critère
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
