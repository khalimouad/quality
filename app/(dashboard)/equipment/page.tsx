"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  Wrench,
  Eye,
  Download,
  CalendarCheck,
  CircleCheck,
  Gauge,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { useToast } from "@/components/ui/use-toast"
import { downloadCsv } from "@/lib/csv"

type EquipmentType = "Mesure" | "Production" | "Sécurité" | "Laboratoire"

type EquipmentStatus =
  | "operational"
  | "maintenance"
  | "calibration_due"
  | "out_of_service"

interface Equipment {
  id: string
  code: string
  name: string
  type: EquipmentType
  location: string
  status: EquipmentStatus
  lastCalibration: Date
  nextCalibration: Date
  responsible: string
}

const mockEquipment: Equipment[] = [
  { id: "1", code: "EQ-001", name: "Pied à coulisse numérique", type: "Mesure", location: "Atelier usinage", status: "operational", lastCalibration: new Date("2026-01-15"), nextCalibration: new Date("2027-01-15"), responsible: "Jean Dupont" },
  { id: "2", code: "EQ-002", name: "Balance de précision 0,1 mg", type: "Laboratoire", location: "Laboratoire contrôle", status: "calibration_due", lastCalibration: new Date("2025-06-20"), nextCalibration: new Date("2026-06-20"), responsible: "Marie Martin" },
  { id: "3", code: "EQ-003", name: "Manomètre étalon 0-25 bar", type: "Mesure", location: "Banc hydraulique", status: "operational", lastCalibration: new Date("2025-11-10"), nextCalibration: new Date("2026-11-10"), responsible: "Pierre Bernard" },
  { id: "4", code: "EQ-004", name: "Thermomètre étalon", type: "Laboratoire", location: "Laboratoire contrôle", status: "calibration_due", lastCalibration: new Date("2025-06-28"), nextCalibration: new Date("2026-06-28"), responsible: "Marie Martin" },
  { id: "5", code: "EQ-005", name: "Pont roulant 5 tonnes", type: "Production", location: "Hall de montage", status: "maintenance", lastCalibration: new Date("2025-09-01"), nextCalibration: new Date("2026-09-01"), responsible: "Luc Petit" },
  { id: "6", code: "EQ-006", name: "Banc d'essai traction", type: "Laboratoire", location: "Laboratoire essais", status: "operational", lastCalibration: new Date("2026-02-05"), nextCalibration: new Date("2027-02-05"), responsible: "Sophie Moreau" },
  { id: "7", code: "EQ-007", name: "Détecteur de gaz portable", type: "Sécurité", location: "Zone ATEX", status: "out_of_service", lastCalibration: new Date("2025-04-12"), nextCalibration: new Date("2026-04-12"), responsible: "Claire Durand" },
  { id: "8", code: "EQ-008", name: "Micromètre extérieur 0-25 mm", type: "Mesure", location: "Atelier usinage", status: "operational", lastCalibration: new Date("2025-12-18"), nextCalibration: new Date("2026-12-18"), responsible: "Jean Dupont" },
  { id: "9", code: "EQ-009", name: "Tour à commande numérique", type: "Production", location: "Atelier usinage", status: "operational", lastCalibration: new Date("2026-03-22"), nextCalibration: new Date("2027-03-22"), responsible: "Luc Petit" },
  { id: "10", code: "EQ-010", name: "Extincteur CO2 5 kg", type: "Sécurité", location: "Hall de montage", status: "operational", lastCalibration: new Date("2025-10-30"), nextCalibration: new Date("2026-10-30"), responsible: "Claire Durand" },
  { id: "11", code: "EQ-011", name: "Colonne de mesure 1D", type: "Mesure", location: "Salle de métrologie", status: "calibration_due", lastCalibration: new Date("2025-06-15"), nextCalibration: new Date("2026-06-15"), responsible: "Marie Martin" },
  { id: "12", code: "EQ-012", name: "Spectrophotomètre UV-Vis", type: "Laboratoire", location: "Laboratoire chimie", status: "maintenance", lastCalibration: new Date("2025-08-08"), nextCalibration: new Date("2026-08-08"), responsible: "Sophie Moreau" },
  { id: "13", code: "EQ-013", name: "Clé dynamométrique 20-200 Nm", type: "Mesure", location: "Hall de montage", status: "operational", lastCalibration: new Date("2026-01-28"), nextCalibration: new Date("2027-01-28"), responsible: "Pierre Bernard" },
  { id: "14", code: "EQ-014", name: "Compresseur d'air industriel", type: "Production", location: "Local technique", status: "out_of_service", lastCalibration: new Date("2025-07-01"), nextCalibration: new Date("2026-07-01"), responsible: "Luc Petit" },
]

const typeConfig: Record<
  EquipmentType,
  { variant: "success" | "warning" | "info" | "secondary" | "outline" | "destructive" }
> = {
  Mesure: { variant: "info" },
  Production: { variant: "secondary" },
  Sécurité: { variant: "destructive" },
  Laboratoire: { variant: "success" },
}

const statusConfig: Record<
  EquipmentStatus,
  { label: string; variant: "success" | "warning" | "info" | "secondary" | "destructive" }
