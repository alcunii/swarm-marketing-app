# 🐘 Panduan Setup Database Neon.tech

## 📋 Daftar Isi
1. [Buat Project Neon](#1-buat-project-neon)
2. [Dapatkan Connection String](#2-dapatkan-connection-string)
3. [Setup Environment Variables](#3-setup-environment-variables)
4. [Inisialisasi Database](#4-inisialisasi-database)

---

## 1. Buat Project Neon

1. Buka [Neon.tech](https://neon.tech) dan login/signup.
2. Klik **"New Project"**.
3. Beri nama project (misal: `swarm-marketing-app`).
4. Pilih region terdekat (misal: Singapore).
5. Klik **"Create Project"**.

---

## 2. Dapatkan Connection String

1. Di dashboard project Neon Anda, cari bagian **"Connection Details"**.
2. Pastikan role yang dipilih adalah role default (biasanya nama Anda atau `neondb_owner`).
3. Copy **Connection String** yang formatnya seperti:
   ```
   postgres://[user]:[password]@[host]/[dbname]?sslmode=require
   ```

---

## 3. Setup Environment Variables

1. Buka file `.env.local` di project Anda.
2. Update variable `POSTGRES_URL` dengan connection string dari Neon:

```env
# Database Configuration (Neon.tech)
POSTGRES_URL="postgres://[user]:[password]@[host]/[dbname]?sslmode=require"
POSTGRES_SSL="require"
```

---

## 4. Inisialisasi Database

Project ini sudah dilengkapi script untuk setup tabel otomatis.

1. Buka terminal di folder project.
2. Jalankan script inisialisasi:

```bash
npx tsx init-neon.ts
```

Script ini akan:
- Mengecek koneksi ke Neon.
- Membuat tabel-tabel yang diperlukan (`analysis_batches`, `ai_recommended_roles`, dll).
- Memastikan schema database sesuai.

Jika berhasil, Anda akan melihat pesan:
`✅ Database initialization completed successfully!`

---

## 🔍 Verifikasi

Anda bisa memverifikasi tabel sudah terbuat dengan:
1. Menggunakan **SQL Editor** di dashboard Neon.tech.
2. Menjalankan query:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```
   Harus muncul tabel: `analysis_batches`, `ai_recommended_roles`, `proposed_breakdowns`, `proposed_kpis`, `campaign_reports`.

---

## 💡 Catatan Penting

- **Serverless Driver**: Project ini menggunakan `@neondatabase/serverless` untuk koneksi yang efisien di lingkungan serverless (Next.js).
- **WebSocket**: Driver dikonfigurasi menggunakan WebSocket untuk menghindari masalah firewall di beberapa jaringan.