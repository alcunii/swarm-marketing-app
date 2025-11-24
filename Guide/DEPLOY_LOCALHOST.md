# 🚀 Deploy di Localhost - Step by Step

## 📋 Checklist Persiapan

Pastikan sudah selesai:
- [x] Supabase project sudah dibuat
- [x] Database tables sudah dibuat (5 tabel)
- [x] Connection string sudah didapat
- [x] File `.env.local` sudah diisi
- [x] Dependencies sudah diinstall (`npm install`)

---

## 🎯 Langkah Deploy

### **Step 1: Verifikasi Environment Variables**

Cek file `.env.local` sudah benar:

```bash
# Buka file .env.local
# Pastikan semua variable terisi
```

**Harus ada:**
```env
POSTGRES_URL="postgresql://postgres.xxx:password@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"
POSTGRES_SSL="require"
N8N_WEBHOOK_URL_1="http://localhost:5678/webhook/marketing-campaign-strategy"
NEXT_PUBLIC_N8N_WEBHOOK_URL_2="http://localhost:5678/webhook/trigger-content-generation"
NEXT_PUBLIC_N8N_WEBHOOK_URL_3="http://localhost:5678/webhook/trigger-report-generation"
```

---

### **Step 2: Start n8n**

Buka **Terminal 1** (Command Prompt atau PowerShell):

```bash
# Jalankan n8n
npx n8n
```

**Tunggu sampai muncul:**
```
Editor is now accessible via:
http://localhost:5678/
```

**Jangan tutup terminal ini!** Biarkan jalan terus.

---

### **Step 3: Import Workflows ke n8n**

Buka browser: **http://localhost:5678**

#### Import Workflow 1 (Strategy)

1. Klik **"Workflows"** di sidebar
2. Klik **"+ Add workflow"**
3. Klik icon **"⋮"** (3 titik) di kanan atas
4. Pilih **"Import from File"**
5. Upload: `workflow/01_AI_Marketing_Campaign_Strategy.json`
6. Klik **"Save"**

#### Import Workflow 2 (Content Generator)

1. Ulangi langkah di atas
2. Upload: `workflow/02_AI_Content_Generator_AUTO.json`
3. Klik **"Save"**

#### Import Workflow 3 (Report Generator)

**Pilih salah satu:**

**Opsi A: Webhook Version (Recommended)**
- Upload: `workflow/03_Campaign_Report_Generator_WEBHOOK.json`

**Opsi B: Schedule Version (Original)**
- Upload: `workflow/03_Campaign_Report_Generator_AUTO.json`
- Ubah interval ke 10 detik (lihat `Guide/CARA_TRIGGER_WORKFLOW_3_OTOMATIS.md`)

---

### **Step 4: Setup Credentials di n8n**

#### A. PostgreSQL Credentials

**Untuk setiap workflow:**

1. Buka workflow di n8n
2. Klik node PostgreSQL (misal: "Save Platform Strategies")
3. Di panel kanan, klik **"Credentials"**
4. Klik **"+ Create New"**
5. Isi:
   ```
   Host: aws-1-ap-southeast-2.pooler.supabase.com
   Database: postgres
   User: postgres.tpahudprosdsucifuki
   Password: [password database Anda]
   Port: 6543
   SSL: Allow
   ```
6. Klik **"Test"** - harus hijau ✅
7. Klik **"Save"**
8. **Gunakan credential yang sama** untuk semua node PostgreSQL

**Ulangi untuk:**
- ✅ Workflow 1: Semua node PostgreSQL
- ✅ Workflow 2: Semua node PostgreSQL
- ✅ Workflow 3: Semua node PostgreSQL

#### B. Google Gemini API Credentials

1. Dapatkan API key: https://makersuite.google.com/app/apikey
2. Di Workflow 1, klik node **"Google Gemini Model"**
3. Klik **"Credentials"** → **"+ Create New"**
4. Pilih **"Google PaLM API"**
5. Paste API key
6. Klik **"Save"**
7. **Gunakan credential yang sama** untuk:
   - Workflow 1: "Google Gemini Model"
   - Workflow 2: "Gemini Agent 1" dan "Gemini Agent 2"

---

### **Step 5: Aktifkan Workflows**

**Untuk setiap workflow:**

1. Buka workflow
2. Klik toggle **"Active"** di kanan atas
3. Harus berubah jadi **hijau** ✅

**Aktifkan:**
- ✅ Workflow 1: AI Marketing Campaign Strategy
- ✅ Workflow 2: AI Content Generator (AUTO)
- ✅ Workflow 3: Campaign Report Generator

---

### **Step 6: Dapatkan Webhook URLs**

#### Workflow 1 Webhook URL

1. Buka Workflow 1
2. Klik node **"Webhook - Campaign Input"**
3. Di panel kanan, lihat **"Webhook URLs"**
4. Copy **Production URL**, contoh:
   ```
   http://localhost:5678/webhook/marketing-campaign-strategy
   ```
5. **Update `.env.local`**:
   ```env
   N8N_WEBHOOK_URL_1="http://localhost:5678/webhook/marketing-campaign-strategy"
   ```

#### Workflow 3 Webhook URL (jika pakai webhook version)

1. Buka Workflow 3
2. Klik node **"Webhook - Trigger Report"**
3. Copy Production URL
4. **Update `.env.local`**:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL_3="http://localhost:5678/webhook/trigger-report-generation"
   ```

---

### **Step 7: Start Next.js**

Buka **Terminal 2** (Command Prompt atau PowerShell baru):

```bash
# Pastikan di folder project
cd path\to\swarm-marketing-app

