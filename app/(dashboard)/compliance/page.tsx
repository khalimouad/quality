"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Building2,
  BookOpen,
  ArrowRight,
  ListFilter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { downloadCsv } from "@/lib/csv"
import { useToast } from "@/components/ui/use-toast"

export type ComplianceDomain = "Sécurité (SST)" | "Environnement" | "Qualité" | "Client & Sectoriel"
export type ComplianceStatus = "conforme" | "partiel" | "non_conforme" | "en_cours"

export interface RegulatoryRequirement {
  id: string
  reference: string
  title: string
  domain: ComplianceDomain
  source: string // ex: Code du travail, ICPE, DREAL, ISO 9001, Client Vega
  applicability: string
  periodicity: string
  lastEvaluation: Date
  nextEvaluation: Date
  status: ComplianceStatus
  evaluator: string
  evidence: string
  associatedAction?: string
}

const initialRequirements: RegulatoryRequirement[] = [
  {
    id: "REQ-001",
    reference: "CDT-L4121-1",
    title: "Obligation générale de sécurité et évaluation des risques (DUERP)",
    domain: "Sécurité (SST)",
    source: "Code du Travail - Art. L4121-1",
    applicability: "Tous les postes et unités de travail de l'entreprise",
    periodicity: "Annuelle",
    lastEvaluation: new Date("2026-01-15"),
    nextEvaluation: new Date("2027-01-15"),
    status: "conforme",
    evaluator: "Marie Martin (QHSE)",
    evidence: "DUERP mis à jour le 15/01/2026 validé par le CSE",
  },
  {
    id: "REQ-002",
    reference: "ICPE-2560",
    title: "Prescriptions générales applicables aux ateliers de travail des métaux",
    domain: "Environnement",
    source: "Arrêté préfectoral DREAL / Rubrique ICPE 2560",
    applicability: "Atelier d'usinage, de découpe et de soudage",
    periodicity: "Semestrielle",
    lastEvaluation: new Date("2026-02-20"),
    nextEvaluation: new Date("2026-08-20"),
    status: "partiel",
    evaluator: "Pierre Bernard",
    evidence: "Bacs de rétention conformes mais analyse rejets aqueux en attente laboratoire",
    associatedAction: "Finaliser les prélèvements rejets métaux lourds (CAPA-2026-019)",
  },
  {
    id: "REQ-003",
    reference: "ISO-9001-8.5.1",
    title: "Maîtrise de la production et de la prestation de service",
    domain: "Qualité",
    source: "Norme ISO 9001:2015 Clause 8.5.1",
    applicability: "Lignes de fabrication et contrôle final",
    periodicity: "Trimestrielle",
    lastEvaluation: new Date("2026-03-10"),
    nextEvaluation: new Date("2026-06-10"),
    status: "conforme",
    evaluator: "Sophie Moreau",
    evidence: "Instructions de travail validées, fiches suiveuses et plans de contrôle tenus",
  },
  {
    id: "REQ-004",
    reference: "REACH-CE-1907",
    title: "Substances extrêmement préoccupantes (SVHC) et Fiches Données Sécurité",
    domain: "Environnement",
    source: "Règlement européen REACH (CE) n°1907/2006",
    applicability: "Chimie, solvants, dégraissants et peintures",
    periodicity: "Annuelle",
    lastEvaluation: new Date("2025-11-30"),
    nextEvaluation: new Date("2026-05-30"),
    status: "conforme",
    evaluator: "Luc Petit",
    evidence: "Registre FDS à 100% à jour, attestation absence SVHC délivrée aux clients",
  },
  {
    id: "REQ-005",
    reference: "CDT-R4227-28",
    title: "Consignes d'incendie, exercices d'évacuation semestriels et extincteurs",
    domain: "Sécurité (SST)",
    source: "Code du Travail - R4227-28",
    applicability: "Ensemble des bâtiments administratifs et industriels",
    periodicity: "Semestrielle",
    lastEvaluation: new Date("2026-02-18"),
    nextEvaluation: new Date("2026-08-18"),
    status: "conforme",
    evaluator: "Marie Martin",
    evidence: "Rapport d'exercice d'évacuation chrono 2min 40s + contrôle extincteurs SOCOTEC",
  },
  {
    id: "REQ-006",
    reference: "EN-9100-8.4.3",
    title: "Exigences spécifiques clients Aéronautique & Défense (FOD & Traçabilité)",
    domain: "Client & Sectoriel",
    source: "Cahier des charges Groupe Vega / EN 9100",
    applicability: "Zone de montage aéronautique & salle blanche",
    periodicity: "Semestrielle",
    lastEvaluation: new Date("2026-03-01"),
    nextEvaluation: new Date("2026-09-01"),
    status: "partiel",
    evaluator: "Jean Dupont",
    evidence: "Sensibilisation FOD réalisée mais renouvellement des outillages gravés à terminer",
    associatedAction: "Inventaire et marquage laser outillages spécifiques (CAPA-2026-022)",
  },
  {
    id: "REQ-007",
    reference: "CSRD-DIR-2022",
    title: "Directive européenne sur les rapports de durabilité (ESG)",
    domain: "Environnement",
    source: "Directive UE 2022/2464 (CSRD)",
    applicability: "Gouvernance d'entreprise et bilan carbone",
    periodicity: "Annuelle",
    lastEvaluation: new Date("2026-01-20"),
    nextEvaluation: new Date("2026-07-20"),
    status: "en_cours",
    evaluator: "Thomas Laurent",
    evidence: "Calcul des scopes 1 et 2 finalisé, audit scope 3 et double matérialité en cours",
    associatedAction: "Consolidation reporting CSRD plateforme ESG",
  },
  {
    id: "REQ-008",
    reference: "CDT-R4544-9",
    title: "Habilitations électriques des intervenants (Norme NF C 18-510)",
    domain: "Sécurité (SST)",
    source: "Code du Travail - R4544-9",
    applicability: "Services maintenance et opérateurs intervenant sur armoires",
    periodicity: "Annuelle",
    lastEvaluation: new Date("2026-03-25"),
    nextEvaluation: new Date("2027-03-25"),
    status: "conforme",
    evaluator: "Antoine Leblanc",
    evidence: "100% des techniciens maintenances détenteurs de titres valides (B2V / BR)",
  },
  {
    id: "REQ-009",
    reference: "ROHS-2011-65",
    title: "Limitation des substances dangereuses dans les équipements électriques (RoHS 3)",
    domain: "Client & Sectoriel",
    source: "Directive RoHS 2011/65/UE + 2015/863",
    applicability: "Cartes électroniques et faisceaux câblés",
    periodicity: "Annuelle",
    lastEvaluation: new Date("2025-10-12"),
    nextEvaluation: new Date("2026-04-12"),
    status: "conforme",
    evaluator: "Pierre Bernard",
    evidence: "Certificats de conformité fournisseurs archivés dans la GED",
  },
]

