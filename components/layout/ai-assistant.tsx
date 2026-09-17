"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Sparkles, Send, X, Bot, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  links?: { label: string; href: string }[]
}

const suggestions = [
  "Résume les non-conformités ouvertes",
  "Quels audits sont planifiés ?",
  "Quels sont les risques critiques ?",
  "Actions en retard ?",
]

function getAiReply(question: string): Message {
  const q = question.toLowerCase()
  if (q.includes("non-conform") || q.includes("non conform") || /\bnc\b/.test(q)) {
    return {
      role: "assistant",
      content:
        "Vous avez actuellement 8 non-conformités ouvertes, dont 2 critiques :\n\n• NC-2026-020 — Défaut dimensionnel lot #4521 (en retard de 3 jours)\n• NC-2026-023 — Contamination matière première\n\n3 NC sont en cours de traitement avec une CAPA associée. Je vous recommande de prioriser NC-2026-020 qui dépasse son échéance.",
      links: [{ label: "Voir les non-conformités", href: "/non-conformances" }],
    }
  }
  if (q.includes("audit")) {
    return {
      role: "assistant",
      content:
        "2 audits sont planifiés ce mois-ci :\n\n• AUD-2026-012 — Audit interne ISO 9001 Production (dans 7 jours)\n• AUD-2026-013 — Audit fournisseur Métallurgie Pro (dans 18 jours)\n\nLe dernier audit a relevé 3 écarts dont 1 NC majeure. Pensez à vérifier que les NC issues d'audit sont bien traitées.",
      links: [{ label: "Voir les audits", href: "/audits" }],
    }
  }
  if (q.includes("risque")) {
    return {
      role: "assistant",
      content:
        "3 risques critiques (score ≥ 16) sont actifs dans votre registre :\n\n• Rupture d'approvisionnement matière critique (20)\n• Défaillance du four de traitement thermique (16)\n• Non-renouvellement certification ISO (16)\n\n2 actions de maîtrise ne sont pas encore au plan d'actions.",
      links: [{ label: "Voir le registre des risques", href: "/risks" }],
    }
  }
  if (q.includes("capa")) {
    return {
      role: "assistant",
      content:
        "12 CAPA sont en cours, dont 3 nécessitent une action cette semaine :\n\n• CAPA-2026-018 — 3 actions à valider avant le 15 juillet\n• CAPA-2026-021 — Vérification d'efficacité à planifier\n• CAPA-2026-015 — En retard de 5 jours\n\nLe taux de clôture dans les délais est de 78 % ce trimestre.",
      links: [{ label: "Voir les CAPA", href: "/capa" }],
    }
  }
  if (q.includes("action") || q.includes("retard")) {
    return {
      role: "assistant",
      content:
        "5 actions du plan d'actions sont en retard :\n\n• 2 actions liées à des CAPA (resp. Jean Dupont)\n• 2 actions de maîtrise des risques (resp. Marie Martin)\n• 1 action issue de la revue de direction\n\nLe taux d'avancement global du plan est de 64 %.",
      links: [{ label: "Voir le plan d'actions", href: "/action-plan" }],
    }
  }
  if (q.includes("document")) {
    return {
      role: "assistant",
      content:
        "Votre base documentaire compte 12 documents : 7 approuvés, 2 en révision, 2 brouillons et 1 obsolète.\n\n⚠️ 3 documents arrivent en échéance de révision dans moins de 90 jours, dont la Politique qualité (10 janvier).",
      links: [
        { label: "Voir les documents", href: "/documents" },
        { label: "Générer un document", href: "/documents/generate" },
      ],
    }
  }
  if (q.includes("formation")) {
    return {
      role: "assistant",
      content:
        "Le taux de couverture des formations obligatoires est de 87 %.\n\n• 4 habilitations expirent dans les 60 prochains jours\n• 2 sessions sont planifiées ce mois-ci\n\nJe vous recommande de planifier le recyclage CACES pour 3 collaborateurs.",
      links: [{ label: "Voir les formations", href: "/training" }],
    }
  }
  if (q.includes("fournisseur") || q.includes("réclamation") || q.includes("reclamation")) {
    return {
      role: "assistant",
      content:
        "Côté fournisseurs : 2 fournisseurs sont sous surveillance suite à des non-conformités de livraison répétées.\n\nCôté réclamations : 4 réclamations clients sont ouvertes, dont 1 critique en attente de réponse depuis 5 jours.",
      links: [
        { label: "Voir les fournisseurs", href: "/suppliers" },
        { label: "Voir les réclamations", href: "/complaints" },
      ],
    }
  }
  return {
    role: "assistant",
    content:
      "Je peux vous aider à piloter votre système QHSE : analyse des non-conformités, suivi des CAPA, audits, risques, plan d'actions, documents, formations…\n\nPosez-moi une question ou choisissez une suggestion ci-dessous.",
  }
}

interface AiAssistantProps {
  open: boolean
  onClose: () => void
}

export function AiAssistant({ open, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour 👋 Je suis Quali, votre assistant QHSE. Je peux analyser vos données qualité, sécurité et environnement. Comment puis-je vous aider ?",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  function send(text: string) {
    const question = text.trim()
    if (!question || typing) return
    setMessages((prev) => [...prev, { role: "user", content: question }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, getAiReply(question)])
      setTyping(false)
    }, 800)
  }

  const panel = (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b bg-gradient-to-r from-blue-600 to-indigo-600 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Assistant IA</p>
            <p className="text-[11px] text-blue-100">Quali — analyse QHSE</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-blue-100 hover:bg-white/15 hover:text-white"
          aria-label="Fermer l'assistant"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-3.5 py-2.5 text-sm text-white">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="max-w-[85%] space-y-2">
                <div className="whitespace-pre-line rounded-2xl rounded-tl-md bg-gray-100 px-3.5 py-2.5 text-sm text-gray-800">
                  {m.content}
                </div>
                {m.links?.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex w-fit items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    {l.label}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
        {typing && (
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="shrink-0 border-t px-3 pt-3">
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex shrink-0 items-center gap-2 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question…"
          className="h-10 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-400 focus:bg-white"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || typing}
          className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700"
          aria-label="Envoyer"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )

  return (
    <>
      {/* Desktop: docked right panel */}
      <aside
        className={cn(
          "hidden shrink-0 overflow-hidden border-l bg-white transition-all duration-300 lg:block",
          open ? "w-80 xl:w-96" : "w-0 border-l-0"
        )}
      >
        <div className="h-full w-80 xl:w-96">{panel}</div>
      </aside>

      {/* Mobile: overlay sheet from the right */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm shadow-2xl">{panel}</div>
        </div>
      )}
    </>
  )
}
