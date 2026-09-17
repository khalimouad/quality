"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  FileText,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  Archive,
  FileCheck,
  FileClock,
  FileX,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"

interface Doc {
  id: string
  reference: string
  title: string
  category: string
  status: "approved" | "draft" | "review" | "obsolete"
  version: string
  owner: string
  reviewDate: Date
  updatedAt: Date
}

const mockDocuments: Doc[] = [
  { id: "1", reference: "PRO-QUA-001", title: "Procédure de contrôle qualité entrant", category: "Procédure", status: "approved", version: "v3.2", owner: "Jean Dupont", reviewDate: new Date("2026-03-15"), updatedAt: new Date("2025-03-15") },
  { id: "2", reference: "INS-PRO-012", title: "Instruction de soudage TIG", category: "Instruction", status: "approved", version: "v1.5", owner: "Marie Martin", reviewDate: new Date("2026-08-20"), updatedAt: new Date("2025-01-20") },
  { id: "3", reference: "FRM-SEC-003", title: "Formulaire d'analyse de risque", category: "Formulaire", status: "draft", version: "v0.2", owner: "Pierre Bernard", reviewDate: new Date("2026-12-01"), updatedAt: new Date("2025-06-01") },
  { id: "4", reference: "POL-QUA-001", title: "Politique qualité de l'entreprise", category: "Politique", status: "approved", version: "v2.0", owner: "Sophie Moreau", reviewDate: new Date("2026-01-10"), updatedAt: new Date("2025-01-10") },
  { id: "5", reference: "PRO-ENV-005", title: "Procédure de gestion des déchets", category: "Procédure", status: "obsolete", version: "v1.0", owner: "Luc Petit", reviewDate: new Date("2024-06-30"), updatedAt: new Date("2023-06-30") },
  { id: "6", reference: "PRO-SEC-008", title: "Procédure de travail en hauteur", category: "Procédure", status: "approved", version: "v2.1", owner: "Claire Durand", reviewDate: new Date("2026-02-28"), updatedAt: new Date("2025-02-28") },
  { id: "7", reference: "MAN-QUA-001", title: "Manuel qualité ISO 9001", category: "Manuel", status: "review", version: "v4.0", owner: "Jean Dupont", reviewDate: new Date("2026-05-15"), updatedAt: new Date("2025-05-15") },
  { id: "8", reference: "INS-ENV-004", title: "Instruction de tri sélectif", category: "Instruction", status: "approved", version: "v1.2", owner: "Luc Petit", reviewDate: new Date("2026-09-10"), updatedAt: new Date("2025-04-10") },
  { id: "9", reference: "FRM-QUA-007", title: "Fiche de non-conformité", category: "Formulaire", status: "approved", version: "v2.3", owner: "Marie Martin", reviewDate: new Date("2026-07-22"), updatedAt: new Date("2025-03-22") },
  { id: "10", reference: "PRO-RH-002", title: "Procédure d'accueil et intégration", category: "Procédure", status: "draft", version: "v0.5", owner: "Sophie Moreau", reviewDate: new Date("2026-11-30"), updatedAt: new Date("2025-06-30") },
  { id: "11", reference: "INS-SEC-009", title: "Consignes en cas d'incendie", category: "Instruction", status: "approved", version: "v3.0", owner: "Claire Durand", reviewDate: new Date("2026-04-18"), updatedAt: new Date("2025-04-18") },
  { id: "12", reference: "POL-ENV-002", title: "Politique environnementale", category: "Politique", status: "review", version: "v1.8", owner: "Pierre Bernard", reviewDate: new Date("2026-06-05"), updatedAt: new Date("2025-05-05") },
]

const statusConfig: Record<Doc["status"], { label: string; variant: "success" | "warning" | "info" | "secondary" }> = {
  approved: { label: "Approuvé", variant: "success" },
  draft: { label: "Brouillon", variant: "warning" },
  review: { label: "En révision", variant: "info" },
  obsolete: { label: "Obsolète", variant: "secondary" },
}

