"use client"

import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  FileText,
  Clock,
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CalendarClock,
  Truck,
  MessageSquareWarning,
  ChevronRight,
  Compass,
  Scale,
  FileCheck2,
  Briefcase,
  Sliders,
  GitMerge,
  Award,
  Layers,
  Sparkles,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"

const ncTrendData = [
  { month: "Jan", ouvertes: 4, fermées: 2 },
  { month: "Fév", ouvertes: 6, fermées: 4 },
  { month: "Mar", ouvertes: 3, fermées: 5 },
  { month: "Avr", ouvertes: 8, fermées: 3 },
  { month: "Mai", ouvertes: 5, fermées: 7 },
  { month: "Jun", ouvertes: 7, fermées: 5 },
]

const capaStatusData = [
  { name: "Ouvertes", value: 8, color: "#3b82f6" },
  { name: "En cours", value: 12, color: "#f59e0b" },
  { name: "Vérifiées", value: 5, color: "#8b5cf6" },
  { name: "Fermées", value: 23, color: "#10b981" },
]

const complianceData = [
  { name: "Conformité", value: 92, fill: "#10b981" },
]

const auditByType = [
  { type: "Interne", count: 8 },
  { type: "Externe", count: 4 },
  { type: "Fournisseur", count: 5 },
]

const objectivesData = [
  { label: "Taux de conformité", value: 92, target: 95, color: "bg-green-500" },
  { label: "NC clôturées dans les délais", value: 78, target: 85, color: "bg-amber-500" },
  { label: "Actions CAPA réalisées", value: 84, target: 80, color: "bg-blue-500" },
  { label: "Audits planifiés réalisés", value: 67, target: 90, color: "bg-red-500" },
]

const certifications = [
  { name: "ISO 9001", label: "Qualité", status: "valid", expiry: new Date("2026-11-15") },
  { name: "ISO 14001", label: "Environnement", status: "valid", expiry: new Date("2026-09-20") },
  { name: "ISO 45001", label: "Santé & Sécurité", status: "soon", expiry: new Date("2026-07-30") },
]

const overdueItems = [
  { type: "NC",    ref: "NC-2026-020",    title: "Matière première hors spécifications",    due: "il y a 3 jours", href: "/non-conformances", color: "bg-red-100 text-red-600"    },
  { type: "CAPA",  ref: "CAPA-2026-011",  title: "Mise à jour étiquetage produits finis",   due: "il y a 1 jour",  href: "/capa",             color: "bg-amber-100 text-amber-600" },
  { type: "Audit", ref: "AUD-2026-012",   title: "Audit interne ISO 9001 — Production",     due: "demain",         href: "/audits",           color: "bg-blue-100 text-blue-600"   },
  { type: "Doc",   ref: "PRO-ENV-005",    title: "Révision procédure gestion des déchets",  due: "dans 5 jours",   href: "/documents",        color: "bg-purple-100 text-purple-600"},
]

const recentActivities = [
  { id: 1, type: "nc",       href: "/non-conformances", title: "NC-2026-023 créée",              description: "Non-conformité sur le processus de soudage",         time: "Il y a 2 heures", user: "Jean Dupont",   color: "bg-red-100 text-red-600"     },
  { id: 2, type: "capa",     href: "/capa",             title: "CAPA-2026-015 mise à jour",      description: "Action corrective vérifiée et fermée",              time: "Il y a 4 heures", user: "Marie Martin",  color: "bg-green-100 text-green-600" },
  { id: 3, type: "document", href: "/documents",        title: "DOC-PRO-012 approuvé",           description: "Procédure de contrôle qualité v2.1",                time: "Hier",            user: "Pierre Bernard",color: "bg-blue-100 text-blue-600"   },
  { id: 4, type: "audit",    href: "/audits",           title: "Audit planifié",                 description: "Audit interne ISO 9001 — Département Production",   time: "Hier",            user: "Sophie Moreau", color: "bg-purple-100 text-purple-600"},
  { id: 5, type: "complaint",href: "/complaints",       title: "Réclamation REC-2026-008 résolue",description: "Réclamation client traitée et clôturée",           time: "Il y a 2 jours",  user: "Luc Petit",     color: "bg-orange-100 text-orange-600"},
]

const activityIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  nc: AlertTriangle,
  capa: CheckSquare,
  document: FileText,
  audit: ClipboardList,
  complaint: MessageSquareWarning,
}

