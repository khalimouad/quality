"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft, ArrowRight, FileText, BookOpen, Layers,
  List, GitBranch, Shield, ClipboardList, Activity,
  Plus, Trash2, CheckCircle2, Save, Eye, Loader2,
} from "lucide-react"
import { downloadAsPdf } from "@/lib/pdf"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ── Document type definitions ─────────────────────────────────────────────────

const DOC_TYPES = [
  {
    key: "procedure",
    label: "Procédure",
    icon: FileText,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    activeColor: "border-blue-500 bg-blue-50 ring-2 ring-blue-200",
    desc: "Décrit comment réaliser une activité de manière standardisée",
    prefix: "PRO",
    example: "PRO-QUA-001",
  },
  {
    key: "instruction",
    label: "Instruction de Travail",
    icon: List,
    color: "bg-green-50 border-green-200 text-green-700",
    activeColor: "border-green-500 bg-green-50 ring-2 ring-green-200",
    desc: "Instructions étape par étape pour une opération spécifique",
    prefix: "IW",
    example: "IW-PROD-001",
  },
  {
    key: "gamme",
    label: "Gamme de Fabrication",
    icon: Layers,
    color: "bg-purple-50 border-purple-200 text-purple-700",
    activeColor: "border-purple-500 bg-purple-50 ring-2 ring-purple-200",
    desc: "Séquence d'opérations de fabrication d'une pièce",
    prefix: "GAM",
    example: "GAM-2026-001",
  },
  {
    key: "plan_op",
    label: "Plan Opératoire",
    icon: GitBranch,
    color: "bg-amber-50 border-amber-200 text-amber-700",
    activeColor: "border-amber-500 bg-amber-50 ring-2 ring-amber-200",
    desc: "Phases et activités d'un processus opérationnel",
    prefix: "PO",
    example: "PO-PROD-001",
  },
  {
    key: "manuel",
    label: "Manuel Qualité",
    icon: BookOpen,
    color: "bg-red-50 border-red-200 text-red-700",
    activeColor: "border-red-500 bg-red-50 ring-2 ring-red-200",
    desc: "Document de référence du système de management qualité",
    prefix: "MQ",
    example: "MQ-2026-001",
  },
  {
    key: "politique",
    label: "Politique Qualité",
    icon: Shield,
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    activeColor: "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200",
    desc: "Engagement de la direction et orientations qualité",
    prefix: "POL",
    example: "POL-QUA-001",
  },
  {
    key: "formulaire",
    label: "Formulaire / Enregistrement",
    icon: ClipboardList,
    color: "bg-teal-50 border-teal-200 text-teal-700",
    activeColor: "border-teal-500 bg-teal-50 ring-2 ring-teal-200",
    desc: "Support de collecte et d'enregistrement de données",
    prefix: "FOR",
    example: "FOR-QUA-001",
  },
  {
    key: "plan_surv",
    label: "Plan de Surveillance",
    icon: Activity,
    color: "bg-orange-50 border-orange-200 text-orange-700",
    activeColor: "border-orange-500 bg-orange-50 ring-2 ring-orange-200",
    desc: "Plan de contrôle des caractéristiques produit/processus",
    prefix: "PS",
    example: "PS-PROD-001",
  },
]

// ── Form state helpers ────────────────────────────────────────────────────────

function makeStep(id: number) { return { id, action: "", description: "", responsible: "", record: "" } }
function makeOp(id: number) { return { id, opNumber: String(id * 10), description: "", machine: "", tooling: "", time: "", controls: "" } }
function makePhase(id: number) { return { id, phase: "", activity: "", responsible: "", duration: "", kpi: "" } }
function makeField(id: number) { return { id, label: "", type: "Texte", required: false } }
function makeControl(id: number) { return { id, characteristic: "", spec: "", method: "", frequency: "", responsible: "", record: "" } }
function makeProcess(id: number) { return { id, name: "", type: "Pilotage", pilot: "" } }

function initialForm(type: string) {
  const today = format(new Date(), "yyyy-MM-dd")
  const base = { reference: "", title: "", version: "v1.0", author: "", date: today, company: "Industries QHSE SAS", approvedBy: "" }
  switch (type) {
    case "procedure":
      return { ...base, objective: "", scope: "", responsible: "", frequency: "Annuelle", relatedDocs: "", definitions: "", steps: [makeStep(1)] }
    case "instruction":
      return { ...base, equipment: "", safetyWarnings: "", materials: "", steps: [{ id: 1, instruction: "", check: "" }], finalChecks: "" }
    case "gamme":
      return { ...base, partName: "", drawingNumber: "", material: "", quantity: "1", operations: [makeOp(1)] }
    case "plan_op":
      return { ...base, process: "", inputs: "", outputs: "", resources: "", phases: [makePhase(1)] }
    case "manuel":
      return { ...base, sector: "", director: "", policy: "", applicationScope: "", standards: "ISO 9001:2015", processes: [makeProcess(1)] }
    case "politique":
      return { ...base, director: "", context: "", commitments: [""], objectives: [""] }
    case "formulaire":
      return { ...base, purpose: "", retentionPeriod: "5 ans", fields: [makeField(1)] }
    case "plan_surv":
      return { ...base, product: "", process: "", controls: [makeControl(1)] }
    default:
      return base
  }
}

