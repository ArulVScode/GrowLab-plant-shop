# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# GrowLab

Toko online perawatan tanaman: katalog produk (pupuk, nutrisi, obat tanaman, benih, media tanam, alat berkebun), keranjang, checkout, pelacakan pesanan, dan panel admin untuk mengelola semuanya.

Dibuat sebagai tugas kuliah **[ISI NAMA MATA KULIAH]**, Teknik Informatika, Universitas Pamulang.

**Demo:** https://kelompok-10-growlab.wuaze.com

> Catatan: demo berjalan di hosting gratis (InfinityFree), jadi bisa lambat atau sesekali tidak bisa dibuka.

<!--
## Tampilan
Taruh screenshot di folder docs/screenshots lalu tampilkan di sini, contoh:
![Halaman produk](docs/screenshots/products.png)
-->

## Fitur

**Pelanggan**

- Katalog produk dengan pencarian, filter (kategori, harga, rating, diskon, stok), dan pengurutan
- Detail produk, wishlist, dan keranjang belanja
- Registrasi dan login pelanggan
- Checkout dengan metode Transfer Bank, Virtual Account, atau E-Wallet
- Instruksi pembayaran (nomor rekening, VA, e-wallet, QRIS) tampil setelah checkout
- Riwayat pesanan dan halaman Lacak Pesanan memakai nomor pesanan
- Halaman informasi: cara belanja, pengiriman, pembayaran, syarat & ketentuan, kebijakan privasi

**Admin**

- Dashboard ringkasan
- Kelola produk (tambah, ubah, hapus, ubah status massal, upload gambar)
- Kelola kategori
- Kelola pesanan: ubah status, isi info pengiriman/resi, tandai pembayaran lunas
- Daftar dan detail pelanggan
- Pengaturan profil, ganti password, dan pengaturan pembayaran (rekening, VA, e-wallet, QRIS)

## Teknologi

| Bagian      | Yang dipakai                                                   |
| ----------- | -------------------------------------------------------------- |
| Frontend    | React 19, Vite 8, React Router 7, Tailwind CSS 3, lucide-react |
| Backend     | PHP 8+ (native, tanpa framework), PDO                          |
| Database    | MySQL / MariaDB                                                |
| Autentikasi | Token Bearer (pelanggan dan admin terpisah)                    |
| Lint        | oxlint                                                         |

## Struktur proyek

```
pupuk-tanaman/
├── backend/
│   ├── config/        konfigurasi database & CORS
│   ├── db/            schema.sql dan seed.sql
│   ├── public/        entry point API (index.php) dan folder uploads/
│   └── src/           Router, Auth, Database, dan Controllers/
├── public/            aset statis frontend (termasuk .htaccess untuk SPA)
├── src/
│   ├── components/    komponen UI (layout, admin, produk, dll.)
│   ├── context/       state global (auth, keranjang, wishlist, toast)
│   ├── pages/         halaman publik dan admin
│   ├── services/      pemanggilan API
│   └── utils/
└── package.json
```

## Menjalankan di komputer sendiri

### Prasyarat

- Node.js 20.19+ (atau 22.12+)
- PHP 8.0+
- MySQL atau MariaDB (misalnya lewat XAMPP)

### 1. Ambil proyek

```bash
git clone <URL-REPO-INI>
cd pupuk-tanaman
npm install
```

### 2. Siapkan database

1. Buat database kosong bernama `growlab_db` (collation `utf8mb4_unicode_ci`) lewat phpMyAdmin.
2. Pilih database itu, lalu **Import** `backend/db/schema.sql`, dan setelah itu `backend/db/seed.sql`.

### 3. Atur konfigurasi backend

Salin `backend/config/config.example.php` menjadi `backend/config/config.php`, lalu sesuaikan isinya (host, nama database, user, password). Bawaannya cocok untuk XAMPP standar (user `root`, tanpa password).

> `config.php` berisi kredensial, jadi **jangan di-commit** (sudah ada di `.gitignore`).

### 4. Jalankan backend

```bash
php -S localhost:8000 -t backend/public
```

Cek di browser: `http://localhost:8000/api/health`.

Alternatif: letakkan folder proyek di `htdocs` XAMPP dan pakai Apache.

### 5. Atur alamat API di frontend

Buka `src/services/apiClient.js`, lalu sesuaikan `API_BASE_URL` dengan alamat backend:

```js
// pengembangan lokal (php -S ... seperti di atas)
const API_BASE_URL = "http://localhost:8000/api";

// production (frontend dan backend di domain yang sama)
// const API_BASE_URL = `${window.location.origin}/backend/public/api`;
```