const pdcaPillars = [
  {
    num: "1",
    phase: "Contexte & Stratégie",
    subtitle: "L'ancrage du système",
    href: "/processes",
    icon: Compass,
    color: "from-purple-600 to-indigo-600",
    badge: "9 Processus actifs",
    badgeColor: "bg-purple-100 text-purple-800",
    stats: "AMDEC · SWOT/PESTEL · Vision",
    links: [
      { label: "Cartographie", href: "/processes" },
      { label: "Risques AMDEC", href: "/risks" },
      { label: "Contexte", href: "/context" },
    ],
  },
  {
    num: "2",
    phase: "Planifier (PLAN)",
    subtitle: "L'organisation en amont",
    href: "/compliance",
    icon: ClipboardList,
    color: "from-blue-600 to-cyan-600",
    badge: "92% Conforme",
    badgeColor: "bg-blue-100 text-blue-800",
    stats: "GED · Compétences · Veille",
    links: [
      { label: "GED", href: "/documents" },
      { label: "Conformité", href: "/compliance" },
      { label: "Compétences", href: "/skills" },
    ],
  },
  {
    num: "3",
    phase: "Réaliser (DO)",
    subtitle: "Le quotidien opérationnel",
    href: "/control-plans",
    icon: CheckSquare,
    color: "from-emerald-600 to-teal-600",
    badge: "100% Acceptation PV",
    badgeColor: "bg-emerald-100 text-emerald-800",
    stats: "Plans de contrôle · Fournisseurs",
    links: [
      { label: "Contrôles", href: "/control-plans" },
      { label: "Fournisseurs", href: "/suppliers" },
      { label: "Réclamations", href: "/complaints" },
    ],
  },
  {
    num: "4",
    phase: "Contrôler (CHECK)",
    subtitle: "La détection des écarts",
    href: "/non-conformances",
    icon: Activity,
    color: "from-amber-500 to-orange-600",
    badge: "14 NC ouvertes",
    badgeColor: "bg-amber-100 text-amber-800",
    stats: "Anomalies · Audits · Indicateurs",
    links: [
      { label: "Non-conformités", href: "/non-conformances" },
      { label: "Audits", href: "/audits" },
      { label: "KPIs", href: "/indicators" },
    ],
  },
  {
    num: "5",
    phase: "Améliorer (ACT)",
    subtitle: "L'amélioration continue",
    href: "/management-reviews",
    icon: TrendingUp,
    color: "from-rose-600 to-pink-600",
    badge: "Revue S1 validée",
    badgeColor: "bg-rose-100 text-rose-800",
    stats: "CAPA 8D · Revues de Direction",
    links: [
      { label: "Revues Direction", href: "/management-reviews" },
      { label: "CAPA", href: "/capa" },
      { label: "Plan d'actions", href: "/action-plan" },
    ],
  },
  {
    num: "6",
    phase: "Configuration & Admin",
    subtitle: "Gouvernance & Sécurité",
    href: "/settings",
    icon: Sliders,
    color: "from-slate-700 to-gray-800",
    badge: "6 Profils RBAC",
    badgeColor: "bg-slate-100 text-slate-800",
    stats: "Rôles · Workflows · Alertes",
    links: [
      { label: "Paramètres", href: "/settings" },
      { label: "Profils RBAC", href: "/settings" },
      { label: "Workflows", href: "/settings" },
    ],
  },
]

