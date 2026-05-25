import { AlertCircle } from "lucide-react"

export function ApiWarning({
  message,
}: {
  message: string
}) {
  return (
    <div className="flex rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-950">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">Layanan data belum siap</p>
          <p className="text-sm leading-6">
            {message}. Jalankan <strong>npm run api</strong>, lalu buka menu{" "}
            <strong>Data Service</strong> untuk melakukan sinkronisasi.
          </p>
        </div>
      </div>
    </div>
  )
}
