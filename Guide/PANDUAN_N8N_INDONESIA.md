# 🇮🇩 Panduan Lengkap Setup n8n untuk AI Marketing Swarm

## 📦 Persiapan

### 0. Setup Database (Pilih Salah Satu)

#### Opsi A: Supabase (Recommended - Paling Mudah) ⭐
- ✅ Tidak perlu install apapun
- ✅ Cloud-based, gratis 500MB
- ✅ Setup 5 menit
- 📖 **Lihat: `QUICK_START_SUPABASE.md`**

#### Opsi B: PostgreSQL Lokal
- ✅ Unlimited storage
- ❌ Perlu install PostgreSQL
- ❌ Setup 30+ menit
- 📖 **Lihat: `SETUP_DATABASE_POSTGRESQL.md`**

### 1. Install n8n
```bash
# Cara 1: Menggunakan npx (paling mudah)
npx n8n

# Cara 2: Install global
npm install n8n -g
n8n start

# Cara 3: Menggunakan Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

n8n akan jalan di: **http://localhost:5678**

### 2. Setup Database PostgreSQL

Pastikan database sudah jalan dan jalankan file `schema.sql`:
```bash
psql -U your_username -d marketing_campaign -f schema.sql
```

### 3. Dapatkan API Key Google Gemini

1. Buka: https://makersuite.google.com/app/apikey
2. Klik "Create API Key"
3. Copy API key Anda

---

## 🔧 Import Workflow ke n8n

### Langkah 1: Buka n8n Dashboard
- Akses: http://localhost:5678
- Login atau buat akun baru

### Langkah 2: Import Workflow 1 (Strategy)

1. Klik menu **"Workflows"** di sidebar kiri
2. Klik tombol **"+ Add workflow"**
3. Klik icon **"⋮"** (3 titik) di kanan atas
4. Pilih **"Import from File"**
5. Upload file: `workflow/01_AI_Marketing_Campaign_Strategy.json`
6. Klik **"Save"**

### Langkah 3: Konfigurasi Workflow 1

#### A. Setup PostgreSQL Connection
1. Klik node **"Save Platform Strategies"**
2. Di panel kanan, klik **"Credentials"**
3. Klik **"+ Create New"**
4. Isi data koneksi:
   ```
   Host: 213.190.4.159 (atau host Anda)
   Database: marketing_campaign
   User: berkomunitas (atau user Anda)
   Password: berkomunitas688 (atau password Anda)
   Port: 5432
   SSL: Disable
   ```
5. Klik **"Save"**
6. Ulangi untuk semua node PostgreSQL lainnya (pilih credential yang sama)

#### B. Setup Google Gemini API
1. Klik node **"Google Gemini Model"**
2. Di panel kanan, klik **"Credentials"**
3. Klik **"+ Create New"**
4. Pilih **"Google PaLM API"**
5. Paste API key Anda
6. Klik **"Save"**

#### C. Aktifkan Webhook
1. Klik node **"Webhook - Campaign Input"**
2. Di panel kanan, lihat **"Webhook URLs"**
3. Copy URL Production (contoh: `https://n8n.drwapp.com/webhook/marketing-campaign-strategy`)
4. Simpan URL ini untuk dipakai di `.env.local`

### Langkah 4: Import Workflow 2 (Content Generator)

1. Ulangi langkah import untuk file: `workflow/02_AI_Content_Generator_AUTO.json`
2. Setup PostgreSQL credentials (sama seperti Workflow 1)
3. Setup Google Gemini credentials untuk node:
   - **"Gemini Agent 1"**
   - **"Gemini Agent 2"**

### Langkah 5: Import Workflow 3 (Report Generator) - Opsional

1. Import file: `workflow/03_Campaign_Report_Generator_AUTO.json`
2. Setup PostgreSQL credentials

---

## ⚙️ Konfigurasi Next.js App

### Edit file `.env.local`:
```env
# Database
POSTGRES_URL="postgres://berkomunitas:berkomunitas688@213.190.4.159:5432/marketing_campaign"
POSTGRES_SSL="disable"

# n8n Webhooks (ganti dengan URL Anda)
N8N_WEBHOOK_URL_1="http://localhost:5678/webhook/marketing-campaign-strategy"
NEXT_PUBLIC_N8N_WEBHOOK_URL_2="http://localhost:5678/webhook/trigger-content-generation"
NEXT_PUBLIC_N8N_WEBHOOK_URL_3="http://localhost:5678/webhook/trigger-report-generation"
```

---

## 🚀 Menjalankan Program

### 1. Start n8n
```bash
n8n start
```

### 2. Aktifkan Workflow di n8n
1. Buka n8n dashboard: http://localhost:5678
2. Buka **Workflow 1** (Strategy)
3. Klik toggle **"Active"** di kanan atas (harus ON/hijau)
4. Buka **Workflow 2** (Content Generator)
5. Aktifkan juga (toggle ON)

