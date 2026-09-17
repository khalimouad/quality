"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft, Plus, Send, Calendar, User,
  AlertTriangle, Clock, MapPin, CheckCircle2, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

type NCStatus = "open" | "in_progress" | "closed"

const mockNC = {
  id: "1",
  reference: "NC-2026-023",
  title: "Défaut de soudage sur pièce P-456",
  status: "open" as NCStatus,
  severity: "major" as const,
  source: "Production",
  location: "Atelier soudage — Poste 3",
  detectedBy: "Jean Dupont",
  assignedTo: "Sophie Moreau",
  detectedAt: new Date("2026-06-01"),
  dueDate: new Date("2026-07-01"),
  description:
    "Lors du contrôle visuel de la pièce P-456, un défaut de soudage a été constaté. La soudure présente des porosités et un manque de fusion sur une longueur de 15 mm. Cette non-conformité impacte la résistance mécanique de l'assemblage.",
  immediateAction:
    "La pièce a été mise en quarantaine. La série de production a été suspendue dans l'attente de l'analyse des causes.",
  comments: [
    { id: 1, author: "Sophie Moreau", role: "Responsable QSE",   content: "Analyse des causes en cours. Les paramètres de soudage sont vérifiés.", createdAt: new Date("2026-06-02T09:30:00") },
    { id: 2, author: "Jean Dupont",   role: "Technicien",         content: "Le paramètre d'intensité était hors tolérance. Réglage effectué et test de validation en cours.", createdAt: new Date("2026-06-03T14:15:00") },
  ],
  initialTimeline: [
    { date: new Date("2026-06-01"), event: "Non-conformité détectée et déclarée", type: "created" },
    { date: new Date("2026-06-01"), event: "Pièce mise en quarantaine",           type: "action"  },
    { date: new Date("2026-06-02"), event: "Analyse des causes initiée",          type: "update"  },
  ],
}

const severityMap: Record<string, { label: string; variant: "destructive" | "warning" | "outline" }> = {
  critical:    { label: "Critique",    variant: "destructive" },
  major:       { label: "Majeure",     variant: "warning" },
  minor:       { label: "Mineure",     variant: "outline" },
  observation: { label: "Observation", variant: "outline" },
}

const statusMap: Record<NCStatus, { label: string; variant: "destructive" | "warning" | "success" }> = {
  open:        { label: "Ouverte",  variant: "destructive" },
  in_progress: { label: "En cours", variant: "warning" },
  closed:      { label: "Fermée",   variant: "success" },
}

const timelineDot: Record<string, string> = {
  created: "bg-red-500",
  action:  "bg-blue-500",
  update:  "bg-amber-500",
  capa:    "bg-purple-500",
  closed:  "bg-green-500",
}