export default function DashboardPage() {
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })

  return (
    <div className="space-y-6">
      {/* Greeting banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/30 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-100 border border-blue-400/30">
                {today}
              </span>
              <span className="rounded-full bg-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-200 border border-emerald-400/30">
                Système certifié ISO 9001 / 14001 / 45001
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">QualiSafe Management Suite</h2>
            <p className="mt-1 text-sm text-blue-100/90 max-w-2xl">
              Pilotage unifié du Système de Management de la Qualité, Sécurité et Environnement structuré selon le cycle d&apos;amélioration continue PDCA.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/management-reviews">
              <button className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 border border-white/20">
                <Briefcase className="h-4 w-4" />
                Revue de Direction
              </button>
            </Link>
            <Link href="/control-plans">
              <button className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-blue-900 shadow-sm transition-colors hover:bg-blue-50">
                <FileCheck2 className="h-4 w-4 text-blue-700" />
                Plans de Contrôle
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── COCKPIT INTERACTIF PDCA (6 PILIERS QUALITÉ) ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-xs">
              ∞
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
              Cockpit Décisionnel · Les 6 Piliers Qualité (Cycle Deming PDCA)
            </h3>
          </div>
          <span className="text-xs text-gray-400">Navigation directe par pilier normatif</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {pdcaPillars.map((p) => {
            const Icon = p.icon
            return (
              <Card
                key={p.num}
                className="group relative flex flex-col justify-between overflow-hidden border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-400"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${p.color}`} />
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
                        {p.num}
                      </span>
                      <Icon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>

                    <Link href={p.href} className="block mt-2">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {p.phase}
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate">{p.subtitle}</p>
                    </Link>

                    <span className={`inline-block mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                    <p className="mt-1 text-[11px] text-gray-500 font-medium truncate">{p.stats}</p>
                  </div>

                  <div className="border-t border-gray-100 pt-2 flex flex-wrap gap-1">
                    {p.links.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                        className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {link.label}
                        {idx < p.links.length - 1 ? " · " : ""}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/non-conformances">
          <StatCard title="Non-Conformités ouvertes" value={14} icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" change="+3 ce mois" trend="up" />
        </Link>
        <Link href="/capa">
          <StatCard title="Actions CAPA en cours" value={20} icon={CheckSquare} iconColor="text-amber-600" iconBg="bg-amber-50" change="-2 ce mois" trend="down" />
        </Link>
        <Link href="/compliance">
          <StatCard title="Conformité Réglementaire" value="92%" icon={Scale} iconColor="text-emerald-600" iconBg="bg-emerald-50" hint="9 exigences suivies" />
        </Link>
        <Link href="/control-plans">
          <StatCard title="Contrôles Qualité / PV" value={24} icon={FileCheck2} iconColor="text-blue-600" iconBg="bg-blue-50" change="100% acceptés ce mois" />
        </Link>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tendance des Non-Conformités</CardTitle>
            <CardDescription>Évolution des NC ouvertes vs fermées (6 derniers mois)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={ncTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorOuvertes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFermees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="ouvertes" stroke="#ef4444" fill="url(#colorOuvertes)" name="Ouvertes" strokeWidth={2} />
                <Area type="monotone" dataKey="fermées" stroke="#10b981" fill="url(#colorFermees)" name="Fermées" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">CAPA par Statut</CardTitle>
            <CardDescription>Répartition des actions d&apos;amélioration continue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={capaStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {capaStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} CAPA`, ""]} />
                <Legend formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: compliance gauge + audits + objectives */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Taux de conformité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={complianceData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="-mt-24 text-center text-3xl font-bold text-gray-900">92%</p>
            <p className="mt-16 text-center text-xs text-gray-500">Objectif : 95%</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Audits par type</CardTitle>
            <CardDescription>Année en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={auditByType} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Audits" barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Objectifs qualité & SMQ</CardTitle>
            <CardDescription>Réalisé vs cible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {objectivesData.map((obj) => (
              <div key={obj.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-700">{obj.label}</span>
                  <span className="font-medium text-gray-900">
                    {obj.value}% <span className="text-xs text-gray-400">/ {obj.target}%</span>
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${obj.color}`} style={{ width: `${obj.value}%` }} />
                  <div className="absolute top-0 h-2 w-px bg-gray-700" style={{ left: `${obj.target}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: overdue + certifications + activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Overdue / action required */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CalendarClock className="h-4 w-4 text-red-600" />
              Actions requises
            </CardTitle>
            <Link href="/action-plan" className="text-xs font-medium text-blue-600 hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueItems.map((item) => (
              <Link key={item.ref} href={item.href} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5 transition-colors hover:bg-gray-50">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${item.color}`}>
                  {item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="font-mono text-xs text-gray-400">{item.ref}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-red-500">{item.due}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Certifications ISO
            </CardTitle>
            <CardDescription>Statut de surveillance des audits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{cert.name}</p>
                    <p className="text-xs text-gray-500">{cert.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={cert.status === "valid" ? "success" : "warning"}>
                    {cert.status === "valid" ? "Valide" : "Échéance proche"}
                  </Badge>
                  <p className="mt-1 text-xs text-gray-400">
                    {format(cert.expiry, "dd MMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-4 w-4 text-blue-600" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activityIcon[activity.type] ?? Activity
                return (
                  <Link key={activity.id} href={activity.href} className="flex items-start gap-3 rounded-lg p-1.5 -mx-1.5 hover:bg-gray-50 transition-colors">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="truncate text-sm text-gray-500">{activity.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{activity.time}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 mt-2.5" />
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {[
          { label: "Plans de Contrôle", href: "/control-plans", icon: FileCheck2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Revues Direction", href: "/management-reviews", icon: Briefcase, color: "text-rose-600 bg-rose-50" },
          { label: "Conformité Légale", href: "/compliance", icon: Scale, color: "text-indigo-600 bg-indigo-50" },
          { label: "Processus SMQ", href: "/processes", icon: GitMerge, color: "text-purple-600 bg-purple-50" },
          { label: "Matrice Compétences", href: "/skills", icon: Award, color: "text-blue-600 bg-blue-50" },
          { label: "Non-Conformités", href: "/non-conformances", icon: AlertTriangle, color: "text-red-600 bg-red-50" },
          { label: "Plans CAPA", href: "/capa", icon: CheckSquare, color: "text-amber-600 bg-amber-50" },
          { label: "Audits ISO", href: "/audits", icon: ClipboardList, color: "text-teal-600 bg-teal-50" },
        ].map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.label} href={link.href}>
              <Card className="transition-all hover:shadow-md hover:border-blue-400">
                <CardContent className="flex flex-col items-center gap-2 p-3 text-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${link.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 line-clamp-1">{link.label}</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
