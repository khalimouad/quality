"use client"

import { useState } from "react"
import Link from "next/link"
import { downloadAsPdf } from "@/lib/pdf"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Edit,
  Download,
  FileText,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  Send,
  Archive,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

type DocStatus = "draft" | "review" | "approved" | "obsolete"

const mockDoc = {
  id: "1",
  reference: "PRO-QUA-001",
  title: "Procédure de contrôle qualité entrant",
  category: "Procédure",
  status: "approved" as DocStatus,
  version: "v3.2",
  owner: "Jean Dupont",
  approvedBy: "Sophie Moreau",
  reviewDate: new Date("2026-03-15"),
  approvedAt: new Date("2025-03-15"),
  createdAt: new Date("2022-01-10"),
  description:
    "Cette procédure définit les modalités de contrôle des matières premières et composants entrants. Elle s'applique à l'ensemble des réceptions de marchandises au sein de l'entreprise.",
  scope: "Département réception, Contrôle qualité, Magasin",
  revisions: [
    { version: "v3.2", date: new Date("2025-03-15"), author: "Jean Dupont", comment: "Mise à jour des critères d'acceptation" },
    { version: "v3.1", date: new Date("2023-08-20"), author: "Jean Dupont", comment: "Ajout du plan de surveillance" },
    { version: "v3.0", date: new Date("2022-11-05"), author: "Marie Martin", comment: "Révision majeure suite à l'audit" },
  ],
}

const statusConfig: Record<DocStatus, { label: string; variant: "success" | "warning" | "info" | "secondary" }> = {
  approved: { label: "Approuvé", variant: "success" },
  draft: { label: "Brouillon", variant: "warning" },
  review: { label: "En révision", variant: "info" },
  obsolete: { label: "Obsolète", variant: "secondary" },
}

const statusIcon: Record<DocStatus, React.ReactNode> = {
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  draft: <Edit className="h-3.5 w-3.5" />,
  review: <Clock className="h-3.5 w-3.5" />,
  obsolete: <Archive className="h-3.5 w-3.5" />,
}

function WorkflowActions({
  status,
  onTransition,
}: {
  status: DocStatus
  onTransition: (next: DocStatus) => void
}) {
  if (status === "draft") {
    return (
      <Button
        size="sm"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => onTransition("review")}
      >
        <Send className="mr-2 h-4 w-4" />
        Soumettre pour révision
      </Button>
    )
  }
  if (status === "review") {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onTransition("approved")}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Approuver
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => onTransition("draft")}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          Rejeter
        </Button>
      </div>
    )
  }
  if (status === "approved") {
    return (
      <Button
        size="sm"
        variant="outline"
        className="border-gray-300 text-gray-600 hover:bg-gray-50"
        onClick={() => onTransition("obsolete")}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Rendre obsolète
      </Button>
    )
  }
  return null
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState<DocStatus>(mockDoc.status)
  const [pdfLoading, setPdfLoading] = useState(false)
  const { toast } = useToast()

  async function handleDownloadPdf() {
    setPdfLoading(true)
    try {
      await downloadAsPdf("doc-detail-content", `${mockDoc.reference}_v${mockDoc.version}`)
      toast({ title: "PDF généré", description: `${mockDoc.reference} téléchargé avec succès.` })
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/documents">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-mono text-gray-500">{mockDoc.reference}</span>
              <Badge variant={statusConfig[status].variant} className="flex items-center gap-1">
                {statusIcon[status]}
                {statusConfig[status].label}
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{mockDoc.title}</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pl-12 sm:pl-0">
          <WorkflowActions status={status} onTransition={setStatus} />
          <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={pdfLoading}>
            {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {pdfLoading ? "Génération..." : "Télécharger"}
          </Button>
          <Button size="sm" variant="ghost">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Workflow status banner */}
      {status === "review" && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <Clock className="h-4 w-4 shrink-0 text-blue-500" />
          <span>Ce document est en attente de validation. Un approbateur doit réviser et approuver.</span>
        </div>
      )}
      {status === "obsolete" && (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          <Archive className="h-4 w-4 shrink-0 text-gray-400" />
          <span>Ce document est obsolète et ne doit plus être utilisé comme référence active.</span>
        </div>
      )}
      {status === "draft" && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Edit className="h-4 w-4 shrink-0 text-amber-500" />
          <span>Brouillon en cours de rédaction. Soumettez pour révision lorsqu'il est prêt.</span>
        </div>
      )}

      <div id="doc-detail-content" className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">{mockDoc.description}</p>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Champ d&apos;application</p>
                <p className="text-sm text-gray-600">{mockDoc.scope}</p>
              </div>
            </CardContent>
          </Card>

          {/* Revision history */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Historique des révisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDoc.revisions.map((rev, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold shrink-0">
                        {rev.version}
                      </div>
                      {idx < mockDoc.revisions.length - 1 && (
                        <div className="flex-1 w-px bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <span className="text-sm font-medium text-gray-900">{rev.comment}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {format(rev.date, "dd MMMM yyyy", { locale: fr })}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">{rev.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Catégorie</p>
                  <p className="text-sm font-medium">{mockDoc.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Version actuelle</p>
                  <p className="text-sm font-medium font-mono">{mockDoc.version}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Responsable</p>
                  <p className="text-sm font-medium">{mockDoc.owner}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Approuvé par</p>
                  <p className="text-sm font-medium">{mockDoc.approvedBy}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Date d&apos;approbation</p>
                  <p className="text-sm font-medium">
                    {format(mockDoc.approvedAt, "dd MMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Prochaine révision</p>
                  <p className="text-sm font-medium text-orange-600">
                    {format(mockDoc.reviewDate, "dd MMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleDownloadPdf} disabled={pdfLoading}>
                {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" /> : <Download className="mr-2 h-4 w-4 text-blue-500" />}
                Télécharger PDF
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Edit className="mr-2 h-4 w-4 text-amber-500" />
                Créer une nouvelle révision
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                <Archive className="mr-2 h-4 w-4" />
                Archiver
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
