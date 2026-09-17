"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  MessageSquareWarning,
  Eye,
  Inbox,
  Loader,
  CheckCircle2,
  UserPlus,
  Lock,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"

export interface Complaint {
  id: string
  reference: string
  subject: string
  type: "client" | "supplier"
  severity: "critical" | "major" | "minor"
  status: "new" | "investigating" | "resolved" | "closed"
  party: string
  receivedDate: Date
  dueDate: Date
}

export const mockComplaints: Complaint[] = [
  { id: "1", reference: "REC-2026-001", subject: "Produit livré endommagé lors du transport", type: "client", severity: "major", status: "investigating", party: "Distrib Sud-Ouest", receivedDate: new Date("2026-05-12"), dueDate: new Date("2026-06-12") },
  { id: "2", reference: "REC-2026-002", subject: "Non-respect des délais contractuels", type: "supplier", severity: "minor", status: "resolved", party: "Transports Léon Express", receivedDate: new Date("2026-04-20"), dueDate: new Date("2026-05-20") },
  { id: "3", reference: "REC-2026-003", subject: "Défaut critique de sécurité sur lot expédié", type: "client", severity: "critical", status: "new", party: "Groupe Industriel Vega", receivedDate: new Date("2026-06-02"), dueDate: new Date("2026-06-09") },
  { id: "4", reference: "REC-2026-004", subject: "Erreur de référence sur la commande #4521", type: "client", severity: "minor", status: "closed", party: "Maison Dubois & Fils", receivedDate: new Date("2026-03-08"), dueDate: new Date("2026-04-08") },
  { id: "5", reference: "REC-2026-005", subject: "Matière première hors spécifications", type: "supplier", severity: "major", status: "investigating", party: "Chimie Provence Industrie", receivedDate: new Date("2026-05-28"), dueDate: new Date("2026-06-18") },
  { id: "6", reference: "REC-2026-006", subject: "Emballage non conforme aux exigences", type: "supplier", severity: "minor", status: "resolved", party: "Emballages Cartonnés du Centre", receivedDate: new Date("2026-04-02"), dueDate: new Date("2026-05-02") },
  { id: "7", reference: "REC-2026-007", subject: "Documentation technique manquante", type: "client", severity: "minor", status: "new", party: "Atelier Mécanique Loire", receivedDate: new Date("2026-06-04"), dueDate: new Date("2026-07-04") },
  { id: "8", reference: "REC-2026-008", subject: "Performance produit insuffisante en usage", type: "client", severity: "major", status: "investigating", party: "Énergies Nouvelles SAS", receivedDate: new Date("2026-05-15"), dueDate: new Date("2026-06-15") },
  { id: "9", reference: "REC-2026-009", subject: "Facturation erronée sur prestation", type: "supplier", severity: "minor", status: "closed", party: "Maintenance Services Nord", receivedDate: new Date("2026-02-25"), dueDate: new Date("2026-03-25") },
  { id: "10", reference: "REC-2026-010", subject: "Contamination détectée à la réception", type: "supplier", severity: "critical", status: "new", party: "Fonderie du Périgord", receivedDate: new Date("2026-06-05"), dueDate: new Date("2026-06-12") },
  { id: "11", reference: "REC-2026-011", subject: "Quantité livrée inférieure à la commande", type: "client", severity: "minor", status: "resolved", party: "Comptoir des Métaux", receivedDate: new Date("2026-04-18"), dueDate: new Date("2026-05-18") },
  { id: "12", reference: "REC-2026-012", subject: "Réclamation sur le service après-vente", type: "client", severity: "major", status: "investigating", party: "Constructions Modernes SA", receivedDate: new Date("2026-05-22"), dueDate: new Date("2026-06-22") },
  { id: "13", reference: "REC-2026-013", subject: "Lot rejeté pour défaut de traçabilité", type: "supplier", severity: "major", status: "resolved", party: "Câblage Industriel Picardie", receivedDate: new Date("2026-03-30"), dueDate: new Date("2026-04-30") },
]

const typeConfig: Record<Complaint["type"], { label: string; variant: "info" | "secondary" }> = {
  client: { label: "Client", variant: "info" },
  supplier: { label: "Fournisseur", variant: "secondary" },
}

const severityConfig: Record<
  Complaint["severity"],
  { label: string; variant: "destructive" | "warning" | "secondary" }
> = {
  critical: { label: "Critique", variant: "destructive" },
  major: { label: "Majeure", variant: "warning" },
  minor: { label: "Mineure", variant: "secondary" },
}

const statusConfig: Record<
  Complaint["status"],
  { label: string; variant: "warning" | "info" | "success" | "secondary" }
> = {
  new: { label: "Nouvelle", variant: "warning" },
  investigating: { label: "En cours", variant: "info" },
  resolved: { label: "Résolue", variant: "success" },
  closed: { label: "Clôturée", variant: "secondary" },
}

