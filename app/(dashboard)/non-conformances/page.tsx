"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  AlertTriangle,
  Eye,
  Trash2,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  CircleDot,
  Clock,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"
import { useQhseStore, type NonConformance } from "@/lib/qhse-store"

const statusLabels: Record<NonConformance["status"], string> = {
  open: "Ouverte",
  in_progress: "En cours",
  closed: "Fermée",
}

const severityLabels: Record<NonConformance["severity"], string> = {
  critical: "Critique",
  major: "Majeure",
  minor: "Mineure",
  observation: "Observation",
}

const statusVariant: Record<NonConformance["status"], "destructive" | "warning" | "success"> = {
  open: "destructive",
  in_progress: "warning",
  closed: "success",
}

const severityVariant: Record<NonConformance["severity"], "destructive" | "warning" | "outline" | "secondary"> = {
  critical: "destructive",
  major: "warning",
  minor: "outline",
  observation: "secondary",
}

export default function NonConformancesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { ncs, triggerCapaFromNc, updateNcStatus } = useQhseStore()

  function handleExport(rows: NonConformance[]) {
    const data = rows.length ? rows : ncs
    downloadCsv(
      "non-conformances",
      ["Référence", "Titre", "Sévérité", "Statut", "Source", "Détecté par", "Date détection", "Échéance", "Quarantaine", "CAPA liée"],
      data.map((n) => [
        n.reference,
        n.title,
        severityLabels[n.severity],
        statusLabels[n.status],
        n.source,
        n.detectedBy,
        n.detectedAt,
        n.dueDate,
        n.quarantine ? "OUI" : "NON",
        n.capaRef || "Aucune",
      ])
    )
    toast({ title: "Export réussi", description: `${data.length} NC exportées en CSV.` })
  }

  const total = ncs.length
  const open = ncs.filter((n) => n.status === "open").length
  const inProgress = ncs.filter((n) => n.status === "in_progress").length
  const closed = ncs.filter((n) => n.status === "closed").length

  const columns: DataTableColumn<NonConformance>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (n) => n.reference,
      cell: (n) => <span className="font-mono text-xs font-semibold text-gray-700">{n.reference}</span>,
    },
    {
      key: "title",
      header: "Titre & Contexte",
      sortValue: (n) => n.title,
      cell: (n) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <span className="font-medium text-gray-900">{n.title}</span>
            {n.quarantine && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 uppercase tracking-wider">
                Quarantaine Lot
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {n.lotNumber && <span>Lot: <strong className="font-mono text-gray-700">{n.lotNumber}</strong></span>}
            {n.pvRef && <span>PV: <strong className="font-mono text-blue-600">{n.pvRef}</strong></span>}
            {n.capaRef && (
              <Link href="/capa" className="font-mono font-semibold text-purple-600 hover:underline">
                → {n.capaRef}
              </Link>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "severity",
      header: "Sévérité",
      sortValue: (n) => n.severity,
      cell: (n) => <Badge variant={severityVariant[n.severity]}>{severityLabels[n.severity]}</Badge>,
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (n) => statusLabels[n.status],
      cell: (n) => <Badge variant={statusVariant[n.status]}>{statusLabels[n.status]}</Badge>,
    },
    {
      key: "source",
      header: "Source",
      sortValue: (n) => n.source,
      hideOnMobile: true,
      cell: (n) => <span className="text-sm text-gray-600">{n.source}</span>,
    },
    {
      key: "detectedBy",
      header: "Détecté par",
      sortValue: (n) => n.detectedBy,
      hideOnMobile: true,
      cell: (n) => <span className="text-sm text-gray-600">{n.detectedBy}</span>,
    },
    {
      key: "detectedAt",
      header: "Date",
      sortValue: (n) => n.detectedAt,
      hideOnMobile: true,
      cell: (n) => (
        <span className="text-sm text-gray-600">
          {format(new Date(n.detectedAt), "dd MMM yyyy", { locale: fr })}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Échéance",
      sortValue: (n) => n.dueDate,
      hideOnMobile: true,
      cell: (n) => (
        <span className="text-sm text-gray-600">
          {format(new Date(n.dueDate), "dd MMM yyyy", { locale: fr })}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Non-Conformités"
        description="Suivi des non-conformités détectées"
        icon={AlertTriangle}
      >
        <Link href="/non-conformances/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle NC
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total" value={total} icon={AlertCircle} iconColor="text-gray-600" iconBg="bg-gray-100" />
        <StatCard title="Ouvertes" value={open} icon={CircleDot} iconColor="text-red-600" iconBg="bg-red-50" />
        <StatCard title="En cours" value={inProgress} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Fermées" value={closed} icon={CheckCheck} iconColor="text-green-600" iconBg="bg-green-50" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={ncs}
            columns={columns}
            getRowId={(n) => n.id}
            searchPlaceholder="Rechercher par titre ou référence..."
            searchAccessor={(n) => `${n.title} ${n.reference} ${n.detectedBy} ${n.source} ${n.lotNumber || ""} ${n.pvRef || ""}`}
            filters={[
              {
                key: "status",
                label: "Statut",
                value: (n) => n.status,
                options: [
                  { value: "open", label: "Ouverte" },
                  { value: "in_progress", label: "En cours" },
                  { value: "closed", label: "Fermée" },
                ],
              },
              {
                key: "severity",
                label: "Sévérité",
                value: (n) => n.severity,
                options: [
                  { value: "critical", label: "Critique" },
                  { value: "major", label: "Majeure" },
                  { value: "minor", label: "Mineure" },
                  { value: "observation", label: "Observation" },
                ],
              },
            ]}
            onRowClick={(n) => router.push(`/non-conformances/${n.id}`)}
            rowActions={(n) => (
              <div className="flex items-center justify-end gap-1">
                {!n.capaRef ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      const created = triggerCapaFromNc(n.reference)
                      toast({
                        title: "CAPA 8D générée",
                        description: `Fiche ${created.reference} ouverte et liée à ${n.reference}.`,
                      })
                    }}
                  >
                    + CAPA 8D
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-purple-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push("/capa")
                    }}
                  >
                    {n.capaRef}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/non-conformances/${n.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Exporter CSV", icon: CheckCheck, onClick: (rows) => handleExport(rows) },
              {
                label: "Clôturer",
                icon: CheckCircle2,
                onClick: (rows) => {
                  rows.forEach((r) => updateNcStatus(r.id, "closed"))
                  toast({ title: `${rows.length} NC clôturées`, description: "Statut mis à jour avec succès." })
                },
                variant: "outline",
              },
            ]}
            emptyMessage="Aucune non-conformité."
          />
        </CardContent>
      </Card>
    </div>
  )
}
