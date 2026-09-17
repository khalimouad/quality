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

interface CAPA {
  id: string
  reference: string
  title: string
  type: "corrective" | "preventive"
  status: "open" | "in_progress" | "verified" | "closed"
  ncRef: string | null
  assignedTo: string
  dueDate: Date
  progress: number
  createdAt: Date
}

const mockCAPAs: CAPA[] = [
  { id: "1", reference: "CAPA-2024-018", title: "Révision des paramètres de soudage TIG", type: "corrective", status: "in_progress", ncRef: "NC-2024-023", assignedTo: "Jean Dupont", dueDate: new Date("2024-07-15"), progress: 60, createdAt: new Date("2024-06-03") },
  { id: "2", reference: "CAPA-2024-017", title: "Formation des opérateurs aux EPI", type: "corrective", status: "verified", ncRef: "NC-2024-019", assignedTo: "Marie Martin", dueDate: new Date("2024-06-30"), progress: 100, createdAt: new Date("2024-05-15") },
  { id: "3", reference: "CAPA-2024-016", title: "Mise en place d'un plan de maintenance préventive", type: "preventive", status: "open", ncRef: null, assignedTo: "Pierre Bernard", dueDate: new Date("2024-08-01"), progress: 15, createdAt: new Date("2024-05-01") },
  { id: "4", reference: "CAPA-2024-015", title: "Révision procédure de contrôle réception", type: "corrective", status: "closed", ncRef: "NC-2024-020", assignedTo: "Sophie Moreau", dueDate: new Date("2024-06-15"), progress: 100, createdAt: new Date("2024-04-20") },
  { id: "5", reference: "CAPA-2024-014", title: "Amélioration du système de traçabilité", type: "preventive", status: "in_progress", ncRef: null, assignedTo: "Luc Petit", dueDate: new Date("2024-09-01"), progress: 35, createdAt: new Date("2024-04-01") },
  { id: "6", reference: "CAPA-2024-013", title: "Remplacement calibres de contrôle endommagés", type: "corrective", status: "in_progress", ncRef: "NC-2024-013", assignedTo: "Marie Martin", dueDate: new Date("2024-07-20"), progress: 45, createdAt: new Date("2024-03-25") },
  { id: "7", reference: "CAPA-2024-012", title: "Audit des procédures de consignation", type: "preventive", status: "verified", ncRef: "NC-2024-012", assignedTo: "Luc Petit", dueDate: new Date("2024-06-10"), progress: 100, createdAt: new Date("2024-03-15") },
  { id: "8", reference: "CAPA-2024-011", title: "Mise à jour étiquetage produits finis", type: "corrective", status: "open", ncRef: "NC-2024-017", assignedTo: "Marc Leroy", dueDate: new Date("2024-08-15"), progress: 5, createdAt: new Date("2024-04-22") },
  { id: "9", reference: "CAPA-2024-010", title: "Plan de surveillance température chambres froides", type: "preventive", status: "in_progress", ncRef: "NC-2024-018", assignedTo: "Claire Durand", dueDate: new Date("2024-07-30"), progress: 70, createdAt: new Date("2024-04-25") },
  { id: "10", reference: "CAPA-2024-009", title: "Réorganisation zone de stockage", type: "corrective", status: "closed", ncRef: "NC-2024-015", assignedTo: "Sophie Moreau", dueDate: new Date("2024-05-30"), progress: 100, createdAt: new Date("2024-04-08") },
  { id: "11", reference: "CAPA-2024-008", title: "Procédure d'évaluation fournisseurs", type: "preventive", status: "open", ncRef: "NC-2024-014", assignedTo: "Pierre Bernard", dueDate: new Date("2024-09-15"), progress: 20, createdAt: new Date("2024-03-30") },
  { id: "12", reference: "CAPA-2024-007", title: "Réparation et étanchéité presse 3", type: "corrective", status: "verified", ncRef: "NC-2024-016", assignedTo: "Jean Dupont", dueDate: new Date("2024-05-15"), progress: 100, createdAt: new Date("2024-04-12") },
]

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

  function handleExport(rows: CAPA[]) {
    const data = rows.length ? rows : mockCAPAs
    downloadCsv("capa", ["Référence","Titre","Type","Statut","NC liée","Assigné à","Avancement (%)","Échéance"],
      data.map((c) => [c.reference, c.title, typeLabels[c.type], statusLabels[c.status], c.ncRef ?? "", c.assignedTo, c.progress, c.dueDate]))
    toast({ title: "Export réussi", description: `${data.length} CAPA exportées en CSV.` })
  }

  const total = mockCAPAs.length
  const open = mockCAPAs.filter((c) => c.status === "open").length
  const inProgress = mockCAPAs.filter((c) => c.status === "in_progress").length
  const verifiedClosed = mockCAPAs.filter((c) => ["verified", "closed"].includes(c.status)).length

  const columns: DataTableColumn<CAPA>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (c) => c.reference,
      cell: (c) => <span className="font-mono text-xs text-gray-500">{c.reference}</span>,
    },
    {
      key: "title",
      header: "Titre",
      sortValue: (c) => c.title,
      cell: (c) => (
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="font-medium text-gray-900">{c.title}</span>
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
      cell: (c) => <span className="text-sm text-gray-600">{format(c.dueDate, "dd MMM yyyy", { locale: fr })}</span>,
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
            data={mockCAPAs}
            columns={columns}
            getRowId={(c) => c.id}
            searchPlaceholder="Rechercher par titre ou référence..."
            searchAccessor={(c) => `${c.title} ${c.reference} ${c.assignedTo} ${c.ncRef ?? ""}`}
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
              { label: "Clôturer", icon: CheckCircle2, onClick: (rows) => { toast({ title: `${rows.length} CAPA clôturées`, description: "Statut mis à jour avec succès." }) }, variant: "outline" },
              { label: "Supprimer", icon: Trash2, onClick: (rows) => { toast({ title: `${rows.length} CAPA supprimées`, description: "Les enregistrements ont été retirés.", variant: "destructive" }) }, variant: "destructive" },
            ]}
            emptyMessage="Aucune action CAPA."
          />
        </CardContent>
      </Card>
    </div>
  )
}
