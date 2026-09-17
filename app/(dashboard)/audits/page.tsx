"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  ClipboardList,
  Eye,
  Trash2,
  Download,
  CalendarClock,
  ClipboardCheck,
  Clock,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"

interface Audit {
  id: string
  reference: string
  title: string
  type: "internal" | "external" | "supplier"
  status: "planned" | "in_progress" | "completed" | "cancelled"
  scope: string
  auditor: string
  date: Date
  duration: string
  findings: number
}

const mockAudits: Audit[] = [
  { id: "1", reference: "AUD-2024-012", title: "Audit interne ISO 9001 - Production", type: "internal", status: "planned", scope: "Département Production", auditor: "Sophie Moreau", date: new Date("2024-07-15"), duration: "2 jours", findings: 0 },
  { id: "2", reference: "AUD-2024-011", title: "Audit fournisseur - Métal SA", type: "supplier", status: "in_progress", scope: "Processus de fabrication", auditor: "Jean Dupont", date: new Date("2024-06-10"), duration: "1 jour", findings: 3 },
  { id: "3", reference: "AUD-2024-010", title: "Audit de certification ISO 14001", type: "external", status: "completed", scope: "Système de management environnemental", auditor: "Bureau Veritas", date: new Date("2024-05-20"), duration: "3 jours", findings: 2 },
  { id: "4", reference: "AUD-2024-009", title: "Audit interne HSE", type: "internal", status: "completed", scope: "Tous les départements", auditor: "Luc Petit", date: new Date("2024-04-15"), duration: "1 jour", findings: 5 },
  { id: "5", reference: "AUD-2024-013", title: "Audit de surveillance ISO 9001", type: "external", status: "planned", scope: "Direction et processus clés", auditor: "AFNOR", date: new Date("2024-09-01"), duration: "2 jours", findings: 0 },
  { id: "6", reference: "AUD-2024-008", title: "Audit interne sécurité machines", type: "internal", status: "completed", scope: "Atelier d'usinage", auditor: "Marie Martin", date: new Date("2024-03-28"), duration: "1 jour", findings: 4 },
  { id: "7", reference: "AUD-2024-014", title: "Audit fournisseur - Plastiques Pro", type: "supplier", status: "planned", scope: "Contrôle qualité réception", auditor: "Pierre Bernard", date: new Date("2024-09-20"), duration: "1 jour", findings: 0 },
  { id: "8", reference: "AUD-2024-007", title: "Audit interne gestion documentaire", type: "internal", status: "completed", scope: "Service qualité", auditor: "Sophie Moreau", date: new Date("2024-03-10"), duration: "1 jour", findings: 1 },
  { id: "9", reference: "AUD-2024-006", title: "Audit externe OHSAS 18001", type: "external", status: "completed", scope: "Système de management SST", auditor: "DEKRA", date: new Date("2024-02-22"), duration: "2 jours", findings: 3 },
  { id: "10", reference: "AUD-2024-015", title: "Audit interne processus achats", type: "internal", status: "in_progress", scope: "Service achats", auditor: "Marc Leroy", date: new Date("2024-06-25"), duration: "1 jour", findings: 0 },
  { id: "11", reference: "AUD-2024-005", title: "Audit fournisseur - Composants Élec", type: "supplier", status: "completed", scope: "Traçabilité et conformité", auditor: "Jean Dupont", date: new Date("2024-02-08"), duration: "1 jour", findings: 2 },
  { id: "12", reference: "AUD-2024-016", title: "Audit de surveillance ISO 14001", type: "external", status: "planned", scope: "Management environnemental", auditor: "Bureau Veritas", date: new Date("2024-10-05"), duration: "2 jours", findings: 0 },
  { id: "13", reference: "AUD-2024-004", title: "Audit interne maintenance préventive", type: "internal", status: "completed", scope: "Service maintenance", auditor: "Claire Durand", date: new Date("2024-01-30"), duration: "1 jour", findings: 2 },
]

const typeLabels: Record<Audit["type"], string> = {
  internal: "Interne",
  external: "Externe",
  supplier: "Fournisseur",
}

const statusLabels: Record<Audit["status"], string> = {
  planned: "Planifié",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
}

const typeVariant: Record<Audit["type"], "info" | "warning" | "secondary"> = {
  internal: "info",
  external: "warning",
  supplier: "secondary",
}

