import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Panel } from "@/components/shared/panel"
import { API_BASE_URL } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { Customer, DataPackage, Transaction } from "@/lib/types"

export function DataServiceView({
  customers,
  packages,
  transactions,
  apiError,
  loading,
  saving,
  onSync,
}: {
  customers: Customer[]
  packages: DataPackage[]
  transactions: Transaction[]
  apiError: string | null
  loading: boolean
  saving: boolean
  onSync: () => void
}) {
  return (
    <section className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <Panel eyebrow="Connection" title="Status layanan data">
        <div className="space-y-4">
          <ServiceStatus
            label="json-server"
            value={apiError ? "Offline" : "Online"}
            healthy={!apiError}
          />
          <div className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#68756f]">
              Base URL
            </p>
            <p className="mt-2 break-all font-mono text-sm">{API_BASE_URL}</p>
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={onSync}
            disabled={loading || saving}
          >
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            Sync Data Service
          </Button>
        </div>
      </Panel>

      <Panel eyebrow="Resources" title="Endpoint operasional">
        <div className="grid gap-3 md:grid-cols-3">
          <EndpointCard
            name="Customers"
            count={customers.length}
            path="/customers"
            methods="GET, POST, PATCH, DELETE"
          />
          <EndpointCard
            name="Packages"
            count={packages.length}
            path="/packages"
            methods="GET"
          />
          <EndpointCard
            name="Transactions"
            count={transactions.length}
            path="/transactions"
            methods="GET, POST, PATCH"
          />
        </div>
      </Panel>
    </section>
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

function EndpointCard({
  name,
  count,
  path,
  methods,
}: {
  name: string
  count: number
  path: string
  methods: string
}) {
  return (
    <article className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] p-4">
      <p className="text-lg font-semibold">{name}</p>
      <p className="mt-1 font-mono text-sm text-[#5c6963]">{path}</p>
      <p className="mt-4 text-3xl font-semibold">{count}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#68756f]">
        {methods}
      </p>
    </article>
  )
}
