"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/",                  icon: LayoutDashboard, label: "Accueil" },
  { href: "/non-conformances",  icon: AlertTriangle,   label: "NC" },
  { href: "/capa",              icon: CheckSquare,     label: "CAPA" },
  { href: "/audits",            icon: ClipboardList,   label: "Audits" },
  { href: "/action-plan",       icon: MoreHorizontal,  label: "Actions" },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white pb-safe md:hidden">
      <div className="flex h-16 items-end justify-around pb-2">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 px-4 py-1"
            >
              <tab.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  active ? "text-blue-600" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-blue-600" : "text-gray-400"
                )}
              >
                {tab.label}
              </span>
              {active && (
                <span className="-mt-1 h-0.5 w-4 rounded-full bg-blue-600" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