// ── Form components per type ──────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 pt-2">{children}</h4>
}

function FormBase({ f, set }: { f: any; set: (k: string, v: any) => void }) {
  return (
    <>
      <SectionTitle>Identification</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Référence">
          <Input className="h-9 rounded-lg" value={f.reference} onChange={(e) => set("reference", e.target.value)} placeholder="PRO-QUA-001" />
        </FieldRow>
        <FieldRow label="Version">
          <Input className="h-9 rounded-lg" value={f.version} onChange={(e) => set("version", e.target.value)} />
        </FieldRow>
      </div>
      <FieldRow label="Titre du document">
        <Input className="h-9 rounded-lg" value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Saisir le titre..." />
      </FieldRow>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Rédigé par">
          <Input className="h-9 rounded-lg" value={f.author} onChange={(e) => set("author", e.target.value)} placeholder="Nom Prénom" />
        </FieldRow>
        <FieldRow label="Approuvé par">
          <Input className="h-9 rounded-lg" value={f.approvedBy} onChange={(e) => set("approvedBy", e.target.value)} placeholder="Nom Prénom" />
        </FieldRow>
      </div>
    </>
  )
}

function FormProcedure({ f, set, update }: { f: any; set: any; update: any }) {
  const addStep = () => set("steps", [...f.steps, makeStep(f.steps.length + 1)])
  const removeStep = (id: number) => set("steps", f.steps.filter((s: any) => s.id !== id))
  const setStep = (id: number, k: string, v: string) =>
    set("steps", f.steps.map((s: any) => s.id === id ? { ...s, [k]: v } : s))
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Contenu</SectionTitle>
      <FieldRow label="Objectif">
        <Textarea className="rounded-lg resize-none" rows={2} value={f.objective} onChange={(e) => set("objective", e.target.value)} placeholder="Décrire l'objectif de cette procédure..." />
      </FieldRow>
      <FieldRow label="Domaine d'application">
        <Textarea className="rounded-lg resize-none" rows={2} value={f.scope} onChange={(e) => set("scope", e.target.value)} placeholder="À qui s'applique cette procédure..." />
      </FieldRow>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Responsable">
          <Input className="h-9 rounded-lg" value={f.responsible} onChange={(e) => set("responsible", e.target.value)} />
        </FieldRow>
        <FieldRow label="Fréquence de révision">
          <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={f.frequency} onChange={(e) => set("frequency", e.target.value)}>
            {["Annuelle","Bisannuelle","Tous les 3 ans","À la demande"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </FieldRow>
      </div>
      <FieldRow label="Documents de référence">
        <Input className="h-9 rounded-lg" value={f.relatedDocs} onChange={(e) => set("relatedDocs", e.target.value)} placeholder="ISO 9001, PRO-QUA-002..." />
      </FieldRow>
      <SectionTitle>Déroulement ({f.steps.length} étape{f.steps.length > 1 ? "s" : ""})</SectionTitle>
      {f.steps.map((s: any, i: number) => (
        <div key={s.id} className="rounded-xl border bg-gray-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600">Étape {i + 1}</span>
            {f.steps.length > 1 && (
              <button onClick={() => removeStep(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            )}
          </div>
          <Input className="h-8 rounded-lg text-sm" placeholder="Action" value={s.action} onChange={(e) => setStep(s.id, "action", e.target.value)} />
          <Textarea className="rounded-lg resize-none text-sm" rows={2} placeholder="Description détaillée" value={s.description} onChange={(e) => setStep(s.id, "description", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Input className="h-8 rounded-lg text-sm" placeholder="Responsable" value={s.responsible} onChange={(e) => setStep(s.id, "responsible", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Enregistrement" value={s.record} onChange={(e) => setStep(s.id, "record", e.target.value)} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addStep} className="rounded-lg h-8 w-full border-dashed">
        <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une étape
      </Button>
    </>
  )
}

function FormInstruction({ f, set }: { f: any; set: any }) {
  const addStep = () => set("steps", [...f.steps, { id: f.steps.length + 1, instruction: "", check: "" }])
  const removeStep = (id: number) => set("steps", f.steps.filter((s: any) => s.id !== id))
  const setStep = (id: number, k: string, v: string) =>
    set("steps", f.steps.map((s: any) => s.id === id ? { ...s, [k]: v } : s))
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Détails</SectionTitle>
      <FieldRow label="Équipement / Poste concerné">
        <Input className="h-9 rounded-lg" value={f.equipment} onChange={(e) => set("equipment", e.target.value)} />
      </FieldRow>
      <FieldRow label="Matériels et outillages nécessaires">
        <Input className="h-9 rounded-lg" value={f.materials} onChange={(e) => set("materials", e.target.value)} placeholder="Clé 12mm, pince, EPI..." />
      </FieldRow>
      <FieldRow label="Avertissements sécurité">
        <Textarea className="rounded-lg resize-none" rows={2} value={f.safetyWarnings} onChange={(e) => set("safetyWarnings", e.target.value)} placeholder="⚠ Porter les EPI..." />
      </FieldRow>
      <SectionTitle>Instructions étape par étape</SectionTitle>
      {f.steps.map((s: any, i: number) => (
        <div key={s.id} className="rounded-xl border bg-gray-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-green-600">Étape {i + 1}</span>
            {f.steps.length > 1 && <button onClick={() => removeStep(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>}
          </div>
          <Textarea className="rounded-lg resize-none text-sm" rows={2} placeholder="Instruction détaillée" value={s.instruction} onChange={(e) => setStep(s.id, "instruction", e.target.value)} />
          <Input className="h-8 rounded-lg text-sm" placeholder="Contrôle qualité associé (optionnel)" value={s.check} onChange={(e) => setStep(s.id, "check", e.target.value)} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addStep} className="rounded-lg h-8 w-full border-dashed">
        <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une étape
      </Button>
      <FieldRow label="Contrôles qualité finaux">
        <Textarea className="rounded-lg resize-none" rows={2} value={f.finalChecks} onChange={(e) => set("finalChecks", e.target.value)} placeholder="Vérifications à effectuer en fin d'opération..." />
      </FieldRow>
    </>
  )
}

function FormGamme({ f, set }: { f: any; set: any }) {
  const addOp = () => set("operations", [...f.operations, makeOp(f.operations.length + 1)])
  const removeOp = (id: number) => set("operations", f.operations.filter((o: any) => o.id !== id))
  const setOp = (id: number, k: string, v: string) =>
    set("operations", f.operations.map((o: any) => o.id === id ? { ...o, [k]: v } : o))
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Identification pièce</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Désignation pièce">
          <Input className="h-9 rounded-lg" value={f.partName} onChange={(e) => set("partName", e.target.value)} />
        </FieldRow>
        <FieldRow label="N° de plan">
          <Input className="h-9 rounded-lg" value={f.drawingNumber} onChange={(e) => set("drawingNumber", e.target.value)} />
        </FieldRow>
        <FieldRow label="Matière">
          <Input className="h-9 rounded-lg" value={f.material} onChange={(e) => set("material", e.target.value)} placeholder="Acier 316L, Aluminium..." />
        </FieldRow>
        <FieldRow label="Quantité">
          <Input className="h-9 rounded-lg" value={f.quantity} onChange={(e) => set("quantity", e.target.value)} />
        </FieldRow>
      </div>
      <SectionTitle>Opérations ({f.operations.length})</SectionTitle>
      {f.operations.map((op: any, i: number) => (
        <div key={op.id} className="rounded-xl border bg-gray-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600">Op. {op.opNumber}</span>
            {f.operations.length > 1 && <button onClick={() => removeOp(op.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>}
          </div>
          <Input className="h-8 rounded-lg text-sm" placeholder="Description opération" value={op.description} onChange={(e) => setOp(op.id, "description", e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Input className="h-8 rounded-lg text-sm" placeholder="Machine / Poste" value={op.machine} onChange={(e) => setOp(op.id, "machine", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Outillage" value={op.tooling} onChange={(e) => setOp(op.id, "tooling", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Temps (min)" value={op.time} onChange={(e) => setOp(op.id, "time", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Contrôle qualité" value={op.controls} onChange={(e) => setOp(op.id, "controls", e.target.value)} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addOp} className="rounded-lg h-8 w-full border-dashed">
        <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une opération
      </Button>
    </>
  )
}

function FormPlanOp({ f, set }: { f: any; set: any }) {
  const addPhase = () => set("phases", [...f.phases, makePhase(f.phases.length + 1)])
  const removePhase = (id: number) => set("phases", f.phases.filter((p: any) => p.id !== id))
  const setPhase = (id: number, k: string, v: string) =>
    set("phases", f.phases.map((p: any) => p.id === id ? { ...p, [k]: v } : p))
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Description du processus</SectionTitle>
      <FieldRow label="Processus concerné"><Input className="h-9 rounded-lg" value={f.process} onChange={(e) => set("process", e.target.value)} /></FieldRow>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Données d'entrée"><Input className="h-9 rounded-lg" value={f.inputs} onChange={(e) => set("inputs", e.target.value)} placeholder="Commande client, cahier des charges..." /></FieldRow>
        <FieldRow label="Données de sortie"><Input className="h-9 rounded-lg" value={f.outputs} onChange={(e) => set("outputs", e.target.value)} placeholder="Produit fini, rapport..." /></FieldRow>
      </div>
      <FieldRow label="Ressources nécessaires"><Input className="h-9 rounded-lg" value={f.resources} onChange={(e) => set("resources", e.target.value)} placeholder="Personnel, équipements, logiciels..." /></FieldRow>
      <SectionTitle>Phases opératoires ({f.phases.length})</SectionTitle>
      {f.phases.map((p: any, i: number) => (
        <div key={p.id} className="rounded-xl border bg-gray-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600">Phase {i + 1}</span>
            {f.phases.length > 1 && <button onClick={() => removePhase(p.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input className="h-8 rounded-lg text-sm" placeholder="Libellé phase" value={p.phase} onChange={(e) => setPhase(p.id, "phase", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Activité principale" value={p.activity} onChange={(e) => setPhase(p.id, "activity", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Responsable" value={p.responsible} onChange={(e) => setPhase(p.id, "responsible", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Durée" value={p.duration} onChange={(e) => setPhase(p.id, "duration", e.target.value)} />
          </div>
          <Input className="h-8 rounded-lg text-sm" placeholder="Indicateur / Critère de sortie" value={p.kpi} onChange={(e) => setPhase(p.id, "kpi", e.target.value)} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addPhase} className="rounded-lg h-8 w-full border-dashed">
        <Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter une phase
      </Button>
    </>
  )
}

function FormManuel({ f, set }: { f: any; set: any }) {
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Entreprise</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Nom de l'entreprise"><Input className="h-9 rounded-lg" value={f.company} onChange={(e) => set("company", e.target.value)} /></FieldRow>
        <FieldRow label="Secteur d'activité"><Input className="h-9 rounded-lg" value={f.sector} onChange={(e) => set("sector", e.target.value)} placeholder="Industrie, Services..." /></FieldRow>
      </div>
      <FieldRow label="Dirigeant / Représentant direction"><Input className="h-9 rounded-lg" value={f.director} onChange={(e) => set("director", e.target.value)} /></FieldRow>
      <FieldRow label="Normes de référence"><Input className="h-9 rounded-lg" value={f.standards} onChange={(e) => set("standards", e.target.value)} placeholder="ISO 9001:2015, ISO 14001:2015..." /></FieldRow>
      <FieldRow label="Domaine d'application">
        <Textarea className="rounded-lg resize-none" rows={2} value={f.applicationScope} onChange={(e) => set("applicationScope", e.target.value)} placeholder="Périmètre couvert par le SMQ..." />
      </FieldRow>
      <FieldRow label="Politique qualité">
        <Textarea className="rounded-lg resize-none" rows={3} value={f.policy} onChange={(e) => set("policy", e.target.value)} placeholder="Engagement de la direction..." />
      </FieldRow>
    </>
  )
}

function FormPolitique({ f, set }: { f: any; set: any }) {
  const updateList = (key: string, idx: number, val: string) =>
    set(key, f[key].map((v: string, i: number) => i === idx ? val : v))
  const addItem = (key: string) => set(key, [...f[key], ""])
  const removeItem = (key: string, idx: number) => set(key, f[key].filter((_: string, i: number) => i !== idx))
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Informations</SectionTitle>
      <FieldRow label="Dirigeant"><Input className="h-9 rounded-lg" value={f.director} onChange={(e) => set("director", e.target.value)} /></FieldRow>
      <FieldRow label="Contexte de l'entreprise">
        <Textarea className="rounded-lg resize-none" rows={2} value={f.context} onChange={(e) => set("context", e.target.value)} placeholder="Secteur, activités, enjeux..." />
      </FieldRow>
      <SectionTitle>Engagements qualité</SectionTitle>
      {f.commitments.map((c: string, i: number) => (
        <div key={i} className="flex gap-2">
          <Input className="h-9 rounded-lg flex-1 text-sm" placeholder={`Engagement ${i + 1}`} value={c} onChange={(e) => updateList("commitments", i, e.target.value)} />
          {f.commitments.length > 1 && <button onClick={() => removeItem("commitments", i)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => addItem("commitments")} className="rounded-lg h-8 w-full border-dashed"><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un engagement</Button>
      <SectionTitle>Objectifs qualité</SectionTitle>
      {f.objectives.map((o: string, i: number) => (
        <div key={i} className="flex gap-2">
          <Input className="h-9 rounded-lg flex-1 text-sm" placeholder={`Objectif ${i + 1}`} value={o} onChange={(e) => updateList("objectives", i, e.target.value)} />
          {f.objectives.length > 1 && <button onClick={() => removeItem("objectives", i)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => addItem("objectives")} className="rounded-lg h-8 w-full border-dashed"><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un objectif</Button>
    </>
  )
}

function FormFormulaire({ f, set }: { f: any; set: any }) {
  const addField = () => set("fields", [...f.fields, makeField(f.fields.length + 1)])
  const removeField = (id: number) => set("fields", f.fields.filter((fi: any) => fi.id !== id))
  const setField = (id: number, k: string, v: any) =>
    set("fields", f.fields.map((fi: any) => fi.id === id ? { ...fi, [k]: v } : fi))
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Détails</SectionTitle>
      <FieldRow label="Objet / finalité"><Textarea className="rounded-lg resize-none" rows={2} value={f.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="Quel est l'objectif de ce formulaire..." /></FieldRow>
      <FieldRow label="Durée de conservation"><Input className="h-9 rounded-lg" value={f.retentionPeriod} onChange={(e) => set("retentionPeriod", e.target.value)} /></FieldRow>
      <SectionTitle>Champs du formulaire ({f.fields.length})</SectionTitle>
      {f.fields.map((fi: any, i: number) => (
        <div key={fi.id} className="flex items-center gap-2 rounded-xl border bg-gray-50 p-2.5">
          <span className="text-xs font-bold text-teal-600 w-5 shrink-0">{i + 1}</span>
          <Input className="h-8 rounded-lg flex-1 text-sm" placeholder="Libellé du champ" value={fi.label} onChange={(e) => setField(fi.id, "label", e.target.value)} />
          <select className="h-8 rounded-lg border border-input text-xs px-2" value={fi.type} onChange={(e) => setField(fi.id, "type", e.target.value)}>
            {["Texte","Nombre","Date","Case à cocher","Liste","Signature"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <label className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
            <input type="checkbox" checked={fi.required} onChange={(e) => setField(fi.id, "required", e.target.checked)} className="rounded" /> Requis
          </label>
          {f.fields.length > 1 && <button onClick={() => removeField(fi.id)} className="text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addField} className="rounded-lg h-8 w-full border-dashed"><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un champ</Button>
    </>
  )
}

function FormPlanSurv({ f, set }: { f: any; set: any }) {
  const addControl = () => set("controls", [...f.controls, makeControl(f.controls.length + 1)])
  const removeControl = (id: number) => set("controls", f.controls.filter((c: any) => c.id !== id))
  const setControl = (id: number, k: string, v: string) =>
    set("controls", f.controls.map((c: any) => c.id === id ? { ...c, [k]: v } : c))
  return (
    <>
      <FormBase f={f} set={set} />
      <SectionTitle>Identification</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Produit / Référence"><Input className="h-9 rounded-lg" value={f.product} onChange={(e) => set("product", e.target.value)} /></FieldRow>
        <FieldRow label="Processus"><Input className="h-9 rounded-lg" value={f.process} onChange={(e) => set("process", e.target.value)} /></FieldRow>
      </div>
      <SectionTitle>Points de contrôle ({f.controls.length})</SectionTitle>
      {f.controls.map((c: any, i: number) => (
        <div key={c.id} className="rounded-xl border bg-gray-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-600">Contrôle {i + 1}</span>
            {f.controls.length > 1 && <button onClick={() => removeControl(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input className="h-8 rounded-lg text-sm" placeholder="Caractéristique contrôlée" value={c.characteristic} onChange={(e) => setControl(c.id, "characteristic", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Spécification / tolérance" value={c.spec} onChange={(e) => setControl(c.id, "spec", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Méthode de contrôle" value={c.method} onChange={(e) => setControl(c.id, "method", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Fréquence" value={c.frequency} onChange={(e) => setControl(c.id, "frequency", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Responsable" value={c.responsible} onChange={(e) => setControl(c.id, "responsible", e.target.value)} />
            <Input className="h-8 rounded-lg text-sm" placeholder="Enregistrement" value={c.record} onChange={(e) => setControl(c.id, "record", e.target.value)} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addControl} className="rounded-lg h-8 w-full border-dashed"><Plus className="mr-1.5 h-3.5 w-3.5" /> Ajouter un point de contrôle</Button>
    </>
  )
}

// ── Preview components ────────────────────────────────────────────────────────

function DocHeader({ f, typeName }: { f: any; typeName: string }) {
  const today = format(new Date(), "dd/MM/yyyy")
  return (
    <table className="w-full border-collapse text-[10px] mb-4" style={{ borderColor: "#333" }}>
      <tbody>
        <tr>
          <td rowSpan={4} className="border border-gray-400 p-2 w-1/3 align-middle text-center">
            <div className="font-bold text-sm">{f.company || "NOM ENTREPRISE"}</div>
            <div className="text-gray-500 text-[9px] mt-0.5">Logo</div>
          </td>
          <td colSpan={2} className="border border-gray-400 p-1.5 text-center font-bold text-xs">{typeName.toUpperCase()}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-1 text-gray-500">Référence</td>
          <td className="border border-gray-400 p-1 font-mono font-bold">{f.reference || "—"}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-1 text-gray-500">Version</td>
          <td className="border border-gray-400 p-1">{f.version || "v1.0"}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-1 text-gray-500">Date</td>
          <td className="border border-gray-400 p-1">{f.date ? format(new Date(f.date), "dd/MM/yyyy") : today}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-1 text-gray-500">Rédigé par</td>
          <td className="border border-gray-400 p-1" colSpan={2}>{f.author || "—"}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-1 text-gray-500">Approuvé par</td>
          <td className="border border-gray-400 p-1" colSpan={2}>{f.approvedBy || "—"}</td>
        </tr>
      </tbody>
    </table>
  )
}

function DocSection({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="font-bold text-[11px] border-b border-gray-300 pb-0.5 mb-1.5">{num}. {title.toUpperCase()}</div>
      <div className="text-[10px] text-gray-700 pl-2">{children}</div>
    </div>
  )
}

function PreviewProcedure({ f }: { f: any }) {
  return (
    <div className="font-sans text-[10px]">
      <DocHeader f={f} typeName="Procédure" />
      <div className="text-center font-bold text-xs mb-3 uppercase">{f.title || "TITRE DE LA PROCÉDURE"}</div>
      <DocSection num={1} title="Objet">{f.objective || <em className="text-gray-400">À compléter...</em>}</DocSection>
      <DocSection num={2} title="Domaine d'application">{f.scope || <em className="text-gray-400">À compléter...</em>}</DocSection>
      <DocSection num={3} title="Responsabilités">Responsable : {f.responsible || "—"} | Fréquence de révision : {f.frequency || "—"}</DocSection>
      {f.relatedDocs && <DocSection num={4} title="Documents de référence">{f.relatedDocs}</DocSection>}
      <DocSection num={f.relatedDocs ? 5 : 4} title="Déroulement">
        <table className="w-full border-collapse text-[9px] mt-1">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-1 text-left w-6">No</th>
              <th className="border border-gray-300 p-1 text-left">Action</th>
              <th className="border border-gray-300 p-1 text-left">Description</th>
              <th className="border border-gray-300 p-1 text-left w-16">Resp.</th>
              <th className="border border-gray-300 p-1 text-left w-20">Enreg.</th>
            </tr>
          </thead>
          <tbody>
            {f.steps?.map((s: any, i: number) => (
              <tr key={s.id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                <td className="border border-gray-300 p-1 text-center">{i + 1}</td>
                <td className="border border-gray-300 p-1">{s.action || <em className="text-gray-400">—</em>}</td>
                <td className="border border-gray-300 p-1">{s.description || <em className="text-gray-400">—</em>}</td>
                <td className="border border-gray-300 p-1">{s.responsible || "—"}</td>
                <td className="border border-gray-300 p-1">{s.record || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>
    </div>
  )
}

function PreviewInstruction({ f }: { f: any }) {
  return (
    <div className="font-sans text-[10px]">
      <DocHeader f={f} typeName="Instruction de Travail" />
      <div className="text-center font-bold text-xs mb-3 uppercase">{f.title || "TITRE DE L'INSTRUCTION"}</div>
      {f.safetyWarnings && <div className="border border-red-300 bg-red-50 rounded p-2 mb-2 text-red-800 text-[10px]">⚠ SÉCURITÉ : {f.safetyWarnings}</div>}
      {f.equipment && <DocSection num={1} title="Équipement concerné">{f.equipment}</DocSection>}
      {f.materials && <DocSection num={2} title="Matériels nécessaires">{f.materials}</DocSection>}
      <DocSection num={3} title="Instructions">
        {f.steps?.map((s: any, i: number) => (
          <div key={s.id} className="mb-1.5 pl-1">
            <span className="font-bold">Étape {i + 1} : </span>{s.instruction || <em className="text-gray-400">À compléter...</em>}
            {s.check && <div className="text-green-700 pl-4">✓ Contrôle : {s.check}</div>}
          </div>
        ))}
      </DocSection>
      {f.finalChecks && <DocSection num={4} title="Contrôles finaux">{f.finalChecks}</DocSection>}
    </div>
  )
}

function PreviewGamme({ f }: { f: any }) {
  return (
    <div className="font-sans text-[10px]">
      <DocHeader f={f} typeName="Gamme de Fabrication" />
      <div className="text-center font-bold text-xs mb-3 uppercase">{f.title || "GAMME DE FABRICATION"}</div>
      <table className="w-full border-collapse text-[9px] mb-3">
        <tbody>
          <tr>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50 w-1/4">Désignation</td>
            <td className="border border-gray-300 p-1">{f.partName || "—"}</td>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50 w-1/4">N° plan</td>
            <td className="border border-gray-300 p-1">{f.drawingNumber || "—"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50">Matière</td>
            <td className="border border-gray-300 p-1">{f.material || "—"}</td>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50">Quantité</td>
            <td className="border border-gray-300 p-1">{f.quantity || "1"}</td>
          </tr>
        </tbody>
      </table>
      <table className="w-full border-collapse text-[9px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1">No op.</th>
            <th className="border border-gray-300 p-1 text-left">Description</th>
            <th className="border border-gray-300 p-1 text-left">Machine</th>
            <th className="border border-gray-300 p-1 text-left">Outillage</th>
            <th className="border border-gray-300 p-1">Tps (min)</th>
            <th className="border border-gray-300 p-1 text-left">Contrôle</th>
          </tr>
        </thead>
        <tbody>
          {f.operations?.map((op: any, i: number) => (
            <tr key={op.id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
              <td className="border border-gray-300 p-1 text-center font-mono">{op.opNumber}</td>
              <td className="border border-gray-300 p-1">{op.description || "—"}</td>
              <td className="border border-gray-300 p-1">{op.machine || "—"}</td>
              <td className="border border-gray-300 p-1">{op.tooling || "—"}</td>
              <td className="border border-gray-300 p-1 text-center">{op.time || "—"}</td>
              <td className="border border-gray-300 p-1">{op.controls || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PreviewPlanOp({ f }: { f: any }) {
  return (
    <div className="font-sans text-[10px]">
      <DocHeader f={f} typeName="Plan Opératoire" />
      <div className="text-center font-bold text-xs mb-3 uppercase">{f.title || "PLAN OPÉRATOIRE"}</div>
      <table className="w-full border-collapse text-[9px] mb-3">
        <tbody>
          <tr>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50">Processus</td>
            <td className="border border-gray-300 p-1" colSpan={3}>{f.process || "—"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50">Données d'entrée</td>
            <td className="border border-gray-300 p-1">{f.inputs || "—"}</td>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50">Données de sortie</td>
            <td className="border border-gray-300 p-1">{f.outputs || "—"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 font-semibold bg-gray-50">Ressources</td>
            <td className="border border-gray-300 p-1" colSpan={3}>{f.resources || "—"}</td>
          </tr>
        </tbody>
      </table>
      <table className="w-full border-collapse text-[9px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1 text-left">Phase</th>
            <th className="border border-gray-300 p-1 text-left">Activité</th>
            <th className="border border-gray-300 p-1 text-left">Resp.</th>
            <th className="border border-gray-300 p-1 text-left">Durée</th>
            <th className="border border-gray-300 p-1 text-left">Indicateur</th>
          </tr>
        </thead>
        <tbody>
          {f.phases?.map((p: any, i: number) => (
            <tr key={p.id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
              <td className="border border-gray-300 p-1">{p.phase || "—"}</td>
              <td className="border border-gray-300 p-1">{p.activity || "—"}</td>
              <td className="border border-gray-300 p-1">{p.responsible || "—"}</td>
              <td className="border border-gray-300 p-1">{p.duration || "—"}</td>
              <td className="border border-gray-300 p-1">{p.kpi || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PreviewPolitique({ f }: { f: any }) {
  return (
    <div className="font-sans text-[10px]">
      <DocHeader f={f} typeName="Politique Qualité" />
      <div className="text-center font-bold text-sm mb-2 uppercase">{f.title || "POLITIQUE QUALITÉ"}</div>
      <div className="text-center text-[10px] mb-3 text-gray-600">{f.company || "Nom de l'entreprise"}</div>
      {f.context && <DocSection num={1} title="Contexte de l'entreprise">{f.context}</DocSection>}
      <DocSection num={2} title="Engagements de la direction">
        <ul className="list-disc pl-3 space-y-0.5">
          {f.commitments?.filter(Boolean).map((c: string, i: number) => <li key={i}>{c}</li>)}
          {!f.commitments?.some(Boolean) && <li className="text-gray-400 italic">À compléter...</li>}
        </ul>
      </DocSection>
      <DocSection num={3} title="Objectifs qualité">
        <ul className="list-disc pl-3 space-y-0.5">
          {f.objectives?.filter(Boolean).map((o: string, i: number) => <li key={i}>{o}</li>)}
          {!f.objectives?.some(Boolean) && <li className="text-gray-400 italic">À compléter...</li>}
        </ul>
      </DocSection>
      <div className="mt-6 text-right text-[10px]">
        <div>Fait à _____________, le {f.date ? format(new Date(f.date), "dd MMMM yyyy", { locale: fr }) : "___________"}</div>
        <div className="mt-4">_________________________</div>
        <div>{f.director || "Le Dirigeant"}</div>
      </div>
    </div>
  )
}

function PreviewGeneric({ f, typeName }: { f: any; typeName: string }) {
  return (
    <div className="font-sans text-[10px]">
      <DocHeader f={f} typeName={typeName} />
      <div className="text-center font-bold text-xs mb-3 uppercase">{f.title || "TITRE DU DOCUMENT"}</div>
      <div className="text-gray-400 italic text-[10px] text-center">Aperçu du document généré</div>
    </div>
  )
}

function Preview({ type, form }: { type: string; form: any }) {
  const typeObj = DOC_TYPES.find((t) => t.key === type)
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b bg-gray-50 px-3 py-2 flex items-center gap-2">
        <Eye className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs font-semibold text-gray-500">APERÇU DU DOCUMENT</span>
        {form.reference && <Badge variant="outline" className="text-[10px] ml-auto">{form.reference}</Badge>}
      </div>
      <div id="doc-preview-content" className="p-4 overflow-auto max-h-[600px]">
        {type === "procedure"   && <PreviewProcedure f={form} />}
        {type === "instruction" && <PreviewInstruction f={form} />}
        {type === "gamme"       && <PreviewGamme f={form} />}
        {type === "plan_op"     && <PreviewPlanOp f={form} />}
        {type === "politique"   && <PreviewPolitique f={form} />}
        {(type === "manuel" || type === "formulaire" || type === "plan_surv") && (
          <PreviewGeneric f={form} typeName={typeObj?.label ?? type} />
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, any>>({})
  const [saved, setSaved] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const { toast } = useToast()

  async function handlePdfExport() {
    setPdfLoading(true)
    try {
      const filename = form.reference || `${typeObj?.prefix ?? "DOC"}-${new Date().getFullYear()}-export`
      await downloadAsPdf("doc-preview-content", filename)
      toast({ title: "PDF exporté", description: `Document "${form.title || filename}" téléchargé.` })
    } finally {
      setPdfLoading(false)
    }
  }

  const typeObj = DOC_TYPES.find((t) => t.key === selectedType)

  function selectType(key: string) {
    setSelectedType(key)
    setForm(initialForm(key))
    setStep(2)
  }

  function setField(k: string, v: any) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => router.push("/documents"), 1500)
  }

  function renderForm() {
    if (!selectedType) return null
    const props = { f: form, set: setField, update: setField }
    switch (selectedType) {
      case "procedure":   return <FormProcedure {...props} />
      case "instruction": return <FormInstruction {...props} />
      case "gamme":       return <FormGamme {...props} />
      case "plan_op":     return <FormPlanOp {...props} />
      case "manuel":      return <FormManuel {...props} />
      case "politique":   return <FormPolitique {...props} />
      case "formulaire":  return <FormFormulaire {...props} />
      case "plan_surv":   return <FormPlanSurv {...props} />
      default: return null
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0"
          onClick={() => step === 1 ? router.back() : setStep(1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-gray-900">Générer un document qualité</h2>
          <p className="text-xs text-gray-400">
            {step === 1 ? "Sélectionnez le type de document à créer" : `Remplissez le formulaire — ${typeObj?.label}`}
          </p>
        </div>
        {/* Step indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          {[1, 2].map((s) => (
            <div key={s} className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${step >= s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>{s}</div>
          ))}
        </div>
      </div>

      {/* ── Step 1: Type selection ── */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DOC_TYPES.map((dt) => {
            const Icon = dt.icon
            return (
              <button
                key={dt.key}
                onClick={() => selectType(dt.key)}
                className={`group flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${selectedType === dt.key ? dt.activeColor : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${dt.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{dt.label}</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{dt.desc}</p>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono mt-auto">{dt.example}</Badge>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors ml-auto" />
              </button>
            )
          })}
        </div>
      )}

      {/* ── Step 2: Form + Preview ── */}
      {step === 2 && selectedType && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Form panel */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                {typeObj && <typeObj.icon className="h-4 w-4" />}
                Formulaire — {typeObj?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-5 overflow-y-auto max-h-[680px]">
              {renderForm()}
            </CardContent>
          </Card>

          {/* Preview panel */}
          <div className="space-y-3">
            <Preview type={selectedType} form={form} />

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl" onClick={handleSave} disabled={saved}>
                {saved ? <><CheckCircle2 className="mr-1.5 h-4 w-4" /> Enregistré!</> : <><Save className="mr-1.5 h-4 w-4" /> Enregistrer dans la bibliothèque</>}
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={handlePdfExport} disabled={pdfLoading}>
                {pdfLoading
                  ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Génération...</>
                  : <><FileText className="mr-1.5 h-4 w-4" /> Exporter PDF</>
                }
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-gray-500">
                Changer de type
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
