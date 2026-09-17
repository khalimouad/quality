"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Plus,
  GraduationCap,
  Eye,
  Download,
  CheckCircle2,
  CalendarClock,
  Loader,
  Award,
  Users,
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

type TrainingCategory =
  | "Qualité"
  | "Sécurité"
  | "Environnement"
  | "Métier"
  | "Réglementaire"

type TrainingStatus = "planned" | "in_progress" | "completed" | "cancelled"

interface Training {
  id: string
  title: string
  category: TrainingCategory
  trainer: string
  date: Date
  durationHours: number
  participants: number
  status: TrainingStatus
  completion: number
}

const mockTrainings: Training[] = [
  { id: "1", title: "Sensibilisation ISO 9001", category: "Qualité", trainer: "Jean Dupont", date: new Date("2026-02-12"), durationHours: 7, participants: 18, status: "completed", completion: 100 },
  { id: "2", title: "Habilitation électrique B0", category: "Sécurité", trainer: "APAVE Formation", date: new Date("2026-03-05"), durationHours: 14, participants: 12, status: "completed", completion: 100 },
  { id: "3", title: "Gestes et postures", category: "Sécurité", trainer: "Marie Martin", date: new Date("2026-04-20"), durationHours: 4, participants: 24, status: "completed", completion: 100 },
  { id: "4", title: "Audit interne ISO 19011", category: "Qualité", trainer: "AFNOR Compétences", date: new Date("2026-06-15"), durationHours: 21, participants: 8, status: "in_progress", completion: 60 },
  { id: "5", title: "Manipulation produits chimiques", category: "Environnement", trainer: "Luc Petit", date: new Date("2026-06-22"), durationHours: 6, participants: 15, status: "in_progress", completion: 40 },
  { id: "6", title: "Tri et gestion des déchets", category: "Environnement", trainer: "Pierre Bernard", date: new Date("2026-07-10"), durationHours: 3, participants: 20, status: "planned", completion: 0 },
  { id: "7", title: "Conduite de chariot élévateur CACES R489", category: "Réglementaire", trainer: "CESR Formation", date: new Date("2026-07-18"), durationHours: 35, participants: 6, status: "planned", completion: 0 },
  { id: "8", title: "Sauveteur Secouriste du Travail (SST)", category: "Sécurité", trainer: "Croix-Rouge", date: new Date("2026-08-03"), durationHours: 14, participants: 10, status: "planned", completion: 0 },
  { id: "9", title: "Lecture de plans techniques", category: "Métier", trainer: "Claire Durand", date: new Date("2026-05-28"), durationHours: 8, participants: 9, status: "completed", completion: 100 },
  { id: "10", title: "Maîtrise statistique des procédés (MSP/SPC)", category: "Métier", trainer: "Sophie Moreau", date: new Date("2026-09-14"), durationHours: 14, participants: 7, status: "planned", completion: 0 },
  { id: "11", title: "Réglementation REACH et CLP", category: "Réglementaire", trainer: "INRS", date: new Date("2026-04-09"), durationHours: 7, participants: 11, status: "completed", completion: 100 },
  { id: "12", title: "Méthode des 5S", category: "Qualité", trainer: "Jean Dupont", date: new Date("2026-06-30"), durationHours: 4, participants: 22, status: "in_progress", completion: 75 },
  { id: "13", title: "Prévention du risque incendie", category: "Sécurité", trainer: "SDIS Formation", date: new Date("2026-10-05"), durationHours: 4, participants: 30, status: "planned", completion: 0 },
  { id: "14", title: "Métrologie et incertitudes de mesure", category: "Métier", trainer: "LNE", date: new Date("2026-03-26"), durationHours: 14, participants: 5, status: "cancelled", completion: 0 },
]

const categoryConfig: Record<
  TrainingCategory,
  { variant: "success" | "warning" | "info" | "secondary" | "outline" | "destructive" }
> = {
  Qualité: { variant: "info" },
  Sécurité: { variant: "destructive" },
  Environnement: { variant: "success" },
  Métier: { variant: "secondary" },
  Réglementaire: { variant: "warning" },
}

const statusConfig: Record<
  TrainingStatus,
  { label: string; variant: "success" | "warning" | "info" | "secondary" }
> = {
  planned: { label: "Planifiée", variant: "info" },
  in_progress: { label: "En cours", variant: "warning" },
  completed: { label: "Terminée", variant: "success" },
  cancelled: { label: "Annulée", variant: "secondary" },
}

