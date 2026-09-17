"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ListTodo,
  Eye,
  Download,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  MessageSquareWarning,
  ShieldAlert,
  Lightbulb,
  AlarmClock,
  Clock,
  CircleDot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"

type Origin = "CAPA" | "Audit" | "NC" | "Réclamation" | "Risque" | "Amélioration"
type Priority = "high" | "medium" | "low"
type ActionStatus = "todo" | "in_progress" | "done" | "overdue"

interface Action {
  id: string
  reference: string
  title: string
  origin: Origin
  priority: Priority
  status: ActionStatus
  assignedTo: string
  dueDate: Date
  progress: number
}

const today = new Date()

const mockActions: Action[] = [
  { id: "1",  reference: "CAPA-2026-018", title: "Révision des paramètres de soudage TIG",         origin: "CAPA",        priority: "high",   status: "in_progress", assignedTo: "Jean Dupont",    dueDate: new Date("2026-07-15"), progress: 60 },
  { id: "2",  reference: "AUD-2026-010",  title: "Mise à jour du plan de formation HSE",            origin: "Audit",       priority: "high",   status: "overdue",     assignedTo: "Sophie Moreau",  dueDate: new Date("2026-05-20"), progress: 30 },
  { id: "3",  reference: "NC-2026-023",   title: "Correction du défaut soudage pièce P-456",        origin: "NC",          priority: "high",   status: "todo",        assignedTo: "Jean Dupont",    dueDate: new Date("2026-07-01"), progress: 0  },
  { id: "4",  reference: "REC-2026-003",  title: "Traitement défaut critique lot expédié",          origin: "Réclamation", priority: "high",   status: "in_progress", assignedTo: "Marie Martin",   dueDate: new Date("2026-06-09"), progress: 45 },
  { id: "5",  reference: "R-2026-039",    title: "Renforcement pare-feu et sauvegardes SI",         origin: "Risque",      priority: "high",   status: "in_progress", assignedTo: "Marc Leroy",     dueDate: new Date("2026-08-01"), progress: 20 },
  { id: "6",  reference: "AME-2026-004",  title: "Digitalisation fiches de contrôle production",   origin: "Amélioration",priority: "medium", status: "todo",        assignedTo: "Pierre Bernard", dueDate: new Date("2026-09-30"), progress: 0  },
  { id: "7",  reference: "CAPA-2026-016", title: "Mise en place maintenance préventive équipements",origin: "CAPA",        priority: "medium", status: "in_progress", assignedTo: "Pierre Bernard", dueDate: new Date("2026-08-01"), progress: 15 },
  { id: "8",  reference: "AUD-2026-009",  title: "Révision procédure travaux extérieurs",          origin: "Audit",       priority: "medium", status: "overdue",     assignedTo: "Luc Petit",      dueDate: new Date("2026-06-01"), progress: 10 },
  { id: "9",  reference: "NC-2026-018",   title: "Réparation et isolation chambre froide C2",      origin: "NC",          priority: "medium", status: "in_progress", assignedTo: "Claire Durand",  dueDate: new Date("2026-07-30"), progress: 70 },
  { id: "10", reference: "R-2026-035",    title: "Mise en place stock de sécurité matières clés",  origin: "Risque",      priority: "medium", status: "todo",        assignedTo: "Pierre Bernard", dueDate: new Date("2026-09-01"), progress: 0  },
  { id: "11", reference: "AME-2026-003",  title: "Amélioration emballage pièces fragiles",         origin: "Amélioration",priority: "medium", status: "in_progress", assignedTo: "Jean Dupont",    dueDate: new Date("2026-07-15"), progress: 50 },
  { id: "12", reference: "CAPA-2026-012", title: "Audit interne procédures consignation",          origin: "CAPA",        priority: "low",    status: "done",        assignedTo: "Luc Petit",      dueDate: new Date("2026-06-10"), progress: 100},
  { id: "13", reference: "AUD-2026-008",  title: "Mise à jour plan de surveillance qualité",       origin: "Audit",       priority: "low",    status: "todo",        assignedTo: "Sophie Moreau",  dueDate: new Date("2026-10-01"), progress: 0  },
  { id: "14", reference: "NC-2026-017",   title: "Correction étiquetage produit fini P-789",       origin: "NC",          priority: "low",    status: "done",        assignedTo: "Marc Leroy",     dueDate: new Date("2026-06-01"), progress: 100},
  { id: "15", reference: "REC-2026-005",  title: "Validation fournisseur Chimie Provence",         origin: "Réclamation", priority: "high",   status: "in_progress", assignedTo: "Pierre Bernard", dueDate: new Date("2026-06-18"), progress: 55 },
  { id: "16", reference: "R-2026-042",    title: "Révision du système documentaire qualité",       origin: "Risque",      priority: "medium", status: "in_progress", assignedTo: "Sophie Moreau",  dueDate: new Date("2026-08-15"), progress: 35 },
  { id: "17", reference: "AME-2026-005",  title: "Mise en place tableau de bord fournisseurs",     origin: "Amélioration",priority: "low",    status: "todo",        assignedTo: "Pierre Bernard", dueDate: new Date("2026-11-30"), progress: 0  },
  { id: "18", reference: "CAPA-2026-009", title: "Réorganisation zone de stockage entrepôt",       origin: "CAPA",        priority: "low",    status: "done",        assignedTo: "Sophie Moreau",  dueDate: new Date("2026-05-30"), progress: 100},
]