# Start development server
npm run dev
```

**Tunggu sampai muncul:**
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

**Jangan tutup terminal ini!** Biarkan jalan terus.

---

### **Step 8: Test Application**

#### Buka Browser

1. Akses: **http://localhost:3000**
2. Harus muncul form campaign

#### Buat Campaign Test

1. Isi form:
   ```
   Campaign Name: Test Campaign Pertama
   Brand Name: Toko Saya
   Product/Service: Fashion
   Target Audience: Wanita 25-40 tahun
   Campaign Goal: Meningkatkan awareness
   Duration: 30 hari
   ```

2. Klik **"🚀 Launch AI Campaign"**

3. **Copy batch_id** dari URL:
   ```
   http://localhost:3000/dashboard?batch_id=xxxxx-xxxxx-xxxxx
   ```

#### Monitor Dashboard

1. Dashboard akan auto-refresh setiap 5 detik
2. Status akan berubah:
   ```
   new → strategy_pending → content_ready → completed
   ```
3. Waktu total: **3-5 menit** (mode demo)

#### Lihat Report

1. Setelah status = `completed`
2. Klik **"📊 View Campaign Report"**
3. Atau akses: `http://localhost:3000/report?batch_id=xxxxx`

---

## ✅ Verifikasi Semua Jalan

### Cek n8n Executions

1. Buka n8n: http://localhost:5678
2. Klik **"Executions"** di sidebar
3. Harus ada execution history:
   - ✅ Workflow 1: Success (hijau)
   - ✅ Workflow 2: Success (hijau)
   - ✅ Workflow 3: Success (hijau)

### Cek Database Supabase

1. Login ke Supabase Dashboard
2. Buka **"Table Editor"**
3. Cek data masuk:
   - ✅ `analysis_batches`: Ada campaign baru
   - ✅ `proposed_breakdowns`: Ada strategi platform
   - ✅ `ai_recommended_roles`: Ada rekomendasi tim
   - ✅ `proposed_kpis`: Ada 50+ posts
   - ✅ `campaign_reports`: Ada report

### Cek Browser Console

1. Buka browser console (F12)
2. Tab **"Console"**
3. Tidak ada error merah ❌
4. API calls berhasil (status 200) ✅

---

## 🎯 Summary: Apa yang Jalan

Setelah deploy berhasil, Anda punya:

### **Terminal 1: n8n**
```
http://localhost:5678
Status: Running ✅
```

### **Terminal 2: Next.js**
```
http://localhost:3000
Status: Running ✅
```

### **3 Workflows Active**
- ✅ Workflow 1: Webhook trigger (manual)
- ✅ Workflow 2: Schedule trigger (setiap 10 detik)
- ✅ Workflow 3: Schedule/Webhook trigger

### **Database Supabase**
- ✅ 5 tabel siap
- ✅ Connection dari n8n berhasil
- ✅ Data masuk real-time

---

## 🆘 Troubleshooting

### Problem 1: n8n tidak bisa start

**Error**: `Port 5678 already in use`

**Solusi**:
```bash
# Windows: Kill process di port 5678
netstat -ano | findstr :5678
taskkill /PID [PID_NUMBER] /F

# Atau restart komputer
```

### Problem 2: Next.js tidak bisa start

**Error**: `Port 3000 already in use`

**Solusi**:
```bash
# Gunakan port lain
npm run dev -- -p 3001

# Atau kill process
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Problem 3: Workflow tidak ter-trigger

**Solusi**:
- Cek workflow sudah **Active** (toggle hijau)
- Cek credentials PostgreSQL benar
- Cek Gemini API key valid
- Lihat n8n Executions untuk error details

### Problem 4: Database connection error

**Solusi**:
- Cek `.env.local` benar
- Cek SSL mode = "Allow" di n8n
- Test connection di n8n credentials
- Cek Supabase project masih active

### Problem 5: Campaign stuck di "strategy_pending"

**Solusi**:
- Cek Workflow 2 sudah Active
- Cek interval = 10 detik (bukan 5 menit)
- Lihat n8n Executions untuk error
- Cek Gemini API quota tidak habis

---

## 📊 Monitoring

### n8n Dashboard
```
http://localhost:5678
- Workflows: Lihat status active
- Executions: Lihat history & errors
- Credentials: Manage connections
```

### Next.js Dashboard
```
http://localhost:3000/dashboard?batch_id=xxx
- Real-time status updates
- Campaign details
- Auto-refresh setiap 5 detik
```

### Supabase Dashboard
```
https://app.supabase.com
- Table Editor: Lihat data real-time
- SQL Editor: Run custom queries
- Logs: Monitor database activity
```

---

## 💡 Tips

1. **Jangan tutup terminal** n8n dan Next.js
2. **Monitor n8n Executions** untuk debug
3. **Cek Supabase Table Editor** untuk verifikasi data
4. **Bookmark dashboard URL** dengan batch_id
5. **Screenshot error** jika ada masalah

---

## 🎉 Selesai!

Jika semua langkah di atas berhasil, aplikasi Anda sudah jalan di localhost!

**Test dengan membuat campaign baru dan lihat hasilnya!** 🚀

---

## 📚 Dokumentasi Lainnya

- **Troubleshooting n8n**: `Guide/PANDUAN_N8N_INDONESIA.md`
- **Trigger Workflow 3**: `Guide/CARA_TRIGGER_WORKFLOW_3_OTOMATIS.md`
- **Setup Supabase**: `Guide/SETUP_SUPABASE.md`
- **Full Documentation**: `Guide/DOCUMENTATION_INDEX.md`