> = {
  operational: { label: "Opérationnel", variant: "success" },
  maintenance: { label: "En maintenance", variant: "warning" },
  calibration_due: { label: "Étalonnage à prévoir", variant: "info" },
  out_of_service: { label: "Hors service", variant: "destructive" },
}

export default function EquipmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const today = new Date()

  function handleExport(rows: Equipment[]) {
    const data = rows.length ? rows : mockEquipment
    downloadCsv("equipements", ["Code","Désignation","Type","Localisation","Statut","Dernier étalonnage","Prochain étalonnage","Responsable"],
      data.map((e) => [e.code, e.name, e.type, e.location, statusConfig[e.status].label, e.lastCalibration, e.nextCalibration, e.responsible]))
    toast({ title: "Export réussi", description: `${data.length} équipements exportés en CSV.` })
  }

  const total = mockEquipment.length
  const operational = mockEquipment.filter((e) => e.status === "operational").length
  const calibrationSoon = mockEquipment.filter((e) => {
    const days = (e.nextCalibration.getTime() - today.getTime()) / 86400000
    return e.status !== "out_of_service" && days < 30
  }).length
  const outOfService = mockEquipment.filter((e) => e.status === "out_of_service").length

  const columns: DataTableColumn<Equipment>[] = [
    {
      key: "code",
      header: "Code",
      sortValue: (e) => e.code,
      cell: (e) => <span className="font-mono text-xs text-gray-500">{e.code}</span>,
    },
    {
      key: "name",
      header: "Désignation",
      sortValue: (e) => e.name,
      cell: (e) => (
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="font-medium text-gray-900">{e.name}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortValue: (e) => e.type,
      hideOnMobile: true,
      cell: (e) => (
        <Badge variant={typeConfig[e.type].variant} className="font-normal">
          {e.type}
        </Badge>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      sortValue: (e) => e.location,
      hideOnMobile: true,
      cell: (e) => <span className="text-sm text-gray-600">{e.location}</span>,
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (e) => statusConfig[e.status].label,
      cell: (e) => (
        <Badge variant={statusConfig[e.status].variant}>
          {statusConfig[e.status].label}
        </Badge>
      ),
    },
    {
      key: "lastCalibration",
      header: "Dernier étalonnage",
      sortValue: (e) => e.lastCalibration,
      hideOnMobile: true,
      cell: (e) => (
        <span className="text-sm text-gray-600">
          {format(e.lastCalibration, "dd MMM yyyy", { locale: fr })}
        </span>
      ),
    },
    {
      key: "nextCalibration",
      header: "Prochain étalonnage",
      sortValue: (e) => e.nextCalibration,
      cell: (e) => {
        const days = (e.nextCalibration.getTime() - today.getTime()) / 86400000
        const overdue = days < 0 && e.status !== "out_of_service"
        const soon = days >= 0 && days < 30 && e.status !== "out_of_service"
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
            {format(e.nextCalibration, "dd MMM yyyy", { locale: fr })}
          </span>
        )
      },
    },
    {
      key: "responsible",
      header: "Responsable",
      sortValue: (e) => e.responsible,
      hideOnMobile: true,
      cell: (e) => <span className="text-sm text-gray-600">{e.responsible}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Équipements & métrologie"
        description="Gestion du parc d'équipements et suivi des étalonnages"
        icon={Wrench}
      >
        <Link href="/equipment/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel équipement
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total équipements" value={total} icon={Wrench} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Opérationnels" value={operational} icon={CircleCheck} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Étalonnage à prévoir" value={calibrationSoon} icon={Gauge} iconColor="text-amber-600" iconBg="bg-amber-50" hint="< 30 jours" />
        <StatCard title="Hors service" value={outOfService} icon={Ban} iconColor="text-red-600" iconBg="bg-red-50" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={mockEquipment}
            columns={columns}
            getRowId={(e) => e.id}
            searchPlaceholder="Rechercher par désignation ou code..."
            searchAccessor={(e) => `${e.name} ${e.code} ${e.location} ${e.responsible}`}
            filters={[
              {
                key: "type",
                label: "Type",
                value: (e) => e.type,
                options: [
                  { value: "Mesure", label: "Mesure" },
                  { value: "Production", label: "Production" },
                  { value: "Sécurité", label: "Sécurité" },
                  { value: "Laboratoire", label: "Laboratoire" },
                ],
              },
              {
                key: "status",
                label: "Statut",
                value: (e) => e.status,
                options: [
                  { value: "operational", label: "Opérationnel" },
                  { value: "maintenance", label: "En maintenance" },
                  { value: "calibration_due", label: "Étalonnage à prévoir" },
                  { value: "out_of_service", label: "Hors service" },
                ],
              },
            ]}
            onRowClick={(e) => router.push(`/equipment/${e.id}`)}
            rowActions={(e) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/equipment/${e.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Planifier étalonnage", icon: CalendarCheck, onClick: (rows) => { toast({ title: `Étalonnage planifié`, description: `${rows.length} équipement(s) ajoutés au planning.` }) } },
              { label: "Exporter CSV", icon: Download, onClick: (rows) => handleExport(rows), variant: "outline" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