### 3. Start Next.js App
```bash
npm run dev
```

### 4. Test Campaign
1. Buka: http://localhost:3000
2. Isi form kampanye:
   ```
   Campaign Name: Promo Ramadan 2025
   Brand Name: Toko Kita
   Product/Service: Fashion Muslim
   Target Audience: Wanita 25-40 tahun
   Campaign Goal: Meningkatkan penjualan 50%
   Duration: 30 hari
   ```
3. Klik **"🚀 Launch AI Campaign"**
4. Copy `batch_id` dari URL

### 5. Monitor Dashboard
1. Buka: `http://localhost:3000/dashboard?batch_id=YOUR_BATCH_ID`
2. Tunggu 3-5 menit (mode demo)
3. Status akan berubah:
   - `new` → `strategy_pending` (2-3 menit)
   - `strategy_pending` → `completed` (30-60 detik)

### 6. Lihat Report
1. Klik tombol **"📊 View Campaign Report"**
2. Atau akses: `http://localhost:3000/report?batch_id=YOUR_BATCH_ID`

---

## 🔍 Troubleshooting

### Problem 1: Workflow tidak jalan
**Solusi**:
- Pastikan workflow sudah **Active** (toggle hijau)
- Cek n8n logs di terminal
- Test webhook manual di n8n (klik "Test Workflow")

### Problem 2: Database connection error
**Solusi**:
- Cek PostgreSQL sudah jalan: `psql -U your_user -d marketing_campaign`
- Pastikan credentials di n8n benar
- Test koneksi di node PostgreSQL (klik "Test")

### Problem 3: Gemini API error
**Solusi**:
- Cek API key valid: https://makersuite.google.com/app/apikey
- Pastikan quota API belum habis
- Coba model lain: `gemini-1.5-flash` atau `gemini-pro`

### Problem 4: Status stuck di "strategy_pending"
**Solusi**:
- Cek Workflow 2 sudah aktif
- Lihat execution history di n8n (menu "Executions")
- Cek interval trigger: ubah dari 10 detik ke 5 detik jika perlu

---

## ⚡ Mode Cepat (Demo)

Untuk demo yang lebih cepat (3-5 menit):

### Edit Workflow 2:
1. Buka node **"Every 10 Seconds"** (Schedule Trigger)
2. Ubah interval dari `10 seconds` ke `5 seconds`
3. Save workflow

### Hasil:
- Workflow 1: ~2-3 menit
- Workflow 2: ~30-60 detik
- **Total: 3-5 menit** ⚡

---

## 📊 Melihat Data di Database

### Query untuk cek status campaign:
```sql
SELECT batch_id, campaign_name, status, created_at 
FROM analysis_batches 
ORDER BY created_at DESC 
LIMIT 5;
```

### Query untuk cek konten yang dihasilkan:
```sql
SELECT platform, COUNT(*) as total_posts, 
       SUM(reach_simulated) as total_reach
FROM proposed_kpis 
WHERE batch_id = 'YOUR_BATCH_ID'
GROUP BY platform;
```

### Query untuk cek report:
```sql
SELECT * FROM campaign_reports 
WHERE batch_id = 'YOUR_BATCH_ID';
```

---

## 🎯 Tips Mengutak-atik Program

### 1. Ubah Jumlah Post per Platform
Edit Workflow 2, node **"Agent 1: Content Creator"**:
```
Create {{ $json.value }} unique posts
```
Ubah `$json.value` menjadi angka tetap, misal: `Create 10 unique posts`

### 2. Tambah Platform Baru
Edit Workflow 1, node **"AI Campaign Strategist"**, tambah di prompt:
```
Available platforms: Instagram, TikTok, Facebook, Twitter, LinkedIn, YouTube, Pinterest
```

### 3. Ubah Tone Konten
Edit Workflow 2, node **"Agent 2: Copywriter"**, ubah prompt:
```
Make tone: [pilih: professional / casual / funny / inspirational]
```

### 4. Ubah Waktu Posting
Edit Workflow 2, node **"Agent 3: Scheduler"**, ubah array:
```javascript
const hoursDistribution = [9, 11, 14, 16, 19]; // jam posting
// Ubah jadi: [8, 10, 12, 15, 18, 20]
```

### 5. Tambah Metrics Baru
Edit `schema.sql`, tambah kolom di tabel `proposed_kpis`:
```sql
ALTER TABLE proposed_kpis 
ADD COLUMN clicks_simulated INTEGER,
ADD COLUMN shares_simulated INTEGER;
```

---

## 📚 Referensi

- **n8n Documentation**: https://docs.n8n.io
- **Google Gemini API**: https://ai.google.dev/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## 🆘 Butuh Bantuan?

Jika ada error atau pertanyaan:
1. Cek n8n execution logs (menu "Executions")
2. Lihat browser console (F12)
3. Cek PostgreSQL logs
4. Review file `Guide/` untuk dokumentasi lengkap

---

**Selamat mencoba! 🚀**
