"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft, Send, Calendar, User, Clock,
  ClipboardList, AlertTriangle, CheckCircle2,
  FileText, Plus, MapPin, ArrowRight,
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

const mockAudit = {
  id: "1",
  reference: "AUD-2026-012",
  title: "Audit interne ISO 9001 — Production",
  type: "internal" as const,
  status: "planned" as const,
  scope: "Département Production",
  auditor: "Sophie Moreau",
  date: new Date("2026-07-15"),
  endDate: new Date("2026-07-16"),
  duration: "2 jours",
  objective:
    "Évaluer la conformité du système de management de la qualité du département Production aux exigences de la norme ISO 9001:2015, identifier les écarts et les opportunités d'amélioration.",
  checkpoints: [
    "Revue de la documentation qualité (procédures, enregistrements)",
    "Contrôle des processus de fabrication et points de contrôle qualité",
    "Vérification de la traçabilité des produits",
    "Évaluation de la maîtrise des équipements de surveillance et mesure",
    "Revue des enregistrements des non-conformités et CAPA associées",
    "Entretiens avec les opérateurs et chefs d'équipe",
  ],
  initialFindings: [
    { id: 1, type: "NC",  description: "Enregistrements de contrôle incomplets sur poste 5",         linkedNC: null as string | null, linkedCapa: "CAPA-2026-019" as string | null },
    { id: 2, type: "OBS", description: "Affichage des instructions de travail obsolète sur poste 3",  linkedNC: null as string | null, linkedCapa: null },
    { id: 3, type: "NC",  description: "Calibration du manomètre EQ-003 en retard",                   linkedNC: null as string | null, linkedCapa: "CAPA-2026-020" as string | null },
  ],
  comments: [
    { id: 1, author: "Sophie Moreau", role: "Auditrice", content: "Préparation du plan d'audit envoyé aux audités. Demande de documents à préparer transmise.", createdAt: new Date("2026-06-20T09:00:00") },
  ],
  initialTimeline: [
    { date: new Date("2026-06-01"), event: "Audit planifié",                     type: "created" },
    { date: new Date("2026-06-20"), event: "Plan d'audit envoyé aux audités",    type: "update"  },
    { date: new Date("2026-07-15"), event: "Audit prévu — Jour 1",               type: "action"  },
    { date: new Date("2026-07-16"), event: "Audit prévu — Jour 2 + rapport",     type: "action"  },
  ],
}

const statusMap: Record<string, { label: string; variant: "destructive" | "warning" | "outline" | "default" }> = {
  planned:     { label: "Planifié",  variant: "default" },
  in_progress: { label: "En cours", variant: "warning" },
  completed:   { label: "Réalisé",  variant: "outline" },
  cancelled:   { label: "Annulé",   variant: "destructive" },
}

const typeMap: Record<string, { label: string; color: string }> = {
  internal: { label: "Interne",     color: "bg-blue-100 text-blue-700"    },
  external: { label: "Externe",     color: "bg-purple-100 text-purple-700" },
  supplier: { label: "Fournisseur", color: "bg-amber-100 text-amber-700"  },
}

const findingBadge: Record<string, string> = {
  NC:  "bg-red-100 text-red-700",
  OBS: "bg-amber-100 text-amber-700",
  OPP: "bg-green-100 text-green-700",
}

const timelineDot: Record<string, string> = {
  created: "bg-blue-500",
  action:  "bg-green-500",
  update:  "bg-amber-500",
  nc:      "bg-red-500",
}

interface Finding {
  id: number
  type: string
  description: string
  linkedNC: string | null
  linkedCapa: string | null
}

