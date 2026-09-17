"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  CheckSquare,
  Eye,
  Trash2,
  CheckCircle2,
  ListChecks,
  CircleDot,
  Clock,
  ShieldCheck,
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
import { useQhseStore, type CAPA } from "@/lib/qhse-store"

const statusLabels: Record<CAPA["status"], string> = {
  open: "Ouverte",
  in_progress: "En cours",
  verified: "Vérifiée",
  closed: "Fermée",
}

const typeLabels: Record<CAPA["type"], string> = {
  corrective: "Corrective",
  preventive: "Préventive",
}

const statusVariant: Record<CAPA["status"], "destructive" | "warning" | "info" | "success"> = {
  open: "destructive",
  in_progress: "warning",
  verified: "info",
  closed: "success",
}

export default function CapaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { capas, updateCapaStatus } = useQhseStore()

  function handleExport(rows: CAPA[]) {
    const data = rows.length ? rows : capas
    downloadCsv(
      "capa",
      ["Référence", "Titre", "Type", "Statut", "Source liée", "Assigné à", "Avancement (%)", "Échéance"],
      data.map((c) => [
        c.reference,
        c.title,
        typeLabels[c.type],
        statusLabels[c.status],
        c.ncRef || c.auditRef || c.complianceRef || "",
        c.assignedTo,
        c.progress,
        c.dueDate,
      ])
    )
    toast({ title: "Export réussi", description: `${data.length} CAPA exportées en CSV.` })
  }

  const total = capas.length
  const open = capas.filter((c) => c.status === "open").length
  const inProgress = capas.filter((c) => c.status === "in_progress").length
  const verifiedClosed = capas.filter((c) => ["verified", "closed"].includes(c.status)).length

  const columns: DataTableColumn<CAPA>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (c) => c.reference,
      cell: (c) => <span className="font-mono text-xs font-semibold text-gray-700">{c.reference}</span>,
    },
    {
      key: "title",
      header: "Titre & Liaison",
      sortValue: (c) => c.title,
      cell: (c) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="font-medium text-gray-900">{c.title}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {c.ncRef && (
              <Link
                href="/non-conformances"
                className="font-mono text-[11px] font-semibold text-red-600 hover:underline bg-red-50 px-1.5 py-0.5 rounded"
              >
                NC: {c.ncRef}
              </Link>
            )}
            {c.auditRef && (
              <Link
                href="/audits"
                className="font-mono text-[11px] font-semibold text-purple-600 hover:underline bg-purple-50 px-1.5 py-0.5 rounded"
              >
                Audit: {c.auditRef}
              </Link>
            )}
            {c.complianceRef && (
              <Link
                href="/compliance"
                className="font-mono text-[11px] font-semibold text-emerald-600 hover:underline bg-emerald-50 px-1.5 py-0.5 rounded"
              >
                Conformité: {c.complianceRef}
              </Link>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortValue: (c) => typeLabels[c.type],
      cell: (c) => (
        <Badge variant={c.type === "corrective" ? "info" : "secondary"}>{typeLabels[c.type]}</Badge>
      ),
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (c) => statusLabels[c.status],
      cell: (c) => <Badge variant={statusVariant[c.status]}>{statusLabels[c.status]}</Badge>,
    },
    {
      key: "ncRef",
      header: "NC liée",
      sortValue: (c) => c.ncRef ?? "",
      hideOnMobile: true,
      cell: (c) =>
        c.ncRef ? (
          <span className="font-mono text-xs text-blue-600">{c.ncRef}</span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "assignedTo",
      header: "Assigné à",
      sortValue: (c) => c.assignedTo,
      hideOnMobile: true,
      cell: (c) => <span className="text-sm text-gray-600">{c.assignedTo}</span>,
    },
    {
      key: "progress",
      header: "Avancement",
      sortValue: (c) => c.progress,
      hideOnMobile: true,
      cell: (c) => (
        <div className="flex items-center gap-2">
          <Progress value={c.progress} className="h-2 w-16" />
          <span className="text-xs text-gray-500">{c.progress}%</span>
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Échéance",
      sortValue: (c) => c.dueDate,
      hideOnMobile: true,
      cell: (c) => (
        <span className="text-sm text-gray-600">
          {format(new Date(c.dueDate), "dd MMM yyyy", { locale: fr })}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Actions CAPA"
        description="Actions Correctives et Préventives"
        icon={CheckSquare}
      >
        <Link href="/capa/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle CAPA
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total" value={total} icon={ListChecks} iconColor="text-gray-600" iconBg="bg-gray-100" />
        <StatCard title="Ouvertes" value={open} icon={CircleDot} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="En cours" value={inProgress} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Vérifiées / Fermées" value={verifiedClosed} icon={ShieldCheck} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={capas}
            columns={columns}
            getRowId={(c) => c.id}
            searchPlaceholder="Rechercher par titre ou référence..."
            searchAccessor={(c) => `${c.title} ${c.reference} ${c.assignedTo} ${c.ncRef ?? ""} ${c.auditRef ?? ""} ${c.complianceRef ?? ""}`}
            filters={[
              {
                key: "status",
                label: "Statut",
                value: (c) => c.status,
                options: [
                  { value: "open", label: "Ouverte" },
                  { value: "in_progress", label: "En cours" },
                  { value: "verified", label: "Vérifiée" },
                  { value: "closed", label: "Fermée" },
                ],
              },
              {
                key: "type",
                label: "Type",
                value: (c) => c.type,
                options: [
                  { value: "corrective", label: "Corrective" },
                  { value: "preventive", label: "Préventive" },
                ],
              },
            ]}
            onRowClick={(c) => router.push(`/capa/${c.id}`)}
            rowActions={(c) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/capa/${c.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Exporter CSV", icon: ListChecks, onClick: (rows) => handleExport(rows) },
              {
                label: "Clôturer",
                icon: CheckCircle2,
                onClick: (rows) => {
                  rows.forEach((r) => updateCapaStatus(r.id, "closed", 100))
                  toast({ title: `${rows.length} CAPA clôturées`, description: "Statut mis à jour avec succès dans le store." })
                },
                variant: "outline",
              },
            ]}
            emptyMessage="Aucune action CAPA."
          />
        </CardContent>
      </Card>
    </div>
  )
}
