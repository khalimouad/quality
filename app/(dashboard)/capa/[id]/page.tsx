"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft, Send, Calendar, User, Clock,
  CheckCircle2, CheckSquare, AlertTriangle, ListChecks,
  CircleDot, Shield, FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const mockCAPA = {
  id: "1",
  reference: "CAPA-2026-018",
  title: "Révision des paramètres de soudage TIG",
  type: "corrective" as const,
  status: "in_progress" as const,
  ncRef: "NC-2026-023",
  ncId: "1",
  assignedTo: "Jean Dupont",
  createdBy: "Sophie Moreau",
  createdAt: new Date("2026-06-03"),
  dueDate: new Date("2026-07-15"),
  progress: 60,
  rootCause:
    "Analyse 5 Pourquoi : le paramètre d'intensité du poste de soudage TIG n°3 était réglé à 95A au lieu des 85A requis. La cause racine identifiée est l'absence de verrouillage du réglage et une formation insuffisante des opérateurs sur la procédure de réglage.",
  actions: [
    { id: 1, label: "Ajuster et verrouiller l'intensité à 85A sur tous les postes",         done: true  },
    { id: 2, label: "Former les opérateurs sur la procédure de réglage soudage TIG",         done: true  },
    { id: 3, label: "Mettre à jour la fiche de réglage affichée sur chaque poste",           done: true  },
    { id: 4, label: "Inspecter les pièces P-456 de la série concernée",                      done: false },
    { id: 5, label: "Vérifier l'efficacité des réglages sur 3 lots consécutifs",             done: false },
    { id: 6, label: "Validation finale par le Responsable QSE",                              done: false },
  ],
  comments: [
    { id: 1, author: "Sophie Moreau", role: "Responsable QSE",  content: "Analyse 5 Pourquoi réalisée. La cause racine a été identifiée : mauvais réglage de l'intensité.", createdAt: new Date("2026-06-03T10:00:00") },
    { id: 2, author: "Jean Dupont",   role: "Technicien",        content: "Actions 1, 2 et 3 réalisées. Réglages verrouillés, opérateurs formés, fiches mises à jour.", createdAt: new Date("2026-06-05T14:30:00") },
  ],
  timeline: [
    { date: new Date("2026-06-03"), event: "CAPA créée suite à NC-2026-023",        type: "created" },
    { date: new Date("2026-06-03"), event: "Analyse 5 Pourquoi réalisée",           type: "update"  },
    { date: new Date("2026-06-04"), event: "Réglages corrigés et verrouillés",      type: "action"  },
    { date: new Date("2026-06-05"), event: "Formation opérateurs réalisée",         type: "action"  },
  ],
}

const statusMap: Record<string, { label: string; variant: "destructive" | "warning" | "outline" | "default" }> = {
  open:        { label: "Ouverte",    variant: "destructive" },
  in_progress: { label: "En cours",  variant: "warning" },
  verified:    { label: "Vérifiée",  variant: "default" },
  closed:      { label: "Fermée",    variant: "outline" },
}

const timelineDot: Record<string, string> = {
  created: "bg-blue-500",
  action:  "bg-green-500",
  update:  "bg-amber-500",
  capa:    "bg-purple-500",
}

export default function CAPADetailPage() {
  const router = useRouter()
  const [comment, setComment] = useState("")
  const st = statusMap[mockCAPA.status]
  const doneCount = mockCAPA.actions.filter((a) => a.done).length

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-gray-400">{mockCAPA.reference}</span>
            <Badge variant={st.variant} className="text-xs">{st.label}</Badge>
            <Badge variant="outline" className="text-xs text-blue-700 border-blue-200">
              {mockCAPA.type === "corrective" ? "Corrective" : "Préventive"}
            </Badge>
          </div>
          <h2 className="mt-0.5 text-lg font-bold leading-tight text-gray-900">{mockCAPA.title}</h2>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="h-9 bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="mr-1.5 h-4 w-4" />
          Marquer vérifiée
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Shield className="mr-1.5 h-4 w-4" />
          Clôturer CAPA
        </Button>
      </div>

      {/* Info chips */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[
          { icon: User,     label: "Assignée à",   value: mockCAPA.assignedTo },
          { icon: User,     label: "Créée par",    value: mockCAPA.createdBy },
          { icon: Calendar, label: "Création",     value: format(mockCAPA.createdAt, "dd MMM yyyy", { locale: fr }) },
          { icon: Clock,    label: "Échéance",     value: format(mockCAPA.dueDate, "dd MMM yyyy", { locale: fr }), red: true },
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

      {/* Progress */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Avancement global</span>
            <span className="text-sm font-bold text-blue-600">{mockCAPA.progress}%</span>
          </div>
          <Progress value={mockCAPA.progress} className="h-2" />
          <p className="mt-2 text-xs text-gray-400">{doneCount}/{mockCAPA.actions.length} actions réalisées</p>
        </CardContent>
      </Card>

      {/* Root cause */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Cause racine
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm leading-relaxed text-gray-700">{mockCAPA.rootCause}</p>
        </CardContent>
      </Card>

      {/* Actions plan */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <ListChecks className="h-4 w-4 text-blue-500" />
            Plan d'actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-2">
          {mockCAPA.actions.map((action) => (
            <div key={action.id} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${action.done ? "bg-green-500" : "bg-gray-200"}`}>
                {action.done && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <p className={`text-sm ${action.done ? "text-gray-400 line-through" : "text-gray-700"}`}>{action.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* NC liée */}
      <Link href={`/non-conformances/${mockCAPA.ncId}`}>
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 hover:bg-red-100 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-200">
            <span className="text-xs font-bold text-red-700">NC</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-900">{mockCAPA.ncRef}</p>
            <p className="truncate text-xs text-red-600">Défaut de soudage sur pièce P-456</p>
          </div>
          <ArrowLeft className="h-4 w-4 rotate-180 text-red-400" />
        </div>
      </Link>

      {/* Timeline */}
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
              {mockCAPA.timeline.map((item, idx) => (
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

      {/* Comments */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700">Commentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          {mockCAPA.comments.map((c) => (
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
              <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700" disabled={!comment.trim()}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Publier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
