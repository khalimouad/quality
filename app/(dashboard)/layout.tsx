"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { AiAssistant } from "@/components/layout/ai-assistant"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <Header
        userEmail="admin@qhse.fr"
        onMenuToggle={() => setMobileNavOpen(true)}
        aiOpen={aiOpen}
        onAiToggle={() => setAiOpen((v) => !v)}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Extra bottom padding on mobile for the bottom nav bar */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          {children}
        </main>
        <AiAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <MobileBottomNav />
    </div>
  )
}
