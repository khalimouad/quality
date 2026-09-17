"use client"

import { useState } from "react"
import {
  GitMerge,
  Activity,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Download,
  TrendingUp,
  TrendingDown,
  Eye,
  ArrowRight,
  ShieldAlert,
  FileText,
  Users,
  Layers,
  Sparkles,
  Sliders,
  Compass,
} from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { downloadCsv } from "@/lib/csv"

type ProcessType = "Management" | "Réalisation" | "Support"
type ProcessStatut = "À jour" | "En révision" | "Non conforme" | "À créer"

interface Process {
  id: string
  nom: string
  type: ProcessType
  pilote: string
  version: string
  dateRevision: string
  statut: ProcessStatut
  kpis: { label: string; valeur: string; cible: string; tendance: "up" | "down" | "stable" }[]
  description: string
  // Extended fields for Fiche Processus
  finalite: string
  donneesEntree: { element: string; fournisseur: string }[]
  donneesSortie: { element: string; client: string }[]
  ressources: { humaines: string; materielles: string }
  risques: string[]
  documentsApplicables: string[]
}

const processes: Process[] = [
  {
    id: "P-MGT-01",
    nom: "Direction et leadership",
    type: "Management",
    pilote: "Thomas Laurent (DG)",
    version: "3.1",
    dateRevision: "2026-01-15",
    statut: "À jour",
    description: "Revue de direction, politique QHSE, objectifs stratégiques, communication interne et gouvernance.",
    finalite: "Définir la vision, les orientations stratégiques, les objectifs annuels et allouer les ressources requises au bon fonctionnement du SMQ.",
    donneesEntree: [
      { element: "Analyse du contexte (PESTEL / SWOT)", fournisseur: "Direction Générale & Parties prenantes" },
      { element: "Bilan des indicateurs et rapports d'audits", fournisseur: "Responsable Qualité" },
      { element: "Attentes des clients et marchés", fournisseur: "Directrice Commerciale" },
    ],
    donneesSortie: [
      { element: "Politique Qualité & Vision stratégique", client: "Ensemble du personnel & Parties intéressées" },
      { element: "Objectifs annuels déclinés et budgets alloués", client: "Tous les pilotes de processus" },
      { element: "Relevé des décisions de la Revue de Direction", client: "Comité de Direction" },
    ],
    ressources: {
      humaines: "Comité de Direction (DG, DAF, Directeurs opérationnels)",
      materielles: "Salle de réunion de direction, plateforme QHSE, reporting financier",
    },
    risques: [
      "Perte d'alignement stratégique en cas de mutation rapide du marché",
      "Sous-allocation budgétaire sur les investissements de modernisation",
    ],
    documentsApplicables: ["POL-QUA-001 (Politique Qualité)", "MAN-QUA-001 (Manuel de Management)", "RD-2026-S1"],
    kpis: [
      { label: "Taux objectifs stratégiques atteints", valeur: "78%", cible: "85%", tendance: "up" },
      { label: "Revues de direction réalisées", valeur: "2/2", cible: "2/2", tendance: "stable" },
    ],
  },
  {
    id: "P-MGT-02",
    nom: "Amélioration continue & Qualité",
    type: "Management",
    pilote: "Sophie Moreau",
    version: "2.4",
    dateRevision: "2025-12-01",
    statut: "En révision",
    description: "Pilotage des audits internes/externes, gestion des non-conformités, CAPA et pilotage de la maturité QHSE.",
    finalite: "Garantir l'amélioration permanente du SMQ et la réduction continue des écarts et des coûts de non-qualité.",
    donneesEntree: [
      { element: "Déclarations de non-conformités et réclamations", fournisseur: "Ateliers, Contrôle, Clients" },
      { element: "Rapports et constats d'audits", fournisseur: "Auditeurs internes & Organismes tierce-partie" },
    ],
    donneesSortie: [
      { element: "Plans d'actions correctives et préventives (CAPA)", client: "Pilotes concernés" },
      { element: "Tableau de bord de performance et indicateurs", client: "Direction & Pilotes" },
    ],
    ressources: {
      humaines: "Équipe Qualité (2 personnes) + réseau d'auditeurs internes",
      materielles: "Logiciel QHSE, outils d'analyse 5M / 5 Pourquoi / 8D",
    },
    risques: [
      "Clôture tardive des actions correctives",
      "Manque d'implication des opérationnels sur l'analyse causale",
    ],
    documentsApplicables: ["PRO-QUA-005 (Gestion des NC)", "PRO-QUA-008 (Méthodologie 8D et CAPA)"],
    kpis: [
      { label: "NC fermées dans délai", valeur: "82%", cible: "90%", tendance: "up" },
      { label: "CAPA vérifiées efficaces", valeur: "74%", cible: "80%", tendance: "stable" },
    ],
  },
  {
    id: "P-REA-01",
    nom: "Développement produit & Industrialisation",
    type: "Réalisation",
    pilote: "Claire Dubois",
    version: "2.0",
    dateRevision: "2026-02-10",
    statut: "À jour",
    description: "Conception, revues de faisabilité, prototypage, AMDEC produit/procédé et validation des gammes.",
    finalite: "Transformer les besoins clients en produits fabriquables, conformes et fiables dans les délais et coûts cibles.",
    donneesEntree: [
      { element: "Cahier des charges fonctionnel client", fournisseur: "Client / Service Commercial" },
      { element: "Normes techniques et réglementations applicables", fournisseur: "Veille Réglementaire" },
    ],
    donneesSortie: [
      { element: "Dossier de Définition & Plans de fabrication", client: "Atelier de fabrication" },
      { element: "AMDEC Procédé & Plans de contrôle prévisionnels", client: "Contrôle Qualité" },
    ],
    ressources: {
      humaines: "Ingénieurs R&D, dessinateurs-projeteurs CAO",
      materielles: "Stations CAO 3D SolidWorks, imprimante 3D de prototypage, logiciels de simulation",
    },
    risques: [
      "Sous-évaluation du temps de cycle d'usinage",
      "Évolution des spécifications en cours de projet sans avenant",
    ],
    documentsApplicables: ["PRO-RND-001 (Jalons de conception)", "FRM-RND-003 (Revue de conception FAI)"],
    kpis: [
      { label: "Taux projets livrés dans les délais", valeur: "68%", cible: "80%", tendance: "down" },
      { label: "Taux re-travail conception", valeur: "8%", cible: "5%", tendance: "down" },
    ],
  },
  {
    id: "P-REA-02",
    nom: "Production, usinage & fabrication",
    type: "Réalisation",
    pilote: "Antoine Leblanc",
    version: "4.2",
    dateRevision: "2026-01-20",
    statut: "À jour",
    description: "Ordonnancement, usinage CNC, mécano-soudure, assemblage, contrôle en cours et maintenance de premier niveau.",
    finalite: "Fabriquer les produits selon les ordres de fabrication, dans le respect strict de la qualité, des cadences et de la sécurité.",
    donneesEntree: [
      { element: "Ordres de fabrication (OF) et gamme de montage", fournisseur: "Ordonnancement" },
      { element: "Matières premières et composants contrôlés", fournisseur: "Magasin & Contrôle Entrant" },
    ],
    donneesSortie: [
      { element: "Produits semi-finis et finis assemblés", client: "Contrôle Final & Expédition" },
      { element: "Fiches suiveuses et enregistrements de traçabilité", client: "Assurance Qualité" },
    ],
    ressources: {
      humaines: "28 opérateurs d'usinage et soudeurs qualifiés",
      materielles: "5 centres d'usinage 5 axes, 4 postes soudage TIG/MIG, outillages étalonnés",
    },
    risques: [
      "Panne d'une machine CNC goulot",
      "Non-respect des paramètres de soudage entraînant porosités",
    ],
    documentsApplicables: ["PRO-PRD-002 (Consignes de fabrication)", "INS-SOU-012 (Instructions TIG)"],
    kpis: [
      { label: "Taux de rebut atelier", valeur: "1.8%", cible: "1.5%", tendance: "down" },
      { label: "Taux de rendement synthétique (TRS/OEE)", valeur: "72%", cible: "78%", tendance: "up" },
    ],
  },
  {
    id: "P-REA-03",
    nom: "Achats & Approvisionnements",
    type: "Réalisation",
    pilote: "Pierre Bernard",
    version: "2.1",
    dateRevision: "2026-03-05",
    statut: "À jour",
    description: "Sélection des fournisseurs, négociation, émission des commandes, suivi logistique et évaluation des prestataires agréés.",
    finalite: "Garantir l'approvisionnement en matières et prestations conformes, aux meilleurs coûts et dans les délais requis.",
    donneesEntree: [
      { element: "Besoins en composants et demandes d'achats", fournisseur: "Planification / Production" },
      { element: "Résultats d'évaluation et audits fournisseurs", fournisseur: "Qualité Fournisseurs" },
    ],
    donneesSortie: [
      { element: "Bons de commande émis et confirmés", client: "Fournisseurs agréés" },
      { element: "Matières réceptionnées avec certificats matière", client: "Contrôle Réception" },
    ],
    ressources: {
      humaines: "2 acheteurs industriels + 1 gestionnaire approvisionnement",
      materielles: "ERP de gestion commerciale et portail fournisseurs",
    },
    risques: [
      "Rupture d'approvisionnement sur nuances d'acier spéciales",
      "Défaillance financière ou dérive qualité d'un sous-traitant critique",
    ],
    documentsApplicables: ["PRO-ACH-001 (Qualification Fournisseurs)", "PRO-ACH-003 (Critères de sélection)"],
    kpis: [
      { label: "Fournisseurs qualifiés au panel", valeur: "88%", cible: "90%", tendance: "stable" },
      { label: "Taux de service fournisseurs (OTD)", valeur: "91%", cible: "95%", tendance: "up" },
    ],
  },
  {
    id: "P-REA-04",
    nom: "Ventes, logistique & relation client",
    type: "Réalisation",
    pilote: "Isabelle Roy",
    version: "1.8",
    dateRevision: "2026-04-12",
    statut: "À jour",
    description: "Traitement des commandes, revue de contrat, préparation expédition, satisfaction client et traitement des réclamations.",
    finalite: "Assurer la parfaite exécution contractuelle des commandes clients et piloter l'expérience client à chaque étape.",
    donneesEntree: [
      { element: "Appels d'offres et commandes fermes clients", fournisseur: "Clients" },
      { element: "Lots libérés par le contrôle qualité", fournisseur: "Contrôle Final" },
    ],
    donneesSortie: [
      { element: "Produits expédiés avec BL et certificats de conformité", client: "Clients" },
      { element: "Enquêtes de satisfaction et mesure de l'expérience client", client: "Direction Générale" },
    ],
    ressources: {
      humaines: "Équipe ADV (3 personnes) + Magasiniers expédition",
      materielles: "Quai de chargement, progiciel de traçabilité colis, transporteurs express agréés",
    },
    risques: [
      "Erreur d'étiquetage ou de destination lors de l'expédition",
      "Retard de livraison dû à un transporteur défaillant",
    ],
    documentsApplicables: ["PRO-EXP-001 (Procédure de conditionnement)", "PRO-REC-001 (Traitement réclamation)"],
    kpis: [
      { label: "Taux de service client (OTIF)", valeur: "96.4%", cible: "98.0%", tendance: "stable" },
      { label: "Score moyen de satisfaction (CSAT)", valeur: "7.8/10", cible: "8.0/10", tendance: "up" },
    ],
  },
  {
    id: "P-SUP-01",
    nom: "Ressources Humaines & Compétences",
    type: "Support",
    pilote: "Sophie Moreau",
    version: "2.7",
    dateRevision: "2026-02-28",
    statut: "À jour",
    description: "Recrutement, fiches de poste, matrice des compétences, plan de formation, entretiens annuels et gestion prévisionnelle des emplois.",
    finalite: "Mettre à disposition les compétences requises, assurer l'adéquation postes/profils et développer l'engagement des équipes.",
    donneesEntree: [
      { element: "Besoins en compétences et habilitations réglementaires", fournisseur: "Tous les services" },
      { element: "Entretiens professionnels annuels", fournisseur: "Managers" },
    ],
    donneesSortie: [
      { element: "Plan de formation validé et exécuté", client: "Collaborateurs" },
      { element: "Matrice de polyvalence et fiches de poste à jour", client: "Encadrement & Auditeurs" },
    ],
    ressources: {
      humaines: "Responsable RH + Chargée de formation",
      materielles: "SIRH, plateformes e-learning, organismes de formation habilités (CARSAT, APAVE)",
    },
    risques: [
      "Perte de savoir-faire critique lors du départ de spécialistes sans tutorat",
      "Échéance dépassée sur habilitations réglementaires (CACES, Élec)",
    ],
    documentsApplicables: ["PRO-RH-002 (Intégration nouveaux arrivants)", "FRM-RH-005 (Fiche de poste type)"],
    kpis: [
      { label: "Plan de formation réalisé", valeur: "87%", cible: "90%", tendance: "up" },
      { label: "Taux de polyvalence postes critiques", valeur: "78%", cible: "85%", tendance: "up" },
    ],
  },
  {
    id: "P-SUP-02",
    nom: "Système d'Information & Cybersécurité",
    type: "Support",
    pilote: "Thomas Bernard",
    version: "1.5",
    dateRevision: "2026-01-10",
    statut: "À jour",
    description: "Disponibilité des infrastructures IT et industrielles, sauvegardes, intégrité des données et sécurité du SI.",
    finalite: "Fournir des outils numériques fiables, continus et sécurisés répondant aux besoins opérationnels et aux exigences de cybersécurité.",
    donneesEntree: [
      { element: "Demandes d'évolution logicielle et tickets support", fournisseur: "Utilisateurs internes" },
      { element: "Veille vulnérabilités et exigences ISO 27001", fournisseur: "ANSSI & Équipe Cybersécurité" },
    ],
    donneesSortie: [
      { element: "Disponibilité continue du SI et de l'ERP", client: "Ensemble de l'entreprise" },
      { element: "Sauvegardes testées et plan de reprise d'activité (PRA)", client: "Direction Générale" },
    ],
    ressources: {
      humaines: "Administrateur systèmes & réseaux + prestataire sécurité externalisé",
      materielles: "Serveurs virtualisés, pare-feu nouvelle génération, sauvegardes immuables",
    },
    risques: [
      "Attaque par rançongiciel paralysant la production",
      "Fuite de données confidentielles plans clients aéronautiques",
    ],
    documentsApplicables: ["POL-SSI-001 (Politique Sécurité SI)", "PRO-SI-004 (Procédure de sauvegarde)"],
    kpis: [
      { label: "Disponibilité des systèmes", valeur: "99.4%", cible: "99.5%", tendance: "stable" },
      { label: "Délai moyen de résolution tickets", valeur: "2.1 h", cible: "3.0 h", tendance: "up" },
    ],
  },
  {
    id: "P-SUP-03",
    nom: "Maintenance & Métrologie des équipements",
    type: "Support",
    pilote: "Marc Durand",
    version: "3.0",
    dateRevision: "2026-03-20",
    statut: "À jour",
    description: "Maintenance préventive et corrective du parc machines, étalonnage périodique des instruments de mesure et gestion des pièces de rechange.",
    finalite: "Garantir la fiabilité des outils de production et la conformité métrologique méticuleuse de tous les moyens de contrôle.",
    donneesEntree: [
      { element: "Plan de maintenance constructeur et alertes pannes", fournisseur: "Atelier de fabrication" },
      { element: "Planning annuel d'étalonnage métrologique", fournisseur: "Responsable Qualité" },
    ],
    donneesSortie: [
      { element: "Machines disponibles et sécurisées", client: "Production" },
      { element: "Certificats d'étalonnage et instruments étiquetés conformes", client: "Contrôleurs qualité" },
    ],
    ressources: {
      humaines: "4 techniciens de maintenance polyvalents (mécanique, électricité, hydraulique)",
      materielles: "Logiciel GMAO, marbre de métrologie, cales étalons raccordées COFRAC",
    },
    risques: [
      "Utilisation d'un instrument de mesure hors étalonnage",
      "Rupture de stock sur pièce d'usure critique d'une machine goulot",
    ],
    documentsApplicables: ["PRO-MNT-001 (Plan préventif GMAO)", "INS-MET-003 (Raccordement des étalons)"],
    kpis: [
      { label: "Temps moyen entre pannes (MTBF)", valeur: "1200 h", cible: "1500 h", tendance: "up" },
      { label: "Instruments étalonnés à jour", valeur: "98%", cible: "100%", tendance: "stable" },
    ],
  },
]