const originConfig: Record<Origin, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  CAPA:        { icon: CheckSquare,           color: "bg-blue-100 text-blue-700" },
  Audit:       { icon: ClipboardList,         color: "bg-purple-100 text-purple-700" },
  NC:          { icon: AlertTriangle,         color: "bg-red-100 text-red-700" },
  Réclamation: { icon: MessageSquareWarning,  color: "bg-orange-100 text-orange-700" },
  Risque:      { icon: ShieldAlert,           color: "bg-rose-100 text-rose-700" },
  Amélioration:{ icon: Lightbulb,             color: "bg-teal-100 text-teal-700" },
}

const priorityConfig: Record<Priority, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
  high:   { label: "Haute",   variant: "destructive" },
  medium: { label: "Moyenne", variant: "warning" },
  low:    { label: "Basse",   variant: "secondary" },
}

const statusConfig: Record<ActionStatus, { label: string; variant: "destructive" | "warning" | "outline" | "success" }> = {
  todo:        { label: "À faire",   variant: "outline" },
  in_progress: { label: "En cours",  variant: "warning" },
  done:        { label: "Terminée",  variant: "success" },
  overdue:     { label: "En retard", variant: "destructive" },
}

export default function ActionPlanPage() {
  const router = useRouter()
  const { toast } = useToast()

  function handleExport(rows: Action[]) {
    const data = rows.length ? rows : mockActions
    downloadCsv("plan-actions", ["Référence","Action","Origine","Priorité","Statut","Assigné à","Avancement (%)","Échéance"],
      data.map((a) => [a.reference, a.title, a.origin, priorityConfig[a.priority].label, statusConfig[a.status].label, a.assignedTo, a.progress, a.dueDate]))
    toast({ title: "Export réussi", description: `${data.length} actions exportées en CSV.` })
  }

  const total     = mockActions.length
  const overdue   = mockActions.filter((a) => a.status === "overdue").length
  const inProgress= mockActions.filter((a) => a.status === "in_progress").length
  const done      = mockActions.filter((a) => a.status === "done").length
  const donePct   = Math.round((done / total) * 100)

  const columns: DataTableColumn<Action>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (a) => a.reference,
      cell: (a) => <span className="font-mono text-xs text-gray-500">{a.reference}</span>,
    },
    {
      key: "title",
      header: "Action",
      sortValue: (a) => a.title,
      cell: (a) => <span className="font-medium text-gray-900">{a.title}</span>,
    },
    {
      key: "origin",
      header: "Origine",
      sortValue: (a) => a.origin,
      hideOnMobile: true,
      cell: (a) => {
        const cfg = originConfig[a.origin]
        const Icon = cfg.icon
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
            <Icon className="h-3.5 w-3.5" />
            {a.origin}
          </span>
        )
      },
    },
    {
      key: "priority",
      header: "Priorité",
      sortValue: (a) => a.priority,
      cell: (a) => <Badge variant={priorityConfig[a.priority].variant}>{priorityConfig[a.priority].label}</Badge>,
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (a) => a.status,
      cell: (a) => <Badge variant={statusConfig[a.status].variant}>{statusConfig[a.status].label}</Badge>,
    },
    {
      key: "assignedTo",
      header: "Assigné à",
      sortValue: (a) => a.assignedTo,
      hideOnMobile: true,
      cell: (a) => <span className="text-sm text-gray-600">{a.assignedTo}</span>,
    },
    {
      key: "progress",
      header: "Avancement",
      sortValue: (a) => a.progress,
      hideOnMobile: true,
      cell: (a) => (
        <div className="flex items-center gap-2">
          <Progress value={a.progress} className="h-2 w-16" />
          <span className="text-xs text-gray-500">{a.progress}%</span>
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Échéance",
      sortValue: (a) => a.dueDate,
      hideOnMobile: true,
      cell: (a) => {
        const overdue = a.dueDate < today && a.status !== "done"
        return (
          <span className={`text-sm ${overdue ? "font-medium text-red-600" : "text-gray-600"}`}>
            {format(a.dueDate, "dd MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plan d'actions global"
        description="Vue consolidée de toutes les actions CAPA, audits, NC, réclamations et risques"
        icon={ListTodo}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Actions totales"  value={total}      icon={ListTodo}    iconColor="text-gray-600" iconBg="bg-gray-100" />
        <StatCard title="En retard"        value={overdue}    icon={AlarmClock}  iconColor="text-red-600"  iconBg="bg-red-50"  trend="up" />
        <StatCard title="En cours"         value={inProgress} icon={CircleDot}   iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Terminées"        value={`${done} (${donePct}%)`} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={mockActions}
            columns={columns}
            getRowId={(a) => a.id}
            searchPlaceholder="Rechercher une action..."
            searchAccessor={(a) => `${a.title} ${a.reference} ${a.assignedTo}`}
            filters={[
              {
                key: "origin",
                label: "Origine",
                value: (a) => a.origin,
                options: (["CAPA","Audit","NC","Réclamation","Risque","Amélioration"] as Origin[]).map((o) => ({ value: o, label: o })),
              },
              {
                key: "priority",
                label: "Priorité",
                value: (a) => a.priority,
                options: [
                  { value: "high",   label: "Haute" },
                  { value: "medium", label: "Moyenne" },
                  { value: "low",    label: "Basse" },
                ],
              },
              {
                key: "status",
                label: "Statut",
                value: (a) => a.status,
                options: [
                  { value: "todo",        label: "À faire" },
                  { value: "in_progress", label: "En cours" },
                  { value: "done",        label: "Terminée" },
                  { value: "overdue",     label: "En retard" },
                ],
              },
            ]}
            rowActions={(a) => (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: a.reference, description: `${a.title} — ${statusConfig[a.status].label}` })}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            bulkActions={[
              { label: "Réassigner", icon: UserPlus,     onClick: (rows) => { toast({ title: `Réassignation en cours`, description: `${rows.length} action(s) marquées pour réassignation.` }) } },
              { label: "Clôturer",   icon: CheckCircle2, onClick: (rows) => { toast({ title: `${rows.length} actions clôturées`, description: "Statut mis à jour avec succès." }) } },
              { label: "Exporter CSV", icon: Download,   onClick: (rows) => handleExport(rows), variant: "outline" },
            ]}
            emptyMessage="Aucune action trouvée."
          />
        </CardContent>
      </Card>
    </div>
  )
}
