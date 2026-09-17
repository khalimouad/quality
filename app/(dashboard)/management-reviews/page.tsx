"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  MessageSquare,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
  Target,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Printer,
  ChevronRight,
  Check,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { downloadCsv } from "@/lib/csv"
import { useToast } from "@/components/ui/use-toast"
import { deployReviewDecisions } from "@/lib/qhse-store"

export type ReviewStatus = "planifiee" | "en_cours" | "cloturee"

export interface ManagementReview {
  id: string
  reference: string
  title: string
  date: Date
  status: ReviewStatus
  president: string
  participants: string[]
  inputsEvaluated: {
    actionsPrecedentes: { statut: "conforme" | "en_cours"; note: string }
    enjeuxContexte: { statut: "conforme" | "en_cours"; note: string }
    satisfactionClients: { statut: "conforme" | "en_cours"; note: string }
    objectifsKpi: { statut: "conforme" | "en_cours"; note: string }
    performanceProcessus: { statut: "conforme" | "en_cours"; note: string }
    nonConformitesCapa: { statut: "conforme" | "en_cours"; note: string }
    resultatsAudits: { statut: "conforme" | "en_cours"; note: string }
    prestatairesExternes: { statut: "conforme" | "en_cours"; note: string }
    adequationRessources: { statut: "conforme" | "en_cours"; note: string }
    risquesOpportunites: { statut: "conforme" | "en_cours"; note: string }
  }
  decisions: string[]
  actionsEngagees: { title: string; resp: string; echeance: string; budget?: string }[]
  syntheseDirection: string
}

