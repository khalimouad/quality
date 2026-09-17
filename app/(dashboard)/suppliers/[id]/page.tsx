"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  Truck,
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Award,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"

interface Evaluation {
  id: string
  period: string
  date: Date
  quality: number
  delay: number
  price: number
  reactivity: number
  global: number
}

interface SupplierNC {
  id: string
  reference: string
  title: string
  severity: string
  date: Date
  status: string
}

interface SupplierDoc {
  id: string
  name: string
  type: string
  date: Date
}

const evaluations: Evaluation[] = [
  { id: "1", period: "T4 2025", date: new Date("2025-12-15"), quality: 92, delay: 88, price: 80, reactivity: 90, global: 88 },
  { id: "2", period: "T3 2025", date: new Date("2025-09-15"), quality: 90, delay: 85, price: 82, reactivity: 86, global: 86 },
  { id: "3", period: "T2 2025", date: new Date("2025-06-15"), quality: 88, delay: 80, price: 84, reactivity: 82, global: 84 },
  { id: "4", period: "T1 2025", date: new Date("2025-03-15"), quality: 85, delay: 78, price: 85, reactivity: 80, global: 82 },
]

const supplierNCs: SupplierNC[] = [
  { id: "1", reference: "NC-2025-112", title: "Lot non conforme aux spécifications dimensionnelles", severity: "Majeure", date: new Date("2025-10-08"), status: "Clôturée" },
  { id: "2", reference: "NC-2025-087", title: "Retard de livraison de 5 jours ouvrés", severity: "Mineure", date: new Date("2025-07-21"), status: "Clôturée" },
  { id: "3", reference: "NC-2026-014", title: "Certificat matière manquant à la réception", severity: "Mineure", date: new Date("2026-02-03"), status: "En cours" },
]

const supplierDocs: SupplierDoc[] = [
  { id: "1", name: "Contrat cadre d'approvisionnement 2026", type: "Contrat", date: new Date("2026-01-02") },
  { id: "2", name: "Certificat ISO 9001:2015", type: "Certificat", date: new Date("2025-04-10") },
  { id: "3", name: "Certificat ISO 14001:2015", type: "Certificat", date: new Date("2025-04-10") },
  { id: "4", name: "Accord qualité fournisseur (AQF)", type: "Contrat", date: new Date("2025-06-20") },
]

function scoreColor(score: number) {
  if (score >= 85) return "text-green-600"
  if (score >= 70) return "text-blue-600"
  if (score >= 50) return "text-amber-600"
  return "text-red-600"
}

export default function SupplierDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = (params?.id as string) ?? "1"

  const supplier = {
    id,
    code: "FRN-001",
    name: "Aciéries de Lorraine SAS",
    category: "Matières premières",
    score: 88,
    status: "approved" as const,
    contactName: "Henri Lefèvre",
    contactEmail: "h.lefevre@acieries-lorraine.fr",
    contactPhone: "+33 3 87 12 34 56",
    address: "Zone Industrielle de la Maxe, 57140 Metz, France",
    certifications: ["ISO 9001", "ISO 14001", "EN 10204"],
    lastAudit: new Date("2025-11-12"),
    referencedSince: new Date("2019-03-01"),
  }

  const ncColumns: DataTableColumn<SupplierNC>[] = [
    { key: "reference", header: "Référence", sortValue: (n) => n.reference, cell: (n) => <span className="font-mono text-xs text-gray-500">{n.reference}</span> },
    { key: "title", header: "Titre", sortValue: (n) => n.title, cell: (n) => <span className="font-medium text-gray-900">{n.title}</span> },
    { key: "severity", header: "Sévérité", sortValue: (n) => n.severity, cell: (n) => <Badge variant={n.severity === "Majeure" ? "warning" : "secondary"}>{n.severity}</Badge> },
    { key: "date", header: "Date", sortValue: (n) => n.date, hideOnMobile: true, cell: (n) => <span className="text-sm text-gray-600">{format(n.date, "dd MMM yyyy", { locale: fr })}</span> },
    { key: "status", header: "Statut", sortValue: (n) => n.status, cell: (n) => <Badge variant={n.status === "Clôturée" ? "success" : "info"}>{n.status}</Badge> },
  ]

  const evalColumns: DataTableColumn<Evaluation>[] = [
    { key: "period", header: "Période", sortValue: (e) => e.date, cell: (e) => <span className="font-medium text-gray-900">{e.period}</span> },
    { key: "quality", header: "Qualité", align: "center", sortValue: (e) => e.quality, cell: (e) => <span className={scoreColor(e.quality)}>{e.quality}</span> },
    { key: "delay", header: "Délai", align: "center", sortValue: (e) => e.delay, cell: (e) => <span className={scoreColor(e.delay)}>{e.delay}</span> },
    { key: "price", header: "Prix", align: "center", sortValue: (e) => e.price, cell: (e) => <span className={scoreColor(e.price)}>{e.price}</span> },
    { key: "reactivity", header: "Réactivité", align: "center", sortValue: (e) => e.reactivity, cell: (e) => <span className={scoreColor(e.reactivity)}>{e.reactivity}</span> },
    { key: "global", header: "Score global", align: "center", sortValue: (e) => e.global, cell: (e) => <Badge variant="info">{e.global}</Badge> },
  ]

  const docColumns: DataTableColumn<SupplierDoc>[] = [
    { key: "name", header: "Document", sortValue: (d) => d.name, cell: (d) => <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-400" /><span className="font-medium text-gray-900">{d.name}</span></div> },
    { key: "type", header: "Type", sortValue: (d) => d.type, cell: (d) => <Badge variant="outline" className="font-normal">{d.type}</Badge> },
    { key: "date", header: "Date", sortValue: (d) => d.date, hideOnMobile: true, cell: (d) => <span className="text-sm text-gray-600">{format(d.date, "dd MMM yyyy", { locale: fr })}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title={supplier.name} description={supplier.code} icon={Truck} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-normal">{supplier.category}</Badge>
        <Badge variant="success">Approuvé</Badge>
        <Badge variant="info">Score {supplier.score} / 100</Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="ncs">Non-conformités</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  Coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="font-medium">{supplier.contactName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{supplier.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="font-medium">{supplier.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Adresse</p>
                    <p className="font-medium">{supplier.address}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <ClipboardCheck className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Dernier audit</p>
                    <p className="font-medium">{format(supplier.lastAudit, "dd MMM yyyy", { locale: fr })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Score global</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${scoreColor(supplier.score)}`}>{supplier.score}</span>
                    <span className="text-sm text-gray-400">/ 100</span>
                  </div>
                  <Progress value={supplier.score} />
                  <p className="text-xs text-gray-500">Catégorie B — Fournisseur fiable</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((c) => (
                      <Badge key={c} variant="secondary" className="font-normal">{c}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evaluations">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique des évaluations périodiques</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable
                data={evaluations}
                columns={evalColumns}
                getRowId={(e) => e.id}
                searchPlaceholder="Rechercher une période..."
                searchAccessor={(e) => e.period}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ncs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Non-conformités liées
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable
                data={supplierNCs}
                columns={ncColumns}
                getRowId={(n) => n.id}
                searchPlaceholder="Rechercher une NC..."
                searchAccessor={(n) => `${n.reference} ${n.title}`}
                onRowClick={() => router.push("/non-conformances")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contrats et certificats</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <DataTable
                data={supplierDocs}
                columns={docColumns}
                getRowId={(d) => d.id}
                searchPlaceholder="Rechercher un document..."
                searchAccessor={(d) => `${d.name} ${d.type}`}
                rowActions={() => (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
