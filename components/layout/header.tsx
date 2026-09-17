"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell, LogOut, User, Settings, Menu, Shield,
  AlertTriangle, CheckSquare, ClipboardList, FileText,
  Clock, CheckCheck, X, Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TopNav } from "@/components/layout/top-nav"
import { cn } from "@/lib/utils"

const mockNotifications = [
  {
    id: 1, read: false, type: "nc", icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
    title: "NC-2026-020 en retard",
    body: "La non-conformité dépasse son échéance de 3 jours.",
    time: "Il y a 2 h",
    href: "/non-conformances/1",
  },
  {
    id: 2, read: false, type: "capa", icon: CheckSquare,
    color: "bg-amber-100 text-amber-600",
    title: "CAPA-2026-018 : action requise",
    body: "3 actions en attente à valider avant le 15 juillet.",
    time: "Il y a 4 h",
    href: "/capa/1",
  },
  {
    id: 3, read: false, type: "audit", icon: ClipboardList,
    color: "bg-blue-100 text-blue-600",
    title: "Audit planifié dans 7 jours",
    body: "AUD-2026-012 — Audit interne ISO 9001 Production.",
    time: "Hier",
    href: "/audits/1",
  },
  {
    id: 4, read: true, type: "doc", icon: FileText,
    color: "bg-purple-100 text-purple-600",
    title: "Document expiré",
    body: "PRO-ENV-005 doit être révisé avant le 30 juin.",
    time: "Il y a 2 j",
    href: "/documents",
  },
  {
    id: 5, read: true, type: "nc", icon: AlertTriangle,
    color: "bg-green-100 text-green-600",
    title: "NC-2026-021 clôturée",
    body: "La non-conformité a été vérifiée et clôturée.",
    time: "Il y a 3 j",
    href: "/non-conformances/1",
  },
]

interface HeaderProps {
  userEmail?: string
  onMenuToggle?: () => void
  aiOpen?: boolean
  onAiToggle?: () => void
}

export function Header({ userEmail = "admin@qhse.fr", onMenuToggle, aiOpen = false, onAiToggle }: HeaderProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  const dismiss = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id))

  const initials = userEmail.substring(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b bg-white/95 px-4 backdrop-blur-sm md:h-16 md:px-6">
      {/* Left: hamburger (mobile) + logo + horizontal nav (desktop) */}
      <div className="flex min-w-0 flex-1 items-center gap-3 self-stretch">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 shrink-0 text-blue-600" />
          <span className="text-base font-bold text-gray-900 md:text-lg">QualiSafe</span>
        </Link>
        <div className="ml-2 hidden self-stretch lg:block">
          <TopNav />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* AI assistant toggle */}
        <Button
          variant={aiOpen ? "default" : "outline"}
          size="sm"
          onClick={onAiToggle}
          className={cn(
            "h-9 gap-1.5 rounded-lg",
            aiOpen
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              : "border-blue-200 text-blue-700 hover:bg-blue-50"
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden md:inline">Assistant IA</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
            {/* Panel header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">{unreadCount}</Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Tout lire
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[380px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-gray-400">
                  <Bell className="h-8 w-8" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = n.icon
                  return (
                    <div
                      key={n.id}
                      className={`group relative flex items-start gap-3 border-b px-4 py-3 last:border-0 hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <Link
                        href={n.href}
                        className="flex-1 min-w-0"
                        onClick={() => { markRead(n.id); setNotifOpen(false) }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-tight ${!n.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{n.body}</p>
                        <div className="mt-1 flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-[11px]">{n.time}</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => dismiss(n.id)}
                        className="absolute right-3 top-3 hidden h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 group-hover:flex"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-2.5">
              <Link
                href="/notifications"
                className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700"
                onClick={() => setNotifOpen(false)}
              >
                Voir toutes les notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-1.5 md:px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-gray-700 xl:block">{userEmail}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="font-semibold">Mon compte</span>
                <span className="text-xs text-gray-500">{userEmail}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => router.push("/login")}>
              <LogOut className="mr-2 h-4 w-4" />Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
