# 🤖 AI Marketing Swarm App

Aplikasi AI Marketing Agent yang mengotomatisasi strategi campaign, pembuatan konten, dan pelaporan analitik menggunakan **Next.js** dan **Neon.tech** (Serverless Postgres).

## ✨ Fitur Utama

*   **AI Strategy Generator**: Membuat strategi marketing komprehensif berdasarkan input brand & tujuan.
*   **Content Automation**: Menghasilkan ide konten, caption, dan hashtag untuk berbagai platform (Instagram, TikTok, LinkedIn, dll).
*   **Real-time Dashboard**: Memantau status pembuatan campaign secara real-time.
*   **Analytics Reporting**: Menyajikan laporan prediksi performa campaign (Reach, Engagement).
*   **Workflow Automation**: Terintegrasi dengan **n8n** untuk orkestrasi AI agent.

## 🛠️ Tech Stack

*   **Frontend/Backend**: Next.js 15 (App Router)
*   **Database**: [Neon.tech](https://neon.tech) (Serverless PostgreSQL)
*   **Styling**: Tailwind CSS
*   **AI/LLM**: Google Gemini (via n8n)
*   **Orchestration**: n8n Workflows

## 🚀 Cara Install & Run

### Prasyarat
*   Node.js 18+
*   Akun [Neon.tech](https://neon.tech)
*   n8n (Local atau Cloud)

### 1. Clone Repository
```bash
git clone https://github.com/username/swarm-marketing-app.git
cd swarm-marketing-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` ke `.env.local` dan isi konfigurasi:
```bash
cp .env.example .env.local
```
Isi `POSTGRES_URL` dengan connection string dari Neon.tech.

### 4. Setup Database
Jalankan script inisialisasi untuk membuat tabel di Neon:
```bash
npx tsx init-neon.ts
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📚 Dokumentasi & Panduan

*   **[Setup Database Neon](Guide/SETUP_DATABASE_NEON.md)**: Panduan lengkap menghubungkan aplikasi ke Neon.tech.
*   **[Deploy Localhost](Guide/DEPLOY_LOCALHOST.md)**: Panduan menjalankan full stack (Next.js + n8n) di lokal.
*   **[Panduan n8n](Guide/PANDUAN_N8N_INDONESIA.md)**: Cara setup dan import workflow n8n.

## 🔄 Workflow

1.  User input detail campaign di Web App.
2.  Next.js mengirim data ke n8n webhook.
3.  n8n menjalankan AI agents untuk riset & strategi.
4.  Hasil disimpan ke database Neon.
5.  Web App menampilkan progress dan hasil akhir di Dashboard.

---
**Note**: Pastikan n8n workflows sudah aktif agar proses generate berjalan lancar.
