"use client"

import { useState } from "react"
import {
  Award,
  Users,
  BadgeCheck,
  AlertTriangle,
  BarChart2,
  Search,
  Grid,
  FileSpreadsheet,
  UserCheck,
  BookOpen,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Eye,
  Download,
} from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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

type Criticality = "Critique" | "Sensible" | "Maîtrisé" | "Faible impact"

// Competency level 1 to 4
// 1 = Notion / Débutant
// 2 = Pratique accompagnée
// 3 = Autonome
// 4 = Expert / Formateur référent
export interface OperatorSkill {
  operatorId: string
  operatorName: string
  poste: string
  departement: string
  skills: Record<string, number> // skillKey -> 1..4
}

export interface SkillDefinition {
  key: string
  name: string
  domaine: string
  niveauRequis: number
  criticite: Criticality
}

export interface FicheDePoste {
  id: string
  code: string
  intitule: string
  departement: string
  rattachement: string
  missions: string[]
  competencesRequises: string[]
  habilitationsObligatoires: string[]
  epiRequis: string[]
  effectifPoste: number
}

const SKILL_DEFS: SkillDefinition[] = [
  { key: "soudage_tig", name: "Soudage TIG inox/alu (ISO 9606)", domaine: "Production", niveauRequis: 3, criticite: "Critique" },
  { key: "programmation_cnc", name: "Programmation & Réglage CNC 5 axes", domaine: "Production", niveauRequis: 3, criticite: "Critique" },
  { key: "metrologie_3d", name: "Métrologie tridimensionnelle & MMT", domaine: "Qualité", niveauRequis: 3, criticite: "Critique" },
  { key: "controle_entrant", name: "Contrôle réception & certificats 3.1", domaine: "Qualité", niveauRequis: 3, criticite: "Maîtrisé" },
  { key: "audit_interne", name: "Audit interne ISO 9001 / 14001 / 45001", domaine: "Qualité", niveauRequis: 4, criticite: "Sensible" },
  { key: "maintenance_hydrau", name: "Diagnostic hydraulique & mécanique", domaine: "Maintenance", niveauRequis: 3, criticite: "Critique" },
  { key: "gestion_dechets", name: "Tri et filières déchets dangereux (ICPE)", domaine: "Environnement", niveauRequis: 2, criticite: "Maîtrisé" },
  { key: "analyse_8d", name: "Méthodologie d'analyse causale 8D / Ishikawa", domaine: "Qualité", niveauRequis: 3, criticite: "Sensible" },
]

const OPERATORS_DATA: OperatorSkill[] = [
  {
    operatorId: "OP-01",
    operatorName: "Antoine Leblanc",
    poste: "Chef d'atelier Usinage",
    departement: "Production",
    skills: { soudage_tig: 4, programmation_cnc: 4, metrologie_3d: 3, controle_entrant: 3, audit_interne: 2, maintenance_hydrau: 4, gestion_dechets: 3, analyse_8d: 3 },
  },
  {
    operatorId: "OP-02",
    operatorName: "Jean Dupont",
    poste: "Soudeur TIG Haute Pression",
    departement: "Production",
    skills: { soudage_tig: 4, programmation_cnc: 1, metrologie_3d: 2, controle_entrant: 2, audit_interne: 1, maintenance_hydrau: 2, gestion_dechets: 2, analyse_8d: 2 },
  },
  {
    operatorId: "OP-03",
    operatorName: "Marie Martin",
    poste: "Responsable HSE & Sécurité",
    departement: "QHSE",
    skills: { soudage_tig: 1, programmation_cnc: 0, metrologie_3d: 1, controle_entrant: 2, audit_interne: 4, maintenance_hydrau: 1, gestion_dechets: 4, analyse_8d: 4 },
  },
  {
    operatorId: "OP-04",
    operatorName: "Pierre Bernard",
    poste: "Technicien Contrôle Qualité",
    departement: "Qualité",
    skills: { soudage_tig: 2, programmation_cnc: 2, metrologie_3d: 4, controle_entrant: 4, audit_interne: 3, maintenance_hydrau: 1, gestion_dechets: 3, analyse_8d: 4 },
  },
  {
    operatorId: "OP-05",
    operatorName: "Luc Petit",
    poste: "Opérateur Tourneur-Fraiseur",
    departement: "Production",
    skills: { soudage_tig: 2, programmation_cnc: 4, metrologie_3d: 3, controle_entrant: 2, audit_interne: 1, maintenance_hydrau: 3, gestion_dechets: 2, analyse_8d: 2 },
  },
  {
    operatorId: "OP-06",
    operatorName: "Marc Durand",
    poste: "Technicien Maintenance Polyvalent",
    departement: "Maintenance",
    skills: { soudage_tig: 3, programmation_cnc: 2, metrologie_3d: 2, controle_entrant: 1, audit_interne: 2, maintenance_hydrau: 4, gestion_dechets: 3, analyse_8d: 2 },
  },
  {
    operatorId: "OP-07",
    operatorName: "Sophie Moreau",
    poste: "Responsable Qualité & Méthodes",
    departement: "Qualité",
    skills: { soudage_tig: 1, programmation_cnc: 1, metrologie_3d: 4, controle_entrant: 4, audit_interne: 4, maintenance_hydrau: 1, gestion_dechets: 3, analyse_8d: 4 },
  },
]

