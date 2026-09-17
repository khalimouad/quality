"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Settings,
  Bell,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  FileText,
  MessageSquareWarning,
  Truck,
  GraduationCap,
  Wrench,
  ShieldAlert,
  Sun,
  Monitor,
  X,
  Users,
  GitFork,
  Shield,
  KeyRound,
  Plus,
  Trash2,
  Check,
  Lock,
  Clock,
  Sliders,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { loadMerged, saveState } from "@/lib/storage"
import { useToast } from "@/components/ui/use-toast"

const STORAGE_KEY = "qhse_settings"

export interface SystemUser {
  id: string
  name: string
  email: string
  role: "Administrateur QHSE" | "Responsable Qualité" | "Pilote de Processus" | "Auditeur" | "Opérateur"
  departement: string
  status: "Actif" | "Inactif"
  lastLogin: string
}

const DEFAULT_USERS: SystemUser[] = [
  { id: "U-01", name: "Thomas Laurent", email: "thomas.laurent@qhse.fr", role: "Administrateur QHSE", departement: "Direction Générale", status: "Actif", lastLogin: "Aujourd'hui à 08:30" },
  { id: "U-02", name: "Sophie Moreau", email: "sophie.moreau@qhse.fr", role: "Responsable Qualité", departement: "Qualité & RSE", status: "Actif", lastLogin: "Aujourd'hui à 09:12" },
  { id: "U-03", name: "Antoine Leblanc", email: "antoine.leblanc@qhse.fr", role: "Pilote de Processus", departement: "Production", status: "Actif", lastLogin: "Hier à 17:45" },
  { id: "U-04", name: "Marie Martin", email: "marie.martin@qhse.fr", role: "Auditeur", departement: "HSE & Sécurité", status: "Actif", lastLogin: "Hier à 14:20" },
  { id: "U-05", name: "Pierre Bernard", email: "pierre.bernard@qhse.fr", role: "Pilote de Processus", departement: "Supply Chain", status: "Actif", lastLogin: "Il y a 2 jours" },
  { id: "U-06", name: "Luc Petit", email: "luc.petit@qhse.fr", role: "Opérateur", departement: "Atelier Usinage", status: "Actif", lastLogin: "Il y a 3 jours" },
]

