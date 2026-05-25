"use client"

import * as React from "react"

import { OperatorShell } from "@/components/app-shell/operator-shell"
import { LoginScreen } from "@/components/features/auth/login-screen"
import { CustomersView } from "@/components/features/customers/customers-view"
import { DashboardView } from "@/components/features/dashboard/dashboard-view"
import { DataServiceView } from "@/components/features/data-service/data-service-view"
import { TransactionsView } from "@/components/features/transactions/transactions-view"
import { apiRequest } from "@/lib/api"
import type {
  Customer,
  CustomerForm,
  DataPackage,
  OperatorMenu,
  Transaction,
  TransactionStatus,
} from "@/lib/types"

const initialCustomerForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  segment: "Silver",
}

export default function Page() {
  const [session, setSession] = React.useState<string | null>(null)
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [packages, setPackages] = React.useState<DataPackage[]>([])
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [apiError, setApiError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [activeMenu, setActiveMenu] = React.useState<OperatorMenu>("dashboard")
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

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 450))
    setSession("Admin")
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
    <OperatorShell
      activeMenu={activeMenu}
      session={session}
      apiError={apiError}
      onMenuChange={setActiveMenu}
      onLogout={() => setSession(null)}
    >
      {activeMenu === "dashboard" ? (
        <DashboardView
          customers={customers}
          packages={packages}
          transactions={transactions}
          apiError={apiError}
          loading={loading}
        />
      ) : null}

      {activeMenu === "customers" ? (
        <CustomersView
          customers={customers}
          customerForm={customerForm}
          saving={saving}
          apiError={apiError}
          onFormChange={setCustomerForm}
          onCreateCustomer={handleCreateCustomer}
          onToggleStatus={(customer) => void handleToggleCustomerStatus(customer)}
          onDeleteCustomer={(customer) => void handleDeleteCustomer(customer)}
        />
      ) : null}

      {activeMenu === "transactions" ? (
        <TransactionsView
          customers={customers}
          packages={packages}
          transactions={transactions}
          filteredPackages={filteredPackages}
          operators={operators}
          query={query}
          operator={operator}
          selectedCustomer={selectedCustomer}
          selectedPackage={selectedPackage}
          selectedCustomerId={selectedCustomerId}
          selectedPackageId={selectedPackageId}
          loading={loading}
          saving={saving}
          apiError={apiError}
          onQueryChange={setQuery}
          onOperatorChange={setOperator}
          onCustomerChange={setSelectedCustomerId}
          onPackageChange={setSelectedPackageId}
          onCreateTransaction={handleCreateTransaction}
          onUpdateTransactionStatus={(transaction, status) =>
            void handleUpdateTransactionStatus(transaction, status)
          }
        />
      ) : null}

      {activeMenu === "data" ? (
        <DataServiceView
          customers={customers}
          packages={packages}
          transactions={transactions}
          apiError={apiError}
          loading={loading}
          saving={saving}
          onSync={() => void loadData()}
        />
      ) : null}
    </OperatorShell>
  )
}