export default function DocumentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const today = new Date()

  function handleExport(rows: Doc[]) {
    const data = rows.length ? rows : mockDocuments
    downloadCsv("documents", ["Référence","Titre","Catégorie","Version","Statut","Responsable","Prochaine révision"],
      data.map((d) => [d.reference, d.title, d.category, d.version, statusConfig[d.status].label, d.owner, d.reviewDate]))
    toast({ title: "Export réussi", description: `${data.length} documents exportés en CSV.` })
  }

  const approved = mockDocuments.filter((d) => d.status === "approved").length
  const inReview = mockDocuments.filter((d) => d.status === "review").length
  const drafts = mockDocuments.filter((d) => d.status === "draft").length
  const dueSoon = mockDocuments.filter(
    (d) => d.status !== "obsolete" && (d.reviewDate.getTime() - today.getTime()) / 86400000 < 90
  ).length

  const columns: DataTableColumn<Doc>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (d) => d.reference,
      cell: (d) => <span className="font-mono text-xs text-gray-500">{d.reference}</span>,
    },
    {
      key: "title",
      header: "Titre",
      sortValue: (d) => d.title,
      cell: (d) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="font-medium text-gray-900">{d.title}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      sortValue: (d) => d.category,
      hideOnMobile: true,
      cell: (d) => (
        <Badge variant="outline" className="font-normal">
          {d.category}
        </Badge>
      ),
    },
    {
      key: "version",
      header: "Version",
      sortValue: (d) => d.version,
      hideOnMobile: true,
      cell: (d) => <span className="font-mono text-xs text-gray-600">{d.version}</span>,
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (d) => statusConfig[d.status].label,
      cell: (d) => (
        <Badge variant={statusConfig[d.status].variant}>
          {statusConfig[d.status].label}
        </Badge>
      ),
    },
    {
      key: "owner",
      header: "Responsable",
      sortValue: (d) => d.owner,
      hideOnMobile: true,
      cell: (d) => <span className="text-sm text-gray-600">{d.owner}</span>,
    },
    {
      key: "reviewDate",
      header: "Révision prévue",
      sortValue: (d) => d.reviewDate,
      hideOnMobile: true,
      cell: (d) => {
        const days = (d.reviewDate.getTime() - today.getTime()) / 86400000
        const overdue = days < 0 && d.status !== "obsolete"
        const soon = days >= 0 && days < 90 && d.status !== "obsolete"
        return (
          <span
            className={
              overdue
                ? "text-sm font-medium text-red-600"
                : soon
                ? "text-sm font-medium text-amber-600"
                : "text-sm text-gray-600"
            }
          >
            {format(d.reviewDate, "dd MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion documentaire"
        description="Maîtrise des documents qualité, versions et cycles de révision"
        icon={FileText}
      >
        <div className="flex gap-2">
          <Link href="/documents/generate">
            <Button variant="outline">
              <Wand2 className="mr-2 h-4 w-4" />
              Générer
            </Button>
          </Link>
          <Link href="/documents/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau document
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Approuvés" value={approved} icon={FileCheck} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="En révision" value={inReview} icon={FileClock} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Brouillons" value={drafts} icon={FileText} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Révision < 90j" value={dueSoon} icon={FileX} iconColor="text-red-600" iconBg="bg-red-50" hint="à planifier" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={mockDocuments}
            columns={columns}
            getRowId={(d) => d.id}
            searchPlaceholder="Rechercher par titre ou référence..."
            searchAccessor={(d) => `${d.title} ${d.reference} ${d.owner}`}
            filters={[
              {
                key: "status",
                label: "Statut",
                value: (d) => d.status,
                options: [
                  { value: "approved", label: "Approuvé" },
                  { value: "review", label: "En révision" },
                  { value: "draft", label: "Brouillon" },
                  { value: "obsolete", label: "Obsolète" },
                ],
              },
              {
                key: "category",
                label: "Catégorie",
                value: (d) => d.category,
                options: [
                  { value: "Procédure", label: "Procédure" },
                  { value: "Instruction", label: "Instruction" },
                  { value: "Formulaire", label: "Formulaire" },
                  { value: "Politique", label: "Politique" },
                  { value: "Manuel", label: "Manuel" },
                ],
              },
            ]}
            onRowClick={(d) => router.push(`/documents/${d.id}`)}
            rowActions={(d) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/documents/${d.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { handleExport([d]) }}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Approuver", icon: CheckCircle2, onClick: (rows) => { toast({ title: `${rows.length} document(s) approuvés`, description: "Statut mis à jour avec succès." }) } },
              { label: "Exporter CSV", icon: Archive, onClick: (rows) => handleExport(rows), variant: "outline" },
              { label: "Supprimer", icon: Trash2, onClick: (rows) => { toast({ title: `${rows.length} document(s) supprimés`, description: "Les enregistrements ont été retirés.", variant: "destructive" }) }, variant: "destructive" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
