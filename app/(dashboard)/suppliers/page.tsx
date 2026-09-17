"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  Truck,
  Eye,
  ClipboardCheck,
  Download,
  CheckCircle2,
  ShieldAlert,
  Gauge,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"

interface Supplier {
  id: string
  code: string
  name: string
  category:
    | "Matières premières"
    | "Sous-traitance"
    | "Services"
    | "Transport"
    | "Équipement"
  score: number
  status: "approved" | "probation" | "blacklisted"
  lastAudit: Date
  certifications: string[]
}

export const mockSuppliers: Supplier[] = [
  { id: "1", code: "FRN-001", name: "Aciéries de Lorraine SA", category: "Matières premières", score: 92, status: "approved", lastAudit: new Date("2025-11-12"), certifications: ["ISO 9001", "ISO 14001"] },
  { id: "2", code: "FRN-002", name: "Plastiques Moreau & Fils", category: "Matières premières", score: 78, status: "approved", lastAudit: new Date("2025-09-03"), certifications: ["ISO 9001"] },
  { id: "3", code: "FRN-003", name: "Usinage de Précision Vosges", category: "Sous-traitance", score: 88, status: "approved", lastAudit: new Date("2026-01-20"), certifications: ["ISO 9001", "EN 9100"] },
  { id: "4", code: "FRN-004", name: "Transports Rapides Atlantique", category: "Transport", score: 64, status: "probation", lastAudit: new Date("2025-06-15"), certifications: ["ISO 39001"] },
  { id: "5", code: "FRN-005", name: "Électro-Composants Rhône", category: "Équipement", score: 81, status: "approved", lastAudit: new Date("2025-12-08"), certifications: ["ISO 9001", "ISO 45001"] },
  { id: "6", code: "FRN-006", name: "Nettoyage Industriel Provence", category: "Services", score: 55, status: "probation", lastAudit: new Date("2025-04-22"), certifications: [] },
  { id: "7", code: "FRN-007", name: "Métaux Spéciaux du Nord", category: "Matières premières", score: 45, status: "blacklisted", lastAudit: new Date("2024-10-30"), certifications: [] },
  { id: "8", code: "FRN-008", name: "Traitement de Surface Alsace", category: "Sous-traitance", score: 90, status: "approved", lastAudit: new Date("2026-02-14"), certifications: ["ISO 9001", "ISO 14001", "Qualisteelcoat"] },
  { id: "9", code: "FRN-009", name: "Maintenance Industrielle Garonne", category: "Services", score: 72, status: "approved", lastAudit: new Date("2025-08-19"), certifications: ["ISO 45001"] },
  { id: "10", code: "FRN-010", name: "Logistique Express Bretagne", category: "Transport", score: 86, status: "approved", lastAudit: new Date("2025-10-05"), certifications: ["ISO 9001", "ISO 39001"] },
  { id: "11", code: "FRN-011", name: "Outillage Technique Savoie", category: "Équipement", score: 68, status: "probation", lastAudit: new Date("2025-05-28"), certifications: ["ISO 9001"] },
  { id: "12", code: "FRN-012", name: "Caoutchouc & Joints Méditerranée", category: "Matières premières", score: 83, status: "approved", lastAudit: new Date("2025-12-30"), certifications: ["ISO 9001", "IATF 16949"] },
  { id: "13", code: "FRN-013", name: "Câblage Électronique Centre", category: "Sous-traitance", score: 48, status: "blacklisted", lastAudit: new Date("2024-09-11"), certifications: [] },
  { id: "14", code: "FRN-014", name: "Emballages Carton Loire", category: "Matières premières", score: 79, status: "approved", lastAudit: new Date("2025-11-25"), certifications: ["ISO 9001", "FSC"] },
]

export const categoryOptions = [
  { value: "Matières premières", label: "Matières premières" },
  { value: "Sous-traitance", label: "Sous-traitance" },
  { value: "Services", label: "Services" },
  { value: "Transport", label: "Transport" },
  { value: "Équipement", label: "Équipement" },
]

export const statusConfig: Record<
  Supplier["status"],
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  approved: { label: "Approuvé", variant: "success" },
  probation: { label: "Sous surveillance", variant: "warning" },
  blacklisted: { label: "Blacklisté", variant: "destructive" },
}

