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
  Scale,
  Award,
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
import { useQhseStore, type ActionPlanItem, type ActionOrigin, type ActionPriority, type ActionStatus } from "@/lib/qhse-store"

const today = new Date()

const originConfig: Record<ActionOrigin, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  CAPA:            { icon: CheckSquare,           color: "bg-blue-100 text-blue-700" },
  Audit:           { icon: ClipboardList,         color: "bg-purple-100 text-purple-700" },
  NC:              { icon: AlertTriangle,         color: "bg-red-100 text-red-700" },
  Réclamation:     { icon: MessageSquareWarning,  color: "bg-orange-100 text-orange-700" },
  Risque:          { icon: ShieldAlert,           color: "bg-rose-100 text-rose-700" },
  Amélioration:    { icon: Lightbulb,             color: "bg-teal-100 text-teal-700" },
  Réglementaire:   { icon: Scale,                 color: "bg-emerald-100 text-emerald-700" },
  "Revue Direction": { icon: Award,               color: "bg-indigo-100 text-indigo-700" },
}

const priorityConfig: Record<ActionPriority, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
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
  const { actions, updateActionStatus } = useQhseStore()

  function handleExport(rows: ActionPlanItem[]) {
    const data = rows.length ? rows : actions
    downloadCsv(
      "plan-actions",
      ["Référence", "Action", "Origine", "Priorité", "Statut", "Assigné à", "Avancement (%)", "Échéance"],
      data.map((a) => [
        a.reference,
        a.title,
        a.origin,
        priorityConfig[a.priority].label,
        statusConfig[a.status].label,
        a.assignedTo,
        a.progress,
        a.dueDate,
      ])
    )
    toast({ title: "Export réussi", description: `${data.length} actions exportées en CSV.` })
  }

  const total = actions.length
  const overdue = actions.filter((a) => a.status === "overdue" || (new Date(a.dueDate) < today && a.status !== "done")).length
  const inProgress = actions.filter((a) => a.status === "in_progress").length
  const done = actions.filter((a) => a.status === "done").length
  const donePct = total > 0 ? Math.round((done / total) * 100) : 0

  const columns: DataTableColumn<ActionPlanItem>[] = [
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
        const d = new Date(a.dueDate)
        const overdue = d < today && a.status !== "done"
        return (
          <span className={`text-sm ${overdue ? "font-medium text-red-600" : "text-gray-600"}`}>
            {format(d, "dd MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plan d'actions global"
        description="Vue consolidée de toutes les actions CAPA, audits, NC, réclamations, conformité et revue de direction"
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
            data={actions}
            columns={columns}
            getRowId={(a) => a.id}
            searchPlaceholder="Rechercher une action..."
            searchAccessor={(a) => `${a.title} ${a.reference} ${a.assignedTo} ${a.origin}`}
            filters={[
              {
                key: "origin",
                label: "Origine",
                value: (a) => a.origin,
                options: (
                  [
                    "CAPA",
                    "Audit",
                    "NC",
                    "Réclamation",
                    "Risque",
                    "Amélioration",
                    "Réglementaire",
                    "Revue Direction",
                  ] as ActionOrigin[]
                ).map((o) => ({ value: o, label: o })),
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
              {
                label: "Clôturer",
                icon: CheckCircle2,
                onClick: (rows) => {
                  rows.forEach((r) => updateActionStatus(r.id, "done", 100))
                  toast({ title: `${rows.length} actions clôturées`, description: "Statut mis à jour avec succès dans le store." })
                },
              },
              { label: "Exporter CSV", icon: Download,   onClick: (rows) => handleExport(rows), variant: "outline" },
            ]}
            emptyMessage="Aucune action trouvée."
          />
        </CardContent>
      </Card>
    </div>
  )
}
