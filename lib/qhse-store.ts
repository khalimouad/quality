// Central Client-Side Reactive Store & Cross-Module Automation Engine
// Strictly 0% Database / 100% Client-Side Reactivity with LocalStorage & CustomEvents

"use client"

import { useState, useEffect, useCallback } from "react"
import { loadState, saveState } from "@/lib/storage"

export type Severity = "critical" | "major" | "minor" | "observation"
export type NCStatus = "open" | "in_progress" | "closed"
export type CAPAType = "corrective" | "preventive"
export type CAPAStatus = "open" | "in_progress" | "verified" | "closed"
export type ActionOrigin =
  | "CAPA"
  | "Audit"
  | "NC"
  | "Réclamation"
  | "Risque"
  | "Amélioration"
  | "Réglementaire"
  | "Revue Direction"
export type ActionPriority = "high" | "medium" | "low"
export type ActionStatus = "todo" | "in_progress" | "done" | "overdue"
export type ControlPhase = "reception" | "en_cours" | "produit_fini"
export type InspectionVerdict = "conforme" | "derogation" | "rejete"

export interface NonConformance {
  id: string
  reference: string
  title: string
  status: NCStatus
  severity: Severity
  source: string
  detectedBy: string
  assignedTo: string
  detectedAt: string
  dueDate: string
  description?: string
  immediateAction?: string
  lotNumber?: string
  articleRef?: string
  articleName?: string
  pvRef?: string
  auditRef?: string
  capaRef?: string
  quarantine?: boolean
}

export interface CAPA {
  id: string
  reference: string
  title: string
  type: CAPAType
  status: CAPAStatus
  ncRef?: string | null
  auditRef?: string | null
  complianceRef?: string | null
  reviewRef?: string | null
  assignedTo: string
  dueDate: string
  progress: number
  createdAt: string
  description?: string
  rootCause?: string
}

export interface InspectionRecord {
  id: string
  pvNumber: string
  date: string
  phase: ControlPhase
  articleRef: string
  articleName: string
  lotNumber: string
  quantiteControlee: number
  inspecteur: string
  valeurMesuree: string
  criterionCode: string
  verdict: InspectionVerdict
  commentaires: string
  ncLinked?: string
}

export interface ActionPlanItem {
  id: string
  reference: string
  title: string
  origin: ActionOrigin
  priority: ActionPriority
  status: ActionStatus
  assignedTo: string
  dueDate: string
  progress: number
  sourceId?: string
}

export interface QhseNotification {
  id: string
  read: boolean
  type: "nc" | "capa" | "audit" | "compliance" | "review" | "control"
  title: string
  body: string
  time: string
  href: string
  createdAt: string
}

// Initial Data Fixtures (Consistent French QHSE Context)
const DEFAULT_NCS: NonConformance[] = [
  {
    id: "nc-1",
    reference: "NC-2026-023",
    title: "Défaut de soudage sur pièce P-456",
    status: "open",
    severity: "major",
    source: "Production",
    detectedBy: "Jean Dupont",
    assignedTo: "Sophie Moreau",
    detectedAt: "2026-06-01",
    dueDate: "2026-07-01",
    description: "Porosités et manque de fusion constatés sur cordon de soudure poste 3.",
    immediateAction: "Pièce mise en quarantaine immédiate.",
    quarantine: true,
  },
  {
    id: "nc-2",
    reference: "NC-2026-022",
    title: "Non-conformité documentaire procédure HSE",
    status: "in_progress",
    severity: "minor",
    source: "Audit interne",
    detectedBy: "Marie Martin",
    assignedTo: "Luc Petit",
    detectedAt: "2026-05-20",
    dueDate: "2026-06-20",
    description: "Procédure d'évacuation incendie non alignée sur l'extension du bâtiment B.",
  },
  {
    id: "nc-3",
    reference: "NC-2026-021",
    title: "Dépassement des délais de calibration",
    status: "closed",
    severity: "major",
    source: "Contrôle qualité",
    detectedBy: "Pierre Bernard",
    assignedTo: "Sophie Moreau",
    detectedAt: "2026-05-10",
    dueDate: "2026-06-10",
  },
  {
    id: "nc-4",
    reference: "NC-2026-020",
    title: "Matière première hors spécifications",
    status: "open",
    severity: "critical",
    source: "Réception",
    detectedBy: "Sophie Moreau",
    assignedTo: "Pierre Bernard",
    detectedAt: "2026-05-05",
    dueDate: "2026-05-20",
    lotNumber: "LOT-RAW-8841",
    articleRef: "AC-S355-5MM",
    quarantine: true,
  },
]

