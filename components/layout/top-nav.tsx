"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { navGroups, isItemActive, isGroupActive } from "@/components/layout/nav-data"

export function TopNav() {
  const pathname = usePathname()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close on navigation
  useEffect(() => {
    setOpenIndex(null)
  }, [pathname])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenIndex(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const open = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenIndex(i)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenIndex(null), 150)
  }

  return (
    <nav ref={navRef} className="hidden h-full items-stretch gap-1 lg:flex">
      {navGroups.map((group, i) => {
        const active = isGroupActive(pathname, group)
        const isOpen = openIndex === i
        return (
          <div
            key={group.title}
            className="relative flex items-stretch"
            onMouseEnter={() => open(i)}
            onMouseLeave={scheduleClose}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors my-2",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                isOpen && "bg-gray-100 text-gray-900"
              )}
            >
              {group.title}
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")}
              />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full z-50 w-80 pt-1">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 shadow-2xl ring-1 ring-black/10">
                  {/* Category header card */}
                  <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-4">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white", group.iconColor)}>
                      <group.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{group.title}</p>
                      <p className="truncate text-xs text-blue-200/80">{group.subtitle}</p>
                    </div>
                  </div>
                  {/* Links */}
                  <div className="p-2">
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
                              : "text-blue-100 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
