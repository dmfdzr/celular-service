"use client"

import * as React from "react"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Database,
  Loader2,
  LogIn,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Signal,
  Trash2,
  Users,
  Wifi,
  XCircle,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000"

type CustomerStatus = "active" | "suspended"
type CustomerSegment = "Bronze" | "Silver" | "Gold" | "Platinum"
type TransactionStatus = "processing" | "success" | "failed"

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  segment: CustomerSegment
  status: CustomerStatus
  city: string
  monthlySpend: number
}

type DataPackage = {
  id: string
  name: string
  operator: string
  quota: string
  validity: string
  price: number
  speed: string
  tag: string
  popular: boolean
}

type Transaction = {
  id: string
  customerId: string
  customerName: string
  msisdn: string
  packageId: string
  packageName: string
  operator: string
  price: number
  status: TransactionStatus
  channel: string
  createdAt: string
}

type CustomerForm = {
  name: string
  email: string
  phone: string
  city: string
  segment: CustomerSegment
}

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

const dateTime = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
})

const initialCustomerForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  segment: "Silver",
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export default function Page() {
  const [session, setSession] = React.useState<string | null>(null)
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [packages, setPackages] = React.useState<DataPackage[]>([])
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [operator, setOperator] = React.useState("Semua")
  const [selectedCustomerId, setSelectedCustomerId] = React.useState("")
  const [selectedPackageId, setSelectedPackageId] = React.useState("")
  const [customerForm, setCustomerForm] =
    React.useState<CustomerForm>(initialCustomerForm)

  const loadData = React.useCallback(async () => {
    setLoading(true)
    setApiError(null)

    try {
      const [customerData, packageData, transactionData] = await Promise.all([
        apiRequest<Customer[]>("/customers"),
        apiRequest<DataPackage[]>("/packages"),
        apiRequest<Transaction[]>("/transactions"),
      ])

      setCustomers(customerData)
      setPackages(packageData)
      setTransactions(
        transactionData.sort(
          (left, right) =>
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime()
        )
      )

      setSelectedCustomerId((current) => current || customerData[0]?.id || "")
      setSelectedPackageId((current) => current || packageData[0]?.id || "")
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Layanan data tidak bisa dihubungi."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // Data transaksi dimuat dari json-server agar alur API tetap realistis.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData()
  }, [loadData])

  const operators = React.useMemo(
    () => ["Semua", ...Array.from(new Set(packages.map((item) => item.operator)))],
    [packages]
  )

  const filteredPackages = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return packages.filter((item) => {
      const matchesOperator = operator === "Semua" || item.operator === operator
      const matchesQuery =
        !normalizedQuery ||
        `${item.name} ${item.operator} ${item.quota} ${item.tag}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesOperator && matchesQuery
    })
  }, [operator, packages, query])

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId
  )
  const selectedPackage = packages.find((item) => item.id === selectedPackageId)

  const successfulRevenue = transactions
    .filter((item) => item.status === "success")
    .reduce((total, item) => total + item.price, 0)
  const processingCount = transactions.filter(
    (item) => item.status === "processing"
  ).length
  const activeCustomers = customers.filter(
    (customer) => customer.status === "active"
  ).length

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    await new Promise((resolve) => window.setTimeout(resolve, 450))
    setSession("Dimas Admin")
    setSaving(false)
  }

  async function handleCreateCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    try {
      const newCustomer = await apiRequest<Customer>("/customers", {
        method: "POST",
        body: JSON.stringify({
          ...customerForm,
          status: "active",
          monthlySpend: 0,
        }),
      })

      setCustomerForm(initialCustomerForm)
      setCustomers((current) => [newCustomer, ...current])
      setSelectedCustomerId(newCustomer.id)
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Customer gagal ditambahkan."
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleCustomerStatus(customer: Customer) {
    setSaving(true)

    try {
      const updatedCustomer = await apiRequest<Customer>(
        `/customers/${customer.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: customer.status === "active" ? "suspended" : "active",
          }),
        }
      )

      setCustomers((current) =>
        current.map((item) =>
          item.id === updatedCustomer.id ? updatedCustomer : item
        )
      )
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Status customer gagal diubah."
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteCustomer(customer: Customer) {
    const hasTransactions = transactions.some(
      (transaction) => transaction.customerId === customer.id
    )

    if (hasTransactions) {
      setApiError("Customer dengan riwayat transaksi perlu dinonaktifkan.")
      return
    }

    if (!window.confirm(`Hapus customer ${customer.name}?`)) {
      return
    }

    setSaving(true)

    try {
      await apiRequest<void>(`/customers/${customer.id}`, {
        method: "DELETE",
      })

      setCustomers((current) =>
        current.filter((item) => item.id !== customer.id)
      )
      setSelectedCustomerId((current) =>
        current === customer.id ? customers[0]?.id ?? "" : current
      )
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Customer gagal dihapus."
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleCreateTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedCustomer || !selectedPackage) {
      setApiError("Pilih customer dan paket internet terlebih dahulu.")
      return
    }

    if (selectedCustomer.status !== "active") {
      setApiError("Customer suspend tidak dapat melakukan pembelian.")
      return
    }

    setSaving(true)

    try {
      const transaction = await apiRequest<Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          customerName: selectedCustomer.name,
          msisdn: selectedCustomer.phone,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          operator: selectedPackage.operator,
          price: selectedPackage.price,
          status: "processing",
          channel: "Web Checkout",
          createdAt: new Date().toISOString(),
        }),
      })

      const updatedCustomer = await apiRequest<Customer>(
        `/customers/${selectedCustomer.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            monthlySpend: selectedCustomer.monthlySpend + selectedPackage.price,
          }),
        }
      )

      setTransactions((current) => [transaction, ...current])
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      )
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Transaksi gagal dibuat."
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateTransactionStatus(
    transaction: Transaction,
    status: TransactionStatus
  ) {
    setSaving(true)

    try {
      const updatedTransaction = await apiRequest<Transaction>(
        `/transactions/${transaction.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      )

      setTransactions((current) =>
        current.map((item) =>
          item.id === updatedTransaction.id ? updatedTransaction : item
        )
      )
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Status transaksi gagal diubah."
      )
    } finally {
      setSaving(false)
    }
  }

  if (!session) {
    return <LoginScreen loading={saving} onSubmit={handleLogin} />
  }

  return (
    <main className="min-h-svh bg-[#f5f7f4] text-[#111816]">
      <div className="grid min-h-svh lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#d8dfd7] bg-[#101816] px-5 py-5 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center border border-emerald-300/40 bg-emerald-300 text-[#101816]">
              <Signal className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                CellMart
              </p>
              <h1 className="text-lg font-semibold">Data Commerce</h1>
            </div>
          </div>

          <nav className="mt-8 grid gap-2 text-sm">
            <MenuItem icon={LogIn} label="Login" active />
            <MenuItem icon={Users} label="Customer" active />
            <MenuItem icon={ShoppingCart} label="Transaksi" active />
            <MenuItem icon={Database} label="Data Service" active={!apiError} />
          </nav>

          <div className="mt-8 border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Operator Mode
            </p>
            <p className="mt-2 text-sm text-white/80">
              {session} mengelola checkout paket data melalui layanan transaksi
              json-server.
            </p>
            <Button
              className="mt-4 w-full border-white/20 text-white hover:bg-white/10"
              variant="outline"
              onClick={() => setSession(null)}
            >
              Logout
            </Button>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="border-b border-[#d8dfd7] bg-white px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  <Zap className="size-4" aria-hidden="true" />
                  Cellular commerce operations
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
                  Checkout cepat, data pelanggan rapi, transaksi terlacak.
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => void loadData()}
                  disabled={loading || saving}
                >
                  <RefreshCw
                    className={cn("size-4", loading && "animate-spin")}
                    aria-hidden="true"
                  />
                  Sync API
                </Button>
                <div className="border border-[#d8dfd7] bg-[#f5f7f4] px-4 py-2 text-xs font-medium text-[#3d4a45]">
                  25 Mei 2026, mulai 23:43 WIB
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 px-5 py-6 sm:px-8">
            {apiError ? (
              <ApiWarning message={apiError} onRetry={() => void loadData()} />
            ) : null}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Users}
                label="Customer aktif"
                value={`${activeCustomers}/${customers.length}`}
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

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <Panel
                  eyebrow="Katalog paket"
                  title="Pilih paket yang paling relevan"
                  action={
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                      <label className="relative min-w-0 flex-1">
                        <Search
                          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#68756f]"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Cari paket</span>
                        <input
                          className="h-10 w-full border border-[#cdd6cc] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                          placeholder="Cari paket, operator, kuota"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                      </label>
                      <label>
                        <span className="sr-only">Filter operator</span>
                        <select
                          className="h-10 w-full border border-[#cdd6cc] bg-white px-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 sm:w-40"
                          value={operator}
                          onChange={(event) => setOperator(event.target.value)}
                        >
                          {operators.map((item) => (
                            <option key={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  }
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredPackages.map((item) => (
                      <button
                        key={item.id}
                        className={cn(
                          "group min-h-44 border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-700 hover:shadow-[0_16px_40px_rgba(16,24,22,0.08)] focus:outline-none focus:ring-2 focus:ring-emerald-600/30",
                          selectedPackageId === item.id
                            ? "border-emerald-700 ring-2 ring-emerald-600/20"
                            : "border-[#d8dfd7]"
                        )}
                        onClick={() => setSelectedPackageId(item.id)}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex size-11 items-center justify-center bg-[#101816] text-emerald-200">
                            <Wifi className="size-5" aria-hidden="true" />
                          </div>
                          <span className="border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800">
                            {item.tag}
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#5c6963]">
                          {item.operator} · {item.speed} · {item.validity}
                        </p>
                        <div className="mt-4 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-2xl font-semibold">
                              {item.quota}
                            </p>
                            <p className="text-sm text-[#5c6963]">
                              {currency.format(item.price)}
                            </p>
                          </div>
                          {item.popular ? (
                            <span className="bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                              Populer
                            </span>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>

                <Panel eyebrow="Transaksi" title="Riwayat pembelian paket">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-[#d8dfd7] text-left text-xs uppercase tracking-[0.16em] text-[#68756f]">
                          <th className="py-3 pr-4 font-semibold">Customer</th>
                          <th className="py-3 pr-4 font-semibold">Paket</th>
                          <th className="py-3 pr-4 font-semibold">Harga</th>
                          <th className="py-3 pr-4 font-semibold">Status</th>
                          <th className="py-3 pr-4 font-semibold">Waktu</th>
                          <th className="py-3 text-right font-semibold">
                            Aksi
                          </th>
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
                              <p className="text-xs text-[#68756f]">
                                {item.msisdn}
                              </p>
                            </td>
                            <td className="py-4 pr-4">
                              <p>{item.packageName}</p>
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
                                  onClick={() =>
                                    void handleUpdateTransactionStatus(
                                      item,
                                      "success"
                                    )
                                  }
                                >
                                  <CheckCircle2 className="size-4" />
                                </IconButton>
                                <IconButton
                                  label="Tandai gagal"
                                  disabled={saving}
                                  onClick={() =>
                                    void handleUpdateTransactionStatus(
                                      item,
                                      "failed"
                                    )
                                  }
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
                </Panel>
              </div>

              <div className="space-y-6">
                <Panel eyebrow="Checkout" title="Buat transaksi baru">
                  <form className="space-y-4" onSubmit={handleCreateTransaction}>
                    <Field label="Customer">
                      <select
                        className="form-input"
                        value={selectedCustomerId}
                        onChange={(event) =>
                          setSelectedCustomerId(event.target.value)
                        }
                        disabled={loading}
                      >
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} · {customer.phone}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Paket internet">
                      <select
                        className="form-input"
                        value={selectedPackageId}
                        onChange={(event) =>
                          setSelectedPackageId(event.target.value)
                        }
                        disabled={loading}
                      >
                        {packages.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} · {currency.format(item.price)}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="border border-[#d8dfd7] bg-[#f7faf7] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            {selectedCustomer?.name ?? "Pilih customer"}
                          </p>
                          <p className="text-xs text-[#68756f]">
                            {selectedCustomer?.phone ?? "-"} ·{" "}
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

                <Panel eyebrow="Customer" title="Tambah customer">
                  <form className="space-y-3" onSubmit={handleCreateCustomer}>
                    <Field label="Nama">
                      <input
                        className="form-input"
                        required
                        value={customerForm.name}
                        onChange={(event) =>
                          setCustomerForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        className="form-input"
                        required
                        type="email"
                        value={customerForm.email}
                        onChange={(event) =>
                          setCustomerForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Nomor HP">
                        <input
                          className="form-input"
                          required
                          type="tel"
                          value={customerForm.phone}
                          onChange={(event) =>
                            setCustomerForm((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                        />
                      </Field>
                      <Field label="Kota">
                        <input
                          className="form-input"
                          required
                          value={customerForm.city}
                          onChange={(event) =>
                            setCustomerForm((current) => ({
                              ...current,
                              city: event.target.value,
                            }))
                          }
                        />
                      </Field>
                    </div>
                    <Field label="Segment">
                      <select
                        className="form-input"
                        value={customerForm.segment}
                        onChange={(event) =>
                          setCustomerForm((current) => ({
                            ...current,
                            segment: event.target.value as CustomerSegment,
                          }))
                        }
                      >
                        <option>Bronze</option>
                        <option>Silver</option>
                        <option>Gold</option>
                        <option>Platinum</option>
                      </select>
                    </Field>
                    <Button className="w-full" disabled={saving || Boolean(apiError)}>
                      <Plus className="size-4" />
                      Tambah customer
                    </Button>
                  </form>
                </Panel>

                <Panel eyebrow="Customer list" title="Kelola pelanggan">
                  <div className="space-y-3">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="border border-[#d8dfd7] bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{customer.name}</p>
                            <p className="text-xs text-[#68756f]">
                              {customer.city} · {customer.segment} ·{" "}
                              {currency.format(customer.monthlySpend)}
                            </p>
                          </div>
                          <CustomerStatusBadge status={customer.status} />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={saving}
                            onClick={() =>
                              void handleToggleCustomerStatus(customer)
                            }
                          >
                            {customer.status === "active"
                              ? "Suspend"
                              : "Activate"}
                          </Button>
                          <IconButton
                            label="Hapus customer"
                            disabled={saving}
                            onClick={() => void handleDeleteCustomer(customer)}
                          >
                            <Trash2 className="size-4" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

function LoginScreen({
  loading,
  onSubmit,
}: {
  loading: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <main className="min-h-svh bg-[#101816] text-white">
      <div className="grid min-h-svh lg:grid-cols-[1fr_520px]">
        <section className="flex min-h-[45svh] flex-col justify-between bg-[linear-gradient(135deg,#10251f_0%,#101816_45%,#073e3a_100%)] p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center bg-emerald-300 text-[#101816]">
              <Signal className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                CellMart
              </p>
              <p className="text-lg font-semibold">Data Commerce</p>
            </div>
          </div>

          <div className="max-w-3xl py-12">
            <p className="mb-4 inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Secure operator console
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Pembelian paket data internet dengan checkout yang ringan untuk
              tim operasional.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              Kelola login operator, customer management, katalog paket, dan
              transaksi melalui endpoint json-server.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-3">
            <p className="border border-white/10 p-4">CRUD customer</p>
            <p className="border border-white/10 p-4">Checkout paket</p>
            <p className="border border-white/10 p-4">Status transaksi</p>
          </div>
        </section>

        <section className="flex items-center bg-[#f5f7f4] p-6 text-[#111816] sm:p-10">
          <form
            className="w-full border border-[#d8dfd7] bg-white p-6 shadow-[0_24px_80px_rgba(16,24,22,0.12)] sm:p-8"
            onSubmit={onSubmit}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Login operator
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Masuk ke dashboard
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5c6963]">
              Gunakan akses operator untuk memproses pembelian dan mengelola
              data pelanggan.
            </p>

            <div className="mt-6 space-y-4">
              <Field label="Email">
                <input
                  className="form-input"
                  defaultValue="admin@cellmart.id"
                  type="email"
                  required
                />
              </Field>
              <Field label="Password">
                <input
                  className="form-input"
                  defaultValue="operator123"
                  type="password"
                  required
                />
              </Field>
            </div>

            <Button className="mt-6 h-12 w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4" />
              )}
              Login
            </Button>

            <div className="mt-6 border border-[#d8dfd7] bg-[#f7faf7] p-4 text-xs leading-5 text-[#5c6963]">
              Jalankan <strong>npm run api</strong> untuk mengaktifkan layanan
              transaksi di <strong>{API_BASE_URL}</strong>.
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

function Panel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border border-[#d8dfd7] bg-white p-4 shadow-[0_18px_50px_rgba(16,24,22,0.05)] sm:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5c6963]">
        {label}
      </span>
      {children}
    </label>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType
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
    <article className="border border-[#d8dfd7] bg-white p-5">
      <div className={cn("flex size-11 items-center justify-center", toneClass)}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm text-[#5c6963]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </article>
  )
}

function MenuItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <div
      className={cn(
        "flex h-11 items-center gap-3 border px-3",
        active
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
          : "border-white/10 text-white/50"
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </div>
  )
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = {
    processing: {
      label: "Processing",
      className: "border-amber-200 bg-amber-50 text-amber-900",
    },
    success: {
      label: "Success",
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
    failed: {
      label: "Failed",
      className: "border-red-200 bg-red-50 text-red-800",
    },
  }[status]

  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center border px-2.5 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}

function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center border px-2.5 text-xs font-semibold",
        status === "active"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-800"
      )}
    >
      {status === "active" ? "Active" : "Suspended"}
    </span>
  )
}

function IconButton({
  label,
  children,
  disabled,
  onClick,
}: {
  label: string
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      aria-label={label}
      className="flex size-10 items-center justify-center border border-[#d8dfd7] bg-white text-[#2d3834] transition hover:border-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/25 disabled:pointer-events-none disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  )
}

function ApiWarning({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex flex-col gap-3 border border-amber-300 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">Layanan data belum siap</p>
          <p className="text-sm leading-6">
            {message}. Jalankan <strong>npm run api</strong>, lalu tekan
            Sync API.
          </p>
        </div>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="size-4" />
        Sync API
      </Button>
    </div>
  )
}
