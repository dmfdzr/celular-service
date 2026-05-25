import * as React from "react"
import { CalendarClock, Menu, PanelLeftClose, PanelLeftOpen, Zap } from "lucide-react"

import type { OperatorMenu } from "@/lib/types"

const pageCopy = {
  dashboard: {
    eyebrow: "Operator dashboard",
    title: "Pantau customer, transaksi, dan performa layanan.",
  },
  customers: {
    eyebrow: "Customer operations",
    title: "Kelola data pelanggan dan status akun.",
  },
  transactions: {
    eyebrow: "Transaction desk",
    title: "Proses pembelian paket dan tindak lanjut transaksi.",
  },
  data: {
    eyebrow: "Data service",
    title: "Monitor koneksi API dan resource operasional.",
  },
} satisfies Record<OperatorMenu, { eyebrow: string; title: string }>

export function PageHeader({
  activeMenu,
  sidebarCollapsed,
  onToggleDesktopSidebar,
  onToggleMobileSidebar,
}: {
  activeMenu: OperatorMenu
  sidebarCollapsed: boolean
  onToggleDesktopSidebar: () => void
  onToggleMobileSidebar: () => void
}) {
  const copy = pageCopy[activeMenu]
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, 60_000)

    return () => window.clearInterval(intervalId)
  }, [])

  const liveDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(now)

  return (
    <header className="border-b border-[#d8dfd7] bg-white px-5 py-5 sm:px-8">
      <div className="flex min-w-0 gap-3">
        <div className="pt-0.5">
          <button
            aria-label="Buka menu"
            className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[#d8dfd7] bg-[#f5f7f4] text-[#111816] transition hover:border-emerald-700 hover:bg-emerald-50 lg:hidden"
            onClick={onToggleMobileSidebar}
            type="button"
          >
            <Menu className="size-5" />
          </button>
          <button
            aria-label={
              sidebarCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"
            }
            className="hidden size-11 shrink-0 items-center justify-center rounded-md border border-[#d8dfd7] bg-[#f5f7f4] text-[#111816] transition hover:border-emerald-700 hover:bg-emerald-50 lg:flex"
            onClick={onToggleDesktopSidebar}
            type="button"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <Zap className="size-4" aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
              {copy.title}
            </h2>
            </div>
            <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md border border-[#d8dfd7] bg-[#f5f7f4] px-3 py-2 text-xs font-medium text-[#3d4a45] sm:px-4">
              <CalendarClock className="size-4" aria-hidden="true" />
              <span className="max-w-[220px] truncate sm:max-w-none">
                {liveDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