const DEFAULT_CAPAS: CAPA[] = [
  {
    id: "capa-1",
    reference: "CAPA-2026-018",
    title: "Révision des paramètres de soudage TIG",
    type: "corrective",
    status: "in_progress",
    ncRef: "NC-2026-023",
    assignedTo: "Jean Dupont",
    dueDate: "2026-07-15",
    progress: 60,
    createdAt: "2026-06-03",
  },
  {
    id: "capa-2",
    reference: "CAPA-2026-017",
    title: "Formation des opérateurs aux EPI",
    type: "corrective",
    status: "verified",
    ncRef: "NC-2026-019",
    assignedTo: "Marie Martin",
    dueDate: "2026-06-30",
    progress: 100,
    createdAt: "2026-05-15",
  },
  {
    id: "capa-3",
    reference: "CAPA-2026-016",
    title: "Mise en place d'un plan de maintenance préventive",
    type: "preventive",
    status: "open",
    ncRef: null,
    assignedTo: "Pierre Bernard",
    dueDate: "2026-08-01",
    progress: 15,
    createdAt: "2026-05-01",
  },
  {
    id: "capa-4",
    reference: "CAPA-2026-015",
    title: "Révision procédure de contrôle réception",
    type: "corrective",
    status: "closed",
    ncRef: "NC-2026-020",
    assignedTo: "Sophie Moreau",
    dueDate: "2026-06-15",
    progress: 100,
    createdAt: "2026-04-20",
  },
]

const DEFAULT_PVS: InspectionRecord[] = [
  {
    id: "pv-1",
    pvNumber: "PV-REC-088",
    date: "2026-06-15",
    phase: "reception",
    articleRef: "MAT-AC-355",
    articleName: "Tôle acier S355 5mm",
    lotNumber: "LOT-99214",
    quantiteControlee: 50,
    inspecteur: "Pierre Bernard",
    valeurMesuree: "4.98 mm",
    criterionCode: "CRIT-001",
    verdict: "conforme",
    commentaires: "Certificat 3.1 conforme, épaisseur moyenne 4.98 mm.",
  },
  {
    id: "pv-2",
    pvNumber: "PV-ENC-142",
    date: "2026-06-16",
    phase: "en_cours",
    articleRef: "USIN-AL-25",
    articleName: "Bague support usinée Ø25",
    lotNumber: "OF-2026-441",
    quantiteControlee: 10,
    inspecteur: "Luc Petit",
    valeurMesuree: "24.99 mm",
    criterionCode: "CRIT-004",
    verdict: "conforme",
    commentaires: "Cotes d'alésage et rugosité conformes.",
  },
  {
    id: "pv-3",
    pvNumber: "PV-FIN-090",
    date: "2026-06-16",
    phase: "produit_fini",
    articleRef: "ACT-ELEC-400",
    articleName: "Actionneur linéaire 400N",
    lotNumber: "LOT-FIN-188",
    quantiteControlee: 24,
    inspecteur: "Sophie Moreau",
    valeurMesuree: "2.12 A",
    criterionCode: "CRIT-007",
    verdict: "conforme",
    commentaires: "Libération qualité accordée pour expédition client.",
  },
]

