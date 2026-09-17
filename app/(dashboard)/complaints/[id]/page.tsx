"use client"

import { useRouter, useParams } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  User,
  Building2,
  Phone,
  Mail,
  CalendarDays,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { mockComplaints } from "../page"

const statusConfig: Record<string, { label: string; variant: "destructive" | "warning" | "info" | "success" }> = {
  new: { label: "Nouvelle", variant: "destructive" },
  investigating: { label: "En investigation", variant: "warning" },
  resolved: { label: "Résolue", variant: "info" },
  closed: { label: "Clôturée", variant: "success" },
}

const severityConfig: Record<string, { label: string; variant: "destructive" | "warning" | "outline" }> = {
  critical: { label: "Critique", variant: "destructive" },
  major: { label: "Majeure", variant: "warning" },
  minor: { label: "Mineure", variant: "outline" },
}

const timeline = [
  { date: new Date("2026-05-12"), author: "Système", text: "Réclamation enregistrée automatiquement." },
  { date: new Date("2026-05-13"), author: "Sophie Moreau", text: "Réclamation assignée à l'équipe qualité pour investigation." },
  { date: new Date("2026-05-16"), author: "Jean Dupont", text: "Premier contact client établi. Demande d'échantillons retournés pour analyse." },
  { date: new Date("2026-05-22"), author: "Jean Dupont", text: "Analyse des échantillons en cours au laboratoire. Résultats attendus sous 5 jours." },
]

const messages = [
  { date: new Date("2026-05-12"), from: "Client", author: "M. Renault (client)", text: "Bonjour, nous avons reçu votre livraison avec plusieurs pièces endommagées lors du transport. Nous avons pris des photos et souhaitons un remboursement ou remplacement urgent." },
  { date: new Date("2026-05-13"), from: "Interne", author: "Sophie Moreau", text: "Bonjour M. Renault, nous avons bien reçu votre réclamation et nous vous remercions de nous en avoir informé. Une enquête est en cours. Nous revenons vers vous sous 48h." },
  { date: new Date("2026-05-16"), from: "Client", author: "M. Renault (client)", text: "Merci pour votre retour. Ci-joint les photos des dommages constatés. Nous avons besoin d'une réponse rapide car ces pièces bloquent notre production." },
  { date: new Date("2026-05-17"), from: "Interne", author: "Jean Dupont", text: "Nous avons bien reçu les photos. L'analyse des causes est en cours. Nous vous enverrons notre rapport d'ici le 25 mai avec les mesures correctives proposées." },
]

export default function ComplaintDetailPage() {
  const router = useRouter()
  const params = useParams()
  const complaint = mockComplaints.find((c) => c.id === params.id) ?? mockComplaints[0]
  const status = statusConfig[complaint.status]
  const severity = severityConfig[complaint.severity]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mt-1 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-gray-500">{complaint.reference}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant={severity.variant}>{severity.label}</Badge>
            <Badge variant={complaint.type === "client" ? "info" : "secondary"}>
              {complaint.type === "client" ? "Client" : "Fournisseur"}
            </Badge>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{complaint.subject}</h2>
        </div>
        <Button className="shrink-0 bg-blue-600 hover:bg-blue-700">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Clôturer
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="treatment">Traitement</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        {/* DETAILS TAB */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {complaint.subject}. Des dommages ont été constatés à la réception de la livraison.
                    Le client signale que plusieurs unités présentent des défauts visibles incompatibles avec les
                    spécifications contractuelles. Une investigation complète est requise pour déterminer l&apos;origine
                    du problème (transport, conditionnement ou fabrication).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Chronologie</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{event.author}</span>
                            <span className="text-xs text-gray-400">
                              {format(event.date, "dd MMM yyyy", { locale: fr })}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-600">{event.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    { icon: Building2, label: "Partie concernée", value: complaint.party },
                    { icon: User, label: "Contact", value: "M. Laurent Renault" },
                    { icon: Mail, label: "Email", value: "l.renault@client.fr" },
                    { icon: Phone, label: "Téléphone", value: "+33 6 12 34 56 78" },
                    { icon: CalendarDays, label: "Reçue le", value: format(complaint.receivedDate, "dd MMM yyyy", { locale: fr }) },
                    { icon: Clock, label: "Échéance", value: format(complaint.dueDate, "dd MMM yyyy", { locale: fr }) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <Icon className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="font-medium text-gray-900">{value}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TREATMENT TAB */}
        <TabsContent value="treatment">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[
              { title: "Cause identifiée", content: "Analyse en cours. Les premières hypothèses pointent vers un conditionnement insuffisant lors de l'expédition. L'emballage secondaire ne protège pas contre les chocs latéraux." },
              { title: "Action immédiate", content: "Remplacement prioritaire des pièces endommagées expédié sous 72h. Crédit commercial accordé au client pour les frais de retour." },
              { title: "Action corrective (CAPA)", content: "Révision complète des spécifications d'emballage pour les pièces fragiles. Validation avec le service logistique d'ici le 15 juillet 2026." },
              { title: "Responsable traitement", content: "Jean Dupont – Responsable Qualité Production. Suivi hebdomadaire jusqu'à clôture." },
            ].map(({ title, content }) => (
              <Card key={title}>
                <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* COMMUNICATION TAB */}
        <TabsContent value="communication">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "Interne" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-lg rounded-xl p-4 text-sm ${msg.from === "Interne" ? "bg-blue-50 text-blue-900" : "bg-gray-100 text-gray-800"}`}>
                  <div className="mb-1 flex items-center justify-between gap-4">
                    <span className="font-semibold text-xs">{msg.author}</span>
                    <span className="text-xs opacity-60">{format(msg.date, "dd MMM", { locale: fr })}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Textarea placeholder="Rédiger un message ou une note interne..." rows={3} />
                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
