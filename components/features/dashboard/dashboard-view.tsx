import { Activity, CreditCard, Package, Users } from "lucide-react"

import { Panel } from "@/components/shared/panel"
import { StatusBadge } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"
import { currency } from "@/lib/formatters"
import type { Customer, DataPackage, Transaction } from "@/lib/types"

export function DashboardView({
  customers,
  packages,
  transactions,
  apiError,
  loading,
}: {
  customers: Customer[]
  packages: DataPackage[]
  transactions: Transaction[]
  apiError: string | null
  loading: boolean
}) {
  const activeCustomers = customers.filter((item) => item.status === "active")
  const successCount = transactions.filter((item) => item.status === "success").length
  const processingCount = transactions.filter(
    (item) => item.status === "processing"
  ).length
  const failedCount = transactions.filter((item) => item.status === "failed").length
  const successfulRevenue = transactions
    .filter((item) => item.status === "success")
    .reduce((total, item) => total + item.price, 0)
  const topCustomers = [...customers]
    .sort((left, right) => right.monthlySpend - left.monthlySpend)
    .slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Customer aktif"
          value={`${activeCustomers.length}/${customers.length}`}
          tone="emerald"
        />
        <MetricCard
          icon={Package}
          label="Paket tersedia"
          value={packages.length.toString()}
          tone="cyan"
        />
        <MetricCard
          icon={Activity}
          label="Diproses"
          value={processingCount.toString()}
          tone="amber"
        />
        <MetricCard
          icon={CreditCard}
          label="Revenue sukses"
          value={currency.format(successfulRevenue)}
          tone="ink"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel eyebrow="Tracking" title="Status transaksi">
          <div className="grid gap-3 sm:grid-cols-3">
            <TrackingTile
              label="Success"
              value={successCount}
              helper={`${Math.round((successCount / Math.max(transactions.length, 1)) * 100)}% selesai`}
              tone="success"
            />
            <TrackingTile
              label="Processing"
              value={processingCount}
              helper="Butuh monitoring"
              tone="warning"
            />
            <TrackingTile
              label="Failed"
              value={failedCount}
              helper="Perlu tindak lanjut"
              tone="danger"
            />
          </div>
        </Panel>

        <Panel eyebrow="Customer volume" title="Customer dengan spend tertinggi">
          <div className="space-y-3">
            {topCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between gap-4 rounded-md border border-[#edf0eb] bg-[#f7faf7] p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{customer.name}</p>
                  <p className="text-xs text-[#68756f]">
                    {customer.city} - {customer.segment}
                  </p>
                </div>
                <p className="shrink-0 font-semibold">
                  {currency.format(customer.monthlySpend)}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Recent activity" title="Transaksi terbaru">
          <div className="space-y-3">
            {transactions.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-md border border-[#edf0eb] bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{item.customerName}</p>
                  <p className="text-sm text-[#68756f]">
                    {item.packageName} - {currency.format(item.price)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Service health" title="Kondisi layanan">
          <div className="grid gap-3 sm:grid-cols-2">
            <ServiceStatus
              label="API status"
              value={apiError ? "Offline" : "Online"}
              healthy={!apiError}
            />
            <ServiceStatus
              label="Resource loaded"
              value={`${customers.length + packages.length + transactions.length} records`}
              healthy={!loading}
            />
          </div>
        </Panel>
      </section>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users
  label: string
  value: string
  tone: "emerald" | "cyan" | "amber" | "ink"
}) {
  const toneClass = {
    emerald: "bg-emerald-100 text-emerald-900",
    cyan: "bg-cyan-100 text-cyan-900",
    amber: "bg-amber-100 text-amber-900",
    ink: "bg-[#101816] text-white",
  }[tone]

  return (
    <article className="stagger-item rounded-md border border-[#d8dfd7] bg-white p-5">
      <div className={cn("flex size-11 items-center justify-center rounded-md", toneClass)}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm text-[#5c6963]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </article>
  )
}

function TrackingTile({
  label,
  value,
  helper,
  tone,
}: {
  label: string
  value: number
  helper: string
  tone: "success" | "warning" | "danger"
}) {
  const toneClass = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-950",
    warning: "border-amber-200 bg-amber-50 text-amber-950",
    danger: "border-red-200 bg-red-50 text-red-950",
  }[tone]

  return (
    <div className={cn("rounded-md border p-4", toneClass)}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm opacity-75">{helper}</p>
    </div>
  )
}

function ServiceStatus({
  label,
  value,
  healthy,
}: {
  label: string
  value: string
  healthy: boolean
}) {
  return (
    <div className="rounded-md border border-[#d8dfd7] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#68756f]">
        {label}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={cn(
            "size-2.5 rounded-full",
            healthy ? "bg-emerald-600" : "bg-red-600"
          )}
        />
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}
