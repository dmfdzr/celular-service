import * as React from "react"
import {
  Activity,
  Database,
  LogOut,
  ShoppingCart,
  Signal,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { OperatorMenu } from "@/lib/types"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "customers", label: "Customer", icon: Users },
  { id: "transactions", label: "Transaksi", icon: ShoppingCart },
  { id: "data", label: "Data Service", icon: Database },
] satisfies Array<{
  id: OperatorMenu
  label: string
  icon: typeof Activity
}>

export function SidebarNav({
  activeMenu,
  collapsed,
  mobileOpen,
  session,
  onCloseMobile,
  onMenuChange,
  onLogout,
}: {
  activeMenu: OperatorMenu
  collapsed: boolean
  mobileOpen: boolean
  session: string
  onCloseMobile: () => void
  onMenuChange: (menu: OperatorMenu) => void
  onLogout: () => void
}) {
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)

  function confirmLogout() {
    setShowLogoutDialog(false)
    onLogout()
  }

  return (
    <>
      <aside
        className={cn(
          "hidden bg-[#101816] px-4 py-5 text-white transition-[width] duration-300 lg:block lg:border-r lg:border-[#d8dfd7]",
          collapsed ? "lg:w-22" : "lg:w-70"
        )}
      >
        <Brand collapsed={collapsed} />

        <nav className="mt-8 grid gap-2 text-sm" aria-label="Operator menu">
          {menuItems.map((item) => (
            <MenuButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeMenu === item.id}
              collapsed={collapsed}
              onClick={() => onMenuChange(item.id)}
            />
          ))}
        </nav>

        <OperatorCard
          collapsed={collapsed}
          session={session}
          onLogoutClick={() => setShowLogoutDialog(true)}
        />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#101816]/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(320px,86vw)] bg-[#101816] px-5 py-5 text-white shadow-[20px_0_80px_rgba(16,24,22,0.28)] transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <Brand collapsed={false} />
          <button
            aria-label="Tutup menu"
            className="flex size-10 items-center justify-center rounded-md border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
            onClick={onCloseMobile}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-8 grid gap-2 text-sm" aria-label="Operator menu">
          {menuItems.map((item) => (
            <MenuButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeMenu === item.id}
              collapsed={false}
              onClick={() => onMenuChange(item.id)}
            />
          ))}
        </nav>

        <OperatorCard
          collapsed={false}
          session={session}
          onLogoutClick={() => setShowLogoutDialog(true)}
        />
      </aside>

      {showLogoutDialog ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#101816]/60 px-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            aria-modal="true"
            className="view-transition w-full max-w-sm rounded-md border border-[#d8dfd7] bg-white p-5 text-[#111816] shadow-[0_24px_80px_rgba(16,24,22,0.22)]"
            role="dialog"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Konfirmasi logout
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              Keluar dari dashboard?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5c6963]">
              Sesi operator akan ditutup dan Anda akan kembali ke halaman login.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
              >
                Tidak
              </Button>
              <Button onClick={confirmLogout}>Ya, logout</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        collapsed && "justify-center"
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-md border border-emerald-300/40 bg-emerald-300 text-[#101816]">
        <Signal className="size-5" aria-hidden="true" />
      </div>
      {!collapsed ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
            CellMart
          </p>
          <h1 className="text-lg font-semibold">Data Commerce</h1>
        </div>
      ) : null}
    </div>
  )
}

function OperatorCard({
  collapsed,
  session,
  onLogoutClick,
}: {
  collapsed: boolean
  session: string
  onLogoutClick: () => void
}) {
  if (collapsed) {
    return (
      <button
        aria-label="Logout"
        className="mt-8 flex size-11 w-full items-center justify-center rounded-md border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
        onClick={onLogoutClick}
        type="button"
      >
        <LogOut className="size-4" />
      </button>
    )
  }

  return (
    <div className="mt-8 rounded-md border border-white/10 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">
        Operator Mode
      </p>
      <p className="mt-2 text-sm text-white/80">
        {session} mengelola checkout paket data melalui layanan transaksi.
      </p>
      <Button
        className="mt-4 w-full border-white/20 text-white hover:bg-white/10"
        variant="outline"
        onClick={onLogoutClick}
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </div>
  )
}

function MenuButton({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: typeof Activity
  label: string
  active: boolean
  collapsed: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        "relative flex h-11 items-center gap-3 overflow-hidden rounded-md border px-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300/30",
        collapsed && "justify-center px-0",
        active
          ? "translate-x-1 border-emerald-300/40 bg-emerald-300/12 text-emerald-100 shadow-[0_12px_32px_rgba(16,185,129,0.12)]"
          : "border-white/10 text-white/60 hover:translate-x-0.5 hover:border-white/20 hover:bg-white/4 hover:text-white"
      )}
      onClick={onClick}
      aria-pressed={active}
      type="button"
    >
      {active ? (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-300" />
      ) : null}
      <Icon className="size-4" aria-hidden="true" />
      {!collapsed ? label : <span className="sr-only">{label}</span>}
    </button>
  )
}
