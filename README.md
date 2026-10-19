<h1 align="center">GrowLab</h1>

<p align="center">
  Toko online perawatan tanaman dengan panel admin.<br>
  Katalog produk, keranjang, checkout, pelacakan pesanan, dan manajemen toko dalam satu aplikasi.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img alt="PHP" src="https://img.shields.io/badge/PHP-8%2B-777BB4?style=for-the-badge&logo=php&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
</p>

<p align="center">
  <a href="https://kelompok-10-growlab.wuaze.com">
    <img alt="Buka demo" src="https://img.shields.io/badge/Demo-Buka_website-3F8F1B?style=for-the-badge">
  </a>
</p>

<p align="center">
  <sub>Demo berjalan di hosting gratis (InfinityFree), jadi bisa lambat atau sesekali tidak bisa dibuka.</sub>
</p>

---

Dibuat sebagai tugas kuliah Teknik Informatika, Universitas Pamulang.

<!--
## Tampilan
Taruh screenshot di folder docs/screenshots lalu tampilkan di sini, contoh:
![Halaman produk](docs/screenshots/products.png)
-->

## Daftar isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur proyek](#struktur-proyek)
- [Menjalankan di komputer sendiri](#menjalankan-di-komputer-sendiri)
- [Akun demo](#akun-demo)
- [Ringkasan API](#ringkasan-api)
- [Deploy ke shared hosting](#deploy-ke-shared-hosting)
- [Batasan yang diketahui](#batasan-yang-diketahui)
- [Catatan pengembangan](#catatan-pengembangan)
- [Pembuat](#pembuat)

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
git clone https://github.com/ArulVScode/GrowLab-plant-shop.git
cd GrowLab-plant-shop
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

Buka `src/services/apiClient.js`, lalu pastikan `API_BASE_URL` seperti ini:

```js
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8000/api" // pengembangan lokal (php -S ... seperti di atas)
  : `${window.location.origin}/backend/public/api`; // production (satu domain)
```

Saat `npm run dev` yang dipakai alamat pertama, saat `npm run build` otomatis alamat kedua. Kalau backend lokal kamu jalan di alamat lain (misalnya lewat Apache XAMPP), ganti alamat pertama.

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

## Batasan yang diketahui

- **Pembayaran dikonfirmasi manual oleh admin.** Belum memakai payment gateway, dan nomor "Virtual Account" adalah nomor tetap dari pengaturan, bukan VA yang dibuat per pesanan.
- **Store Settings di halaman admin masih mock** (belum tersimpan ke database).
- Tabel `customer_addresses` belum dipakai. Alamat pengiriman disimpan langsung di data pesanan.
- Belum ada pengujian otomatis.
- Beberapa file di `src/data/` adalah sisa data contoh dan sudah tidak dipakai.

## Catatan pengembangan

Proyek ini saya kerjakan sambil belajar, dan saya masih di tahap belajar. Sebagian pekerjaan dibantu asisten AI (Claude dari Anthropic), antara lain data seed, perbaikan bug, fitur upload gambar dan pengaturan pembayaran, panduan deployment, serta README ini. Kodenya saya jalankan, uji, dan sesuaikan sendiri, tapi mungkin masih ada kekurangan. Saran dan masukan sangat diterima lewat Issues atau Pull Request.

## Pembuat

**Muh. Asrul Mulis** ([@ArulVScode](https://github.com/ArulVScode)), Teknik Informatika.
