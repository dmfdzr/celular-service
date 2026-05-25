import * as React from "react"

import { cn } from "@/lib/utils"

type PanelProps = {
  eyebrow: string
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Panel({
  eyebrow,
  title,
  action,
  children,
  className,
}: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-md border border-[#d8dfd7] bg-white p-4 shadow-[0_18px_50px_rgba(16,24,22,0.05)] sm:p-5",
        className
      )}
    >
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
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