export function scoreGrade(score: number): {
  grade: string
  variant: "success" | "info" | "warning" | "destructive"
} {
  if (score >= 85) return { grade: "A", variant: "success" }
  if (score >= 70) return { grade: "B", variant: "info" }
  if (score >= 50) return { grade: "C", variant: "warning" }
  return { grade: "D", variant: "destructive" }
}

export default function SuppliersPage() {
  const router = useRouter()
  const { toast } = useToast()

  function handleExport(rows: Supplier[]) {
    const data = rows.length ? rows : mockSuppliers
    downloadCsv("fournisseurs", ["Code","Nom","Catégorie","Score","Statut","Dernier audit","Certifications"],
      data.map((s) => [s.code, s.name, s.category, s.score, statusConfig[s.status].label, s.lastAudit, s.certifications.join(" | ")]))
    toast({ title: "Export réussi", description: `${data.length} fournisseurs exportés en CSV.` })
  }

  const total = mockSuppliers.length
  const approved = mockSuppliers.filter((s) => s.status === "approved").length
  const probation = mockSuppliers.filter((s) => s.status === "probation").length
  const avgScore = Math.round(
    mockSuppliers.reduce((sum, s) => sum + s.score, 0) / total
  )

  const columns: DataTableColumn<Supplier>[] = [
    {
      key: "code",
      header: "Code",
      sortValue: (s) => s.code,
      cell: (s) => <span className="font-mono text-xs text-gray-500">{s.code}</span>,
    },
    {
      key: "name",
      header: "Fournisseur",
      sortValue: (s) => s.name,
      cell: (s) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="font-medium text-gray-900">{s.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      sortValue: (s) => s.category,
      hideOnMobile: true,
      cell: (s) => (
        <Badge variant="outline" className="font-normal">
          {s.category}
        </Badge>
      ),
    },
    {
      key: "score",
      header: "Score",
      align: "center",
      sortValue: (s) => s.score,
      cell: (s) => {
        const g = scoreGrade(s.score)
        return (
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-semibold text-gray-700">{s.score}</span>
            <Badge variant={g.variant}>{g.grade}</Badge>
          </div>
        )
      },
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (s) => statusConfig[s.status].label,
      cell: (s) => (
        <Badge variant={statusConfig[s.status].variant}>
          {statusConfig[s.status].label}
        </Badge>
      ),
    },
    {
      key: "lastAudit",
      header: "Dernier audit",
      sortValue: (s) => s.lastAudit,
      hideOnMobile: true,
      cell: (s) => (
        <span className="text-sm text-gray-600">
          {format(s.lastAudit, "dd MMM yyyy", { locale: fr })}
        </span>
      ),
    },
    {
      key: "certifications",
      header: "Certifications",
      hideOnMobile: true,
      cell: (s) =>
        s.certifications.length === 0 ? (
          <span className="text-sm text-gray-400">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {s.certifications.map((c) => (
              <Badge key={c} variant="secondary" className="font-normal">
                {c}
              </Badge>
            ))}
          </div>
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Évaluation fournisseurs"
        description="Suivi, évaluation et qualification des fournisseurs et sous-traitants"
        icon={Truck}
      >
        <Link href="/suppliers/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau fournisseur
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total fournisseurs" value={total} icon={Truck} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Approuvés" value={approved} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Sous surveillance" value={probation} icon={ShieldAlert} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Score moyen" value={avgScore} icon={Gauge} iconColor="text-indigo-600" iconBg="bg-indigo-50" hint="/ 100" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={mockSuppliers}
            columns={columns}
            getRowId={(s) => s.id}
            searchPlaceholder="Rechercher par nom ou code..."
            searchAccessor={(s) => `${s.name} ${s.code} ${s.category}`}
            filters={[
              {
                key: "category",
                label: "Catégorie",
                value: (s) => s.category,
                options: categoryOptions,
              },
              {
                key: "status",
                label: "Statut",
                value: (s) => s.status,
                options: [
                  { value: "approved", label: "Approuvé" },
                  { value: "probation", label: "Sous surveillance" },
                  { value: "blacklisted", label: "Blacklisté" },
                ],
              },
            ]}
            onRowClick={(s) => router.push(`/suppliers/${s.id}`)}
            rowActions={(s) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/suppliers/${s.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Évaluer", icon: ClipboardCheck, onClick: (rows) => { toast({ title: `Évaluation lancée`, description: `${rows.length} fournisseur(s) ajoutés à la file d'évaluation.` }) } },
              { label: "Exporter CSV", icon: Download, onClick: (rows) => handleExport(rows), variant: "outline" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