const FICHES_POSTE: FicheDePoste[] = [
  {
    id: "FP-01",
    code: "POSTE-QUA-01",
    intitule: "Technicien Contrôle Qualité & Métrologie",
    departement: "Qualité & Conformité",
    rattachement: "Responsable Assurance Qualité",
    missions: [
      "Effectuer les contrôles dimensionnels et visuels à réception des matières et composants",
      "Programmer et utiliser la machine tridimensionnelle (MMT) pour validation premier article (FAI)",
      "Vérifier et archiver les certificats matière CCPU 3.1 des fournisseurs",
      "Émettre les fiches de non-conformité en cas d'écart et bloquer les lots en quarantaine",
    ],
    competencesRequises: [
      "Lecture de plans techniques et cotation ISO GPS",
      "Maîtrise des instruments de métrologie (micromètre, rugosimétre, bras de mesure 3D)",
      "Connaissance des normes ISO 9001 et EN 9100",
    ],
    habilitationsObligatoires: ["Habilitation électrique BE Manœuvre", "CACES R489 Chariots cat. 3"],
    epiRequis: ["Chaussures de sécurité", "Blouse de laboratoire", "Lunettes de protection"],
    effectifPoste: 3,
  },
  {
    id: "FP-02",
    code: "POSTE-PRD-02",
    intitule: "Opérateur Soudeur TIG Haute Pression",
    departement: "Production & Chaudronnerie",
    rattachement: "Chef d'atelier Fabrication",
    missions: [
      "Assembler et souder les tubulures et châssis inox selon les DMOS validés",
      "Régler les paramètres des postes TIG (intensité, débit gaz argon, vitesse)",
      "Autocontrôle visuel 100% des cordons et test d'étanchéité",
      "Maintenance de premier niveau des torches et détendeurs",
    ],
    competencesRequises: [
      "Licence de soudage valide selon ISO 9606-1 (procédé 141)",
      "Maîtrise des jauges de soudage et du contrôle par ressuage",
      "Rigueur et précision gestuelle sous masque ventilé",
    ],
    habilitationsObligatoires: ["Certificat de qualification soudeur (CQS)", "Habilitation espaces confinés CATEC"],
    epiRequis: ["Masque optoélectronique ventilé", "Gants cuir agneau TIG", "Tablier croûte de cuir"],
    effectifPoste: 4,
  },
  {
    id: "FP-03",
    code: "POSTE-MNT-03",
    intitule: "Technicien de Maintenance Industrielle",
    departement: "Support Maintenance",
    rattachement: "Responsable Maintenance & Travaux Neufs",
    missions: [
      "Assurer le dépannage curatif rapide des centres d'usinage et ponts roulants",
      "Exécuter le planning de maintenance préventive via la GMAO",
      "Contrôler périodiquement les circuits hydrauliques et pneumatiques",
      "Participer à l'amélioration de la sécurité machine et au plan d'économie d'énergie",
    ],
    competencesRequises: [
      "Électrotechnique, automates programmables Siemens / Fanuc",
      "Hydraulique industrielle et mécanique de précision",
      "Lecture de schémas électriques et pneumatiques",
    ],
    habilitationsObligatoires: ["Habilitation électrique BR / BC / B2V", "CACES R486 Nacelles", "SST"],
    epiRequis: ["Chaussures de sécurité montantes", "Écran facial anti-arc électrique", "Gants isolants 1000V"],
    effectifPoste: 4,
  },
]

