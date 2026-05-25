import * as React from "react"

export function Field({
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