const DEFAULT_ACTIONS: ActionPlanItem[] = [
  {
    id: "act-1",
    reference: "CAPA-2026-018",
    title: "Révision des paramètres de soudage TIG",
    origin: "CAPA",
    priority: "high",
    status: "in_progress",
    assignedTo: "Jean Dupont",
    dueDate: "2026-07-15",
    progress: 60,
  },
  {
    id: "act-2",
    reference: "AUD-2026-010",
    title: "Mise à jour du plan de formation HSE",
    origin: "Audit",
    priority: "high",
    status: "overdue",
    assignedTo: "Sophie Moreau",
    dueDate: "2026-05-20",
    progress: 30,
  },
  {
    id: "act-3",
    reference: "NC-2026-023",
    title: "Correction du défaut soudage pièce P-456",
    origin: "NC",
    priority: "high",
    status: "todo",
    assignedTo: "Jean Dupont",
    dueDate: "2026-07-01",
    progress: 0,
  },
  {
    id: "act-4",
    reference: "RD-2026-S1-A1",
    title: "Déploiement de la double vérification traçabilité ICPE",
    origin: "Revue Direction",
    priority: "high",
    status: "in_progress",
    assignedTo: "Antoine Leblanc",
    dueDate: "2026-09-30",
    progress: 40,
  },
]

const DEFAULT_NOTIFICATIONS: QhseNotification[] = [
  {
    id: "notif-1",
    read: false,
    type: "nc",
    title: "NC-2026-020 en retard",
    body: "Matière première hors spécifications — Échéance dépassée.",
    time: "Il y a 2 h",
    href: "/non-conformances",
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-2",
    read: false,
    type: "capa",
    title: "CAPA-2026-018 en cours",
    body: "Révision des paramètres de soudage TIG — 60% réalisé.",
    time: "Il y a 4 h",
    href: "/capa",
    createdAt: new Date().toISOString(),
  },
]

const STORAGE_KEYS = {
  NCS: "quali_qhse_ncs",
  CAPAS: "quali_qhse_capas",
  PVS: "quali_qhse_pvs",
  ACTIONS: "quali_qhse_actions",
  NOTIFICATIONS: "quali_qhse_notifications",
}

const STORE_EVENT = "qhse-store-update"

// Direct helper to dispatch store changes to all listening components
function dispatchStoreUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORE_EVENT))
  }
}

// ---- Raw Store Accessors (can be used outside hooks if needed) ----
export function getStoredNCs(): NonConformance[] {
  return loadState(STORAGE_KEYS.NCS, DEFAULT_NCS)
}

export function saveStoredNCs(ncs: NonConformance[]) {
  saveState(STORAGE_KEYS.NCS, ncs)
  dispatchStoreUpdate()
}

export function getStoredCAPAs(): CAPA[] {
  return loadState(STORAGE_KEYS.CAPAS, DEFAULT_CAPAS)
}

export function saveStoredCAPAs(capas: CAPA[]) {
  saveState(STORAGE_KEYS.CAPAS, capas)
  dispatchStoreUpdate()
}

export function getStoredPVs(): InspectionRecord[] {
  return loadState(STORAGE_KEYS.PVS, DEFAULT_PVS)
}

export function saveStoredPVs(pvs: InspectionRecord[]) {
  saveState(STORAGE_KEYS.PVS, pvs)
  dispatchStoreUpdate()
}

export function getStoredActions(): ActionPlanItem[] {
  return loadState(STORAGE_KEYS.ACTIONS, DEFAULT_ACTIONS)
}

export function saveStoredActions(actions: ActionPlanItem[]) {
  saveState(STORAGE_KEYS.ACTIONS, actions)
  dispatchStoreUpdate()
}

export function getStoredNotifications(): QhseNotification[] {
  return loadState(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS)
}

export function saveStoredNotifications(notifs: QhseNotification[]) {
  saveState(STORAGE_KEYS.NOTIFICATIONS, notifs)
  dispatchStoreUpdate()
}

// Add a notification utility
export function pushNotification(notif: Omit<QhseNotification, "id" | "read" | "createdAt">): QhseNotification {
  const list = getStoredNotifications()
  const created: QhseNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...notif,
  }
  saveStoredNotifications([created, ...list])
  return created
}

