import * as React from "react"

export function IconButton({
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
      className="flex size-10 items-center justify-center rounded-md border border-[#d8dfd7] bg-white text-[#2d3834] transition hover:border-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/25 disabled:pointer-events-none disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  )
}