### 6. Jalankan frontend

```bash
npm run dev
```

Buka `http://localhost:5173`.

### Perintah lain

```bash
npm run build     # build production ke folder dist/
npm run preview   # lihat hasil build
npm run lint      # cek kode dengan oxlint
```

## Akun demo

| Peran | Email                | Password   |
| ----- | -------------------- | ---------- |
| Admin | `admin@growlab.test` | `admin123` |

Akun admin ini hanya untuk pengembangan lokal. **Ganti passwordnya** sebelum dipakai di server yang bisa diakses orang lain. Untuk akun pelanggan, daftar lewat halaman Register.

## Ringkasan API

Semua endpoint berada di bawah `/api`. Tanda **(admin)** berarti butuh token admin.

| Grup                  | Endpoint                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Auth pelanggan        | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`                                                                               |
| Auth admin            | `POST /admin/auth/login`, `POST /admin/auth/logout`, `GET /admin/auth/me`                                                                                    |
| Kategori              | `GET /categories`, `GET /categories/{id}`; `POST`, `PUT`, `DELETE` **(admin)**                                                                               |
| Produk                | `GET /products`, `GET /products/{id}`; `POST`, `PUT`, `DELETE`, `POST /products/bulk-status`, `POST /products/bulk-delete` **(admin)**                       |
| Pesanan               | `POST /orders`, `GET /orders/{orderNumber}`, `GET /me/orders`; **(admin)** `GET /orders`, `PUT /orders/{orderNumber}/status`, `/tracking`, `/payment-status` |
| Wishlist              | `GET /me/wishlist`, `POST /me/wishlist`, `DELETE /me/wishlist/{productId}`                                                                                   |
| Pelanggan             | **(admin)** `GET /customers`, `GET /customers/{id}`, `PUT /customers/{id}/status`                                                                            |
| Upload gambar         | `POST /uploads` **(admin)**                                                                                                                                  |
| Pengaturan pembayaran | `GET /settings/payment`; `PUT /admin/settings/payment` **(admin)**                                                                                           |
| Lainnya               | `GET /health`                                                                                                                                                |

## Database

Tabel utama: `admins`, `admin_tokens`, `customers`, `customer_tokens`, `customer_addresses`, `categories`, `products`, `product_images`, `product_benefits`, `wishlists`, `orders`, `order_items`, `order_status_history`, dan `settings`.

## Deploy ke shared hosting

Proyek ini dijalankan di hosting gratis (InfinityFree) dengan cara berikut:

1. Buat database di panel hosting, lalu import `schema.sql` dan `seed.sql` lewat phpMyAdmin (hapus baris `CREATE DATABASE` dan `USE ...` dari file SQL dulu kalau hosting menolaknya).
2. Isi `backend/config/config.php` dengan data database dari hosting, set `'debug' => false`.
3. Set `API_BASE_URL` ke `` `${window.location.origin}/backend/public/api` ``, lalu `npm run build`.
4. Upload **isi** folder `dist/` dan folder `backend/` ke `htdocs/` di server (FTP atau File Manager).
5. Pastikan `.htaccess` ikut terupload. File di `public/.htaccess` mengarahkan semua alamat halaman ke `index.html` supaya React Router berfungsi saat halaman di-refresh.
6. Jangan hapus folder `backend/public/uploads/` di server karena isinya gambar produk yang sudah diupload.

## Batasan yang diketahui

- **Pembayaran dikonfirmasi manual oleh admin.** Belum memakai payment gateway, dan nomor "Virtual Account" adalah nomor tetap dari pengaturan, bukan VA yang dibuat per pesanan.
- **Store Settings di halaman admin masih mock** (belum tersimpan ke database).
- Tabel `customer_addresses` belum dipakai. Alamat pengiriman disimpan langsung di data pesanan.
- Belum ada pengujian otomatis.
- Beberapa file di `src/data/` adalah sisa data contoh dan sudah tidak dipakai.

## Catatan pengembangan

Proyek ini kami kerjakan sambil belajar, dan kami masih di tahap belajar. Sebagian pekerjaan dibantu asisten AI (Claude dari Anthropic), antara lain data seed, perbaikan bug, fitur upload gambar dan pengaturan pembayaran, panduan deployment, serta README ini. Kode tersebut kami jalankan, uji, dan sesuaikan sendiri, tapi mungkin masih ada kekurangan. Saran dan masukan sangat kami terima lewat Issues atau Pull Request.

## Pembuat

**ArulVScode**

| Nama             |
| ---------------- |
| Muh. Asrul Mulis |