// ---- AUTOMATION 1: Control Plan Rejection -> Automatic NC Creation ----
export function triggerNcFromPv(
  pvData: {
    pvNumber: string
    phase: ControlPhase
    articleRef: string
    articleName: string
    lotNumber: string
    quantiteControlee: number
    inspecteur: string
    valeurMesuree: string
    criterionCode: string
    commentaires: string
  },
  criterionMeta?: { criticite?: "Critique" | "Majeur" | "Mineur"; caracteristique?: string }
): { nc: NonConformance; pv: InspectionRecord } {
  const currentNCs = getStoredNCs()
  const currentPVs = getStoredPVs()
  const currentActions = getStoredActions()

  // 1. Calculate NC Reference and Severity
  const nextNum = currentNCs.length + 24
  const ncRef = `NC-2026-${String(nextNum).padStart(3, "0")}`

  let severity: Severity = "major"
  if (criterionMeta?.criticite === "Critique") severity = "critical"
  else if (criterionMeta?.criticite === "Mineur") severity = "minor"

  const now = new Date()
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + (severity === "critical" ? 7 : 15))

  const ncTitle = `Rejet contrôle ${pvData.phase.toUpperCase()} : ${pvData.articleName} (${pvData.lotNumber})`

  // 2. Instantiate Non-Conformance with Quarantine status
  const newNc: NonConformance = {
    id: `nc-${Date.now()}`,
    reference: ncRef,
    title: ncTitle,
    status: "open",
    severity,
    source: `Contrôle Qualité (${pvData.phase})`,
    detectedBy: pvData.inspecteur,
    assignedTo: "Sophie Moreau (Resp. Qualité)",
    detectedAt: now.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    description: `Non-conformité détectée lors du PV ${pvData.pvNumber} sur le critère ${pvData.criterionCode} (${criterionMeta?.caracteristique || "Caractéristique hors tolérance"}). Valeur mesurée : ${pvData.valeurMesuree}. Remarques : ${pvData.commentaires}`,
    immediateAction: `Mise en quarantaine immédiate du lot ${pvData.lotNumber} (${pvData.quantiteControlee} pièces). Blocage informatique et étiquetage rouge physique.`,
    lotNumber: pvData.lotNumber,
    articleRef: pvData.articleRef,
    articleName: pvData.articleName,
    pvRef: pvData.pvNumber,
    quarantine: true,
  }

  // 3. Instantiate PV with link to NC
  const newPv: InspectionRecord = {
    id: `pv-${Date.now()}`,
    date: now.toISOString().slice(0, 10),
    verdict: "rejete",
    ncLinked: ncRef,
    ...pvData,
  }

  // 4. Add into Action Plan
  const newAction: ActionPlanItem = {
    id: `act-${Date.now()}`,
    reference: ncRef,
    title: `Traitement NC & Quarantaine lot ${pvData.lotNumber}`,
    origin: "NC",
    priority: severity === "critical" ? "high" : "medium",
    status: "todo",
    assignedTo: newNc.assignedTo,
    dueDate: newNc.dueDate,
    progress: 0,
    sourceId: newNc.id,
  }

  // 5. Persist all changes
  saveStoredNCs([newNc, ...currentNCs])
  saveStoredPVs([newPv, ...currentPVs])
  saveStoredActions([newAction, ...currentActions])

  // 6. Push real-time notification
  pushNotification({
    type: "nc",
    title: `Alerte Rejet : ${ncRef} générée`,
    body: `Lot ${pvData.lotNumber} rejeté (${pvData.valeurMesuree}). Quarantaine activée automatiquement.`,
    time: "À l'instant",
    href: `/non-conformances`,
  })

  return { nc: newNc, pv: newPv }
}

