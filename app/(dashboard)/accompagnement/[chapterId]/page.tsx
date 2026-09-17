"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChapterGuide } from "@/components/guidance/chapter-guide"
import { standards, chapters, getChapterById } from "@/lib/guidance/hls-guide"
import type { Pdca } from "@/lib/guidance/types"

const PDCA_COLORS: Record<Pdca, { bg: string; text: string; border: string }> = {
  INTRO: { bg: "bg-gray-100",   text: "text-gray-700",   border: "border-gray-300" },
  PLAN:  { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-300" },
  DO:    { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-300" },
  CHECK: { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300" },
  ACT:   { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
}

const PDCA_CIRCLE: Record<Pdca, string> = {
  INTRO: "bg-gray-500",
  PLAN:  "bg-blue-500",
  DO:    "bg-green-500",
  CHECK: "bg-amber-500",
  ACT:   "bg-purple-500",
}

export default function ChapterDetailPage() {
  const params = useParams<{ chapterId: string }>()
  const chapterId = params?.chapterId ?? ""
  const chapter = getChapterById(chapterId)

  if (!chapter) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Chapitre introuvable : {chapterId}</p>
      </div>
    )
  }

  const currentIndex = chapters.findIndex((c) => c.id === chapter.id)
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  const pdcaColors = PDCA_COLORS[chapter.pdca]
  const circleClass = PDCA_CIRCLE[chapter.pdca]

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Link href="/accompagnement" className="mt-1.5 shrink-0 text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title={`Chapitre ${chapter.number} — ${chapter.title}`}
          description={chapter.purpose}
          icon={BookOpen}
        >
          <Badge
            variant="outline"
            className={`${pdcaColors.bg} ${pdcaColors.text} ${pdcaColors.border} border font-bold`}
          >
            {chapter.pdca}
          </Badge>
        </PageHeader>
      </div>

      {/* Standards summary row */}
      <div className="flex flex-wrap gap-2">
        {standards.map((std) => (
          <div
            key={std.id}
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: std.color + "18", color: std.color, border: `1px solid ${std.color}40` }}
          >
            {std.shortName}
          </div>
        ))}
      </div>

      {/* Chapter number badge */}
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${circleClass}`}>
          {chapter.number}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{chapter.title}</p>
          {chapter.subtitle && <p className="text-sm text-gray-500">{chapter.subtitle}</p>}
        </div>
      </div>

      {/* Per-standard requirement cards */}
      <ChapterGuide chapter={chapter} standards={standards} />

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between pt-2">
        {prevChapter ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/accompagnement/${prevChapter.id}`}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Ch. {prevChapter.number} — {prevChapter.title}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/accompagnement/${nextChapter.id}`}>
              Ch. {nextChapter.number} — {nextChapter.title}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