export default function AuditDetailPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [findings, setFindings]   = useState<Finding[]>(mockAudit.initialFindings)
  const [timeline, setTimeline]   = useState(mockAudit.initialTimeline)
  const [comment, setComment]     = useState("")
  const [comments, setComments]   = useState(mockAudit.comments)

  // NC creation dialog
  const [ncDialog, setNcDialog]   = useState<Finding | null>(null)
  const [ncTitle, setNcTitle]     = useState("")
  const [ncSeverity, setNcSeverity] = useState("major")
  const [ncResponsible, setNcResponsible] = useState(mockAudit.auditor)
  const [ncDueDate, setNcDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10)
  })

  // New finding dialog
  const [newFindingOpen, setNewFindingOpen] = useState(false)
  const [newFindingType, setNewFindingType] = useState("NC")
  const [newFindingDesc, setNewFindingDesc] = useState("")

  const st = statusMap[mockAudit.status]
  const tp = typeMap[mockAudit.type]

  function openNcDialog(f: Finding) {
    setNcTitle(`NC issue d'audit : ${f.description}`)
    setNcDialog(f)
  }

  function handleCreateNC() {
    if (!ncDialog) return
    const ref = `NC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
    setFindings((prev) => prev.map((f) => f.id === ncDialog.id ? { ...f, linkedNC: ref } : f))
    setTimeline((prev) => [...prev, { date: new Date(), event: `${ref} créée depuis écart #${ncDialog.id}`, type: "nc" }])
    setNcDialog(null)
    toast({ title: "NC créée avec succès", description: `${ref} a été générée et liée à cet écart d'audit.` })
  }

  function handleAddFinding() {
    if (!newFindingDesc.trim()) return
    const newF: Finding = { id: findings.length + 1, type: newFindingType, description: newFindingDesc, linkedNC: null, linkedCapa: null }
    setFindings((prev) => [...prev, newF])
    setTimeline((prev) => [...prev, { date: new Date(), event: `Écart ${newFindingType} ajouté : ${newFindingDesc.slice(0, 40)}…`, type: "nc" }])
    setNewFindingDesc("")
    setNewFindingOpen(false)
    toast({ title: "Écart ajouté", description: `L'écart a été enregistré dans le rapport d'audit.` })
  }

  function handleAddComment() {
    if (!comment.trim()) return
    setComments((prev) => [...prev, { id: Date.now(), author: "Admin", role: "Utilisateur", content: comment, createdAt: new Date() }])
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
            <span className="font-mono text-xs text-gray-400">{mockAudit.reference}</span>
            <Badge variant={st.variant} className="text-xs">{st.label}</Badge>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tp.color}`}>{tp.label}</span>
          </div>
          <h2 className="mt-0.5 text-lg font-bold leading-tight text-gray-900">{mockAudit.title}</h2>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700"
          onClick={() => toast({ title: "Rapport en cours de génération", description: "Le rapport PDF sera prêt dans quelques instants." })}>
          <FileText className="mr-1.5 h-4 w-4" />
          Rapport d'audit
        </Button>
        <Button variant="outline" size="sm" className="h-9" onClick={() => setNewFindingOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Ajouter un écart
        </Button>
      </div>

      {/* ── Info chips ── */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[
          { icon: User,          label: "Auditeur",  value: mockAudit.auditor },
          { icon: MapPin,        label: "Périmètre", value: mockAudit.scope },
          { icon: Calendar,      label: "Date",      value: format(mockAudit.date, "dd MMM yyyy", { locale: fr }) },
          { icon: Clock,         label: "Durée",     value: mockAudit.duration },
          { icon: AlertTriangle, label: "Écarts",    value: `${findings.length} écart${findings.length > 1 ? "s" : ""}`, red: findings.length > 0 },
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

      {/* ── Objective ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <ClipboardList className="h-4 w-4 text-blue-500" />
            Objectif et périmètre
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm leading-relaxed text-gray-700">{mockAudit.objective}</p>
        </CardContent>
      </Card>

      {/* ── Checkpoints ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Points à vérifier
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-2">
          {mockAudit.checkpoints.map((cp, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">{i + 1}</span>
              {cp}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Findings ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Écarts constatés
              {findings.length > 0 && (
                <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">{findings.length}</span>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setNewFindingOpen(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4 space-y-3">
          {findings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucun écart enregistré.</p>
          ) : findings.map((f) => (
            <div key={f.id} className="rounded-xl bg-gray-50 p-3">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${findingBadge[f.type] ?? "bg-gray-100 text-gray-600"}`}>{f.type}</span>
                {f.linkedNC && (
                  <Link href="/non-conformances/1">
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 hover:bg-red-200 cursor-pointer">{f.linkedNC}</span>
                  </Link>
                )}
                {f.linkedCapa && (
                  <Link href="/capa/1">
                    <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 hover:bg-purple-200 cursor-pointer">{f.linkedCapa}</span>
                  </Link>
                )}
                <div className="ml-auto flex gap-1.5">
                  {f.type === "NC" && !f.linkedNC && (
                    <button
                      onClick={() => openNcDialog(f)}
                      className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Créer NC
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700">{f.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

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
                  <div className={`absolute left-0 flex h-4 w-4 items-center justify-center rounded-full ${timelineDot[item.type] ?? "bg-gray-400"}`}>
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
              <Textarea placeholder="Ajouter un commentaire..." rows={2} value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none rounded-xl" />
              <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" disabled={!comment.trim()} onClick={handleAddComment}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Publier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Dialog : Créer NC depuis écart ── */}
      <Dialog open={!!ncDialog} onOpenChange={(open) => !open && setNcDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              Créer une NC depuis cet écart
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {ncDialog && (
              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                <span className="font-semibold">Écart source :</span> {ncDialog.description}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Titre de la NC</Label>
              <Input value={ncTitle} onChange={(e) => setNcTitle(e.target.value)} className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Sévérité</Label>
              <select
                value={ncSeverity}
                onChange={(e) => setNcSeverity(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="critical">Critique</option>
                <option value="major">Majeure</option>
                <option value="minor">Mineure</option>
                <option value="observation">Observation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Responsable</Label>
                <Input value={ncResponsible} onChange={(e) => setNcResponsible(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Échéance</Label>
                <Input type="date" value={ncDueDate} onChange={(e) => setNcDueDate(e.target.value)} className="rounded-xl" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="outline" size="sm">Annuler</Button></DialogClose>
            <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={handleCreateNC} disabled={!ncTitle.trim()}>
              <Plus className="mr-1.5 h-4 w-4" />
              Créer la NC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Nouvel écart ── */}
      <Dialog open={newFindingOpen} onOpenChange={setNewFindingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <Plus className="h-4 w-4 text-amber-600" />
              </div>
              Ajouter un écart
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Type d'écart</Label>
              <div className="flex gap-2">
                {["NC", "OBS", "OPP"].map((t) => (
                  <button key={t} onClick={() => setNewFindingType(t)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${newFindingType === t ? findingBadge[t] + " border-current" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description de l'écart</Label>
              <Textarea
                placeholder="Décrivez l'écart constaté..."
                rows={3}
                value={newFindingDesc}
                onChange={(e) => setNewFindingDesc(e.target.value)}
                className="resize-none rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="outline" size="sm">Annuler</Button></DialogClose>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleAddFinding} disabled={!newFindingDesc.trim()}>
              <Plus className="mr-1.5 h-4 w-4" />
              Enregistrer l'écart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