interface SettingsState {
  general: { company: string; timezone: string; language: string; dateFormat: string; fiscalYear: string }
  certifications: string[]
  notifEmail: Record<string, boolean>
  notifPush: Record<string, boolean>
  moduleEnabled: Record<string, boolean>
  theme: "light" | "system"
  density: "comfortable" | "compact"
  sidebar: boolean
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

const notifTypes = [
  { key: "nc_created", label: "Nouvelle non-conformité déclarée", icon: AlertTriangle, color: "text-red-500" },
  { key: "nc_overdue", label: "Échéance NC dépassée (Retard)", icon: AlertTriangle, color: "text-red-500" },
  { key: "capa_action", label: "Action CAPA assignée ou à valider", icon: CheckSquare, color: "text-amber-500" },
  { key: "audit_remind", label: "Rappel d'audit sous 7 jours", icon: ClipboardList, color: "text-blue-500" },
  { key: "doc_expiry", label: "Document en fin de validité", icon: FileText, color: "text-purple-500" },
  { key: "complaint", label: "Nouvelle réclamation client enregistrée", icon: MessageSquareWarning, color: "text-orange-500" },
  { key: "supplier_eval", label: "Évaluation fournisseur annuelle échue", icon: Truck, color: "text-teal-500" },
]

const modules = [
  { key: "compliance", label: "Exigences & Conformité", icon: ShieldAlert, color: "bg-indigo-50 text-indigo-600" },
  { key: "control_plans", label: "Plans de Contrôle", icon: CheckSquare, color: "bg-emerald-50 text-emerald-600" },
  { key: "management_reviews", label: "Revues de Direction", icon: Sliders, color: "bg-blue-50 text-blue-600" },
  { key: "documents", label: "Gestion Documentaire (GED)", icon: FileText, color: "bg-purple-50 text-purple-600" },
  { key: "nc", label: "Non-Conformités", icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  { key: "capa", label: "Plans d'Actions (CAPA)", icon: CheckSquare, color: "bg-amber-50 text-amber-600" },
  { key: "audits", label: "Audits Internes/Externes", icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
  { key: "risks", label: "Risques & AMDEC", icon: ShieldAlert, color: "bg-red-50 text-red-700" },
  { key: "complaints", label: "Réclamations & Clients", icon: MessageSquareWarning, color: "bg-orange-50 text-orange-600" },
  { key: "suppliers", label: "Fournisseurs", icon: Truck, color: "bg-teal-50 text-teal-600" },
  { key: "training", label: "Formations & Compétences", icon: GraduationCap, color: "bg-green-50 text-green-600" },
]

const DEFAULT_SETTINGS: SettingsState = {
  general: {
    company: "Industries QHSE SAS",
    timezone: "Europe/Paris",
    language: "fr",
    dateFormat: "dd/MM/yyyy",
    fiscalYear: "Janvier",
  },
  certifications: ["ISO 9001", "ISO 14001", "ISO 45001", "ISO 50001", "IATF 16949"],
  notifEmail: {
    nc_created: true,
    nc_overdue: true,
    capa_action: true,
    audit_remind: true,
    doc_expiry: false,
    complaint: true,
    supplier_eval: false,
  },
  notifPush: {
    nc_created: true,
    nc_overdue: false,
    capa_action: true,
    audit_remind: false,
    doc_expiry: false,
    complaint: true,
    supplier_eval: false,
  },
  moduleEnabled: Object.fromEntries(modules.map((m) => [m.key, true])),
  theme: "light",
  density: "comfortable",
  sidebar: true,
}

const RBAC_PERMISSIONS = [
  {
    role: "Administrateur QHSE",
    read: true,
    write: true,
    approve: true,
    delete: true,
    export: true,
    desc: "Accès total au paramétrage, suppression et validation globale du système.",
  },
  {
    role: "Responsable Qualité",
    read: true,
    write: true,
    approve: true,
    delete: false,
    export: true,
    desc: "Gestion complète des fiches, clôture des NC, approbation documentaire et CAPA.",
  },
  {
    role: "Pilote de Processus",
    read: true,
    write: true,
    approve: true,
    delete: false,
    export: true,
    desc: "Mise à jour de son processus, saisie d'actions, approbation des PV de son périmètre.",
  },
  {
    role: "Auditeur",
    read: true,
    write: true,
    approve: false,
    delete: false,
    export: true,
    desc: "Consultation générale, émission de rapports d'audits et déclaration de constats.",
  },
  {
    role: "Opérateur / Consultant",
    read: true,
    write: true,
    approve: false,
    delete: false,
    export: false,
    desc: "Déclaration d'anomalies / NC atelier, saisie des relevés de contrôle en production.",
  },
]

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [saved, setSaved] = useState(false)

  const [general, setGeneral] = useState(DEFAULT_SETTINGS.general)
  const [certifications, setCertifications] = useState<string[]>(DEFAULT_SETTINGS.certifications)
  const [newCert, setNewCert] = useState("")
  const [addingCert, setAddingCert] = useState(false)
  const [notifEmail, setNotifEmail] = useState<Record<string, boolean>>(DEFAULT_SETTINGS.notifEmail)
  const [notifPush, setNotifPush] = useState<Record<string, boolean>>(DEFAULT_SETTINGS.notifPush)
  const [moduleEnabled, setModuleEnabled] = useState<Record<string, boolean>>(DEFAULT_SETTINGS.moduleEnabled)
  const [theme, setTheme] = useState<"light" | "system">(DEFAULT_SETTINGS.theme)
  const [density, setDensity] = useState<"comfortable" | "compact">(DEFAULT_SETTINGS.density)
  const [sidebar, setSidebar] = useState(DEFAULT_SETTINGS.sidebar)

  // Users State
  const [users, setUsers] = useState<SystemUser[]>(DEFAULT_USERS)
  const [isNewUserOpen, setIsNewUserOpen] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<SystemUser["role"]>("Pilote de Processus")
  const [newUserDept, setNewUserDept] = useState("Production")

  useEffect(() => {
    const s = loadMerged<SettingsState>(STORAGE_KEY, DEFAULT_SETTINGS)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGeneral(s.general)
    setCertifications(s.certifications)
    setNotifEmail(s.notifEmail)
    setNotifPush(s.notifPush)
    setModuleEnabled(s.moduleEnabled)
    setTheme(s.theme)
    setDensity(s.density)
    setSidebar(s.sidebar)
  }, [])

  const handleSave = () => {
    saveState<SettingsState>(STORAGE_KEY, {
      general,
      certifications,
      notifEmail,
      notifPush,
      moduleEnabled,
      theme,
      density,
      sidebar,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    toast({
      title: "Paramètres enregistrés",
      description: "Les modifications de configuration ont été sauvegardées avec succès.",
    })
  }

  const addCert = () => {
    const v = newCert.trim()
    if (v && !certifications.includes(v)) {
      setCertifications([...certifications, v])
    }
    setNewCert("")
    setAddingCert(false)
  }

  const removeCert = (cert: string) => {
    setCertifications(certifications.filter((c) => c !== cert))
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName || !newUserEmail) return

    const created: SystemUser = {
      id: `U-${String(users.length + 1).padStart(2, "0")}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      departement: newUserDept,
      status: "Actif",
      lastLogin: "Jamais connecté",
    }

    setUsers([...users, created])
    setIsNewUserOpen(false)
    setNewUserName("")
    setNewUserEmail("")

    toast({
      title: "Utilisateur créé",
      description: `Le compte pour ${created.name} (${created.role}) a été ajouté.`,
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Back header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Configuration & Administration</h2>
            <p className="text-xs text-gray-500">Pilier 6 · Rôles RBAC, workflows de validation et personnalisation</p>
          </div>
        </div>
        <SaveBar saved={saved} onSave={handleSave} />
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="h-10">
            <TabsTrigger value="general">
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Général
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Utilisateurs & Droits (RBAC)
            </TabsTrigger>
            <TabsTrigger value="workflows">
              <GitFork className="h-3.5 w-3.5 mr-1.5" />
              Workflows & Circuits
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-3.5 w-3.5 mr-1.5" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="modules">
              <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Sun className="h-3.5 w-3.5 mr-1.5" />
              Apparence
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── 1. Général ── */}
        <TabsContent value="general">
          <div className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-700">Informations de l&apos;organisme</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-600">Raison sociale</Label>
                  <Input
                    value={general.company}
                    onChange={(e) => setGeneral({ ...general, company: e.target.value })}
                    className="rounded-xl h-10 text-sm font-semibold"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-600">Fuseau horaire</Label>
                    <select
                      value={general.timezone}
                      onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Europe/Paris">Europe/Paris (UTC+2)</option>
                      <option value="Europe/London">Europe/London (UTC+1)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-600">Langue principale</Label>
                    <select
                      value={general.language}
                      onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="fr">Français (FR)</option>
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-700">Normes et Référentiels certifiés</CardTitle>
                <CardDescription className="text-xs">Systèmes certifiés déclenchant les circuits de surveillance</CardDescription>
              </CardHeader>
              <CardContent className="pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  {certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="select-none gap-1 border-blue-200 text-blue-700 pr-1">
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeCert(cert)}
                        className="rounded-full p-0.5 hover:bg-blue-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {addingCert ? (
                    <span className="inline-flex items-center gap-1">
                      <Input
                        autoFocus
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addCert()
                          if (e.key === "Escape") setAddingCert(false)
                        }}
                        className="h-7 w-28 rounded-lg text-xs"
                      />
                      <Button size="sm" className="h-7 px-2" onClick={addCert}>
                        OK
                      </Button>
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 rounded-lg text-xs"
                      onClick={() => setAddingCert(true)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Ajouter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── 2. Utilisateurs & Droits (RBAC) ── */}
        <TabsContent value="users">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Annuaire des Utilisateurs & Rôles</h3>
                <p className="text-xs text-gray-500">Gestion des profils et attribution des niveaux d&apos;habilitation</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsNewUserOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" /> Nouvel utilisateur
              </Button>
            </div>

            {/* Users Table */}
            <Card className="border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b bg-gray-50 text-gray-600 font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-3">Utilisateur</th>
                      <th className="px-4 py-3">Département</th>
                      <th className="px-4 py-3">Rôle attribué</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Dernière connexion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/80">
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-gray-400 text-[11px]">{u.email}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{u.departement}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              u.role === "Administrateur QHSE"
                                ? "destructive"
                                : u.role === "Responsable Qualité"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-[11px]">{u.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Permissions Matrix */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-blue-600" />
                  Matrice des Droits d&apos;Accès Granulaires par Rôle (RBAC)
                </CardTitle>
                <CardDescription className="text-xs">
                  Permissions applicables aux modules GED, NC, CAPA, Contrôles et Audits
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b bg-gray-50 text-gray-600 font-semibold uppercase">
                      <tr>
                        <th className="px-3 py-2.5">Rôle</th>
                        <th className="px-3 py-2.5 text-center">Lecture</th>
                        <th className="px-3 py-2.5 text-center">Création / Écriture</th>
                        <th className="px-3 py-2.5 text-center">Approbation / Visa</th>
                        <th className="px-3 py-2.5 text-center">Suppression</th>
                        <th className="px-3 py-2.5 text-center">Export</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {RBAC_PERMISSIONS.map((perm) => (
                        <tr key={perm.role}>
                          <td className="px-3 py-3">
                            <span className="font-bold text-gray-900">{perm.role}</span>
                            <p className="text-[11px] text-gray-500 mt-0.5">{perm.desc}</p>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Check className="h-4 w-4 mx-auto text-green-600" />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Check className="h-4 w-4 mx-auto text-green-600" />
                          </td>
                          <td className="px-3 py-3 text-center">
                            {perm.approve ? (
                              <Check className="h-4 w-4 mx-auto text-green-600" />
                            ) : (
                              <span className="text-gray-300 font-mono">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {perm.delete ? (
                              <Check className="h-4 w-4 mx-auto text-red-600" />
                            ) : (
                              <span className="text-gray-300 font-mono">-</span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {perm.export ? (
                              <Check className="h-4 w-4 mx-auto text-blue-600" />
                            ) : (
                              <span className="text-gray-300 font-mono">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── 3. Workflows & Circuits de Validation ── */}
        <TabsContent value="workflows">
          <div className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Circuits de Signature & Workflows de Validation
                </CardTitle>
                <CardDescription className="text-xs">
                  Personnalisation des étapes d&apos;approbation et des délais impartis par processus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-5">
                {[
                  {
                    name: "Circuit GED (Gestion Documentaire)",
                    desc: "Validation formelle des procédures, consignes et fiches de poste",
                    etapes: [
                      { role: "Rédacteur", action: "Élaboration du brouillon" },
                      { role: "Vérificateur Métier", action: "Revue technique & faisabilité" },
                      { role: "Responsable Qualité", action: "Approbation finale & diffusion" },
                    ],
                    sla: "Délai max : 14 jours",
                  },
                  {
                    name: "Circuit Non-Conformités & 8D",
                    desc: "Détection, analyse causale, mesures conservatoires et clôture",
                    etapes: [
                      { role: "Opérateur / Déclarant", action: "Déclaration d'anomalie" },
                      { role: "Pilote Traitement", action: "Analyse des causes & plan d'action" },
                      { role: "Assurance Qualité", action: "Vérification d'efficacité & clôture" },
                    ],
                    sla: "Délai max : 30 jours",
                  },
                  {
                    name: "Circuit Dérogations Qualité",
                    desc: "Autorisation exceptionnelle de libération lot hors spécification",
                    etapes: [
                      { role: "Contrôleur", action: "Émission demande de dérogation" },
                      { role: "Ingénieur Méthodes", action: "Avis technique & risque client" },
                      { role: "Directeur Général", action: "Visa d'approbation dérogation" },
                    ],
                    sla: "Délai max : 48 heures",
                  },
                ].map((wf, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{wf.name}</h4>
                        <p className="text-[11px] text-gray-500">{wf.desc}</p>
                      </div>
                      <span className="rounded bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        {wf.sla}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row items-center gap-2">
                      {wf.etapes.map((etp, i) => (
                        <div key={i} className="flex-1 w-full rounded-lg bg-white p-2.5 border text-xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Étape {i + 1}</span>
                          <p className="font-bold text-gray-800">{etp.role}</p>
                          <p className="text-gray-500 text-[11px] truncate">{etp.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── 4. Notifications ── */}
        <TabsContent value="notifications">
          <div className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-700">Préférences de notification</CardTitle>
                <CardDescription className="text-xs">Choisissez les canaux d&apos;alerte par type d&apos;événement</CardDescription>
              </CardHeader>
              <CardContent className="pb-5">
                <div className="divide-y divide-gray-100">
                  <div className="grid grid-cols-12 pb-2 text-xs font-medium text-gray-400">
                    <span className="col-span-8">Événement</span>
                    <span className="col-span-2 text-center">E-mail</span>
                    <span className="col-span-2 text-center">Push / In-App</span>
                  </div>
                  {notifTypes.map(({ key, label, icon: Icon, color }) => (
                    <div key={key} className="grid grid-cols-12 items-center py-3">
                      <div className="col-span-8 flex items-center gap-3">
                        <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                        <span className="text-xs font-medium text-gray-800">{label}</span>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Toggle
                          checked={notifEmail[key] ?? false}
                          onChange={() => setNotifEmail({ ...notifEmail, [key]: !notifEmail[key] })}
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Toggle
                          checked={notifPush[key] ?? false}
                          onChange={() => setNotifPush({ ...notifPush, [key]: !notifPush[key] })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── 5. Modules ── */}
        <TabsContent value="modules">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-semibold text-gray-700">Activation des modules</CardTitle>
              <CardDescription className="text-xs">Activez ou désactivez les fonctionnalités selon vos besoins</CardDescription>
            </CardHeader>
            <CardContent className="pb-5 space-y-2">
              {modules.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{label}</span>
                  </div>
                  <Toggle
                    checked={moduleEnabled[key] ?? true}
                    onChange={() => setModuleEnabled({ ...moduleEnabled, [key]: !moduleEnabled[key] })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── 6. Apparence ── */}
        <TabsContent value="appearance">
          <div className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-700">Thème</CardTitle>
              </CardHeader>
              <CardContent className="pb-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "light" as const, icon: Sun, label: "Clair", preview: "bg-white border-2" },
                    { val: "system" as const, icon: Monitor, label: "Système", preview: "bg-gradient-to-br from-white to-gray-800 border-2" },
                  ].map(({ val, icon: Icon, label, preview }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTheme(val)}
                      className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                        theme === val ? "border-2 border-blue-500 bg-blue-50" : "border border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`h-12 w-full rounded-lg ${preview} ${theme === val ? "border-blue-300" : "border-gray-200"}`}>
                        <div className="flex items-center gap-1 p-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">{label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm font-semibold text-gray-700">Densité d&apos;affichage</CardTitle>
              </CardHeader>
              <CardContent className="pb-5 space-y-2">
                {[
                  { val: "comfortable" as const, label: "Confortable", desc: "Plus d'espacement pour une meilleure lisibilité" },
                  { val: "compact" as const, label: "Compact", desc: "Plus d'éléments visibles à l'écran" },
                ].map(({ val, label, desc }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDensity(val)}
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-all ${
                      density === val ? "border-2 border-blue-500 bg-blue-50" : "border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium text-gray-900">{label}</p>
                      <p className="text-[11px] text-gray-400">{desc}</p>
                    </div>
                    {density === val && <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add User Modal */}
      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Ajouter un utilisateur</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Attribuez un compte et définissez le rôle de sécurité dans le système QHSE.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs">Nom complet *</Label>
              <Input
                placeholder="ex: Jean Dupont"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs">Adresse e-mail professionnelle *</Label>
              <Input
                type="email"
                placeholder="ex: j.dupont@entreprise.fr"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Rôle (Profil RBAC)</Label>
                <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as SystemUser["role"])}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrateur QHSE">Administrateur QHSE</SelectItem>
                    <SelectItem value="Responsable Qualité">Responsable Qualité</SelectItem>
                    <SelectItem value="Pilote de Processus">Pilote de Processus</SelectItem>
                    <SelectItem value="Auditeur">Auditeur</SelectItem>
                    <SelectItem value="Opérateur">Opérateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Département</Label>
                <Input
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewUserOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Créer l&apos;utilisateur
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SaveBar({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl text-xs h-9" onClick={onSave}>
        Enregistrer les modifications
      </Button>
      {saved && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
          <CheckCircle2 className="h-4 w-4" /> Enregistré
        </span>
      )}
    </div>
  )
}
