"use client"

import { FileText, CheckCircle2, Clock, AlertCircle, Download, CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

const csrdSections = [
  { id: "bp", title: "Base de préparation (BP)", status: "done", progress: 100, deadline: "Jan 2026", pages: 8 },
  { id: "gov", title: "Gouvernance (GOV)", status: "done", progress: 100, deadline: "Fév 2026", pages: 12 },
  { id: "srs", title: "Stratégie et modèle d'affaires (SRS)", status: "done", progress: 100, deadline: "Fév 2026", pages: 15 },
  { id: "iro", title: "Impacts, risques et opportunités (IRO)", status: "in_progress", progress: 70, deadline: "Juil 2026", pages: 20 },
  { id: "e1", title: "ESRS E1 — Changement climatique", status: "in_progress", progress: 60, deadline: "Août 2026", pages: 18 },
  { id: "e2_5", title: "ESRS E2-E5 — Autres thèmes env.", status: "pending", progress: 25, deadline: "Sep 2026", pages: 14 },
  { id: "s1", title: "ESRS S1 — Effectifs de l'entreprise", status: "in_progress", progress: 55, deadline: "Août 2026", pages: 16 },
  { id: "s2_4", title: "ESRS S2-S4 — Social chaîne valeur", status: "pending", progress: 15, deadline: "Sep 2026", pages: 10 },
  { id: "g1", title: "ESRS G1 — Conduite des affaires", status: "done", progress: 100, deadline: "Mar 2026", pages: 9 },
]

const calendar = [
  { date: "30 juin 2026", milestone: "Données Scope 1 et 2 finalisées", done: false },
  { date: "31 août 2026", milestone: "Rédaction ESRS E1-S1 complète", done: false },
  { date: "30 sep 2026", milestone: "Rapport CSRD complet pour révision interne", done: false },
  { date: "31 oct 2026", milestone: "Envoi à l'OTI (vérificateur tiers)", done: false },
  { date: "30 nov 2026", milestone: "Rapport CSRD finalisé et certifié", done: false },
  { date: "31 jan 2027", milestone: "Publication dans le rapport de gestion annuel", done: false },
]

function StatusBadge({ status }: { status: string }) {
  if (status === "done") return <Badge variant="success">Terminé</Badge>
  if (status === "in_progress") return <Badge variant="warning">En cours</Badge>
  return <Badge variant="outline">À faire</Badge>
}

export default function EsgReportPage() {
  const { toast } = useToast()
  const done = csrdSections.filter((s) => s.status === "done").length
  const inProgress = csrdSections.filter((s) => s.status === "in_progress").length
  const overallProgress = Math.round(csrdSections.reduce((sum, s) => sum + s.progress, 0) / csrdSections.length)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rapport CSRD"
        description="Préparation du rapport de durabilité CSRD — conformité ESRS et vérification OTI"
        icon={FileText}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast({ title: "Export PDF", description: "Génération du rapport CSRD en cours de développement." })}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter le draft
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Avancement global" value={`${overallProgress}%`} icon={FileText} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard title="Sections terminées" value={done} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" />
        <StatCard title="En cours" value={inProgress} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <StatCard title="Délai publication" value="Jan 2027" icon={CalendarDays} iconColor="text-blue-600" iconBg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Sections ESRS — Avancement</CardTitle>
              <CardDescription>Conformité CSRD par section de l&apos;état de durabilité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {csrdSections.map((section) => (
                  <div key={section.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-800 flex-1 truncate">{section.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400">{section.deadline}</span>
                        <StatusBadge status={section.status} />
                        <span className="text-xs font-medium text-gray-600 w-8 text-right">{section.progress}%</span>
                      </div>
                    </div>
                    <Progress value={section.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Calendrier CSRD</CardTitle>
            <CardDescription>Jalons clés de publication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calendar.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-green-100" : "bg-gray-100"}`}>
                    {item.done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{item.milestone}</p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