const mockReviews: ManagementReview[] = [
  {
    id: "REV-2026-01",
    reference: "RD-2026-S1",
    title: "Revue de Direction Semestre 1 — Exercice 2026",
    date: new Date("2026-06-25"),
    status: "cloturee",
    president: "Thomas Laurent (Directeur Général)",
    participants: [
      "Thomas Laurent (DG)",
      "Sophie Moreau (Directrice Qualité & RSE)",
      "Antoine Leblanc (Directeur Industriel)",
      "Pierre Bernard (Responsable Achats & Supply Chain)",
      "Marie Martin (Responsable HSE)",
      "Claire Dubois (Directrice Commerciale)",
    ],
    inputsEvaluated: {
      actionsPrecedentes: {
        statut: "conforme",
        note: "88% des actions décidées lors de la revue 2025-S2 sont soldées avec succès.",
      },
      enjeuxContexte: {
        statut: "conforme",
        note: "PESTEL et SWOT actualisés : prise en compte de la directive CSRD et de la hausse coût énergie.",
      },
      satisfactionClients: {
        statut: "conforme",
        note: "Score CSAT moyen 7.8/10, réclamations en baisse de 14%. Enquête grands comptes positive.",
      },
      objectifsKpi: {
        statut: "en_cours",
        note: "Taux de conformité global à 92% (cible 95%). Objectif OEE production atteint à 72%.",
      },
      performanceProcessus: {
        statut: "conforme",
        note: "9 processus sur 10 affichent une efficacité maîtrisée. Processus R&D en légère dérive de délai.",
      },
      nonConformitesCapa: {
        statut: "conforme",
        note: "Délai moyen de clôture des NC réduit à 18 jours. Taux de récurrence inférieur à 2%.",
      },
      resultatsAudits: {
        statut: "conforme",
        note: "Audit de certification ISO 9001 et ISO 14001 réussi sans aucune non-conformité majeure.",
      },
      prestatairesExternes: {
        statut: "conforme",
        note: "88% des fournisseurs stratégiques qualifiés A. 2 fournisseurs sous plan de surveillance.",
      },
      adequationRessources: {
        statut: "en_cours",
        note: "Nécessité de recruter 1 technicien méthodes et d'investir dans une machine de mesure 3D.",
      },
      risquesOpportunites: {
        statut: "conforme",
        note: "AMDEC à jour, plan de continuité d'activité (PCA) validé par la direction.",
      },
    },
    decisions: [
      "Validation de la politique qualité 2026-2027 intégrant le cap de décarbonation -20% d'ici 2027.",
      "Octroi d'une enveloppe budgétaire de 45 000 € pour l'acquisition d'une colonne de mesure 3D.",
      "Renforcement du plan de formation soudage TIG avec tutorat systématique des nouveaux embauchés.",
      "Passage en revue semestrielle avec les 5 premiers fournisseurs stratégiques aéronautiques.",
    ],
    actionsEngagees: [
      {
        title: "Acquisition et qualification de la nouvelle colonne de mesure 3D",
        resp: "Antoine Leblanc",
        echeance: "2026-09-30",
        budget: "45 000 €",
      },
      {
        title: "Formalisation du module de formation interne tuteur soudage",
        resp: "Sophie Moreau / Marie Martin",
        echeance: "2026-08-15",
        budget: "4 000 €",
      },
      {
        title: "Audit spécifique sur la cybersécurité des automates de production (OT)",
        resp: "Thomas Bernard (DSI)",
        echeance: "2026-10-31",
      },
    ],
    syntheseDirection:
      "Le Système de Management de la Qualité et de l'Environnement est jugé approprié, adapté, efficace et aligné avec les orientations stratégiques de l'entreprise. L'engagement de la direction est renouvelé avec des investissements industriels clés pour consolider notre leadership aéronautique.",
  },
  {
    id: "REV-2026-02",
    reference: "RD-2026-S2",
    title: "Revue de Direction Annuelle — Clôture 2026",
    date: new Date("2026-12-10"),
    status: "planifiee",
    president: "Thomas Laurent (Directeur Général)",
    participants: [
      "Comité de Direction (DG, Qualité, Production, Achats, HSE, Commercial)",
      "Pilotes des processus clés",
    ],
    inputsEvaluated: {
      actionsPrecedentes: { statut: "en_cours", note: "En cours de consolidation" },
      enjeuxContexte: { statut: "en_cours", note: "Préparation matrice PESTEL 2027" },
      satisfactionClients: { statut: "en_cours", note: "Enquête annuelle clients en cours" },
      objectifsKpi: { statut: "en_cours", note: "Bilan des indicateurs annuels" },
      performanceProcessus: { statut: "en_cours", note: "Rapports des revues de processus" },
      nonConformitesCapa: { statut: "en_cours", note: "Bilan annuel NC / CAPA" },
      resultatsAudits: { statut: "en_cours", note: "Audits internes du S2 planifiés" },
      prestatairesExternes: { statut: "en_cours", note: "Évaluation annuelle fournisseurs" },
      adequationRessources: { statut: "en_cours", note: "Plan de formation et plan d'investissements 2027" },
      risquesOpportunites: { statut: "en_cours", note: "Révision annuelle registre des risques" },
    },
    decisions: [
      "Ordre du jour préliminaire transmis aux membres du CODIR.",
      "Collecte des données d'entrée par le responsable qualité avant le 15/11/2026.",
    ],
    actionsEngagees: [
      {
        title: "Consolidation des fiches processus et des bilans d'indicateurs",
        resp: "Sophie Moreau",
        echeance: "2026-11-20",
      },
    ],
    syntheseDirection: "Revue annuelle de synthèse stratégique et validation du budget QHSE 2027.",
  },
]

const statusConfig: Record<ReviewStatus, { label: string; variant: "success" | "warning" | "info" }> = {
  cloturee: { label: "Clôturée & Validée", variant: "success" },
  en_cours: { label: "En cours de déroulement", variant: "warning" },
  planifiee: { label: "Planifiée", variant: "info" },
}

