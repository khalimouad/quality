"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Shield, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navGroups, isItemActive, isGroupActive } from "@/components/layout/nav-data"

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname()
  const activeIndex = navGroups.findIndex((g) => isGroupActive(pathname, g))
  const [expanded, setExpanded] = useState<number | null>(activeIndex >= 0 ? activeIndex : 0)

  // Close drawer and re-expand the active group on navigation
  useEffect(() => {
    onClose()
    const idx = navGroups.findIndex((g) => isGroupActive(pathname, g))
    if (idx >= 0) setExpanded(idx)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-slate-900 to-blue-950 text-white transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 shrink-0 text-blue-400" />
            <span className="ml-3 truncate text-lg font-bold">QualiSafe</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-blue-200 hover:bg-white/10 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {navGroups.map((group, i) => {
            const isExpanded = expanded === i
            const groupActive = isGroupActive(pathname, group)
            return (
              <div key={group.title} className="overflow-hidden rounded-xl bg-white/5">
                <button
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left"
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white", group.iconColor)}>
                    <group.icon className="h-4 w-4" />
                  </div>
                  <span className={cn("flex-1 truncate text-sm font-semibold", groupActive ? "text-white" : "text-blue-100")}>
                    {group.title}
                  </span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-blue-300 transition-transform", isExpanded && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-0.5 px-2 pb-2">
                      {group.items.map((item) => {
                        const itemActive = isItemActive(pathname, item.href)
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                              itemActive
                                ? "bg-blue-600 font-medium text-white"
                                : "text-blue-200 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                            <span className="truncate">{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="text-xs text-blue-300/60">QHSE Manager v1.0</p>
        </div>
      </aside>
    </>
  )
}
