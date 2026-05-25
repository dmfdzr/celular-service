import { Loader2, LogIn, ShieldCheck, Signal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/shared/field"
import { API_BASE_URL } from "@/lib/api"

export function LoginScreen({
  loading,
  onSubmit,
}: {
  loading: boolean
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <main className="login-transition min-h-svh bg-[#f5f7f4] text-[#111816] lg:bg-[#101816] lg:text-white">
      <div className="grid min-h-svh lg:grid-cols-[1fr_520px]">
        <section className="hidden min-h-svh flex-col justify-between bg-[linear-gradient(135deg,#10251f_0%,#101816_45%,#073e3a_100%)] p-10 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-md bg-emerald-300 text-[#101816]">
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
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Secure operator console
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Pembelian paket data internet dengan checkout yang ringan untuk
              tim operasional.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
              Kelola customer management, katalog paket, dan transaksi melalui aplikasi.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-3">
            <p className="rounded-md border border-white/10 p-4">CRUD customer</p>
            <p className="rounded-md border border-white/10 p-4">Checkout paket</p>
            <p className="rounded-md border border-white/10 p-4">Status transaksi</p>
          </div>
        </section>

        <section className="flex min-h-svh items-center bg-[#f5f7f4] p-5 text-[#111816] sm:p-10">
          <form
            className="w-full rounded-md border border-[#d8dfd7] bg-white p-6 shadow-[0_24px_80px_rgba(16,24,22,0.12)] sm:p-8"
            onSubmit={onSubmit}
          >
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <div className="flex size-11 items-center justify-center rounded-md bg-emerald-300 text-[#101816]">
                <Signal className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  CellMart
                </p>
                <p className="text-lg font-semibold">Data Commerce</p>
              </div>
            </div>
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

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5c6963] lg:hidden">
              <span className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] px-2 py-2">
                Customer
              </span>
              <span className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] px-2 py-2">
                Checkout
              </span>
              <span className="rounded-md border border-[#d8dfd7] bg-[#f7faf7] px-2 py-2">
                Tracking
              </span>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
