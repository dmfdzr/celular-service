# CellMart Data Commerce

CellMart Data Commerce adalah aplikasi web untuk operasional pembelian paket data internet. Aplikasi ini menyediakan login operator, pengelolaan customer, katalog paket internet, checkout pembelian, dan pemantauan status transaksi.

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

- Login operator untuk masuk ke dashboard.
- Ringkasan customer aktif, paket tersedia, transaksi berjalan, dan revenue sukses.
- Katalog paket internet dengan pencarian dan filter operator.
- Checkout pembelian paket berdasarkan customer terpilih.
- Riwayat transaksi dengan update status `Processing`, `Success`, dan `Failed`.
- Tambah customer baru.
- Aktivasi atau suspend customer.
- Proteksi hapus customer yang sudah memiliki riwayat transaksi.
- Error state ketika layanan data belum aktif.

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

## Validasi

Perintah yang sudah dijalankan:

```bash
npm run lint
npm run typecheck
npm run build
```

## Catatan Pengerjaan

- Mulai: 25 Mei 2026, 23:43 WIB
- Selesai: 26 Mei 2026, 00:01 WIB

Commit message yang disarankan:

```txt
docs: update readme with application usage guide
```
