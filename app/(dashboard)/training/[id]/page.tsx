"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft, Send, Calendar, User, Clock,
  GraduationCap, CheckCircle2, Users, Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const mockTraining = {
  id: "4",
  title: "Audit interne ISO 19011",
  category: "Qualité",
  trainer: "AFNOR Compétences",
  date: new Date("2026-06-15"),
  endDate: new Date("2026-06-17"),
  durationHours: 21,
  participants: 8,
  status: "in_progress" as const,
  completion: 60,
  location: "Salle de formation B — Bâtiment admin",
  description:
    "Formation à la conduite d'audits internes selon les lignes directrices de la norme ISO 19011:2018. Les participants apprendront à planifier, préparer, réaliser et suivre des audits internes de systèmes de management (qualité, environnement, SST).",
  program: [
    { day: "Jour 1", content: "Introduction à l'audit — Principes, types et vocabulaire ISO 19011" },
    { day: "Jour 2", content: "Préparation et conduite des audits — Listes de vérification, entretiens" },
    { day: "Jour 3", content: "Rapport d'audit, suivi des écarts et exercices pratiques" },
  ],
  participants_list: [
    { name: "Jean Dupont",    role: "Technicien qualité",  status: "present" },
    { name: "Marie Martin",   role: "Contrôleuse QSE",     status: "present" },
    { name: "Luc Petit",      role: "Chef d'atelier",      status: "present" },
    { name: "Claire Durand",  role: "Responsable méthodes",status: "absent" },
    { name: "Marc Leroy",     role: "Technicien HSE",      status: "present" },
    { name: "Alice Robin",    role: "Assistante qualité",  status: "present" },
    { name: "Paul Garnier",   role: "Opérateur production",status: "pending" },
    { name: "Hélène Morin",   role: "Technicienne labo",   status: "pending" },
  ],
  comments: [
    { id: 1, author: "Sophie Moreau", role: "Responsable QSE", content: "Formation en cours. Jours 1 et 2 réalisés. Très bon retour des participants sur les exercices pratiques.", createdAt: new Date("2026-06-16T17:00:00") },
  ],
}

const statusMap: Record<string, { label: string; variant: "destructive" | "warning" | "outline" | "default" }> = {
  planned:     { label: "Planifiée",   variant: "default" },
  in_progress: { label: "En cours",   variant: "warning" },
  completed:   { label: "Terminée",   variant: "outline" },
  cancelled:   { label: "Annulée",    variant: "destructive" },
}

const participantStatus: Record<string, { label: string; color: string }> = {
  present: { label: "Présent",  color: "bg-green-100 text-green-700" },
  absent:  { label: "Absent",   color: "bg-red-100 text-red-700" },
  pending: { label: "En attente", color: "bg-gray-100 text-gray-500" },
}

const categoryColor: Record<string, string> = {
  Qualité:        "bg-blue-100 text-blue-700",
  Sécurité:       "bg-red-100 text-red-700",
  Environnement:  "bg-green-100 text-green-700",
  Métier:         "bg-purple-100 text-purple-700",
  Réglementaire:  "bg-amber-100 text-amber-700",
}

export default function TrainingDetailPage() {
  const router = useRouter()
  const [comment, setComment] = useState("")
  const st = statusMap[mockTraining.status]
  const catColor = categoryColor[mockTraining.category] ?? "bg-gray-100 text-gray-700"
  const presentCount = mockTraining.participants_list.filter((p) => p.status === "present").length

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={st.variant} className="text-xs">{st.label}</Badge>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${catColor}`}>{mockTraining.category}</span>
          </div>
          <h2 className="mt-0.5 text-lg font-bold leading-tight text-gray-900">{mockTraining.title}</h2>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="h-9 bg-green-600 hover:bg-green-700">
          <Award className="mr-1.5 h-4 w-4" />
          Émettre attestations
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <CheckCircle2 className="mr-1.5 h-4 w-4" />
          Clôturer formation
        </Button>
      </div>

      {/* Info chips */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[
          { icon: User,     label: "Formateur",    value: mockTraining.trainer },
          { icon: Calendar, label: "Date début",   value: format(mockTraining.date, "dd MMM yyyy", { locale: fr }) },
          { icon: Clock,    label: "Durée",        value: `${mockTraining.durationHours}h` },
          { icon: Users,    label: "Participants", value: `${mockTraining.participants} pers.` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex shrink-0 flex-col rounded-xl border bg-white p-3 shadow-sm min-w-[120px]">
            <div className="flex items-center gap-1 text-gray-400">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
            </div>
            <span className="mt-1 text-sm font-semibold text-gray-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Avancement de la formation</span>
            <span className="text-sm font-bold text-blue-600">{mockTraining.completion}%</span>
          </div>
          <Progress value={mockTraining.completion} className="h-2" />
          <p className="mt-2 text-xs text-gray-400">
            {presentCount}/{mockTraining.participants} participants présents
          </p>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <GraduationCap className="h-4 w-4 text-blue-500" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-4">
          <p className="text-sm leading-relaxed text-gray-700">{mockTraining.description}</p>
          <div className="rounded-xl bg-blue-50 p-3">
            <p className="mb-2 text-xs font-semibold text-blue-700">Lieu</p>
            <p className="text-sm text-blue-800">{mockTraining.location}</p>
          </div>
        </CardContent>
      </Card>

      {/* Program */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="h-4 w-4 text-amber-500" />
            Programme
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-3">
          {mockTraining.program.map((p, i) => (
            <div key={i} className="flex gap-3 rounded-xl bg-gray-50 p-3">
              <span className="shrink-0 text-xs font-bold text-blue-600 mt-0.5 w-14">{p.day}</span>
              <p className="text-sm text-gray-700">{p.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Participants */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Users className="h-4 w-4 text-blue-500" />
            Participants ({mockTraining.participants_list.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-2">
          {mockTraining.participants_list.map((p) => {
            const ps = participantStatus[p.status]
            return (
              <div key={p.name} className="flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-bold">
                    {p.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 truncate">{p.role}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${ps.color}`}>
                  {ps.label}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold text-gray-700">Commentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          {mockTraining.comments.map((c) => (
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