const statusBadgeConfig: Record<ComplianceStatus, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  conforme: { label: "Conforme", variant: "success" },
  partiel: { label: "Partiellement conforme", variant: "warning" },
  non_conforme: { label: "Non conforme", variant: "destructive" },
  en_cours: { label: "Évaluation en cours", variant: "info" },
}

export default function CompliancePage() {
  const { toast } = useToast()
  const [requirements, setRequirements] = useState<RegulatoryRequirement[]>(initialRequirements)
  const [search, setSearch] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedReq, setSelectedReq] = useState<RegulatoryRequirement | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // New requirement form state
  const [newRef, setNewRef] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newDomain, setNewDomain] = useState<ComplianceDomain>("Sécurité (SST)")
  const [newSource, setNewSource] = useState("")
  const [newApplicability, setNewApplicability] = useState("")
  const [newPeriodicity, setNewPeriodicity] = useState("Annuelle")
  const [newStatus, setNewStatus] = useState<ComplianceStatus>("conforme")
  const [newEvidence, setNewEvidence] = useState("")
  const [newEvaluator, setNewEvaluator] = useState("Sophie Moreau")

  // Filtered requirements
  const filtered = requirements.filter((r) => {
    const matchSearch =
      r.reference.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.source.toLowerCase().includes(search.toLowerCase()) ||
      r.evidence.toLowerCase().includes(search.toLowerCase())
    const matchDomain = selectedDomain === "all" || r.domain === selectedDomain
    const matchStatus = selectedStatus === "all" || r.status === selectedStatus
    return matchSearch && matchDomain && matchStatus
  })

  // Statistics
  const total = requirements.length
  const conformes = requirements.filter((r) => r.status === "conforme").length
  const partiels = requirements.filter((r) => r.status === "partiel").length
  const nonConformes = requirements.filter((r) => r.status === "non_conforme").length
  const enCours = requirements.filter((r) => r.status === "en_cours").length

  const complianceRate = total > 0 ? Math.round(((conformes + partiels * 0.5) / total) * 100) : 0

  const handleExportCsv = () => {
    downloadCsv(
      "veille_reglementaire_conformite",
      ["Réf", "Titre", "Domaine", "Source", "Périodicité", "Statut", "Dernière évaluation", "Évaluateur", "Preuve", "Action associée"],
      requirements.map((r) => [
        r.reference,
        r.title,
        r.domain,
        r.source,
        r.periodicity,
        statusBadgeConfig[r.status].label,
        format(r.lastEvaluation, "yyyy-MM-dd"),
        r.evaluator,
        r.evidence,
        r.associatedAction || "",
      ])
    )
    toast({
      title: "Export réussi",
      description: `${requirements.length} exigences exportées au format CSV.`,
    })
  }

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRef || !newTitle || !newSource) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez renseigner au minimum la référence, le titre et la source.",
        variant: "destructive",
      })
      return
    }

    const created: RegulatoryRequirement = {
      id: `REQ-${String(requirements.length + 1).padStart(3, "0")}`,
      reference: newRef,
      title: newTitle,
      domain: newDomain,
      source: newSource,
      applicability: newApplicability || "Non spécifié",
      periodicity: newPeriodicity,
      lastEvaluation: new Date(),
      nextEvaluation: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: newStatus,
      evaluator: newEvaluator,
      evidence: newEvidence || "Évaluation initiale enregistrée",
    }

    setRequirements([created, ...requirements])
    setIsAddOpen(false)
    setNewRef("")
    setNewTitle("")
    setNewSource("")
    setNewApplicability("")
    setNewEvidence("")

    toast({
      title: "Exigence enregistrée",
      description: `L'exigence ${created.reference} a été ajoutée à la veille réglementaire.`,
    })
  }

  const handleUpdateStatus = (id: string, newStatus: ComplianceStatus) => {
    setRequirements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus, lastEvaluation: new Date() } : item))
    )
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq((prev) => (prev ? { ...prev, status: newStatus, lastEvaluation: new Date() } : null))
    }
    toast({
      title: "Statut mis à jour",
      description: `L'exigence est maintenant marquée comme "${statusBadgeConfig[newStatus].label}".`,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exigences & Conformité Réglementaire"
        description="Pilier 2 · PLAN — Veille légale, suivi des exigences normatives ISO et conformité contractuelle clients"
        icon={Scale}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle exigence
          </Button>
        </div>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Taux de conformité global"
          value={`${complianceRate}%`}
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          hint="Objectif : 100%"
        />
        <StatCard
          title="Exigences conformes"
          value={conformes}
          icon={CheckCircle2}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          change={`${Math.round((conformes / total) * 100)}% du référentiel`}
        />
        <StatCard
          title="Écarts / Partiellement conf."
          value={partiels + nonConformes}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          hint={`${partiels} partiels · ${nonConformes} non conformes`}
        />
        <StatCard
          title="En cours d'évaluation"
          value={enCours}
          icon={Clock}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          hint="Évaluations planifiées"
        />
      </div>

      {/* Domain Breakdown Banner */}
      <Card className="border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="border-r border-blue-200/60 pr-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sécurité (SST)</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {requirements.filter((r) => r.domain === "Sécurité (SST)" && r.status === "conforme").length} /{" "}
                  {requirements.filter((r) => r.domain === "Sécurité (SST)").length}
                </span>
                <span className="text-xs text-green-700 font-medium">Conformes</span>
              </div>
            </div>
            <div className="border-r border-blue-200/60 pr-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Environnement (ICPE)</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {requirements.filter((r) => r.domain === "Environnement" && r.status === "conforme").length} /{" "}
                  {requirements.filter((r) => r.domain === "Environnement").length}
                </span>
                <span className="text-xs text-amber-700 font-medium">1 Partiel</span>
              </div>
            </div>
            <div className="border-r border-blue-200/60 pr-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Qualité (ISO 9001)</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {requirements.filter((r) => r.domain === "Qualité" && r.status === "conforme").length} /{" "}
                  {requirements.filter((r) => r.domain === "Qualité").length}
                </span>
                <span className="text-xs text-green-700 font-medium">100% à jour</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Exigences Clients</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {requirements.filter((r) => r.domain === "Client & Sectoriel" && r.status === "conforme").length} /{" "}
                  {requirements.filter((r) => r.domain === "Client & Sectoriel").length}
                </span>
                <span className="text-xs text-blue-700 font-medium">Surveillance active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par référence, texte légal, mot-clé ou preuve..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-[180px] text-xs h-9">
                  <SelectValue placeholder="Domaine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les domaines</SelectItem>
                  <SelectItem value="Sécurité (SST)">Sécurité (SST)</SelectItem>
                  <SelectItem value="Environnement">Environnement</SelectItem>
                  <SelectItem value="Qualité">Qualité</SelectItem>
                  <SelectItem value="Client & Sectoriel">Client & Sectoriel</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[170px] text-xs h-9">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="conforme">Conforme</SelectItem>
                  <SelectItem value="partiel">Partiellement conforme</SelectItem>
                  <SelectItem value="non_conforme">Non conforme</SelectItem>
                  <SelectItem value="en_cours">Évaluation en cours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Table */}
      <Card className="overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50/80 text-xs font-semibold uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Réf. & Titre</th>
                <th className="px-4 py-3">Domaine / Source</th>
                <th className="px-4 py-3">Périodicité</th>
                <th className="px-4 py-3">Dernière Éval.</th>
                <th className="px-4 py-3">Statut de conformité</th>
                <th className="px-4 py-3">Preuve d'application</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Aucune exigence ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-gray-50/80">
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-xs font-bold text-blue-700">{r.reference}</div>
                      <div className="font-medium text-gray-900 line-clamp-1 max-w-sm">{r.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{r.applicability}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className="text-xs font-normal">
                        {r.domain}
                      </Badge>
                      <p className="mt-1 text-xs text-gray-500 truncate max-w-[180px]">{r.source}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {r.periodicity}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600">
                      <div>{format(r.lastEvaluation, "dd/MM/yyyy")}</div>
                      <div className="text-gray-400 text-[11px]">{r.evaluator}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusBadgeConfig[r.status].variant}>
                        {statusBadgeConfig[r.status].label}
                      </Badge>
                      {r.associatedAction && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          CAPA liée
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{r.evidence}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setSelectedReq(r)
                          setIsDetailOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail & Evaluation Modal */}
      {selectedReq && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant={statusBadgeConfig[selectedReq.status].variant}>
                  {statusBadgeConfig[selectedReq.status].label}
                </Badge>
                <span className="font-mono text-xs text-gray-400">{selectedReq.reference}</span>
              </div>
              <DialogTitle className="text-lg font-bold mt-1.5">{selectedReq.title}</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Source juridique / normative : {selectedReq.source}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-gray-50/70 p-3">
                <div>
                  <span className="text-xs text-gray-500">Domaine de veille</span>
                  <p className="font-semibold text-gray-800">{selectedReq.domain}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Périodicité d&apos;évaluation</span>
                  <p className="font-semibold text-gray-800">{selectedReq.periodicity}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Dernière évaluation</span>
                  <p className="font-semibold text-gray-800">
                    {format(selectedReq.lastEvaluation, "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Évaluateur désigné</span>
                  <p className="font-semibold text-gray-800">{selectedReq.evaluator}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Périmètre et applicabilité</Label>
                <p className="mt-1 text-gray-800">{selectedReq.applicability}</p>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Preuve de conformité constatée</Label>
                <div className="mt-1 rounded-md border bg-white p-3 text-gray-800 shadow-sm">
                  {selectedReq.evidence}
                </div>
              </div>

              {selectedReq.associatedAction && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                    <AlertTriangle className="h-4 w-4" />
                    Action corrective de mise en conformité engagée
                  </div>
                  <p className="mt-1 text-xs text-amber-900">{selectedReq.associatedAction}</p>
                  <Link
                    href="/capa"
                    className="mt-2 inline-flex items-center text-xs font-semibold text-blue-700 hover:underline"
                  >
                    Voir l&apos;action dans le module CAPA <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              )}

              {/* Quick Status Change */}
              <div className="border-t pt-3">
                <Label className="text-xs font-semibold text-gray-700">Mettre à jour le statut d&apos;évaluation</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={selectedReq.status === "conforme" ? "default" : "outline"}
                    className={selectedReq.status === "conforme" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    onClick={() => handleUpdateStatus(selectedReq.id, "conforme")}
                  >
                    <CheckCircle className="mr-1.5 h-4 w-4 text-white" />
                    Conforme
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedReq.status === "partiel" ? "default" : "outline"}
                    className={selectedReq.status === "partiel" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
                    onClick={() => handleUpdateStatus(selectedReq.id, "partiel")}
                  >
                    <AlertTriangle className="mr-1.5 h-4 w-4" />
                    Partiellement conforme
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedReq.status === "non_conforme" ? "destructive" : "outline"}
                    onClick={() => handleUpdateStatus(selectedReq.id, "non_conforme")}
                  >
                    <XCircle className="mr-1.5 h-4 w-4" />
                    Non conforme
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedReq.status === "en_cours" ? "secondary" : "outline"}
                    onClick={() => handleUpdateStatus(selectedReq.id, "en_cours")}
                  >
                    <Clock className="mr-1.5 h-4 w-4" />
                    En évaluation
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Requirement Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Ajouter une exigence réglementaire</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Enregistrez un texte de loi, une exigence ICPE, une norme ou une exigence client dans la veille.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRequirement} className="space-y-3 py-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="reqRef" className="text-xs">
                  Référence du texte *
                </Label>
                <Input
                  id="reqRef"
                  placeholder="ex: CDT-R4228-1, ICPE-1510..."
                  value={newRef}
                  onChange={(e) => setNewRef(e.target.value)}
                  className="mt-1 h-9 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reqDomain" className="text-xs">
                  Domaine
                </Label>
                <Select value={newDomain} onValueChange={(val) => setNewDomain(val as ComplianceDomain)}>
                  <SelectTrigger id="reqDomain" className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sécurité (SST)">Sécurité (SST)</SelectItem>
                    <SelectItem value="Environnement">Environnement</SelectItem>
                    <SelectItem value="Qualité">Qualité</SelectItem>
                    <SelectItem value="Client & Sectoriel">Client & Sectoriel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reqTitle" className="text-xs">
                Intitulé de l&apos;exigence *
              </Label>
              <Input
                id="reqTitle"
                placeholder="ex: Contrôle périodique des installations d'aération..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="reqSource" className="text-xs">
                  Source juridique / Norme *
                </Label>
                <Input
                  id="reqSource"
                  placeholder="ex: Code du Travail, Norme ISO 9001, Client..."
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="reqPeriodicity" className="text-xs">
                  Périodicité d&apos;évaluation
                </Label>
                <Select value={newPeriodicity} onValueChange={setNewPeriodicity}>
                  <SelectTrigger id="reqPeriodicity" className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                    <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
                    <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                    <SelectItem value="Annuelle">Annuelle</SelectItem>
                    <SelectItem value="Biennale">Biennale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reqApp" className="text-xs">
                Champ d&apos;application dans l&apos;entreprise
              </Label>
              <Input
                id="reqApp"
                placeholder="ex: Ensemble du personnel de production, zone magasin..."
                value={newApplicability}
                onChange={(e) => setNewApplicability(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="reqEvidence" className="text-xs">
                Preuve de conformité constatée
              </Label>
              <Textarea
                id="reqEvidence"
                placeholder="ex: Rapport de vérification annuel APAVE n°2026-882 archivé..."
                value={newEvidence}
                onChange={(e) => setNewEvidence(e.target.value)}
                className="mt-1 text-xs"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="reqStatus" className="text-xs">
                  Statut initial
                </Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ComplianceStatus)}>
                  <SelectTrigger id="reqStatus" className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="partiel">Partiellement conforme</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                    <SelectItem value="en_cours">En évaluation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reqEvaluator" className="text-xs">
                  Évaluateur référent
                </Label>
                <Input
                  id="reqEvaluator"
                  value={newEvaluator}
                  onChange={(e) => setNewEvaluator(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Enregistrer l&apos;exigence
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