export default function NCDetailPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [status, setStatus]         = useState<NCStatus>(mockNC.status)
  const [timeline, setTimeline]     = useState(mockNC.initialTimeline)
  const [comment, setComment]       = useState("")
  const [comments, setComments]     = useState(mockNC.comments)
  const [capaOpen, setCapaOpen]     = useState(false)
  const [createdCapa, setCreatedCapa] = useState<string | null>(null)
  const [closeOpen, setCloseOpen]   = useState(false)
  const [closeReason, setCloseReason] = useState("")

  // CAPA form state
  const [capaTitle, setCapaTitle]           = useState(`Correction : ${mockNC.title}`)
  const [capaResponsible, setCapaResponsible] = useState(mockNC.assignedTo)
  const [capaDueDate, setCapaDueDate]       = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() + 1)
    return d.toISOString().slice(0, 10)
  })

  const sev = severityMap[mockNC.severity]
  const st  = statusMap[status]

  function handleCreateCapa() {
    const ref = `CAPA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
    setCreatedCapa(ref)
    if (status === "open") setStatus("in_progress")
    setTimeline((prev) => [
      ...prev,
      { date: new Date(), event: `${ref} créée — ${capaTitle}`, type: "capa" },
    ])
    setCapaOpen(false)
    toast({ title: "CAPA créée avec succès", description: `${ref} a été générée et liée à cette NC.` })
  }

  function handleCloseNC() {
    setStatus("closed")
    setTimeline((prev) => [
      ...prev,
      { date: new Date(), event: `NC clôturée${closeReason ? ` — ${closeReason}` : ""}`, type: "closed" },
    ])
    setCloseOpen(false)
    toast({ title: "NC clôturée", description: `${mockNC.reference} est maintenant fermée.` })
  }

  function handleAddComment() {
    if (!comment.trim()) return
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: "Admin", role: "Utilisateur", content: comment, createdAt: new Date() },
    ])
    setComment("")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-gray-400">{mockNC.reference}</span>
            <Badge variant={st.variant} className="text-xs">{st.label}</Badge>
            <Badge variant={sev.variant} className="text-xs">{sev.label}</Badge>
          </div>
          <h2 className="mt-0.5 text-lg font-bold leading-tight text-gray-900">{mockNC.title}</h2>
        </div>
      </div>

      {/* ── Workflow banner ── */}
      {status === "open" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>NC ouverte — Analysez les causes et créez une action corrective (CAPA) pour traiter cette non-conformité.</span>
        </div>
      )}
      {status === "in_progress" && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Clock className="h-4 w-4 shrink-0 text-amber-500" />
          <span>NC en cours de traitement — Une CAPA est active. Clôturez la NC une fois les actions vérifiées.</span>
        </div>
      )}
      {status === "closed" && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
          <span>NC clôturée — Cette non-conformité a été traitée et vérifiée.</span>
        </div>
      )}

      {/* ── Action buttons ── */}
      {status !== "closed" && (
        <div className="flex flex-wrap gap-2">
          {!createdCapa && (
            <Button variant="outline" size="sm" className="h-9 border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={() => setCapaOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Créer une CAPA
            </Button>
          )}
          <Button size="sm" className="h-9 bg-green-600 hover:bg-green-700" onClick={() => setCloseOpen(true)}>
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            Clôturer NC
          </Button>
        </div>
      )}

      {/* ── Info strip ── */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[
          { icon: AlertTriangle, label: "Source",            value: mockNC.source },
          { icon: User,          label: "Détecté par",       value: mockNC.detectedBy },
          { icon: MapPin,        label: "Lieu",              value: mockNC.location },
          { icon: Calendar,      label: "Date détection",    value: format(mockNC.detectedAt, "dd MMM yyyy", { locale: fr }) },
          { icon: Clock,         label: "Échéance",          value: format(mockNC.dueDate, "dd MMM yyyy", { locale: fr }), red: status !== "closed" },
        ].map(({ icon: Icon, label, value, red }) => (
          <div key={label} className="flex shrink-0 flex-col rounded-xl border bg-white p-3 shadow-sm min-w-[120px]">
            <div className="flex items-center gap-1 text-gray-400">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
            </div>
            <span className={`mt-1 text-sm font-semibold ${red ? "text-red-600" : "text-gray-900"}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* ── Description ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <p className="text-sm leading-relaxed text-gray-700">{mockNC.description}</p>
          <div className="rounded-xl bg-blue-50 p-3">
            <p className="mb-1 text-xs font-semibold text-blue-700">Action immédiate</p>
            <p className="text-sm text-blue-800">{mockNC.immediateAction}</p>
          </div>
        </CardContent>
      </Card>

      {/* ── CAPA liée ── */}
      {createdCapa ? (
        <Link href="/capa/1">
          <div className="flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4 hover:bg-purple-100 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-200">
              <span className="text-xs font-bold text-purple-700">CA</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-purple-900">{createdCapa}</p>
              <p className="truncate text-xs text-purple-600">{capaTitle}</p>
            </div>
            <Badge variant="info" className="text-xs">Ouverte</Badge>
          </div>
        </Link>
      ) : (
        <button
          onClick={() => setCapaOpen(true)}
          disabled={status === "closed"}
          className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-4 text-left hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <Plus className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Aucune CAPA liée</p>
            <p className="text-xs text-gray-400">Cliquez pour créer une action corrective</p>
          </div>
        </button>
      )}

      {/* ── Timeline ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="h-4 w-4 text-blue-500" />
            Chronologie
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="relative pl-5">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />
            <div className="space-y-5">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`absolute left-0 flex h-4 w-4 items-center justify-center rounded-full ${timelineDot[item.type]}`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <p className="text-xs text-gray-400">{format(item.date, "dd MMM yyyy", { locale: fr })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Comments ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700">Commentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                  {c.author.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-xl bg-gray-50 p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-900">{c.author}</span>
                  <span className="text-xs text-gray-400">{c.role}</span>
                  <span className="ml-auto text-xs text-gray-400">{format(c.createdAt, "dd MMM HH:mm", { locale: fr })}</span>
                </div>
                <p className="text-sm text-gray-700">{c.content}</p>
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Ajouter un commentaire..."
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none rounded-xl"
              />
              <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" disabled={!comment.trim()} onClick={handleAddComment}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Publier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Dialog : Créer CAPA ── */}
      <Dialog open={capaOpen} onOpenChange={setCapaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <Plus className="h-4 w-4 text-purple-600" />
              </div>
              Créer une action corrective (CAPA)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <span className="font-semibold">NC liée :</span> {mockNC.reference} — {mockNC.title}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Titre de la CAPA</Label>
              <Input value={capaTitle} onChange={(e) => setCapaTitle(e.target.value)} className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Responsable</Label>
              <Input value={capaResponsible} onChange={(e) => setCapaResponsible(e.target.value)} className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Échéance cible</Label>
              <Input type="date" value={capaDueDate} onChange={(e) => setCapaDueDate(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">Annuler</Button>
            </DialogClose>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleCreateCapa}
              disabled={!capaTitle.trim() || !capaResponsible.trim()}>
              <Plus className="mr-1.5 h-4 w-4" />
              Créer la CAPA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Clôturer NC ── */}
      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              Clôturer la non-conformité
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">
              Confirmez la clôture de <span className="font-semibold">{mockNC.reference}</span>. Assurez-vous que les actions correctives ont été vérifiées et que l'efficacité a été confirmée.
            </p>
            {!createdCapa && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Aucune CAPA n'a été créée. Êtes-vous sûr de vouloir clôturer sans action corrective ?</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Motif de clôture (optionnel)</Label>
              <Textarea
                placeholder="Ex : Actions correctives vérifiées, efficacité confirmée..."
                rows={3}
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="resize-none rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">Annuler</Button>
            </DialogClose>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleCloseNC}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Confirmer la clôture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
