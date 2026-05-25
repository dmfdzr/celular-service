import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/shared/field"
import { IconButton } from "@/components/shared/icon-button"
import { Panel } from "@/components/shared/panel"
import { CustomerStatusBadge } from "@/components/shared/status-badge"
import { currency } from "@/lib/formatters"
import type { Customer, CustomerForm, CustomerSegment } from "@/lib/types"

export function CustomersView({
  customers,
  customerForm,
  saving,
  apiError,
  onFormChange,
  onCreateCustomer,
  onToggleStatus,
  onDeleteCustomer,
}: {
  customers: Customer[]
  customerForm: CustomerForm
  saving: boolean
  apiError: string | null
  onFormChange: (form: CustomerForm) => void
  onCreateCustomer: (event: React.FormEvent<HTMLFormElement>) => void
  onToggleStatus: (customer: Customer) => void
  onDeleteCustomer: (customer: Customer) => void
}) {
  return (
    <section className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <Panel
        eyebrow="Customer"
        title="Tambah customer"
        className="xl:sticky xl:top-6"
      >
        <form className="space-y-3" onSubmit={onCreateCustomer}>
          <Field label="Nama">
            <input
              className="form-input"
              required
              value={customerForm.name}
              onChange={(event) =>
                onFormChange({ ...customerForm, name: event.target.value })
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
                onFormChange({ ...customerForm, email: event.target.value })
              }
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Field label="Nomor HP">
              <input
                className="form-input"
                required
                type="tel"
                value={customerForm.phone}
                onChange={(event) =>
                  onFormChange({ ...customerForm, phone: event.target.value })
                }
              />
            </Field>
            <Field label="Kota">
              <input
                className="form-input"
                required
                value={customerForm.city}
                onChange={(event) =>
                  onFormChange({ ...customerForm, city: event.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Segment">
            <select
              className="form-input"
              value={customerForm.segment}
              onChange={(event) =>
                onFormChange({
                  ...customerForm,
                  segment: event.target.value as CustomerSegment,
                })
              }
            >
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
              <option>Platinum</option>
            </select>
          </Field>
          <Button className="w-full" disabled={saving || Boolean(apiError)}>
            Tambah customer
          </Button>
        </form>
      </Panel>

      <Panel
        eyebrow="Customer list"
        title="Kelola pelanggan"
        action={
          <div className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] px-3 py-2 text-sm font-semibold text-[#3d4a45]">
            {customers.length} customer
          </div>
        }
      >
        <div className="hidden md:block">
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[28%]" />
              <col className="w-[13%]" />
              <col className="w-[15%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-[#d8dfd7] text-left text-xs uppercase tracking-[0.16em] text-[#68756f]">
                <th className="py-3 pr-4 font-semibold">Customer</th>
                <th className="py-3 pr-4 font-semibold">Kontak</th>
                <th className="py-3 pr-4 font-semibold">Segment</th>
                <th className="py-3 pr-4 font-semibold">Spend</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-[#edf0eb] last:border-0"
                >
                  <td className="py-4 pr-4">
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-xs text-[#68756f]">{customer.city}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="truncate">{customer.phone}</p>
                    <p className="truncate text-xs text-[#68756f]">
                      {customer.email}
                    </p>
                  </td>
                  <td className="py-4 pr-4">{customer.segment}</td>
                  <td className="py-4 pr-4 font-semibold">
                    {currency.format(customer.monthlySpend)}
                  </td>
                  <td className="py-4 pr-4">
                    <CustomerStatusBadge status={customer.status} />
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={() => onToggleStatus(customer)}
                      >
                        {customer.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                      <IconButton
                        label="Hapus customer"
                        disabled={saving}
                        onClick={() => onDeleteCustomer(customer)}
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 md:hidden">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{customer.name}</p>
                  <p className="text-sm text-[#68756f]">
                    {customer.city} - {customer.segment}
                  </p>
                </div>
                <CustomerStatusBadge status={customer.status} />
              </div>
              <div className="mt-4 grid gap-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#68756f]">
                    Kontak
                  </p>
                  <p className="mt-1">{customer.phone}</p>
                  <p className="break-all text-xs text-[#68756f]">
                    {customer.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#68756f]">
                    Spend
                  </p>
                  <p className="mt-1 font-semibold">
                    {currency.format(customer.monthlySpend)}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-[1fr_44px] gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={saving}
                  onClick={() => onToggleStatus(customer)}
                >
                  {customer.status === "active" ? "Suspend" : "Activate"}
                </Button>
                <IconButton
                  label="Hapus customer"
                  disabled={saving}
                  onClick={() => onDeleteCustomer(customer)}
                >
                  <Trash2 className="size-4" />
                </IconButton>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  )
}
