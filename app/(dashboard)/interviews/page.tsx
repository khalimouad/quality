"use client"

import { useState } from "react"
import { Users2, CalendarDays, CheckCircle2, Clock, TrendingUp, BookOpen, Brain, ChevronRight } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface Interview {
  id: number
  employee: string
  role: string
  date: string
  type: string
  progress: number
  status: "done" | "in_progress" | "planned"
  knowledgeCaptured: string[]
}

const interviews: Interview[] = [
  {
    id: 1,
    employee: "Jean Dupont",
    role: "Responsable qualité",
    date: "3 juin 2026",
    type: "Capitalisation expertise",
    progress: 100,
    status: "done",
    knowledgeCaptured: ["Processus d'audit interne ISO 9001", "Gestion des non-conformités critiques", "Méthode 5 Pourquoi appliquée en production"],
  },
  {
    id: 2,
    employee: "Marie Martin",
    role: "Ingénieur HSE senior",
    date: "5 juin 2026",
    type: "Transfert de compétences",
    progress: 75,
    status: "in_progress",
    knowledgeCaptured: ["Analyse JSA pour postes à risque élevé", "Gestion des permis de travail (PTW)"],
  },
  {
    id: 3,
    employee: "Pierre Bernard",
    role: "Technicien environnement",
    date: "10 juin 2026",
    type: "Capitalisation expertise",
    progress: 50,
    status: "in_progress",
    knowledgeCaptured: ["Suivi des rejets aqueux réglementaires"],
  },
  {
    id: 4,
    employee: "Sophie Moreau",
    role: "Auditrice interne",
    date: "17 juin 2026",
    type: "Passation de poste",
    progress: 20,
    status: "planned",
    knowledgeCaptured: [],
  },
  {
    id: 5,
    employee: "Antoine Leblanc",
    role: "Expert soudage",
    date: "24 juin 2026",
    type: "Capitalisation expertise",
    progress: 0,
    status: "planned",
    knowledgeCaptured: [],
  },
]

const guideSection = [
  { title: "1. Présentation et objectifs", content: "Expliquer l'objectif KM de l'entretien. Mettre l'interviewé en confiance. Rappeler que les savoirs seront valorisés, pas utilisés contre lui." },
  { title: "2. Identification des savoirs clés", content: "Quels sont les savoirs, techniques ou méthodes que vous maîtrisez mieux que les autres ? Quelles situations complexes avez-vous gérées qui demandent votre expertise ?" },
  { title: "3. Contexte et conditions d'application", content: "Dans quels contextes ces savoirs s'appliquent-ils ? Quelles sont les conditions critiques de succès ? Quels sont les pièges à éviter ?" },
  { title: "4. Sources d'apprentissage", content: "Comment avez-vous acquis ces savoirs ? (expérience, formation, mentor) Existe-t-il des documents, procédures ou guides existants ?" },
  { title: "5. Transmission et accessibilité", content: "À qui transmettez-vous ces savoirs aujourd'hui ? Comment pourrait-on les rendre accessibles rapidement à un nouvel arrivant ?" },
  { title: "6. Risques et points d'attention", content: "Quels sont les risques si ces savoirs ne sont pas transmis ? Y a-t-il des décisions critiques qui dépendent de votre expertise unique ?" },
  { title: "7. Plan d'action de capitalisation", content: "Proposer un plan : rédaction de procédures, mentorat, vidéo de référence, foire aux questions, etc. Définir des échéances et un porteur de suivi." },
]

function statusConfig(status: Interview["status"]) {
  if (status === "done") return { label: "Terminé", variant: "success" as const }
  if (status === "in_progress") return { label: "En cours", variant: "warning" as const }
  return { label: "Planifié", variant: "outline" as const }
}

export default function InterviewsPage() {
  const [showGuide, setShowGuide] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  const done = interviews.filter((i) => i.status === "done").length
  const inProgress = interviews.filter((i) => i.status === "in_progress").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Entretiens de capitalisation"
        description="Entretiens individuels de transfert de connaissances et capitalisation d'expertise"
        icon={Users2}
      >
        <Button size="sm" onClick={() => setShowGuide(true)}>
          <BookOpen className="mr-2 h-4 w-4" />
          Guide d&apos;entretien
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Entretiens planifiés" value={interviews.length} icon={CalendarDays} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <StatCard title="Réalisés" value={done} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="En cours" value={inProgress} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Taux complétion" value={`${Math.round((done / interviews.length) * 100)} %`} icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-50" />
      </div>

      <div className="space-y-3">
        {interviews.map((interview) => {
          const sc = statusConfig(interview.status)
          return (
            <Card
              key={interview.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedInterview(interview)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{interview.employee}</span>
                      <span className="text-sm text-gray-500">— {interview.role}</span>
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                      <Badge variant="outline" className="text-xs">{interview.type}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-400">{interview.date}</span>
                      {interview.knowledgeCaptured.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {interview.knowledgeCaptured.length} savoir(s) capturé(s)
                        </span>
                      )}
                    </div>
                    {interview.status !== "planned" && (
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={interview.progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-gray-500 shrink-0">{interview.progress}%</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Interview detail dialog */}
      <Dialog open={!!selectedInterview} onOpenChange={(o) => !o && setSelectedInterview(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedInterview?.employee} — {selectedInterview?.type}
            </DialogTitle>
          </DialogHeader>
          {selectedInterview && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                {selectedInterview.role} · {selectedInterview.date}
              </div>
              {selectedInterview.knowledgeCaptured.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">Savoirs capturés :</p>
                  <ul className="space-y-1">
                    {selectedInterview.knowledgeCaptured.map((k) => (
                      <li key={k} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedInterview.status === "planned" && (
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  Entretien planifié — cliquez sur &quot;Démarrer&quot; pour lancer la session de capitalisation.
                </div>
              )}
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Fermer</Button>
                </DialogClose>
                <Button size="sm">
                  {selectedInterview.status === "planned" ? "Démarrer" : "Continuer"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Guide modal */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Guide d&apos;entretien de capitalisation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {guideSection.map((section, i) => (
              <div key={i} className="rounded-lg border border-gray-100 p-4">
                <p className="mb-1.5 text-sm font-semibold text-gray-800">{section.title}</p>
                <p className="text-sm text-gray-600">{section.content}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