export default function ComplaintsPage() {
  const router = useRouter()
  const { toast } = useToast()

  function handleExport(rows: Complaint[]) {
    const data = rows.length ? rows : mockComplaints
    downloadCsv("reclamations", ["Référence","Objet","Type","Client/Fournisseur","Sévérité","Statut","Date réception","Échéance"],
      data.map((c) => [c.reference, c.subject, typeConfig[c.type].label, c.party, severityConfig[c.severity].label, statusConfig[c.status].label, c.receivedDate, c.dueDate]))
    toast({ title: "Export réussi", description: `${data.length} réclamations exportées en CSV.` })
  }

  const total = mockComplaints.length
  const newCount = mockComplaints.filter((c) => c.status === "new").length
  const investigating = mockComplaints.filter((c) => c.status === "investigating").length
  const resolved = mockComplaints.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  ).length
  const resolvedRate = Math.round((resolved / total) * 100)

  const columns: DataTableColumn<Complaint>[] = [
    {
      key: "reference",
      header: "Référence",
      sortValue: (c) => c.reference,
      cell: (c) => <span className="font-mono text-xs text-gray-500">{c.reference}</span>,
    },
    {
      key: "subject",
      header: "Objet",
      sortValue: (c) => c.subject,
      cell: (c) => (
        <div className="flex items-center gap-2">
          <MessageSquareWarning className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="font-medium text-gray-900">{c.subject}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortValue: (c) => typeConfig[c.type].label,
      hideOnMobile: true,
      cell: (c) => <Badge variant={typeConfig[c.type].variant}>{typeConfig[c.type].label}</Badge>,
    },
    {
      key: "party",
      header: "Client / Fournisseur",
      sortValue: (c) => c.party,
      hideOnMobile: true,
      cell: (c) => <span className="text-sm text-gray-600">{c.party}</span>,
    },
    {
      key: "severity",
      header: "Sévérité",
      sortValue: (c) => severityConfig[c.severity].label,
      cell: (c) => <Badge variant={severityConfig[c.severity].variant}>{severityConfig[c.severity].label}</Badge>,
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (c) => statusConfig[c.status].label,
      cell: (c) => <Badge variant={statusConfig[c.status].variant}>{statusConfig[c.status].label}</Badge>,
    },
    {
      key: "receivedDate",
      header: "Reçue le",
      sortValue: (c) => c.receivedDate,
      hideOnMobile: true,
      cell: (c) => <span className="text-sm text-gray-600">{format(c.receivedDate, "dd MMM yyyy", { locale: fr })}</span>,
    },
    {
      key: "dueDate",
      header: "Échéance",
      sortValue: (c) => c.dueDate,
      hideOnMobile: true,
      cell: (c) => {
        const open = c.status === "new" || c.status === "investigating"
        const overdue = open && c.dueDate.getTime() < Date.now()
        return (
          <span className={overdue ? "text-sm font-medium text-red-600" : "text-sm text-gray-600"}>
            {format(c.dueDate, "dd MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réclamations"
        description="Gestion des réclamations clients et fournisseurs"
        icon={MessageSquareWarning}
      >
        <Link href="/complaints/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle réclamation
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total" value={total} icon={MessageSquareWarning} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Nouvelles" value={newCount} icon={Inbox} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="En cours" value={investigating} icon={Loader} iconColor="text-indigo-600" iconBg="bg-indigo-50" />
        <StatCard title="Résolues" value={resolved} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" hint={`taux ${resolvedRate}%`} />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={mockComplaints}
            columns={columns}
            getRowId={(c) => c.id}
            searchPlaceholder="Rechercher par objet ou référence..."
            searchAccessor={(c) => `${c.subject} ${c.reference} ${c.party}`}
            filters={[
              {
                key: "type",
                label: "Type",
                value: (c) => c.type,
                options: [
                  { value: "client", label: "Client" },
                  { value: "supplier", label: "Fournisseur" },
                ],
              },
              {
                key: "status",
                label: "Statut",
                value: (c) => c.status,
                options: [
                  { value: "new", label: "Nouvelle" },
                  { value: "investigating", label: "En cours" },
                  { value: "resolved", label: "Résolue" },
                  { value: "closed", label: "Clôturée" },
                ],
              },
              {
                key: "severity",
                label: "Sévérité",
                value: (c) => c.severity,
                options: [
                  { value: "critical", label: "Critique" },
                  { value: "major", label: "Majeure" },
                  { value: "minor", label: "Mineure" },
                ],
              },
            ]}
            onRowClick={(c) => router.push(`/complaints/${c.id}`)}
            rowActions={(c) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/complaints/${c.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Exporter CSV", icon: UserPlus, onClick: (rows) => handleExport(rows) },
              { label: "Clôturer", icon: Lock, onClick: (rows) => { toast({ title: `${rows.length} réclamations clôturées`, description: "Statut mis à jour avec succès." }) }, variant: "outline" },
              { label: "Supprimer", icon: Trash2, onClick: (rows) => { toast({ title: `${rows.length} réclamations supprimées`, description: "Les enregistrements ont été retirés.", variant: "destructive" }) }, variant: "destructive" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
