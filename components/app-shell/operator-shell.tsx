import * as React from "react"

import { PageHeader } from "@/components/app-shell/page-header"
import { SidebarNav } from "@/components/app-shell/sidebar-nav"
import { ApiWarning } from "@/components/shared/api-warning"
import type { OperatorMenu } from "@/lib/types"

export function OperatorShell({
  activeMenu,
  session,
  apiError,
  onMenuChange,
  onLogout,
  children,
}: {
  activeMenu: OperatorMenu
  session: string
  apiError: string | null
  onMenuChange: (menu: OperatorMenu) => void
  onLogout: () => void
  children: React.ReactNode
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] =
    React.useState(false)

  function handleMenuChange(menu: OperatorMenu) {
    onMenuChange(menu)
    setMobileSidebarOpen(false)
  }

  return (
    <main className="min-h-svh bg-[#f5f7f4] text-[#111816]">
      <div
        className={
          desktopSidebarCollapsed
            ? "grid min-h-svh lg:grid-cols-[88px_1fr]"
            : "grid min-h-svh lg:grid-cols-[280px_1fr]"
        }
      >
        <SidebarNav
          activeMenu={activeMenu}
          collapsed={desktopSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          session={session}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onMenuChange={handleMenuChange}
          onLogout={onLogout}
        />
        <section className="min-w-0">
          <PageHeader
            activeMenu={activeMenu}
            sidebarCollapsed={desktopSidebarCollapsed}
            onToggleDesktopSidebar={() =>
              setDesktopSidebarCollapsed((current) => !current)
            }
            onToggleMobileSidebar={() =>
              setMobileSidebarOpen((current) => !current)
            }
          />
          <div className="space-y-6 px-5 py-6 sm:px-8">
            {apiError ? <ApiWarning message={apiError} /> : null}
            <div key={activeMenu} className="view-transition">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
