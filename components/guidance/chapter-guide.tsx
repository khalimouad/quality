"use client"

import Link from "next/link"
import type React from "react"
import {
  ShieldCheck, ShieldAlert, Leaf, HardHat, Scale, UtensilsCrossed, ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GuideChapter, GuideStandard } from "@/lib/guidance/types"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  ShieldAlert,
  Leaf,
  HardHat,
  Scale,
  UtensilsCrossed,
}

interface ChapterGuideProps {
  chapter: GuideChapter
  standards: GuideStandard[]
  standardFilter?: string[]
}

export function ChapterGuide({ chapter, standards, standardFilter }: ChapterGuideProps) {
  const visibleStandards = standardFilter
    ? standards.filter((s) => standardFilter.includes(s.id))
    : standards

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleStandards.map((std) => {
        const cell = chapter.cells.find((c) => c.standardId === std.id)
        if (!cell) return null
        const Icon = ICON_MAP[std.iconName] ?? ShieldCheck
        return (
          <Card key={std.id} className="overflow-hidden border-0 shadow-sm ring-1 ring-gray-200">
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ backgroundColor: std.color + "18", borderBottom: `2px solid ${std.color}` }}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: std.color }}
              >
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold leading-none" style={{ color: std.color }}>
                  {std.name}
                </p>
                <p className="text-[10px] leading-none text-gray-500 mt-0.5">{std.domain}</p>
              </div>
            </div>
            <CardHeader className="px-4 pb-0 pt-3">
              <CardTitle className="sr-only">{std.name}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-2">
              <ul className="space-y-1.5">
                {cell.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-snug">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: std.color }}
                    />
                    {req}
                  </li>
                ))}
              </ul>
              {cell.links && cell.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cell.links.map((link) => (
                    <Button
                      key={link.href}
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-6 gap-1 px-2 text-[10px] font-medium"
                      style={{ borderColor: std.color + "40", color: std.color }}
                    >
                      <Link href={link.href}>
                        <ExternalLink className="h-2.5 w-2.5" />
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
