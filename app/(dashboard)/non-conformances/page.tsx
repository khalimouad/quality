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

interface NC {
  id: string
  reference: string
  title: string
  status: "open" | "in_progress" | "closed"
  severity: "critical" | "major" | "minor" | "observation"
  source: string
  detectedBy: string
  detectedAt: Date
  dueDate: Date
}

const mockNCs: NC[] = [
  { id: "1", reference: "NC-2024-023", title: "Défaut de soudage sur pièce P-456", status: "open", severity: "major", source: "Production", detectedBy: "Jean Dupont", detectedAt: new Date("2024-06-01"), dueDate: new Date("2024-07-01") },
  { id: "2", reference: "NC-2024-022", title: "Non-conformité documentaire procédure HSE", status: "in_progress", severity: "minor", source: "Audit interne", detectedBy: "Marie Martin", detectedAt: new Date("2024-05-20"), dueDate: new Date("2024-06-20") },
  { id: "3", reference: "NC-2024-021", title: "Dépassement des délais de calibration", status: "closed", severity: "major", source: "Contrôle qualité", detectedBy: "Pierre Bernard", detectedAt: new Date("2024-05-10"), dueDate: new Date("2024-06-10") },
  { id: "4", reference: "NC-2024-020", title: "Matière première hors spécifications", status: "open", severity: "critical", source: "Réception", detectedBy: "Sophie Moreau", detectedAt: new Date("2024-05-05"), dueDate: new Date("2024-05-20") },
  { id: "5", reference: "NC-2024-019", title: "EPI non port par opérateur", status: "closed", severity: "minor", source: "HSE", detectedBy: "Luc Petit", detectedAt: new Date("2024-04-28"), dueDate: new Date("2024-05-28") },
  { id: "6", reference: "NC-2024-018", title: "Écart de température chambre froide", status: "in_progress", severity: "major", source: "Maintenance", detectedBy: "Claire Durand", detectedAt: new Date("2024-04-22"), dueDate: new Date("2024-05-22") },
  { id: "7", reference: "NC-2024-017", title: "Étiquetage produit incorrect", status: "open", severity: "minor", source: "Expédition", detectedBy: "Marc Leroy", detectedAt: new Date("2024-04-18"), dueDate: new Date("2024-05-18") },
  { id: "8", reference: "NC-2024-016", title: "Fuite huile hydraulique presse 3", status: "closed", severity: "critical", source: "Production", detectedBy: "Jean Dupont", detectedAt: new Date("2024-04-10"), dueDate: new Date("2024-04-25") },
  { id: "9", reference: "NC-2024-015", title: "Observation rangement zone stockage", status: "closed", severity: "observation", source: "Audit interne", detectedBy: "Sophie Moreau", detectedAt: new Date("2024-04-05"), dueDate: new Date("2024-05-05") },
  { id: "10", reference: "NC-2024-014", title: "Retard livraison fournisseur Métal SA", status: "in_progress", severity: "minor", source: "Achats", detectedBy: "Pierre Bernard", detectedAt: new Date("2024-03-28"), dueDate: new Date("2024-04-28") },
  { id: "11", reference: "NC-2024-013", title: "Calibre de contrôle endommagé", status: "open", severity: "major", source: "Contrôle qualité", detectedBy: "Marie Martin", detectedAt: new Date("2024-03-20"), dueDate: new Date("2024-04-20") },
  { id: "12", reference: "NC-2024-012", title: "Manquement procédure consignation", status: "closed", severity: "critical", source: "HSE", detectedBy: "Luc Petit", detectedAt: new Date("2024-03-12"), dueDate: new Date("2024-03-27") },
  { id: "13", reference: "NC-2024-011", title: "Observation propreté vestiaires", status: "open", severity: "observation", source: "HSE", detectedBy: "Claire Durand", detectedAt: new Date("2024-03-05"), dueDate: new Date("2024-04-05") },
]

const statusLabels: Record<NC["status"], string> = {
  open: "Ouverte",
  in_progress: "En cours",
  closed: "Fermée",
}

const severityLabels: Record<NC["severity"], string> = {
  critical: "Critique",
  major: "Majeure",
  minor: "Mineure",
  observation: "Observation",
}

const statusVariant: Record<NC["status"], "destructive" | "warning" | "success"> = {
  open: "destructive",
  in_progress: "warning",
  closed: "success",
}

const severityVariant: Record<NC["severity"], "destructive" | "warning" | "outline" | "secondary"> = {
  critical: "destructive",
  major: "warning",
  minor: "outline",
  observation: "secondary",
}

export default function NonConformancesPage() {
  const router = useRouter()
  const { toast } = useToast()

  function handleExport(rows: NC[]) {
    const data = rows.length ? rows : mockNCs
    downloadCsv("non-conformances", ["Référence","Titre","Sévérité","Statut","Source","Détecté par","Date détection","Échéance"],
      data.map((n) => [n.reference, n.title, severityLabels[n.severity], statusLabels[n.status], n.source, n.detectedBy, n.detectedAt, n.dueDate]))
    toast({ title: "Export réussi", description: `${data.length} NC exportées en CSV.` })
  }

  const total = mockNCs.length
  const open = mockNCs.filter((n) => n.status === "open").length
  const inProgress = mockNCs.filter((n) => n.status === "in_progress").length
  const closed = mockNCs.filter((n) => n.status === "closed").length

  const columns: DataTableColumn<NC>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (n) => n.reference,
      cell: (n) => <span className="font-mono text-xs text-gray-500">{n.reference}</span>,
    },
    {
      key: "title",
      header: "Titre",
      sortValue: (n) => n.title,
      cell: (n) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <span className="font-medium text-gray-900">{n.title}</span>
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
      cell: (n) => <span className="text-sm text-gray-600">{format(n.detectedAt, "dd MMM yyyy", { locale: fr })}</span>,
    },
    {
      key: "dueDate",
      header: "Échéance",
      sortValue: (n) => n.dueDate,
      hideOnMobile: true,
      cell: (n) => <span className="text-sm text-gray-600">{format(n.dueDate, "dd MMM yyyy", { locale: fr })}</span>,
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
            data={mockNCs}
            columns={columns}
            getRowId={(n) => n.id}
            searchPlaceholder="Rechercher par titre ou référence..."
            searchAccessor={(n) => `${n.title} ${n.reference} ${n.detectedBy} ${n.source}`}
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
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/non-conformances/${n.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Exporter CSV", icon: CheckCheck, onClick: (rows) => handleExport(rows) },
              { label: "Clôturer", icon: CheckCircle2, onClick: (rows) => { toast({ title: `${rows.length} NC clôturées`, description: "Statut mis à jour avec succès." }) }, variant: "outline" },
              { label: "Supprimer", icon: Trash2, onClick: (rows) => { toast({ title: `${rows.length} NC supprimées`, description: "Les enregistrements ont été retirés.", variant: "destructive" }) }, variant: "destructive" },
            ]}
            emptyMessage="Aucune non-conformité."
          />
        </CardContent>
      </Card>
    </div>
  )
}