// ---- AUTOMATION 2: Non-Conformance -> CAPA 8D Creation ----
export function triggerCapaFromNc(
  ncReference: string,
  options?: { customTitle?: string; assignedTo?: string; dueDate?: string; description?: string }
): CAPA {
  const currentNCs = getStoredNCs()
  const currentCAPAs = getStoredCAPAs()
  const currentActions = getStoredActions()

  const targetNc = currentNCs.find((n) => n.reference === ncReference)
  const nextNum = currentCAPAs.length + 19
  const capaRef = `CAPA-2026-${String(nextNum).padStart(3, "0")}`

  const now = new Date()
  const defaultDue = new Date()
  defaultDue.setMonth(defaultDue.getMonth() + 1)

  const capaTitle = options?.customTitle || `Action Corrective 8D : ${targetNc?.title || ncReference}`
  const assignedTo = options?.assignedTo || targetNc?.assignedTo || "Jean Dupont"
  const dueDate = options?.dueDate || defaultDue.toISOString().slice(0, 10)

  const newCapa: CAPA = {
    id: `capa-${Date.now()}`,
    reference: capaRef,
    title: capaTitle,
    type: "corrective",
    status: "open",
    ncRef: ncReference,
    assignedTo,
    dueDate,
    progress: 0,
    createdAt: now.toISOString().slice(0, 10),
    description: options?.description || targetNc?.description || "Analyse des causes racines et plan d'actions correctives.",
  }

  // Update target NC with link to this CAPA
  const updatedNCs = currentNCs.map((nc) =>
    nc.reference === ncReference ? { ...nc, capaRef, status: "in_progress" as NCStatus } : nc
  )

  // Add into Action Plan
  const newAction: ActionPlanItem = {
    id: `act-${Date.now()}`,
    reference: capaRef,
    title: capaTitle,
    origin: "CAPA",
    priority: targetNc?.severity === "critical" ? "high" : "medium",
    status: "todo",
    assignedTo,
    dueDate,
    progress: 0,
    sourceId: newCapa.id,
  }

  saveStoredNCs(updatedNCs)
  saveStoredCAPAs([newCapa, ...currentCAPAs])
  saveStoredActions([newAction, ...currentActions])

  pushNotification({
    type: "capa",
    title: `${capaRef} créée depuis ${ncReference}`,
    body: `Plan 8D ouvert : ${capaTitle}`,
    time: "À l'instant",
    href: `/capa`,
  })

  return newCapa
}

// ---- AUTOMATION 3: Audit Finding -> NC / CAPA Creation ----
export function triggerNcFromAudit(
  auditRef: string,
  findingDesc: string,
  auditor: string = "Sophie Moreau",
  severity: Severity = "major"
): NonConformance {
  const currentNCs = getStoredNCs()
  const currentActions = getStoredActions()

  const nextNum = currentNCs.length + 24
  const ncRef = `NC-2026-${String(nextNum).padStart(3, "0")}`
  const now = new Date()
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30)

  const newNc: NonConformance = {
    id: `nc-${Date.now()}`,
    reference: ncRef,
    title: `Écart audit ${auditRef} : ${findingDesc.slice(0, 60)}...`,
    status: "open",
    severity,
    source: `Audit interne (${auditRef})`,
    detectedBy: auditor,
    assignedTo: auditor,
    detectedAt: now.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    description: `Non-conformité identifiée lors de l'audit ${auditRef}. Constat : ${findingDesc}`,
    auditRef,
  }

  const newAction: ActionPlanItem = {
    id: `act-${Date.now()}`,
    reference: ncRef,
    title: `Résolution écart ${auditRef}`,
    origin: "Audit",
    priority: severity === "critical" ? "high" : "medium",
    status: "todo",
    assignedTo: auditor,
    dueDate: newNc.dueDate,
    progress: 0,
    sourceId: newNc.id,
  }

  saveStoredNCs([newNc, ...currentNCs])
  saveStoredActions([newAction, ...currentActions])

  pushNotification({
    type: "audit",
    title: `Écart audit : ${ncRef} générée`,
    body: `Audit ${auditRef} : ${findingDesc.slice(0, 50)}...`,
    time: "À l'instant",
    href: `/non-conformances`,
  })

  return newNc
}