const statusVariant: Record<Audit["status"], "outline" | "warning" | "success" | "secondary"> = {
  planned: "outline",
  in_progress: "warning",
  completed: "success",
  cancelled: "secondary",
}

export default function AuditsPage() {
  const router = useRouter()
  const { toast } = useToast()

  function handleExport(rows: Audit[]) {
    const data = rows.length ? rows : mockAudits
    downloadCsv("audits", ["Référence","Titre","Type","Statut","Champ","Auditeur","Date","Écarts"],
      data.map((a) => [a.reference, a.title, typeLabels[a.type], statusLabels[a.status], a.scope, a.auditor, a.date, a.findings]))
    toast({ title: "Export réussi", description: `${data.length} audits exportés en CSV.` })
  }

  const total = mockAudits.length
  const planned = mockAudits.filter((a) => a.status === "planned").length
  const inProgress = mockAudits.filter((a) => a.status === "in_progress").length
  const completed = mockAudits.filter((a) => a.status === "completed").length

  const columns: DataTableColumn<Audit>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (a) => a.reference,
      cell: (a) => <span className="font-mono text-xs text-gray-500">{a.reference}</span>,
    },
    {
      key: "title",
      header: "Titre",
      sortValue: (a) => a.title,
      cell: (a) => (
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="font-medium text-gray-900">{a.title}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortValue: (a) => typeLabels[a.type],
      cell: (a) => <Badge variant={typeVariant[a.type]}>{typeLabels[a.type]}</Badge>,
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (a) => statusLabels[a.status],
      cell: (a) => <Badge variant={statusVariant[a.status]}>{statusLabels[a.status]}</Badge>,
    },
    {
      key: "scope",
      header: "Champ",
      sortValue: (a) => a.scope,
      hideOnMobile: true,
      cell: (a) => <span className="block max-w-[180px] truncate text-sm text-gray-600">{a.scope}</span>,
    },
    {
      key: "auditor",
      header: "Auditeur",
      sortValue: (a) => a.auditor,
      hideOnMobile: true,
      cell: (a) => <span className="text-sm text-gray-600">{a.auditor}</span>,
    },
    {
      key: "date",
      header: "Date",
      sortValue: (a) => a.date,
      hideOnMobile: true,
      cell: (a) => <span className="text-sm text-gray-600">{format(a.date, "dd MMM yyyy", { locale: fr })}</span>,
    },
    {
      key: "findings",
      header: "Écarts",
      sortValue: (a) => a.findings,
      align: "center",
      hideOnMobile: true,
      cell: (a) =>
        a.findings > 0 ? (
          <Badge variant="destructive" className="text-xs">
            {a.findings} écart{a.findings > 1 ? "s" : ""}
          </Badge>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audits"
        description="Programme et suivi des audits"
        icon={ClipboardList}
      >
        <Link href="/audits/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Planifier un audit
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total" value={total} icon={ListChecks} iconColor="text-gray-600" iconBg="bg-gray-100" />
        <StatCard title="Planifiés" value={planned} icon={CalendarClock} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="En cours" value={inProgress} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Terminés" value={completed} icon={ClipboardCheck} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={mockAudits}
            columns={columns}
            getRowId={(a) => a.id}
            searchPlaceholder="Rechercher par titre ou référence..."
            searchAccessor={(a) => `${a.title} ${a.reference} ${a.auditor} ${a.scope}`}
            filters={[
              {
                key: "status",
                label: "Statut",
                value: (a) => a.status,
                options: [
                  { value: "planned", label: "Planifié" },
                  { value: "in_progress", label: "En cours" },
                  { value: "completed", label: "Terminé" },
                ],
              },
              {
                key: "type",
                label: "Type",
                value: (a) => a.type,
                options: [
                  { value: "internal", label: "Interne" },
                  { value: "external", label: "Externe" },
                  { value: "supplier", label: "Fournisseur" },
                ],
              },
            ]}
            onRowClick={(a) => router.push(`/audits/${a.id}`)}
            rowActions={(a) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/audits/${a.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Exporter CSV", icon: Download, onClick: (rows) => handleExport(rows), variant: "outline" },
              { label: "Supprimer", icon: Trash2, onClick: (rows) => { toast({ title: `${rows.length} audits supprimés`, description: "Les enregistrements ont été retirés.", variant: "destructive" }) }, variant: "destructive" },
            ]}
            emptyMessage="Aucun audit."
          />
        </CardContent>
      </Card>
    </div>
  )
}