export default function TrainingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const thisYear = new Date().getFullYear()

  function handleExport(rows: Training[]) {
    const data = rows.length ? rows : mockTrainings
    downloadCsv("formations", ["Titre","Catégorie","Formateur","Date","Durée (h)","Participants","Statut","Complétion (%)"],
      data.map((t) => [t.title, t.category, t.trainer, t.date, t.durationHours, t.participants, statusConfig[t.status].label, t.completion]))
    toast({ title: "Export réussi", description: `${data.length} formations exportées en CSV.` })
  }

  const planned = mockTrainings.filter((t) => t.status === "planned").length
  const inProgress = mockTrainings.filter((t) => t.status === "in_progress").length
  const completedThisYear = mockTrainings.filter(
    (t) => t.status === "completed" && t.date.getFullYear() === thisYear
  ).length
  const trackable = mockTrainings.filter((t) => t.status !== "cancelled")
  const avgCompletion =
    trackable.length === 0
      ? 0
      : Math.round(
          trackable.reduce((sum, t) => sum + t.completion, 0) / trackable.length
        )

  const columns: DataTableColumn<Training>[] = [
    {
      key: "title",
      header: "Formation",
      sortValue: (t) => t.title,
      cell: (t) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="font-medium text-gray-900">{t.title}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      sortValue: (t) => t.category,
      hideOnMobile: true,
      cell: (t) => (
        <Badge variant={categoryConfig[t.category].variant} className="font-normal">
          {t.category}
        </Badge>
      ),
    },
    {
      key: "trainer",
      header: "Formateur",
      sortValue: (t) => t.trainer,
      hideOnMobile: true,
      cell: (t) => <span className="text-sm text-gray-600">{t.trainer}</span>,
    },
    {
      key: "date",
      header: "Date",
      sortValue: (t) => t.date,
      cell: (t) => (
        <span className="text-sm text-gray-600">
          {format(t.date, "dd MMM yyyy", { locale: fr })}
        </span>
      ),
    },
    {
      key: "durationHours",
      header: "Durée",
      sortValue: (t) => t.durationHours,
      align: "center",
      hideOnMobile: true,
      cell: (t) => <span className="text-sm text-gray-600">{t.durationHours} h</span>,
    },
    {
      key: "participants",
      header: "Participants",
      sortValue: (t) => t.participants,
      align: "center",
      hideOnMobile: true,
      cell: (t) => (
        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          {t.participants}
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      sortValue: (t) => statusConfig[t.status].label,
      cell: (t) => (
        <Badge variant={statusConfig[t.status].variant}>
          {statusConfig[t.status].label}
        </Badge>
      ),
    },
    {
      key: "completion",
      header: "Complétion",
      sortValue: (t) => t.completion,
      hideOnMobile: true,
      cell: (t) => (
        <div className="flex w-32 items-center gap-2">
          <Progress value={t.completion} className="h-2" />
          <span className="w-9 shrink-0 text-right text-xs font-medium text-gray-600">
            {t.completion}%
          </span>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formations & compétences"
        description="Planification des sessions de formation et suivi des compétences"
        icon={GraduationCap}
      >
        <Link href="/training/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle formation
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Sessions planifiées" value={planned} icon={CalendarClock} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="En cours" value={inProgress} icon={Loader} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Terminées (cette année)" value={completedThisYear} icon={Award} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="Taux de complétion moyen" value={`${avgCompletion}%`} icon={CheckCircle2} iconColor="text-violet-600" iconBg="bg-violet-50" hint="hors annulées" />
      </div>

      <Card>
        <CardContent className="p-4">
          <DataTable
            data={mockTrainings}
            columns={columns}
            getRowId={(t) => t.id}
            searchPlaceholder="Rechercher par titre ou formateur..."
            searchAccessor={(t) => `${t.title} ${t.trainer} ${t.category}`}
            filters={[
              {
                key: "category",
                label: "Catégorie",
                value: (t) => t.category,
                options: [
                  { value: "Qualité", label: "Qualité" },
                  { value: "Sécurité", label: "Sécurité" },
                  { value: "Environnement", label: "Environnement" },
                  { value: "Métier", label: "Métier" },
                  { value: "Réglementaire", label: "Réglementaire" },
                ],
              },
              {
                key: "status",
                label: "Statut",
                value: (t) => t.status,
                options: [
                  { value: "planned", label: "Planifiée" },
                  { value: "in_progress", label: "En cours" },
                  { value: "completed", label: "Terminée" },
                  { value: "cancelled", label: "Annulée" },
                ],
              },
            ]}
            onRowClick={(t) => router.push(`/training/${t.id}`)}
            rowActions={(t) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/training/${t.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
            bulkActions={[
              { label: "Exporter CSV", icon: Download, onClick: (rows) => handleExport(rows), variant: "outline" },
              { label: "Clôturer", icon: CheckCircle2, onClick: (rows) => { toast({ title: `${rows.length} formations clôturées`, description: "Statut mis à jour avec succès." }) } },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