export default function ManagementReviewsPage() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<ManagementReview[]>(mockReviews)
  const [selectedReview, setSelectedReview] = useState<ManagementReview>(mockReviews[0])
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

  // New review form
  const [newTitle, setNewTitle] = useState("")
  const [newRef, setNewRef] = useState(`RD-${new Date().getFullYear()}-S2`)
  const [newDate, setNewDate] = useState("2026-11-20")
  const [newPresident, setNewPresident] = useState("Thomas Laurent (Directeur Général)")

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle) return

    const created: ManagementReview = {
      id: `REV-${Date.now()}`,
      reference: newRef,
      title: newTitle,
      date: new Date(newDate),
      status: "planifiee",
      president: newPresident,
      participants: [newPresident, "Sophie Moreau (Responsable Qualité)", "Comité de Direction"],
      inputsEvaluated: {
        actionsPrecedentes: { statut: "en_cours", note: "À évaluer" },
        enjeuxContexte: { statut: "en_cours", note: "À évaluer" },
        satisfactionClients: { statut: "en_cours", note: "À évaluer" },
        objectifsKpi: { statut: "en_cours", note: "À évaluer" },
        performanceProcessus: { statut: "en_cours", note: "À évaluer" },
        nonConformitesCapa: { statut: "en_cours", note: "À évaluer" },
        resultatsAudits: { statut: "en_cours", note: "À évaluer" },
        prestatairesExternes: { statut: "en_cours", note: "À évaluer" },
        adequationRessources: { statut: "en_cours", note: "À évaluer" },
        risquesOpportunites: { statut: "en_cours", note: "À évaluer" },
      },
      decisions: ["Ordre du jour en cours de constitution."],
      actionsEngagees: [],
      syntheseDirection: "Préparation de la session de revue.",
    }

    setReviews([created, ...reviews])
    setSelectedReview(created)
    setIsNewOpen(false)
    setNewTitle("")

    toast({
      title: "Revue de direction planifiée",
      description: `La revue ${created.reference} a été enregistrée au calendrier.`,
    })
  }

  const handleDeployActions = () => {
    if (!selectedReview.actionsEngagees || selectedReview.actionsEngagees.length === 0) {
      toast({
        title: "Aucune action à déployer",
        description: "Cette revue ne contient aucune action enregistrée.",
        variant: "destructive",
      })
      return
    }
    const deployed = deployReviewDecisions(selectedReview.reference, selectedReview.actionsEngagees)
    toast({
      title: "Actions déployées avec succès",
      description: `${deployed.length} actions stratégiques de ${selectedReview.reference} ont été injectées dans le Plan d'Actions global !`,
    })
  }

  const handleExportCsv = () => {
    downloadCsv(
      "revues_de_direction_iso9001",
      ["Référence", "Titre", "Date", "Statut", "Président", "Nb Décisions", "Nb Actions"],
      reviews.map((r) => [
        r.reference,
        r.title,
        format(r.date, "yyyy-MM-dd"),
        statusConfig[r.status].label,
        r.president,
        r.decisions.length,
        r.actionsEngagees.length,
      ])
    )
    toast({
      title: "Export réussi",
      description: "Historique des revues de direction exporté en CSV.",
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revues de Direction ISO 9001:2015"
        description="Pilier 5 · ACT — Évaluation stratégique par la Direction Générale (§9.3), décisions et actions d'amélioration continue"
        icon={Briefcase}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsPrintModalOpen(true)}>
            <Printer className="mr-2 h-4 w-4" />
            Compte-Rendu officiel
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsNewOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Planifier une revue
          </Button>
        </div>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Dernière Revue réalisée"
          value={format(reviews[0].date, "dd MMM yyyy", { locale: fr })}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          hint="Statut : Validée & conforme"
        />
        <StatCard
          title="Décisions stratégiques actées"
          value={reviews[0].decisions.length}
          icon={Target}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          change="Revue S1 2026"
        />
        <StatCard
          title="Actions d'amélioration engagées"
          value={reviews[0].actionsEngagees.length}
          icon={TrendingUp}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          hint="Lien direct vers CAPA"
        />
        <StatCard
          title="Prochaine Revue au calendrier"
          value={format(reviews[1].date, "dd MMM yyyy", { locale: fr })}
          icon={Calendar}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          change="Dans 5 mois"
        />
      </div>

      {/* Main Review Viewer: Selector + Tabbed ISO 9001 §9.3 Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left column: list of reviews */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Sessions de Revue</CardTitle>
            <CardDescription className="text-xs">Sélectionnez une revue de direction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3">
            {reviews.map((rev) => (
              <button
                key={rev.id}
                onClick={() => setSelectedReview(rev)}
                className={`w-full text-left rounded-lg p-3 transition-all border ${
                  selectedReview.id === rev.id
                    ? "bg-blue-50/80 border-blue-300 ring-1 ring-blue-200"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700">{rev.reference}</span>
                  <Badge variant={statusConfig[rev.status].variant} className="text-[10px] px-1.5 py-0">
                    {statusConfig[rev.status].label}
                  </Badge>
                </div>
                <p className="mt-1 text-xs font-semibold text-gray-900 line-clamp-1">{rev.title}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
                  <Calendar className="h-3 w-3" />
                  {format(rev.date, "dd MMMM yyyy", { locale: fr })}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right column: Selected Review Detail */}
        <div className="space-y-4 lg:col-span-3">
          {/* Header Card */}
          <Card className="border-blue-200 bg-white">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">{selectedReview.reference}</span>
                    <Badge variant={statusConfig[selectedReview.status].variant}>
                      {statusConfig[selectedReview.status].label}
                    </Badge>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-gray-900">{selectedReview.title}</h2>
                  <p className="text-xs text-gray-500">Présidée par : {selectedReview.president}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">Date de tenue</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {format(selectedReview.date, "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>

              {/* Participants */}
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700">Participants et Membres du Comité de Direction :</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedReview.participants.map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700"
                    >
                      <Users className="h-3 w-3 text-slate-400" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sub-tabs for ISO 9001 §9.3 breakdown */}
          <Tabs defaultValue="inputs" className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="inputs">
                <FileCheck className="h-4 w-4 mr-2" />
                1. Éléments d&apos;Entrée (§9.3.2)
              </TabsTrigger>
              <TabsTrigger value="outputs">
                <Target className="h-4 w-4 mr-2" />
                2. Décisions Stratégiques (§9.3.3)
              </TabsTrigger>
              <TabsTrigger value="actions">
                <TrendingUp className="h-4 w-4 mr-2" />
                3. Actions Engagées (CAPA)
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Inputs */}
            <TabsContent value="inputs" className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  {
                    code: "a",
                    title: "Actions des revues antérieures",
                    data: selectedReview.inputsEvaluated.actionsPrecedentes,
                  },
                  {
                    code: "b",
                    title: "Évolutions des enjeux internes & externes (Contexte)",
                    data: selectedReview.inputsEvaluated.enjeuxContexte,
                  },
                  {
                    code: "c",
                    title: "Satisfaction client & retours parties prenantes",
                    data: selectedReview.inputsEvaluated.satisfactionClients,
                  },
                  {
                    code: "d",
                    title: "Atteinte des objectifs qualité (KPI)",
                    data: selectedReview.inputsEvaluated.objectifsKpi,
                  },
                  {
                    code: "e",
                    title: "Performance des processus & conformité des produits",
                    data: selectedReview.inputsEvaluated.performanceProcessus,
                  },
                  {
                    code: "f",
                    title: "Non-conformités & actions correctives (CAPA)",
                    data: selectedReview.inputsEvaluated.nonConformitesCapa,
                  },
                  {
                    code: "g",
                    title: "Résultats des audits internes et externes",
                    data: selectedReview.inputsEvaluated.resultatsAudits,
                  },
                  {
                    code: "h",
                    title: "Performance des prestataires externes / Fournisseurs",
                    data: selectedReview.inputsEvaluated.prestatairesExternes,
                  },
                  {
                    code: "i",
                    title: "Adéquation des ressources (RH, compétences, moyens)",
                    data: selectedReview.inputsEvaluated.adequationRessources,
                  },
                  {
                    code: "j",
                    title: "Efficacité des actions face aux risques & opportunités",
                    data: selectedReview.inputsEvaluated.risquesOpportunites,
                  },
                ].map((item) => (
                  <Card key={item.code} className="border border-gray-200">
                    <CardHeader className="pb-2 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 font-mono text-[10px] font-bold text-blue-800">
                            {item.code}
                          </span>
                          <CardTitle className="text-xs font-semibold text-gray-900">{item.title}</CardTitle>
                        </div>
                        <Badge
                          variant={item.data.statut === "conforme" ? "success" : "warning"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {item.data.statut === "conforme" ? "Maîtrisé" : "À suivre"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 text-xs text-gray-600">
                      <p>{item.data.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 2: Strategic Decisions */}
            <TabsContent value="outputs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Relevé Formel des Décisions de la Direction Générale (§9.3.3)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Orientations arrêtées concernant l&apos;opportunité d&apos;amélioration, les besoins en ressources et les
                    modifications du système.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Synthèse Globale & Conclusion de la Direction
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-blue-950">
                      {selectedReview.syntheseDirection}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-gray-800">Décisions actées en séance :</h4>
                    {selectedReview.decisions.map((dec, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/80 p-2.5">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span className="text-xs text-gray-800">{dec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Actions Engaged */}
            <TabsContent value="actions" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Plan d&apos;Actions Issu de la Revue de Direction
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Actions injectées directement dans le système CAPA de l&apos;entreprise
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleDeployActions}
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Déployer dans le Plan d&apos;Actions
                    </Button>
                    <Link href="/action-plan">
                      <Button variant="outline" size="sm" className="h-8 text-xs text-blue-600">
                        Plan d&apos;Actions <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedReview.actionsEngagees.map((act, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50/60 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px]">
                              Action stratégique
                            </Badge>
                            <span className="font-semibold text-xs text-gray-900">{act.title}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Responsable : <span className="font-medium text-gray-700">{act.resp}</span>
                            {act.budget && ` · Enveloppe budgétaire allouée : ${act.budget}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                            <Clock className="h-3 w-3" />
                            Échéance : {act.echeance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Print / Official Report Modal */}
      <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Système de Management QHSE · ISO 9001
                </span>
                <DialogTitle className="text-base font-bold mt-1">
                  Procès-Verbal Officiel de Revue de Direction
                </DialogTitle>
              </div>
              <Badge variant="outline" className="font-mono">
                {selectedReview.reference}
              </Badge>
            </div>
            <DialogDescription className="text-xs">
              Document officiel à destination des auditeurs de certification et de la Direction Générale.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs leading-relaxed text-gray-800">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3">
              <div>
                <span className="text-gray-500 font-semibold">Organisme :</span> Industries QHSE SAS
              </div>
              <div>
                <span className="text-gray-500 font-semibold">Date de tenue :</span>{" "}
                {format(selectedReview.date, "dd MMMM yyyy", { locale: fr })}
              </div>
              <div>
                <span className="text-gray-500 font-semibold">Président de séance :</span> {selectedReview.president}
              </div>
              <div>
                <span className="text-gray-500 font-semibold">Statut :</span> Conforme ISO 9001:2015 §9.3
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase text-gray-900">1. Présence & Émargement</h4>
              <p className="mt-1 text-gray-600">{selectedReview.participants.join(" · ")}</p>
            </div>

            <div>
              <h4 className="font-bold uppercase text-gray-900">2. Synthèse des Éléments d&apos;Entrée</h4>
              <ul className="mt-1 list-disc pl-5 space-y-1 text-gray-700">
                <li>Actions antérieures : {selectedReview.inputsEvaluated.actionsPrecedentes.note}</li>
                <li>Performance processus : {selectedReview.inputsEvaluated.performanceProcessus.note}</li>
                <li>Audits : {selectedReview.inputsEvaluated.resultatsAudits.note}</li>
                <li>Ressources : {selectedReview.inputsEvaluated.adequationRessources.note}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase text-gray-900">3. Décisions Stratégiques & Allocations</h4>
              <ol className="mt-1 list-decimal pl-5 space-y-1 text-gray-700">
                {selectedReview.decisions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-bold uppercase text-gray-900">4. Conclusion & Engagement de la Direction</h4>
              <p className="mt-1 italic rounded bg-blue-50/60 p-3 border-l-4 border-blue-600 text-blue-950">
                &ldquo;{selectedReview.syntheseDirection}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex justify-between border-t pt-4 text-center">
              <div>
                <p className="font-semibold text-gray-700">Le Responsable Qualité</p>
                <p className="text-[11px] text-gray-400 mt-6">Sophie Moreau (Visa électronique)</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Le Directeur Général</p>
                <p className="text-[11px] text-gray-400 mt-6">Thomas Laurent (Signature certifiée)</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Fermer
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                window.print()
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer / Enregistrer PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Planifier Nouvelle Revue Modal */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Planifier une Revue de Direction</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Convoquez le comité de direction et préparez l&apos;ordre du jour normalisé ISO 9001.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateReview} className="space-y-3 py-2 text-sm">
            <div>
              <Label className="text-xs">Référence de la revue *</Label>
              <Input
                value={newRef}
                onChange={(e) => setNewRef(e.target.value)}
                className="mt-1 h-9 text-xs font-mono"
                required
              />
            </div>

            <div>
              <Label className="text-xs">Intitulé de la revue *</Label>
              <Input
                placeholder="ex: Revue de Direction Semestrielle S2 2026..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date de la séance *</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Président de séance</Label>
                <Input
                  value={newPresident}
                  onChange={(e) => setNewPresident(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setIsNewOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Planifier la Revue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
