"use client"

import { useState } from "react"
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChapterGuide } from "@/components/guidance/chapter-guide"
import { standards, chapters } from "@/lib/guidance/hls-guide"
import type { Pdca } from "@/lib/guidance/types"
import Link from "next/link"

const PDCA_COLORS: Record<Pdca, { bg: string; text: string; border: string }> = {
  INTRO: { bg: "bg-gray-100",   text: "text-gray-700",   border: "border-gray-300" },
  PLAN:  { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-300" },
  DO:    { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-300" },
  CHECK: { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300" },
  ACT:   { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
}

const PDCA_GROUPS: { pdca: Pdca; label: string; description: string }[] = [
  { pdca: "INTRO", label: "Introduction (Ch. 1–3)",   description: "Périmètre, références et vocabulaire communs à toutes les normes HLS" },
  { pdca: "PLAN",  label: "PLAN (Ch. 4–7)",           description: "Contexte, leadership, planification et support — socle stratégique" },
  { pdca: "DO",    label: "DO (Ch. 8)",                description: "Réalisation opérationnelle — mise en œuvre terrain des contrôles" },
  { pdca: "CHECK", label: "CHECK (Ch. 9)",             description: "Évaluation des performances — mesure, audits, revue de direction" },
  { pdca: "ACT",   label: "ACT (Ch. 10)",              description: "Amélioration continue — non-conformités, CAPA, leçons apprises" },
]

const STD_COLORS: Record<string, string> = {
  iso9001:   "#3b82f6",
  iso14001:  "#10b981",
  iso45001:  "#ef4444",
  iso27001:  "#6366f1",
  iso37001:  "#f59e0b",
  fssc22000: "#14b8a6",
}

export default function AccompagnementPage() {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set(["ch4"]))
  const [activeStds, setActiveStds] = useState<Set<string>>(new Set(standards.map((s) => s.id)))

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleStd = (id: string) => {
    setActiveStds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const stdFilter = [...activeStds]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accompagnant Qualité"
        description="Guide HLS multi-normes — exigences de chaque chapitre ISO pour respecter la démarche de certification"
        icon={BookOpen}
      />

      {/* Standards filter chips */}
      <div className="flex flex-wrap gap-2">
        {standards.map((std) => {
          const active = activeStds.has(std.id)
          return (
            <button
              key={std.id}
              onClick={() => toggleStd(std.id)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
              style={
                active
                  ? { backgroundColor: STD_COLORS[std.id] + "22", color: STD_COLORS[std.id], borderColor: STD_COLORS[std.id] + "60" }
                  : { backgroundColor: "#f3f4f6", color: "#9ca3af", borderColor: "#e5e7eb" }
              }
            >
              {std.shortName}
            </button>
          )
        })}
      </div>

      {/* PDCA legend */}
      <div className="flex flex-wrap gap-2">
        {PDCA_GROUPS.map((g) => {
          const c = PDCA_COLORS[g.pdca]
          return (
            <span key={g.pdca} className={`rounded border px-2 py-0.5 text-xs font-semibold ${c.bg} ${c.text} ${c.border}`}>
              {g.label}
            </span>
          )
        })}
      </div>

      {/* Accordion grouped by PDCA */}
      {PDCA_GROUPS.map((group) => {
        const groupChapters = chapters.filter((ch) => ch.pdca === group.pdca)
        const c = PDCA_COLORS[group.pdca]
        return (
          <div key={group.pdca} className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={`${c.bg} ${c.text} ${c.border} border text-xs font-bold px-2`}>
                {group.pdca}
              </Badge>
              <span className="text-sm font-semibold text-gray-700">{group.label}</span>
              <span className="text-xs text-gray-500">— {group.description}</span>
            </div>

            {groupChapters.map((chapter) => {
              const isOpen = openChapters.has(chapter.id)
              return (
                <Card key={chapter.id} className="overflow-hidden">
                  <button
                    className="flex w-full items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      group.pdca === "INTRO" ? "bg-gray-500" :
                      group.pdca === "PLAN"  ? "bg-blue-500" :
                      group.pdca === "DO"    ? "bg-green-500" :
                      group.pdca === "CHECK" ? "bg-amber-500" :
                      "bg-purple-500"
                    }`}>
                      {chapter.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {chapter.title}
                        {chapter.subtitle && (
                          <span className="ml-1.5 text-xs font-normal text-gray-500">— {chapter.subtitle}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{chapter.purpose}</p>
                    </div>
                    <Link
                      href={`/accompagnement/${chapter.id}`}
                      className="shrink-0 text-xs text-blue-600 hover:underline mr-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Vue détaillée
                    </Link>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                    )}
                  </button>

                  {isOpen && (
                    <CardContent className="border-t border-gray-100 p-4">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="sr-only">{chapter.title}</CardTitle>
                        <CardDescription className="text-xs text-gray-600">{chapter.purpose}</CardDescription>
                      </CardHeader>
                      <ChapterGuide
                        chapter={chapter}
                        standards={standards}
                        standardFilter={stdFilter}
                      />
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
