import { cn } from "@/lib/utils"
import type { CustomerStatus, TransactionStatus } from "@/lib/types"

export function StatusBadge({ status }: { status: TransactionStatus }) {
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

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
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