export function triggerCapaFromAudit(
  auditRef: string,
  findingDesc: string,
  auditor: string = "Sophie Moreau",
  dueDate?: string
): CAPA {
  const currentCAPAs = getStoredCAPAs()
  const currentActions = getStoredActions()

  const nextNum = currentCAPAs.length + 19
  const capaRef = `CAPA-2026-${String(nextNum).padStart(3, "0")}`
  const now = new Date()
  const dDue = dueDate || new Date(now.setDate(now.getDate() + 45)).toISOString().slice(0, 10)

  const newCapa: CAPA = {
    id: `capa-${Date.now()}`,
    reference: capaRef,
    title: `Traitement écart ${auditRef} : ${findingDesc.slice(0, 60)}...`,
    type: "corrective",
    status: "open",
    auditRef,
    assignedTo: auditor,
    dueDate: dDue,
    progress: 0,
    createdAt: new Date().toISOString().slice(0, 10),
    description: `Action corrective issue du rapport d'audit ${auditRef}. Exigence à remettre en conformité.`,
  }

  const newAction: ActionPlanItem = {
    id: `act-${Date.now()}`,
    reference: capaRef,
    title: `Action corrective audit ${auditRef}`,
    origin: "Audit",
    priority: "high",
    status: "todo",
    assignedTo: auditor,
    dueDate: dDue,
    progress: 0,
    sourceId: newCapa.id,
  }

  saveStoredCAPAs([newCapa, ...currentCAPAs])
  saveStoredActions([newAction, ...currentActions])

  pushNotification({
    type: "audit",
    title: `${capaRef} générée depuis ${auditRef}`,
    body: `Action corrective enregistrée pour l'audit ${auditRef}.`,
    time: "À l'instant",
    href: `/capa`,
  })

  return newCapa
}

// ---- AUTOMATION 4: Regulatory Compliance -> Action Plan Creation ----
export function triggerActionFromCompliance(
  reqReference: string,
  title: string,
  assignedTo: string = "Marie Martin (HSE)",
  dueDate?: string
): ActionPlanItem {
  const currentActions = getStoredActions()
  const currentCAPAs = getStoredCAPAs()

  const nextNum = currentCAPAs.length + 19
  const capaRef = `CAPA-2026-${String(nextNum).padStart(3, "0")}`
  const now = new Date()
  const defaultDue = dueDate || new Date(now.setDate(now.getDate() + 30)).toISOString().slice(0, 10)

  // 1. Create CAPA linked to regulatory compliance
  const newCapa: CAPA = {
    id: `capa-${Date.now()}`,
    reference: capaRef,
    title: `Mise en conformité réglementaire : ${reqReference}`,
    type: "corrective",
    status: "open",
    complianceRef: reqReference,
    assignedTo,
    dueDate: defaultDue,
    progress: 0,
    createdAt: new Date().toISOString().slice(0, 10),
    description: `Plan d'actions pour mise en conformité avec ${reqReference} - ${title}.`,
  }

  // 2. Create Action in Action Plan
  const newAction: ActionPlanItem = {
    id: `act-${Date.now()}`,
    reference: `${reqReference}-ACT`,
    title: `Action corrective conformité : ${title}`,
    origin: "Réglementaire",
    priority: "high",
    status: "todo",
    assignedTo,
    dueDate: defaultDue,
    progress: 0,
    sourceId: newCapa.id,
  }

  saveStoredCAPAs([newCapa, ...currentCAPAs])
  saveStoredActions([newAction, ...currentActions])

  pushNotification({
    type: "compliance",
    title: `Écart réglementaire : ${reqReference}`,
    body: `Action de remédiation créée et assignée à ${assignedTo}.`,
    time: "À l'instant",
    href: `/action-plan`,
  })

  return newAction
}

