# CellMart Data Commerce

CellMart Data Commerce adalah aplikasi web untuk operasional pembelian paket data internet. Aplikasi ini menyediakan login operator, dashboard tracking, pengelolaan customer, checkout pembelian, dan pemantauan layanan data.

## Tech Stack

- Next.js 16
- React 19
- TypeScript / TSX
- Tailwind CSS
- shadcn/ui base styling
- lucide-react icons
- json-server untuk API lokal

## Prasyarat

Pastikan Node.js dan npm sudah terpasang.

```bash
node -v
npm -v
```

Install dependency project:

```bash
npm install
```

## Menjalankan Aplikasi

Jalankan API lokal di terminal pertama:

```bash
npm run api
```

API akan berjalan di:

```bash
http://localhost:4000
```

Jalankan aplikasi web di terminal kedua:

```bash
npm run dev
```

Aplikasi web akan berjalan di:

```bash
http://localhost:3000
```

## Akses Operator

Gunakan kredensial berikut pada halaman login:

```txt
Email: admin@cellmart.id
Password: operator123
```

## Fitur Utama

- Login operator sebagai halaman masuk sebelum dashboard.
- Menu Dashboard untuk tracking jumlah customer, jumlah transaksi, status transaksi, customer dengan spend tertinggi, aktivitas terbaru, dan kondisi layanan.
- Menu Customer untuk tambah customer, melihat daftar customer, aktivasi, dan suspend customer.
- Menu Transaksi untuk memilih paket, checkout pembelian, melihat riwayat transaksi, dan update status `Processing`, `Success`, atau `Failed`.
- Menu Data Service untuk memantau koneksi json-server, base URL, resource API, jumlah record, dan sinkronisasi data. Tombol sinkronisasi hanya tersedia di menu ini.
- Header dashboard menampilkan tanggal dan jam live.
- Transisi ringan pada halaman login dan pergantian menu operator, dengan radius visual yang lebih lembut pada panel dan kontrol.
- Sidebar dashboard bisa dibuka-tutup: collapse/expand di desktop dan drawer di mobile.
- Tampilan login mobile memakai auth card ringkas agar operator bisa langsung masuk tanpa scroll panjang.
- Tabel Customer dan Transaksi berubah menjadi card list di mobile, lalu kembali menjadi table fit di tablet/desktop.
- Error state ketika layanan data belum aktif.

## Struktur Aplikasi

Source aplikasi dipisah berdasarkan tanggung jawab agar lebih mudah dirawat.

```txt
app/
  page.tsx                 # orchestration state dan pemilihan menu aktif
  globals.css              # token style, form utility, dan transisi view

components/
  app-shell/               # layout dashboard operator
  features/
    auth/                  # login operator
    dashboard/             # tracking dashboard
    customers/             # customer form dan customer table
    transactions/          # katalog paket, checkout, riwayat transaksi
    data-service/          # status API dan resource endpoint
  shared/                  # panel, field, status badge, icon button

lib/
  api.ts                   # API base URL dan fetch wrapper
  formatters.ts            # formatter currency dan tanggal
  types.ts                 # tipe data customer, paket, transaksi, menu
```

## Endpoint API

Data aplikasi disimpan di [db.json](./db.json) dan dilayani oleh json-server.

Resource yang tersedia:

```txt
GET    /customers
GET    /customers/:id
POST   /customers
PATCH  /customers/:id
DELETE /customers/:id

GET    /packages
GET    /packages/:id

GET    /transactions
GET    /transactions/:id
POST   /transactions
PATCH  /transactions/:id
DELETE /transactions/:id
```

Contoh endpoint:

```bash
http://localhost:4000/customers
http://localhost:4000/packages
http://localhost:4000/transactions
```

## Script

```bash
npm run dev        # menjalankan Next.js development server
npm run api        # menjalankan API lokal json-server
npm run build      # build production
npm run start      # menjalankan hasil build
npm run lint       # menjalankan ESLint
npm run typecheck  # menjalankan TypeScript check
```