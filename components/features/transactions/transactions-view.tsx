import { CheckCircle2, Loader2, Search, ShoppingCart, Wifi, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/shared/field"
import { IconButton } from "@/components/shared/icon-button"
import { Panel } from "@/components/shared/panel"
import { CustomerStatusBadge, StatusBadge } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"
import { currency, dateTime } from "@/lib/formatters"
import type { Customer, DataPackage, Transaction, TransactionStatus } from "@/lib/types"

export function TransactionsView({
  customers,
  packages,
  transactions,
  filteredPackages,
  operators,
  query,
  operator,
  selectedCustomer,
  selectedPackage,
  selectedCustomerId,
  selectedPackageId,
  loading,
  saving,
  apiError,
  onQueryChange,
  onOperatorChange,
  onCustomerChange,
  onPackageChange,
  onCreateTransaction,
  onUpdateTransactionStatus,
}: {
  customers: Customer[]
  packages: DataPackage[]
  transactions: Transaction[]
  filteredPackages: DataPackage[]
  operators: string[]
  query: string
  operator: string
  selectedCustomer?: Customer
  selectedPackage?: DataPackage
  selectedCustomerId: string
  selectedPackageId: string
  loading: boolean
  saving: boolean
  apiError: string | null
  onQueryChange: (value: string) => void
  onOperatorChange: (value: string) => void
  onCustomerChange: (value: string) => void
  onPackageChange: (value: string) => void
  onCreateTransaction: (event: React.FormEvent<HTMLFormElement>) => void
  onUpdateTransactionStatus: (
    transaction: Transaction,
    status: TransactionStatus
  ) => void
}) {
  return (
    <section className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <Panel
          eyebrow="Katalog paket"
          title="Pilih paket yang paling relevan"
          action={
            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row 2xl:max-w-xl">
              <label className="relative min-w-0 flex-1">
                <Search
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#68756f]"
                  aria-hidden="true"
                />
                <span className="sr-only">Cari paket</span>
                <input
                  className="h-10 w-full rounded-md border border-[#cdd6cc] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                  placeholder="Cari paket, operator, kuota"
                  value={query}
                  onChange={(event) => onQueryChange(event.target.value)}
                />
              </label>
              <label>
                <span className="sr-only">Filter operator</span>
                <select
                  className="h-10 w-full rounded-md border border-[#cdd6cc] bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 sm:w-40"
                  value={operator}
                  onChange={(event) => onOperatorChange(event.target.value)}
                >
                  {operators.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          }
        >
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2">
            {filteredPackages.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "group min-h-44 rounded-md border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-700 hover:shadow-[0_16px_40px_rgba(16,24,22,0.08)] focus:outline-none focus:ring-2 focus:ring-emerald-600/30",
                  selectedPackageId === item.id
                    ? "border-emerald-700 ring-2 ring-emerald-600/20"
                    : "border-[#d8dfd7]"
                )}
                onClick={() => onPackageChange(item.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-md bg-[#101816] text-emerald-200">
                    <Wifi className="size-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-md border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800">
                    {item.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
                <p className="mt-1 text-sm text-[#5c6963]">
                  {item.operator} - {item.speed} - {item.validity}
                </p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold">{item.quota}</p>
                    <p className="text-sm text-[#5c6963]">
                      {currency.format(item.price)}
                    </p>
                  </div>
                  {item.popular ? (
                    <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                      Populer
                    </span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <TransactionTable
          transactions={transactions}
          saving={saving}
          onUpdateTransactionStatus={onUpdateTransactionStatus}
        />
      </div>

      <Panel
        eyebrow="Checkout"
        title="Buat transaksi baru"
        className="order-first 2xl:sticky 2xl:top-6 2xl:order-none"
      >
        <form className="space-y-4" onSubmit={onCreateTransaction}>
          <Field label="Customer">
            <select
              className="form-input"
              value={selectedCustomerId}
              onChange={(event) => onCustomerChange(event.target.value)}
              disabled={loading}
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Paket internet">
            <select
              className="form-input"
              value={selectedPackageId}
              onChange={(event) => onPackageChange(event.target.value)}
              disabled={loading}
            >
              {packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {currency.format(item.price)}
                </option>
              ))}
            </select>
          </Field>

          <div className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {selectedCustomer?.name ?? "Pilih customer"}
                </p>
                <p className="text-xs text-[#68756f]">
                  {selectedCustomer?.phone ?? "-"} -{" "}
                  {selectedCustomer?.segment ?? "-"}
                </p>
              </div>
              {selectedCustomer ? (
                <CustomerStatusBadge status={selectedCustomer.status} />
              ) : null}
            </div>
            <div className="mt-4 border-t border-[#d8dfd7] pt-4">
              <p className="text-sm text-[#68756f]">Total bayar</p>
              <p className="text-3xl font-semibold">
                {selectedPackage
                  ? currency.format(selectedPackage.price)
                  : currency.format(0)}
              </p>
            </div>
          </div>

          <Button
            className="h-12 w-full"
            disabled={saving || loading || Boolean(apiError)}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ShoppingCart className="size-4" />
            )}
            Beli paket
          </Button>
        </form>
      </Panel>
    </section>
  )
}

function TransactionTable({
  transactions,
  saving,
  onUpdateTransactionStatus,
}: {
  transactions: Transaction[]
  saving: boolean
  onUpdateTransactionStatus: (
    transaction: Transaction,
    status: TransactionStatus
  ) => void
}) {
  return (
    <Panel eyebrow="Transaksi" title="Riwayat pembelian paket">
      <div className="hidden md:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#d8dfd7] text-left text-xs uppercase tracking-[0.16em] text-[#68756f]">
              <th className="py-3 pr-4 font-semibold">Customer</th>
              <th className="py-3 pr-4 font-semibold">Paket</th>
              <th className="py-3 pr-4 font-semibold">Harga</th>
              <th className="py-3 pr-4 font-semibold">Status</th>
              <th className="py-3 pr-4 font-semibold">Waktu</th>
              <th className="py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#edf0eb] last:border-0"
              >
                <td className="py-4 pr-4">
                  <p className="font-semibold">{item.customerName}</p>
                  <p className="text-xs text-[#68756f]">{item.msisdn}</p>
                </td>
                <td className="py-4 pr-4">
                  <p className="truncate">{item.packageName}</p>
                  <p className="text-xs text-[#68756f]">
                    {item.operator} via {item.channel}
                  </p>
                </td>
                <td className="py-4 pr-4 font-semibold">
                  {currency.format(item.price)}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-4 pr-4 text-[#5c6963]">
                  {dateTime.format(new Date(item.createdAt))}
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <IconButton
                      label="Tandai sukses"
                      disabled={saving}
                      onClick={() => onUpdateTransactionStatus(item, "success")}
                    >
                      <CheckCircle2 className="size-4" />
                    </IconButton>
                    <IconButton
                      label="Tandai gagal"
                      disabled={saving}
                      onClick={() => onUpdateTransactionStatus(item, "failed")}
                    >
                      <XCircle className="size-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {transactions.map((item) => (
          <article
            key={item.id}
            className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{item.customerName}</p>
                <p className="text-xs text-[#68756f]">{item.msisdn}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#68756f]">
                  Paket
                </p>
                <p className="mt-1 font-medium">{item.packageName}</p>
                <p className="text-xs text-[#68756f]">
                  {item.operator} via {item.channel}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#68756f]">
                    Harga
                  </p>
                  <p className="mt-1 font-semibold">
                    {currency.format(item.price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#68756f]">
                    Waktu
                  </p>
                  <p className="mt-1 text-xs text-[#5c6963]">
                    {dateTime.format(new Date(item.createdAt))}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <IconButton
                label="Tandai sukses"
                disabled={saving}
                onClick={() => onUpdateTransactionStatus(item, "success")}
              >
                <CheckCircle2 className="size-4" />
              </IconButton>
              <IconButton
                label="Tandai gagal"
                disabled={saving}
                onClick={() => onUpdateTransactionStatus(item, "failed")}
              >
                <XCircle className="size-4" />
              </IconButton>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