// ---- AUTOMATION 5: Management Review Decisions -> Action Plan Deployment ----
export function deployReviewDecisions(
  reviewRef: string,
  decisions: Array<{ title: string; resp: string; echeance: string; budget?: string }>
): ActionPlanItem[] {
  const currentActions = getStoredActions()
  const newActions: ActionPlanItem[] = []

  decisions.forEach((d, idx) => {
    const actRef = `${reviewRef}-D${idx + 1}`
    const item: ActionPlanItem = {
      id: `act-${Date.now()}-${idx}`,
      reference: actRef,
      title: d.title,
      origin: "Revue Direction",
      priority: "high",
      status: "todo",
      assignedTo: d.resp || "Directeur Général",
      dueDate: d.echeance || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      progress: 0,
    }
    newActions.push(item)
  })

  saveStoredActions([...newActions, ...currentActions])

  pushNotification({
    type: "review",
    title: `${newActions.length} actions déployées depuis ${reviewRef}`,
    body: `Les décisions stratégiques ont été injectées dans le Plan d'Actions global.`,
    time: "À l'instant",
    href: `/action-plan`,
  })

  return newActions
}

// ---- Central React Hook for all Components ----
export function useQhseStore() {
  const [ncs, setNcs] = useState<NonConformance[]>(getStoredNCs)
  const [capas, setCapas] = useState<CAPA[]>(getStoredCAPAs)
  const [pvs, setPvs] = useState<InspectionRecord[]>(getStoredPVs)
  const [actions, setActions] = useState<ActionPlanItem[]>(getStoredActions)
  const [notifications, setNotifications] = useState<QhseNotification[]>(getStoredNotifications)

  const reloadAll = useCallback(() => {
    setNcs(getStoredNCs())
    setCapas(getStoredCAPAs())
    setPvs(getStoredPVs())
    setActions(getStoredActions())
    setNotifications(getStoredNotifications())
  }, [])

  useEffect(() => {
    // Listen for cross-component custom events
    const handleStoreChange = () => reloadAll()
    window.addEventListener(STORE_EVENT, handleStoreChange)
    // Also listen for storage events from other browser tabs
    window.addEventListener("storage", handleStoreChange)

    return () => {
      window.removeEventListener(STORE_EVENT, handleStoreChange)
      window.removeEventListener("storage", handleStoreChange)
    }
  }, [reloadAll])

  // Simple state update functions
  const updateNcStatus = useCallback((id: string, status: NCStatus) => {
    const list = getStoredNCs()
    const updated = list.map((n) => (n.id === id ? { ...n, status } : n))
    saveStoredNCs(updated)
  }, [])

  const updateCapaStatus = useCallback((id: string, status: CAPAStatus, progress?: number) => {
    const list = getStoredCAPAs()
    const updated = list.map((c) => {
      if (c.id === id) {
        const nextProg = progress !== undefined ? progress : status === "closed" ? 100 : c.progress
        return { ...c, status, progress: nextProg }
      }
      return c
    })
    saveStoredCAPAs(updated)
  }, [])

  const updateActionStatus = useCallback((id: string, status: ActionStatus, progress?: number) => {
    const list = getStoredActions()
    const updated = list.map((a) => {
      if (a.id === id) {
        const nextProg = progress !== undefined ? progress : status === "done" ? 100 : a.progress
        return { ...a, status, progress: nextProg }
      }
      return a
    })
    saveStoredActions(updated)
  }, [])

  const markNotificationRead = useCallback((id: string | number) => {
    const list = getStoredNotifications()
    const updated = list.map((n) => (String(n.id) === String(id) ? { ...n, read: true } : n))
    saveStoredNotifications(updated)
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    const list = getStoredNotifications()
    const updated = list.map((n) => ({ ...n, read: true }))
    saveStoredNotifications(updated)
  }, [])

  const dismissNotification = useCallback((id: string | number) => {
    const list = getStoredNotifications()
    const updated = list.filter((n) => String(n.id) !== String(id))
    saveStoredNotifications(updated)
  }, [])

  return {
    ncs,
    capas,
    pvs,
    actions,
    notifications,
    // Automations
    triggerNcFromPv,
    triggerCapaFromNc,
    triggerNcFromAudit,
    triggerCapaFromAudit,
    triggerActionFromCompliance,
    deployReviewDecisions,
    // Updates
    updateNcStatus,
    updateCapaStatus,
    updateActionStatus,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
    reloadAll,
  }
}