const LEVEL_LABELS: Record<number, { label: string; bg: string; text: string }> = {
  0: { label: "Non formé", bg: "bg-gray-100", text: "text-gray-400" },
  1: { label: "1 · Notion / Débutant", bg: "bg-blue-50", text: "text-blue-700 font-semibold" },
  2: { label: "2 · Pratique accompagnée", bg: "bg-amber-100", text: "text-amber-800 font-semibold" },
  3: { label: "3 · Autonome", bg: "bg-green-100", text: "text-green-800 font-bold" },
  4: { label: "4 · Expert / Formateur", bg: "bg-purple-100", text: "text-purple-800 font-bold" },
}

export default function SkillsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<string>("matrix")
  const [search, setSearch] = useState("")
  const [selectedPoste, setSelectedPoste] = useState<FicheDePoste | null>(null)
  const [isPosteOpen, setIsPosteOpen] = useState(false)

  // Filtered operators
  const filteredOperators = OPERATORS_DATA.filter(
    (op) =>
      op.operatorName.toLowerCase().includes(search.toLowerCase()) ||
      op.poste.toLowerCase().includes(search.toLowerCase()) ||
      op.departement.toLowerCase().includes(search.toLowerCase())
  )

  // Critical skills with low coverage (less than 2 operators autonomous or expert)
  const skillsCoverage = SKILL_DEFS.map((s) => {
    const autonomousCount = OPERATORS_DATA.filter((op) => (op.skills[s.key] || 0) >= 3).length
    return {
      ...s,
      autonomousCount,
      isRisk: autonomousCount < 2 && s.criticite === "Critique",
    }
  })

  const handleExportMatrix = () => {
    downloadCsv(
      "matrice_de_polyvalence_competences",
      ["Collaborateur", "Poste", "Département", ...SKILL_DEFS.map((s) => s.name)],
      OPERATORS_DATA.map((op) => [
        op.operatorName,
        op.poste,
        op.departement,
        ...SKILL_DEFS.map((s) => LEVEL_LABELS[op.skills[s.key] || 0].label),
      ])
    )
    toast({
      title: "Matrice exportée",
      description: "La matrice de polyvalence a été exportée au format CSV.",
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ressources & Matrice des Compétences"
        description="Pilier 2 · PLAN — Matrice de polyvalence, gestion des savoirs critiques ISO 9001 (§7.2) et fiches de poste"
        icon={Award}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportMatrix}>
            <Download className="mr-2 h-4 w-4" />
            Exporter Matrice
          </Button>
        </div>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Collaborateurs évalués"
          value={OPERATORS_DATA.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          change="3 départements"
        />
        <StatCard
          title="Compétences cartographiées"
          value={SKILL_DEFS.length}
          icon={BadgeCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          hint="Dont 4 critiques"
        />
        <StatCard
          title="Taux de polyvalence global"
          value="82%"
          icon={BarChart2}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          hint="Objectif : 85%"
        />
        <StatCard
          title="Fiches de poste formalisées"
          value={FICHES_POSTE.length}
          icon={Briefcase}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
          hint="100% à jour"
        />
      </div>

      {/* Tabs: Matrice de Polyvalence vs Fiches de Poste */}
      <Tabs defaultValue="matrix" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="matrix">
              <Grid className="h-4 w-4 mr-2" />
              Matrice de Polyvalence Croisée
            </TabsTrigger>
            <TabsTrigger value="fiches">
              <Briefcase className="h-4 w-4 mr-2" />
              Fiches de Poste ({FICHES_POSTE.length})
            </TabsTrigger>
            <TabsTrigger value="coverage">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Taux de Couverture & Savoirs Critiques
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <Input
              placeholder="Rechercher collaborateur ou poste..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs w-64"
            />
          </div>
        </div>

        {/* TAB 1: Matrice Croisée */}
        <TabsContent value="matrix" className="space-y-4">
          {/* Level Legend */}
          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 text-xs">
            <span className="font-semibold text-gray-600 mr-2">Niveaux de maîtrise :</span>
            {[1, 2, 3, 4].map((lvl) => {
              const cfg = LEVEL_LABELS[lvl]
              return (
                <span key={lvl} className={`rounded px-2.5 py-1 ${cfg.bg} ${cfg.text} border`}>
                  {cfg.label}
                </span>
              )
            })}
          </div>

          <Card className="overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-gray-50/90 font-semibold uppercase text-gray-700">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 min-w-[200px] border-r">
                      Collaborateur / Poste
                    </th>
                    {SKILL_DEFS.map((s) => (
                      <th key={s.key} className="px-3 py-3 text-center min-w-[130px] border-r">
                        <div className="line-clamp-2">{s.name}</div>
                        <Badge
                          variant={s.criticite === "Critique" ? "destructive" : "secondary"}
                          className="text-[9px] px-1 py-0 mt-1"
                        >
                          {s.criticite}
                        </Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredOperators.map((op) => (
                    <tr key={op.operatorId} className="transition-colors hover:bg-gray-50/80">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 border-r shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        <p className="font-bold text-gray-900">{op.operatorName}</p>
                        <p className="text-[11px] text-gray-500">{op.poste}</p>
                        <span className="text-[10px] text-gray-400">{op.departement}</span>
                      </td>
                      {SKILL_DEFS.map((s) => {
                        const level = op.skills[s.key] || 0
                        const cfg = LEVEL_LABELS[level]
                        return (
                          <td key={s.key} className="px-2 py-2 text-center border-r">
                            <span
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold border transition-transform hover:scale-110 ${cfg.bg} ${cfg.text}`}
                              title={`${op.operatorName} - ${s.name} : ${cfg.label}`}
                            >
                              {level === 0 ? "-" : level}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: Fiches de Poste */}
        <TabsContent value="fiches" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FICHES_POSTE.map((fp) => (
              <Card
                key={fp.id}
                className="border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  setSelectedPoste(fp)
                  setIsPosteOpen(true)
                }}
              >
                <CardHeader className="pb-3 pt-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs">
                      {fp.code}
                    </Badge>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      {fp.effectifPoste} titulaires
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-gray-900 mt-2">{fp.intitule}</CardTitle>
                  <CardDescription className="text-xs">{fp.departement}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-4 text-xs">
                  <div>
                    <span className="font-semibold text-gray-600">Rattachement :</span>
                    <p className="text-gray-800">{fp.rattachement}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Missions principales :</span>
                    <p className="text-gray-700 line-clamp-2 mt-0.5">{fp.missions.join(", ")}</p>
                  </div>
                  <div className="border-t pt-2 flex items-center justify-between text-blue-600 font-semibold">
                    <span>Consulter la fiche complète</span>
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: Taux de couverture & Savoirs Critiques */}
        <TabsContent value="coverage" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skillsCoverage.map((s) => (
              <Card
                key={s.key}
                className={`border ${s.isRisk ? "border-red-300 bg-red-50/20" : "border-gray-200"}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={s.criticite === "Critique" ? "destructive" : "secondary"}>
                      {s.criticite}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">{s.domaine}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-gray-900 mt-1">{s.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Opérateurs autonomes / experts :</span>
                    <span className={`font-bold text-sm ${s.autonomousCount < 2 ? "text-red-600" : "text-green-700"}`}>
                      {s.autonomousCount} personne(s)
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${s.autonomousCount >= 3 ? "bg-green-500" : s.autonomousCount === 2 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min((s.autonomousCount / 3) * 100, 100)}%` }}
                    />
                  </div>
                  {s.isRisk ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 pt-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Risque de dépendance / Perte de savoir-faire critique
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-green-700 pt-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Couverture satisfaisante (≥ 2 autonomes)
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Fiche de Poste Detail Modal */}
      {selectedPoste && (
        <Dialog open={isPosteOpen} onOpenChange={setIsPosteOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedPoste.code}
                </Badge>
                <span className="text-xs text-gray-500">{selectedPoste.departement}</span>
              </div>
              <DialogTitle className="text-lg font-bold mt-1">Fiche de Poste : {selectedPoste.intitule}</DialogTitle>
              <DialogDescription className="text-xs">
                Rattachement hiérarchique : <span className="font-semibold text-gray-800">{selectedPoste.rattachement}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs leading-relaxed text-gray-800">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-blue-900 text-[11px] mb-1">
                  1. Missions & Responsabilités Principales
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {selectedPoste.missions.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border bg-gray-50/60 p-3">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5 text-indigo-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> Compétences Indispensables
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    {selectedPoste.competencesRequises.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3">
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> Habilitations Obligatoires
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-amber-950 font-medium">
                    {selectedPoste.habilitationsObligatoires.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-gray-800 text-[11px] mb-1">
                  Équipements de Protection Individuelle (EPI) Réglementaires
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPoste.epiRequis.map((epi, i) => (
                    <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 font-medium">
                      {epi}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-3">
              <Button variant="outline" onClick={() => setIsPosteOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