const TYPE_COLORS: Record<ProcessType, { bg: string; text: string; border: string; dot: string }> = {
  Management: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  Réalisation: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  Support: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-500" },
}

const STATUT_COLORS: Record<ProcessStatut, string> = {
  "À jour": "bg-green-100 text-green-700",
  "En révision": "bg-amber-100 text-amber-700",
  "Non conforme": "bg-red-100 text-red-700",
  "À créer": "bg-gray-100 text-gray-600",
}

export default function ProcessesPage() {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [isFicheOpen, setIsFicheOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "macro">("cards")

  const aJour = processes.filter((p) => p.statut === "À jour").length
  const enRevision = processes.filter((p) => p.statut === "En révision").length
  const nonConformes = processes.filter((p) => p.statut === "Non conforme").length

  const byType = {
    Management: processes.filter((p) => p.type === "Management"),
    Réalisation: processes.filter((p) => p.type === "Réalisation"),
    Support: processes.filter((p) => p.type === "Support"),
  }

  const handleOpenFiche = (p: Process) => {
    setSelectedProcess(p)
    setIsFicheOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cartographie & Fiches Processus"
        description="Pilier 1 · Contexte & Stratégie — Visualisation macro de l'organisation et fiches d'identité des processus ISO 9001"
        icon={GitMerge}
      >
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border bg-gray-100 p-0.5">
            <button
              onClick={() => setViewMode("cards")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                viewMode === "cards" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Vue Cartes
            </button>
            <button
              onClick={() => setViewMode("macro")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                viewMode === "macro" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cartographie Macro (Flux)
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadCsv(
                "processus_smq.csv",
                ["Réf", "Nom", "Type", "Pilote", "Version", "Date révision", "Statut"],
                processes.map((p) => [p.id, p.nom, p.type, p.pilote, p.version, p.dateRevision, p.statut])
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Processus cartographiés" value={processes.length} icon={Activity} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="À jour & Validés" value={aJour} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="En cours de révision" value={enRevision} icon={RefreshCw} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Non conformes" value={nonConformes} icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" />
      </div>

      {/* View Mode: Macro Flow Diagram */}
      {viewMode === "macro" && (
        <Card className="border-2 border-indigo-100 bg-gradient-to-br from-slate-50 to-blue-50/40 p-6">
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Cartographie Macro des Processus de l&apos;Entreprise
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Modèle d&apos;Interaction Processus ISO 9001:2015</h3>
              <p className="text-xs text-gray-500 max-w-2xl mx-auto mt-1">
                La cartographie met en évidence les flux d&apos;informations et de matières, depuis l&apos;écoute des attentes clients jusqu&apos;à la satisfaction finale.
              </p>
            </div>

            {/* Management Box */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-3 w-3 rounded-full bg-purple-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900">
                  Processus de Management & Direction (Gouvernance & Stratégie)
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {byType.Management.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleOpenFiche(p)}
                    className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-purple-100 hover:border-purple-300 cursor-pointer transition-all"
                  >
                    <div>
                      <span className="font-mono text-[11px] text-purple-700 font-bold">{p.id}</span>
                      <p className="font-semibold text-xs text-gray-900">{p.nom}</p>
                      <p className="text-[11px] text-gray-500">{p.pilote}</p>
                    </div>
                    <Eye className="h-4 w-4 text-purple-400 hover:text-purple-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Réalisation Flow Box with input and output arrows */}
            <div className="relative rounded-xl border-2 border-blue-300 bg-blue-50/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-blue-900">
                  Processus de Réalisation (Cœur de Métier / Chaîne de Valeur Client)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {byType.Réalisation.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => handleOpenFiche(p)}
                    className="relative flex flex-col justify-between rounded-lg bg-white p-3 shadow-sm border border-blue-100 hover:border-blue-400 cursor-pointer transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-blue-700 font-bold">{p.id}</span>
                        <span className="text-[10px] font-semibold text-gray-400">Étape {idx + 1}</span>
                      </div>
                      <p className="font-semibold text-xs text-gray-900 mt-1">{p.nom}</p>
                      <p className="text-[11px] text-gray-500">{p.pilote}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-blue-600 font-medium">
                      <span>Fiche processus</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Box */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-3 w-3 rounded-full bg-teal-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-teal-900">
                  Processus Support (Ressources, SI, Maintenance, Métrologie)
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {byType.Support.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleOpenFiche(p)}
                    className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-teal-100 hover:border-teal-300 cursor-pointer transition-all"
                  >
                    <div>
                      <span className="font-mono text-[11px] text-teal-700 font-bold">{p.id}</span>
                      <p className="font-semibold text-xs text-gray-900">{p.nom}</p>
                      <p className="text-[11px] text-gray-500">{p.pilote}</p>
                    </div>
                    <Eye className="h-4 w-4 text-teal-400 hover:text-teal-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* View Mode: Interactive Cards by Category */}
      {viewMode === "cards" && (
        <div className="space-y-6">
          {(["Management", "Réalisation", "Support"] as ProcessType[]).map((type) => {
            const c = TYPE_COLORS[type]
            return (
              <div key={type}>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                  Processus de {type} ({byType[type].length})
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {byType[type].map((p) => (
                    <Card
                      key={p.id}
                      className={`border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                        p.statut === "Non conforme"
                          ? "border-red-300"
                          : p.statut === "En révision"
                          ? "border-amber-300"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleOpenFiche(p)}
                    >
                      <div className={`h-1 ${c.dot}`} />
                      <CardHeader className="pb-2 pt-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-gray-500">{p.id}</span>
                              <CardTitle className="text-sm font-semibold">{p.nom}</CardTitle>
                            </div>
                            <CardDescription className="text-xs mt-0.5">
                              Pilote : {p.pilote} · v{p.version} · {p.dateRevision}
                            </CardDescription>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium shrink-0 ${STATUT_COLORS[p.statut]}`}
                          >
                            {p.statut}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-1.5 border-t border-gray-100 pt-2">
                          {p.kpis.map((kpi) => (
                            <div key={kpi.label} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate pr-2">{kpi.label}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                {kpi.tendance === "up" ? (
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : kpi.tendance === "down" ? (
                                  <TrendingDown className="h-3 w-3 text-red-500" />
                                ) : null}
                                <span className="font-semibold text-gray-800">{kpi.valeur}</span>
                                <span className="text-gray-400">/ {kpi.cible}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-blue-600 font-semibold pt-1">
                          <span>Ouvrir la Fiche Processus</span>
                          <Eye className="h-3.5 w-3.5" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Fiche Processus Détaillée Modal */}
      {selectedProcess && (
        <Dialog open={isFicheOpen} onOpenChange={setIsFicheOpen}>
          <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
            <DialogHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs font-bold text-blue-700">
                    {selectedProcess.id}
                  </Badge>
                  <span className="text-xs text-gray-500">v{selectedProcess.version} · Révisé le {selectedProcess.dateRevision}</span>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUT_COLORS[selectedProcess.statut]}`}>
                  {selectedProcess.statut}
                </span>
              </div>
              <DialogTitle className="text-lg font-bold mt-1.5">Fiche Processus : {selectedProcess.nom}</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Type : Processus de {selectedProcess.type} · Pilote désigné :{" "}
                <span className="font-semibold text-gray-800">{selectedProcess.pilote}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs leading-relaxed text-gray-800">
              {/* Finalité */}
              <div className="rounded-lg bg-blue-50/70 p-3 border border-blue-100">
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                  Finalité & Mission du Processus
                </h4>
                <p className="mt-1 text-blue-950">{selectedProcess.finalite}</p>
              </div>

              {/* Inputs & Outputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-3">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 text-indigo-700">
                    <ArrowRight className="h-3.5 w-3.5" /> Données d&apos;Entrée (Inputs)
                  </h4>
                  <div className="space-y-2">
                    {selectedProcess.donneesEntree.map((item, i) => (
                      <div key={i} className="rounded bg-gray-50 p-2 border border-gray-100">
                        <p className="font-medium text-gray-900">{item.element}</p>
                        <p className="text-[11px] text-gray-500">Fournisseur : {item.fournisseur}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-3">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 text-emerald-700">
                    <ArrowRight className="h-3.5 w-3.5" /> Données de Sortie (Outputs)
                  </h4>
                  <div className="space-y-2">
                    {selectedProcess.donneesSortie.map((item, i) => (
                      <div key={i} className="rounded bg-gray-50 p-2 border border-gray-100">
                        <p className="font-medium text-gray-900">{item.element}</p>
                        <p className="text-[11px] text-gray-500">Bénéficiaire / Client : {item.client}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPIs Table */}
              <div className="rounded-lg border border-gray-200 p-3">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5 text-blue-700">
                  <Activity className="h-3.5 w-3.5" /> Indicateurs de Performance (KPI)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProcess.kpis.map((kpi, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 border">
                      <span className="font-medium text-gray-700">{kpi.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-sm">{kpi.valeur}</span>
                        <span className="text-gray-400">/ {kpi.cible}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ressources */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-gray-50/60 p-3">
                <div>
                  <h5 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Ressources Humaines</h5>
                  <p className="mt-1 text-gray-800">{selectedProcess.ressources.humaines}</p>
                </div>
                <div>
                  <h5 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Ressources Matérielles / SI</h5>
                  <p className="mt-1 text-gray-800">{selectedProcess.ressources.materielles}</p>
                </div>
              </div>

              {/* Risques & Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-red-200 bg-red-50/40 p-3">
                  <h4 className="font-bold text-red-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-red-600" /> Risques Majeurs Identifiés (AMDEC)
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-red-950">
                    {selectedProcess.risques.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3">
                  <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-600" /> Documents de Référence Applicables
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-blue-950">
                    {selectedProcess.documentsApplicables.map((d, i) => (
                      <li key={i} className="font-mono text-[11px]">{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-3">
              <Button variant="outline" onClick={() => setIsFicheOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
