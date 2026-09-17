import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  ShieldAlert,
  BarChart2,
  ListTodo,
  MessageSquareWarning,
  Truck,
  GraduationCap,
  TrendingUp,
  Wrench,
  Wand2,
  User,
  Settings,
  Gauge,
  HardHat,
  Leaf,
  Users,
  GitMerge,
  Compass,
  ShieldCheck,
  FlaskConical,
  AlertCircle,
  BellRing,
  MapPin,
  Trash2,
  Map,
  Award,
  Users2,
  ClipboardCheck,
  BookOpen,
  Star,
  Globe,
  UtensilsCrossed,
  Scale,
  Brain,
  LifeBuoy,
  Briefcase,
  Sliders,
  CheckCircle,
  ArrowRightCircle,
  FileCheck2,
} from "lucide-react"

export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export interface NavGroup {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  // ── 1. Contexte & Stratégie ──
  {
    title: "1. Stratégie & Contexte",
    subtitle: "L'ancrage du système : cartographie processus, politique & risques",
    icon: Compass,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    items: [
      { name: "Cartographie des processus", href: "/processes", icon: GitMerge },
      { name: "Politique, vision & KPI", href: "/indicators", icon: BarChart2 },
      { name: "Contexte, PESTEL & SWOT", href: "/context", icon: Compass },
      { name: "Gestion des risques & AMDEC", href: "/risks", icon: ShieldAlert },
    ],
  },

  // ── 2. Planifier (PLAN) ──
  {
    title: "2. Planifier (PLAN)",
    subtitle: "L'organisation en amont : GED, compétences et conformité",
    icon: ClipboardList,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    items: [
      { name: "Gestion documentaire (GED)", href: "/documents", icon: FileText },
      { name: "Générer un document IA", href: "/documents/generate", icon: Wand2 },
      { name: "Matrice de compétences & Postes", href: "/skills", icon: Award },
      { name: "Plan de formation", href: "/training", icon: GraduationCap },
      { name: "Exigences & Conformité légale", href: "/compliance", icon: Scale },
    ],
  },

  // ── 3. Réaliser & Mesurer (DO) ──
  {
    title: "3. Réaliser (DO)",
    subtitle: "Le quotidien opérationnel : contrôles, fournisseurs et clients",
    icon: CheckSquare,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    items: [
      { name: "Plans de contrôle qualité", href: "/control-plans", icon: FileCheck2 },
      { name: "Évaluation fournisseurs", href: "/suppliers", icon: Truck },
      { name: "Réclamations clients", href: "/complaints", icon: MessageSquareWarning },
      { name: "Expérience client (CX)", href: "/cx", icon: Star },
      { name: "Équipements & métrologie", href: "/equipment", icon: Wrench },
    ],
  },

  // ── 4. Contrôler (CHECK) ──
  {
    title: "4. Contrôler (CHECK)",
    subtitle: "La détection des écarts : non-conformités, audits et indicateurs",
    icon: Gauge,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    items: [
      { name: "Tableau de bord QHSE", href: "/", icon: LayoutDashboard },
      { name: "Non-conformités", href: "/non-conformances", icon: AlertTriangle },
      { name: "Audits internes & externes", href: "/audits", icon: ClipboardCheck },
      { name: "Indicateurs & Tableaux de bord", href: "/indicators", icon: BarChart2 },
    ],
  },

  // ── 5. Améliorer (ACT) ──
  {
    title: "5. Améliorer (ACT)",
    subtitle: "La boucle d'amélioration continue : CAPA et revues de direction",
    icon: TrendingUp,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
    items: [
      { name: "Plans d'actions (CAPA)", href: "/capa", icon: CheckSquare },
      { name: "Plan d'actions global", href: "/action-plan", icon: ListTodo },
      { name: "Revues de direction ISO 9001", href: "/management-reviews", icon: Briefcase },
    ],
  },

  // ── 6. Configuration & Administration ──
  {
    title: "6. Administration",
    subtitle: "Rôles RBAC, workflows de validation et circuits",
    icon: Settings,
    iconColor: "text-slate-600",
    iconBg: "bg-slate-50",
    items: [
      { name: "Paramètres & Workflows", href: "/settings", icon: Settings },
      { name: "Utilisateurs & Profils", href: "/settings", icon: Users },
      { name: "Mon profil", href: "/profile", icon: User },
    ],
  },

  // ── Modules Spécialisés QHSE & HSE ──
  {
    title: "Sécurité & HSE",
    subtitle: "Document unique, visites sécurité et urgences",
    icon: HardHat,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    items: [
      { name: "Document unique (DUERP)", href: "/document-unique", icon: ShieldCheck },
      { name: "Risques chimiques", href: "/chemical-risks", icon: FlaskConical },
      { name: "Accidents et incidents", href: "/incidents", icon: AlertCircle },
      { name: "Visites sécurité terrain", href: "/safety-visits", icon: MapPin },
      { name: "Plan de prévention", href: "/prevention-plan", icon: ShieldCheck },
      { name: "Tests d'urgence", href: "/emergency-tests", icon: BellRing },
    ],
  },
  {
    title: "Environnement & RSE",
    subtitle: "Impacts, déchets et stratégie ESG",
    icon: Leaf,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    items: [
      { name: "Impacts environnementaux", href: "/env-impacts", icon: Leaf },
      { name: "Gestion des déchets", href: "/waste", icon: Trash2 },
      { name: "Visites environnement", href: "/env-visits", icon: Map },
      { name: "Stratégie ESG / CSRD", href: "/esg", icon: Globe },
      { name: "Hub Diagnostics HLS", href: "/diagnostics", icon: ClipboardCheck },
      { name: "Accompagnant Qualité ISO", href: "/accompagnement", icon: LifeBuoy },
    ],
  },
]

export function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  if (href === "/documents/generate") return pathname === "/documents/generate"
  if (href === "/documents") return pathname.startsWith("/documents") && pathname !== "/documents/generate"
  return pathname.startsWith(href)
}

export function isGroupActive(pathname: string, group: NavGroup): boolean {
  return group.items.some((item) => isItemActive(pathname, item.href))
}
