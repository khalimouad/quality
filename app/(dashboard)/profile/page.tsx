"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, User, Mail, Phone, Building2, Shield,
  Lock, Eye, EyeOff, CheckCircle2, Camera,
  AlertTriangle, CheckSquare, ClipboardList, FileText,
  Clock,
} from "lucide-react"
import { loadMerged, saveState } from "@/lib/storage"

const STORAGE_KEY = "qhse_profile"

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  role: string
}

const DEFAULT_FORM: ProfileForm = {
  firstName: "Admin",
  lastName: "QHSE",
  email: "admin@qhse.fr",
  phone: "+33 6 12 34 56 78",
  department: "Qualité & HSE",
  role: "Responsable QSE",
}
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const mockActivity = [
  { id: 1, type: "nc",    icon: AlertTriangle, color: "bg-red-100 text-red-600",      title: "NC-2026-023 créée",                time: "Il y a 2 h"   },
  { id: 2, type: "capa",  icon: CheckSquare,   color: "bg-amber-100 text-amber-600",   title: "CAPA-2026-018 commentée",          time: "Il y a 4 h"   },
  { id: 3, type: "audit", icon: ClipboardList, color: "bg-blue-100 text-blue-600",     title: "AUD-2026-012 planifié",            time: "Hier"          },
  { id: 4, type: "doc",   icon: FileText,      color: "bg-purple-100 text-purple-600", title: "DOC-PRO-012 approuvé",             time: "Hier"          },
  { id: 5, type: "nc",    icon: AlertTriangle, color: "bg-red-100 text-red-600",       title: "NC-2026-022 mise à jour",          time: "Il y a 2 j"   },
  { id: 6, type: "capa",  icon: CheckSquare,   color: "bg-green-100 text-green-600",   title: "CAPA-2026-015 clôturée",           time: "Il y a 3 j"   },
  { id: 7, type: "audit", icon: ClipboardList, color: "bg-blue-100 text-blue-600",     title: "AUD-2026-011 rapport soumis",      time: "Il y a 4 j"   },
  { id: 8, type: "doc",   icon: FileText,      color: "bg-purple-100 text-purple-600", title: "PRO-HSE-003 révisé",               time: "Il y a 5 j"   },
]

const stats = [
  { label: "NC créées",      value: 12, color: "text-red-600"    },
  { label: "CAPA traitées",  value: 8,  color: "text-amber-600"  },
  { label: "Audits réalisés",value: 4,  color: "text-blue-600"   },
  { label: "Docs approuvés", value: 19, color: "text-purple-600" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [form, setForm] = useState<ProfileForm>(DEFAULT_FORM)

  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable client-side after mount
    setForm(loadMerged<ProfileForm>(STORAGE_KEY, DEFAULT_FORM))
  }, [])

  const handleSave = () => {
    saveState<ProfileForm>(STORAGE_KEY, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handlePwSave = () => {
    setPw({ current: "", newPw: "", confirm: "" })
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2500)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* Back header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-bold text-gray-900">Mon profil</h2>
      </div>

      {/* Profile hero */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6 pb-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                  {`${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase() || "AD"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:text-blue-600 transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900">{form.firstName} {form.lastName}</h3>
              <p className="text-sm text-gray-500">{form.role} · {form.department}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="outline" className="text-xs">ISO 9001 Lead Auditor</Badge>
                <Badge variant="outline" className="text-xs border-green-200 text-green-700">Actif</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info"><User className="h-3.5 w-3.5" />Informations</TabsTrigger>
          <TabsTrigger value="security"><Lock className="h-3.5 w-3.5" />Sécurité</TabsTrigger>
          <TabsTrigger value="activity"><Clock className="h-3.5 w-3.5" />Activité</TabsTrigger>
        </TabsList>

        {/* ── Informations ── */}
        <TabsContent value="info">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-semibold text-gray-700">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="pb-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs text-gray-600">Prénom</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="rounded-xl h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs text-gray-600">Nom</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="rounded-xl h-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-gray-600">Adresse e-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl h-10 pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs text-gray-600">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-10 pl-9" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="department" className="text-xs text-gray-600">Département</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input id="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="rounded-xl h-10 pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs text-gray-600">Rôle (lecture seule)</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input id="role" value={form.role} disabled className="rounded-xl h-10 pl-9 bg-gray-50" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl" onClick={handleSave}>
                  Enregistrer les modifications
                </Button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" /> Sauvegardé
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Sécurité ── */}
        <TabsContent value="security">
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-700">Modifier le mot de passe</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 space-y-4">
                {[
                  { id: "current", label: "Mot de passe actuel", val: pw.current, show: showCurrent, toggle: () => setShowCurrent(!showCurrent), change: (v: string) => setPw({ ...pw, current: v }) },
                  { id: "new",     label: "Nouveau mot de passe", val: pw.newPw,  show: showNew,     toggle: () => setShowNew(!showNew),         change: (v: string) => setPw({ ...pw, newPw: v }) },
                  { id: "confirm", label: "Confirmer le mot de passe", val: pw.confirm, show: showConfirm, toggle: () => setShowConfirm(!showConfirm), change: (v: string) => setPw({ ...pw, confirm: v }) },
                ].map(({ id, label, val, show, toggle, change }) => (
                  <div key={id} className="space-y-1.5">
                    <Label htmlFor={id} className="text-xs text-gray-600">{label}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id={id}
                        type={show ? "text" : "password"}
                        value={val}
                        onChange={(e) => change(e.target.value)}
                        className="rounded-xl h-10 pl-9 pr-10"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                {pw.newPw && pw.confirm && pw.newPw !== pw.confirm && (
                  <p className="text-xs text-red-500">Les mots de passe ne correspondent pas.</p>
                )}
                <div className="flex items-center gap-3 pt-1">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                    disabled={!pw.current || !pw.newPw || pw.newPw !== pw.confirm}
                    onClick={handlePwSave}
                  >
                    Changer le mot de passe
                  </Button>
                  {pwSaved && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Modifié
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center justify-between text-sm font-semibold text-gray-700">
                  Authentification à deux facteurs
                  <Badge variant="outline" className="text-[10px]">Bientôt disponible</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5">
                <p className="text-sm text-gray-500">
                  Renforcez la sécurité de votre compte avec une authentification à deux facteurs via application mobile ou SMS.
                </p>
                <Button variant="outline" className="mt-3 rounded-xl" disabled>
                  Activer l&apos;authentification 2FA
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-700">Sessions actives</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 space-y-3">
                {[
                  { device: "Chrome · macOS", location: "Paris, France",   current: true,  time: "Maintenant" },
                  { device: "Safari · iPhone", location: "Paris, France",  current: false, time: "Il y a 2 h"  },
                  { device: "Firefox · Windows",location: "Lyon, France",  current: false, time: "Il y a 1 j"  },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.device}</p>
                      <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                    </div>
                    {s.current
                      ? <Badge variant="outline" className="text-[10px] border-green-200 text-green-700">Session actuelle</Badge>
                      : <button className="text-xs text-red-500 hover:text-red-700 font-medium">Révoquer</button>
                    }
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Activité ── */}
        <TabsContent value="activity">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-semibold text-gray-700">Mes actions récentes</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <div className="relative pl-5">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />
                <div className="space-y-5">
                  {mockActivity.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className={`absolute left-0 flex h-4 w-4 items-center justify-center rounded-full ${item.color}`}>
                          <Icon className="h-2.5 w-2.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
