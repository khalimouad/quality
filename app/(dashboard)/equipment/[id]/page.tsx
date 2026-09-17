"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft, Send, Calendar, User, Clock,
  Wrench, CheckCircle2, AlertTriangle, MapPin, Gauge,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const mockEquipment = {
  id: "1",
  code: "EQ-001",
  name: "Pied à coulisse numérique",
  type: "Mesure" as const,
  location: "Atelier usinage",
  status: "operational" as const,
  responsible: "Jean Dupont",
  lastCalibration: new Date("2026-01-15"),
  nextCalibration: new Date("2027-01-15"),
  manufacturer: "Mitutoyo",
  model: "CD-15CPX",
  serialNumber: "S/N 28740521",
  measureRange: "0 — 150 mm",
  resolution: "0,01 mm",
  description:
    "Pied à coulisse numérique de précision utilisé pour le contrôle dimensionnel des pièces usinées. Conforme aux exigences de la procédure PR-METRO-003. Étalonné selon la chaîne d'étalonnage traçable COFRAC.",
  calibrationHistory: [
    { date: new Date("2026-01-15"), result: "Conforme",      certificate: "CERT-2026-0042", performed_by: "LNE Métrologie" },
    { date: new Date("2025-01-20"), result: "Conforme",      certificate: "CERT-2025-0031", performed_by: "LNE Métrologie" },
    { date: new Date("2024-01-18"), result: "Conforme",      certificate: "CERT-2024-0028", performed_by: "LNE Métrologie" },
    { date: new Date("2023-01-22"), result: "Non-conforme",  certificate: "CERT-2023-0019", performed_by: "LNE Métrologie" },
  ],
  maintenanceLog: [
    { date: new Date("2026-01-15"), action: "Nettoyage et vérification mors lors de l'étalonnage annuel" },
    { date: new Date("2025-06-10"), action: "Remplacement batterie" },
    { date: new Date("2023-02-05"), action: "Remplacement après constat de non-conformité — nouvel instrument commandé" },
  ],
  comments: [
    { id: 1, author: "Jean Dupont", role: "Technicien qualité", content: "Instrument en très bon état. Prochain étalonnage planifié en janvier 2027.", createdAt: new Date("2026-01-16T08:30:00") },
  ],
}

const statusMap: Record<string, { label: string; variant: "destructive" | "warning" | "outline" | "default"; color: string }> = {
  operational:     { label: "Opérationnel",      variant: "outline",      color: "bg-green-100 text-green-700" },
  maintenance:     { label: "En maintenance",    variant: "warning",      color: "bg-amber-100 text-amber-700" },
  calibration_due: { label: "Étalonnage requis", variant: "destructive",  color: "bg-red-100 text-red-700" },
  out_of_service:  { label: "Hors service",      variant: "destructive",  color: "bg-gray-100 text-gray-700" },
}

const typeColor: Record<string, string> = {
  Mesure:       "bg-blue-100 text-blue-700",
  Production:   "bg-purple-100 text-purple-700",
  Sécurité:     "bg-red-100 text-red-700",
  Laboratoire:  "bg-green-100 text-green-700",
}

const resultColor: Record<string, string> = {
  "Conforme":     "text-green-600",
  "Non-conforme": "text-red-600",
}

export default function EquipmentDetailPage() {
  const router = useRouter()
  const [comment, setComment] = useState("")
  const st = statusMap[mockEquipment.status]
  const tc = typeColor[mockEquipment.type] ?? "bg-gray-100 text-gray-700"
  const daysUntilCalib = Math.ceil((mockEquipment.nextCalibration.getTime() - Date.now()) / 86400000)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-gray-400">{mockEquipment.code}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${st.color}`}>{st.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${tc}`}>{mockEquipment.type}</span>
          </div>
          <h2 className="mt-0.5 text-lg font-bold leading-tight text-gray-900">{mockEquipment.name}</h2>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700">
          <Gauge className="mr-1.5 h-4 w-4" />
          Planifier étalonnage
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Wrench className="mr-1.5 h-4 w-4" />
          Signaler maintenance
        </Button>
      </div>

      {/* Info chips */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {[
          { icon: User,     label: "Responsable",      value: mockEquipment.responsible },
          { icon: MapPin,   label: "Localisation",     value: mockEquipment.location },
          { icon: Calendar, label: "Dernier étalon.",  value: format(mockEquipment.lastCalibration, "dd MMM yyyy", { locale: fr }) },
          { icon: Clock,    label: "Prochain étalon.", value: format(mockEquipment.nextCalibration, "dd MMM yyyy", { locale: fr }), red: daysUntilCalib < 90 },
        ].map(({ icon: Icon, label, value, red }) => (
          <div key={label} className="flex shrink-0 flex-col rounded-xl border bg-white p-3 shadow-sm min-w-[130px]">
            <div className="flex items-center gap-1 text-gray-400">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
            </div>
            <span className={`mt-1 text-sm font-semibold ${red ? "text-red-600" : "text-gray-900"}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Specs */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Wrench className="h-4 w-4 text-blue-500" />
            Caractéristiques
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="mb-3 text-sm leading-relaxed text-gray-700">{mockEquipment.description}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Fabricant",    value: mockEquipment.manufacturer },
              { label: "Modèle",       value: mockEquipment.model },
              { label: "N° de série",  value: mockEquipment.serialNumber },
              { label: "Plage mesure", value: mockEquipment.measureRange },
              { label: "Résolution",   value: mockEquipment.resolution },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calibration history */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Gauge className="h-4 w-4 text-blue-500" />
            Historique d'étalonnage
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-2">
          {mockEquipment.calibrationHistory.map((h, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{format(h.date, "dd MMM yyyy", { locale: fr })}</p>
                <p className="text-xs text-gray-400">{h.performed_by} — {h.certificate}</p>
              </div>
              <span className={`text-sm font-semibold shrink-0 ${resultColor[h.result] ?? "text-gray-600"}`}>
                {h.result}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Maintenance log */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Wrench className="h-4 w-4 text-amber-500" />
            Journal de maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="relative pl-5">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />
            <div className="space-y-5">
              {mockEquipment.maintenanceLog.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="absolute left-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.action}</p>
                    <p className="text-xs text-gray-400">{format(m.date, "dd MMM yyyy", { locale: fr })}</p>
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
          {mockEquipment.comments.map((c) => (
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
