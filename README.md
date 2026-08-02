# 🏝️ NusantaraChatbot

#Screenshoot Tampilan
![SS_Tampilan1]()
![SS_Tampilan2]()

> **Chatbot AI Ahli Budaya, Suku, Kuliner, dan Wisata Indonesia**  
> Ditenagai oleh **Google Gemini AI** dengan arsitektur **Full-Stack JavaScript** (Node.js + React)

---

## 📋 Daftar Isi (Table of Contents)

1. [Deskripsi Proyek](#1-deskripsi-proyek)
2. [Fitur Utama](#2-fitur-utama)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Arsitektur Folder](#4-arsitektur-folder)
5. [Teknologi yang Digunakan](#5-teknologi-yang-digunakan)
6. [Prasyarat & Kebutuhan Sistem](#6-prasyarat--kebutuhan-sistem)
7. [Instalasi & Konfigurasi](#7-instalasi--konfigurasi)
8. [Cara Menjalankan Proyek](#8-cara-menjalankan-proyek)
   - [8.1 Menjalankan Backend (Server)](#81-menjalankan-backend-server)
   - [8.2 Menjalankan Frontend (Client)](#82-menjalankan-frontend-client)
9. [Dokumentasi API Endpoint](#9-dokumentasi-api-endpoint)
10. [Cara Menggunakan Aplikasi](#10-cara-menggunakan-aplikasi)
11. [Environment Variables](#11-environment-variables)
12. [Troubleshooting](#12-troubleshooting)
13. [Struktur Kode](#13-struktur-kode)

---

## 1. Deskripsi Proyek

**NusantaraChatbot** adalah aplikasi chatbot berbasis web yang dibangun sebagai bagian dari tugas **Bootcamp AI Engineer Hacktiv8 (Sesi 3)**. Aplikasi ini menghadirkan pengalaman percakapan interaktif tentang kekayaan budaya Nusantara, mulai dari suku dan adat istiadat, seni budaya, kuliner khas daerah, hingga destinasi wisata di seluruh Indonesia.

Chatbot ini menggunakan model bahasa besar **Google Gemini** (`gemini-3.6-flash`) sebagai otak AI-nya, dengan persona bernama **"NusantaraBot"** yang dikonfigurasi melalui *system prompt* khusus agar selalu menjawab dalam Bahasa Indonesia yang ramah dan antusias.

---

## 2. Fitur Utama

| Fitur | Keterangan |
|---|---|
| 💬 **Chat Interaktif** | Percakapan real-time dengan AI tentang topik Indonesia |
| 🏛️ **Informasi Suku & Adat** | Pengetahuan tentang suku-suku di Indonesia (Jawa, Batak, Dayak, dll.) |
| 🍜 **Kuliner Nusantara** | Informasi makanan dan jajanan khas dari berbagai daerah |
| 🏝️ **Rekomendasi Wisata** | Destinasi wisata alam, budaya, dan sejarah seluruh Indonesia |
| 🎭 **Seni & Budaya** | Tari tradisional, wayang, batik, musik daerah, dll. |
| ⚡ **Quick Questions** | Tombol pertanyaan cepat untuk memulai percakapan |
| 🗑️ **Reset Chat** | Tombol untuk memulai sesi percakapan baru |
| 🧠 **Riwayat Percakapan** | Menyimpan konteks 10 pesan terakhir untuk percakapan yang koheren |
| 🖼️ **Analisis Gambar** | Endpoint API untuk analisis gambar dalam konteks budaya |
| 📄 **Analisis Dokumen** | Endpoint API untuk meringkas konten dokumen |
| 🎵 **Transkripsi Audio** | Endpoint API untuk mentranskrip file audio |

---

## 3. Arsitektur Sistem

Proyek ini menggunakan arsitektur **Client-Server** yang dipisah secara eksplisit:

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                          │
│                   http://localhost:5173                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP Request (fetch API)
                          │ POST /chat
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND - React + Vite (Client)                    │
│  • Render UI chat interface                                      │
│  • Kelola state pesan & riwayat percakapan                       │
│  • Tombol pertanyaan cepat                                       │
│  • Format respons markdown                                       │
│                   http://localhost:5173                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP Request
                          │ (CORS diizinkan dari port 5173, 3001)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND - Node.js + Express (Server)                │
│  • Routing API (GET /, POST /chat, dll.)                         │
│  • Manajemen System Prompt NusantaraBot                         │
│  • Validasi request & error handling                             │
│  • Pemrosesan file (gambar, dokumen, audio via multer)           │
│                   http://localhost:3000                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS Request
                          │ (API Key via .env)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              GOOGLE GEMINI AI API (Cloud)                        │
│  • Model: gemini-3.6-flash                                       │
│  • Generate teks, analisis gambar, dokumen, audio                │
│                 https://generativelanguage.googleapis.com        │
└─────────────────────────────────────────────────────────────────┘
```

### Alur Data Chat

```
1. User mengetik pesan di Frontend (React)
2. Frontend mengirim POST ke http://localhost:3000/chat
   Body: { message: "...", history: [...] }
3. Backend menyusun konteks percakapan + System Prompt NusantaraBot
4. Backend mengirim request ke Google Gemini API
5. Gemini memproses dan mengembalikan respons teks
6. Backend meneruskan respons ke Frontend
   Body: { result: "..." }
7. Frontend menampilkan respons di chat bubble
8. Frontend menyimpan pasangan pesan ke state riwayat (max 20 entri)
```

---

## 4. Arsitektur Folder

```
NusantaraChatbot/                    ← Root Direktori Proyek
│
├── 📄 .env                          ← Konfigurasi environment (API Key)
├── 📄 index.js                      ← Entry point Backend (Express Server)
├── 📄 package.json                  ← Konfigurasi & dependensi Backend
├── 📄 package-lock.json             ← Lock file dependensi Backend
├── 📄 README.md                     ← Dokumentasi proyek ini
│
├── 📁 node_modules/                 ← Dependensi Backend (auto-generated)
│
└── 📁 client/                       ← Direktori Frontend (React + Vite)
    │
    ├── 📄 index.html                ← HTML template utama aplikasi
    ├── 📄 package.json              ← Konfigurasi & dependensi Frontend
    ├── 📄 package-lock.json         ← Lock file dependensi Frontend
    ├── 📄 vite.config.js            ← Konfigurasi bundler Vite
    ├── 📄 .gitignore                ← File yang diabaikan Git
    ├── 📄 .oxlintrc.json            ← Konfigurasi linter Oxlint
    │
    ├── 📁 public/                   ← Aset statis publik
    │   ├── favicon.svg              ← Ikon tab browser
    │   └── icons.svg                ← Kumpulan ikon SVG
    │
    ├── 📁 node_modules/             ← Dependensi Frontend (auto-generated)
    │
    └── 📁 src/                      ← Source code Frontend
        ├── 📄 main.jsx              ← Entry point React (render ke DOM)
        ├── 📄 App.jsx               ← Komponen utama aplikasi chat
        ├── 📄 App.css               ← Stylesheet utama komponen
        ├── 📄 index.css             ← Global CSS Reset & base styles
        │
        └── 📁 assets/              ← Aset gambar/media untuk React
```

### Penjelasan File Kunci

| File | Peran |
|---|---|
| `index.js` | Server Express utama; mendefinisikan semua endpoint API dan System Prompt |
| `.env` | Menyimpan `GEMINI_API_KEY` yang **tidak boleh** di-commit ke Git |
| `client/src/App.jsx` | Komponen React utama; mengelola seluruh logika UI dan komunikasi API |
| `client/src/App.css` | Seluruh styling tampilan chatbot (glassmorphism, animasi, dll.) |
| `client/vite.config.js` | Konfigurasi Vite untuk proses build dan dev server |

---

## 5. Teknologi yang Digunakan

### Backend

| Paket | Versi | Fungsi |
|---|---|---|
| **Node.js** | ≥ 18.x | Runtime JavaScript server-side |
| **express** | ^5.2.1 | Framework web server HTTP |
| **@google/genai** | ^2.15.0 | SDK resmi Google Gemini AI |
| **dotenv** | ^17.4.2 | Load variabel dari file `.env` |
| **cors** | ^2.8.6 | Mengizinkan request lintas origin |
| **multer** | ^2.2.0 | Middleware upload file (gambar, audio, dokumen) |

### Frontend

| Paket | Versi | Fungsi |
|---|---|---|
| **React** | ^19.2.8 | Library UI berbasis komponen |
| **react-dom** | ^19.2.8 | Rendering React ke DOM browser |
| **Vite** | ^8.2.0 | Build tool & dev server modern |
| **@vitejs/plugin-react** | ^6.0.4 | Plugin Vite untuk transpilasi JSX |
| **oxlint** | ^1.75.0 | Linter JavaScript/TypeScript cepat |

---

## 6. Prasyarat & Kebutuhan Sistem

Pastikan software berikut sudah terinstall di sistem Anda sebelum menjalankan proyek:

| Kebutuhan | Versi Minimum | Cek Instalasi |
|---|---|---|
| **Node.js** | v18.0.0 atau lebih baru | `node --version` |
| **npm** | v9.0.0 atau lebih baru | `npm --version` |
| **Google Gemini API Key** | - | [Dapatkan di Google AI Studio](https://aistudio.google.com/app/apikey) |

> **Catatan:** npm sudah otomatis terinstall bersama Node.js. Download Node.js di: https://nodejs.org/

---

## 7. Instalasi & Konfigurasi

### Langkah 1: Clone / Salin Proyek

Pastikan folder proyek `NusantaraChatbot` sudah tersedia di komputer Anda.

### Langkah 2: Konfigurasi API Key (File `.env`)

File `.env` sudah tersedia di root proyek. Pastikan isinya benar:

```env
GEMINI_API_KEY=YOUR_API_KEY_DISINI
```

> ⚠️ **PENTING:** Ganti nilai `GEMINI_API_KEY` dengan API Key milik Anda yang valid dari [Google AI Studio](https://aistudio.google.com/app/apikey). **Jangan pernah** membagikan atau meng-upload file `.env` ke repositori publik.

### Langkah 3: Install Dependensi Backend

Buka terminal, navigasi ke folder root proyek, lalu jalankan:

```bash
# Masuk ke folder root proyek
cd NusantaraChatbot

# Install semua dependensi backend
npm install
```

### Langkah 4: Install Dependensi Frontend

```bash
# Masuk ke folder client
cd client

# Install semua dependensi frontend
npm install

# Kembali ke folder root
cd ..
```

---

## 8. Cara Menjalankan Proyek

> ⚠️ **Backend HARUS dijalankan terlebih dahulu** sebelum Frontend, karena Frontend bergantung pada API yang disediakan Backend.

### 8.1 Menjalankan Backend (Server)

Buka **Terminal 1**, navigasi ke folder **root** proyek (`NusantaraChatbot/`):

```bash
# Mode Development (dengan auto-reload saat ada perubahan file)
npm run dev

# ATAU Mode Production (tanpa auto-reload)
npm start
```

**Output yang diharapkan:**
```
Server NusantaraBot ready on http://localhost:3000
```

Backend kini berjalan di: **`http://localhost:3000`**

Anda dapat memverifikasinya dengan membuka `http://localhost:3000` di browser, yang akan menampilkan:
```json
{
  "status": "ok",
  "message": "NusantaraBot API is running!"
}
```

### 8.2 Menjalankan Frontend (Client)

Buka **Terminal 2** (terminal baru, jangan tutup Terminal 1), navigasi ke folder **`client/`**:

```bash
# Masuk ke folder client
cd NusantaraChatbot/client

# Jalankan development server
npm run dev
```

**Output yang diharapkan:**
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Frontend kini berjalan di: **`http://localhost:5173`**

Buka URL tersebut di browser untuk menggunakan NusantaraChatbot. 🎉

### Ringkasan Port

| Layanan | URL | Perintah Jalankan |
|---|---|---|
| **Backend API** | http://localhost:3000 | `npm run dev` (di folder root) |
| **Frontend UI** | http://localhost:5173 | `npm run dev` (di folder client) |

---

## 9. Dokumentasi API Endpoint

Base URL Backend: `http://localhost:3000`

### `GET /`
**Health check** — Mengecek apakah server berjalan.

```
GET http://localhost:3000/
```

**Response `200 OK`:**
```json
{
  "status": "ok",
  "message": "NusantaraBot API is running!"
}
```

---

### `POST /chat`
**Endpoint utama chatbot** — Mengirim pesan dan mendapatkan respons AI.

```
POST http://localhost:3000/chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Ceritakan tentang Suku Toraja",
  "history": [
    { "role": "user", "text": "Halo!" },
    { "role": "model", "text": "Halo! Ada yang bisa saya bantu?" }
  ]
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `message` | `string` | ✅ Ya | Pesan dari pengguna |
| `history` | `array` | ❌ Tidak | Riwayat percakapan sebelumnya (default: `[]`) |

**Response `200 OK`:**
```json
{
  "result": "🏛️ Suku Toraja adalah salah satu suku yang berasal dari Sulawesi Selatan..."
}
```

**Response `400 Bad Request`:**
```json
{
  "message": "Parameter \"message\" wajib diisi."
}
```

---

### `POST /generate-text`
**Generasi teks bebas** — Menghasilkan teks berdasarkan prompt.

```
POST http://localhost:3000/generate-text
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Tuliskan deskripsi singkat tentang Tari Kecak"
}
```

**Response `200 OK`:**
```json
{
  "result": "Tari Kecak adalah tarian tradisional Bali yang unik..."
}
```

---

### `POST /generate-from-image`
**Analisis gambar** — Mendeskripsikan atau menganalisis gambar dalam konteks budaya Indonesia.

```
POST http://localhost:3000/generate-from-image
Content-Type: multipart/form-data
```

| Field | Tipe | Keterangan |
|---|---|---|
| `image` | `file` | File gambar (JPG, PNG, WEBP, dll.) |
| `prompt` | `string` | (Opsional) Pertanyaan spesifik tentang gambar |

**Response `200 OK`:**
```json
{
  "result": "Gambar ini menampilkan batik dengan motif parang..."
}
```

---

### `POST /generate-from-document`
**Analisis dokumen** — Meringkas atau menganalisis isi dokumen.

```
POST http://localhost:3000/generate-from-document
Content-Type: multipart/form-data
```

| Field | Tipe | Keterangan |
|---|---|---|
| `document` | `file` | File dokumen (PDF, TXT, dll.) |
| `prompt` | `string` | (Opsional) Instruksi spesifik untuk dokumen |

---

### `POST /generate-from-audio`
**Transkripsi audio** — Mentranskrip atau menganalisis konten file audio.

```
POST http://localhost:3000/generate-from-audio
Content-Type: multipart/form-data
```

| Field | Tipe | Keterangan |
|---|---|---|
| `audio` | `file` | File audio (MP3, WAV, dll.) |
| `prompt` | `string` | (Opsional) Instruksi spesifik untuk audio |

---

## 10. Cara Menggunakan Aplikasi

Setelah kedua server (backend dan frontend) berjalan, buka browser dan akses `http://localhost:5173`.

### Panduan Penggunaan

1. **Memulai Percakapan**
   - Aplikasi langsung menampilkan pesan sambutan dari NusantaraBot
   - Ketik pertanyaan Anda di kolom input di bagian bawah layar

2. **Menggunakan Quick Questions (Pertanyaan Cepat)**
   - Di atas area input terdapat tombol-tombol pertanyaan cepat:
     - 🏛️ *Ceritakan tentang Suku Toraja*
     - 🍜 *Apa makanan khas Padang?*
     - 🏝️ *Rekomendasikan wisata di Bali*
     - 🎭 *Jelaskan tari Saman dari Aceh*
     - 🌋 *Tempat wisata alam terbaik di Jawa*
     - 🥘 *Makanan tradisional khas Betawi*
   - Klik salah satu untuk langsung mengirim pertanyaan tersebut

3. **Mengirim Pesan**
   - Ketik pesan di area `textarea`
   - Tekan **`Enter`** untuk mengirim
   - Tekan **`Shift + Enter`** untuk membuat baris baru tanpa mengirim

4. **Topik yang Dapat Ditanyakan**
   - 🏛️ Suku dan Adat Istiadat (Jawa, Sunda, Batak, Bugis, Dayak, Papua, dll.)
   - 🎨 Kesenian dan Budaya (Wayang, Batik, Tenun, Tari Tradisional)
   - 🍜 Kuliner dan Makanan Khas Daerah
   - 🏝️ Destinasi Wisata (Alam, Budaya, Sejarah, Kuliner)

5. **Reset Percakapan**
   - Klik tombol 🗑️ di pojok kanan atas untuk memulai percakapan baru

> **Catatan:** Bot akan mengarahkan kembali ke topik Indonesia jika pertanyaan di luar topik suku, budaya, makanan, dan wisata.

---

## 11. Environment Variables

File `.env` berada di folder **root** proyek (`NusantaraChatbot/.env`).

| Variabel | Wajib | Default | Keterangan |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ Ya | — | API Key Google Gemini dari AI Studio |
| `PORT` | ❌ Tidak | `3000` | Port yang digunakan server backend |

**Contoh file `.env`:**
```env
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
PORT=3000
```

> 📌 **Tips Keamanan:** File `.env` sudah terdaftar di `.gitignore` pada folder `client`. Pastikan Anda juga tidak meng-upload file ini ke platform seperti GitHub.

---

## 12. Troubleshooting

### ❌ Error: `Cannot connect to server`
**Gejala:** Frontend menampilkan pesan *"Pastikan server backend berjalan di port 3000"*

**Solusi:**
- Pastikan Backend sudah dijalankan terlebih dahulu dengan `npm run dev` di folder root
- Cek apakah port 3000 tidak digunakan oleh aplikasi lain
- Verifikasi dengan membuka `http://localhost:3000` di browser

---

### ❌ Error: `API Key invalid` atau respons error dari Gemini
**Gejala:** Bot membalas dengan pesan error, atau terminal Backend menampilkan error 400/403

**Solusi:**
- Pastikan `GEMINI_API_KEY` di file `.env` sudah benar dan valid
- Cek apakah API Key masih aktif di [Google AI Studio](https://aistudio.google.com/)
- Pastikan tidak ada spasi atau karakter tambahan di sekitar nilai API Key

---

### ❌ Error: `Module not found` atau `Cannot find package`
**Gejala:** Error saat menjalankan `npm run dev`

**Solusi:**
```bash
# Hapus dan install ulang node_modules di root
cd NusantaraChatbot
rm -rf node_modules
npm install

# Hapus dan install ulang node_modules di client
cd client
rm -rf node_modules
npm install
```

---

### ❌ Port 5173 atau 3000 sudah digunakan
**Gejala:** Error `EADDRINUSE: address already in use`

**Solusi:**
- Ubah port backend dengan menambahkan `PORT=3001` di file `.env`
- Untuk frontend, Vite akan otomatis mencoba port berikutnya (5174, dst.)
- Atau hentikan proses yang menggunakan port tersebut

---

## 13. Struktur Kode

### Backend (`index.js`)

```
index.js
├── Import & Inisialisasi
│   ├── dotenv, express, cors, multer
│   └── GoogleGenAI SDK initialization
│
├── System Prompt (SYSTEM_PROMPT)
│   └── Persona NusantaraBot & panduan menjawab
│
├── Middleware
│   ├── cors() → izinkan request dari localhost:5173 & 3001
│   └── express.json() → parse body JSON
│
└── Routes (API Endpoints)
    ├── GET  /                     → Health check
    ├── POST /chat                 → Chat utama dengan riwayat
    ├── POST /generate-text        → Generasi teks bebas
    ├── POST /generate-from-image  → Analisis gambar (multipart)
    ├── POST /generate-from-document → Analisis dokumen (multipart)
    └── POST /generate-from-audio  → Transkripsi audio (multipart)
```

### Frontend (`client/src/App.jsx`)

```
App.jsx
├── Konstanta
│   ├── API_URL → 'http://localhost:3000'
│   └── QUICK_QUESTIONS → Array pertanyaan cepat
│
├── Komponen Kecil
│   ├── TypingIndicator() → Animasi "..." saat bot sedang menjawab
│   └── Message({ msg }) → Bubble pesan user/bot
│
├── Fungsi Utilitas
│   ├── formatText(text) → Konversi markdown sederhana ke HTML
│   └── getTime() → Timestamp pesan dalam format HH:MM
│
└── Komponen Utama: App()
    ├── State: messages, input, loading, history
    ├── Refs: bottomRef (auto-scroll), inputRef (focus)
    ├── sendMessage(text) → Kirim pesan ke API & update state
    ├── handleKeyDown(e) → Handle Enter/Shift+Enter
    ├── clearChat() → Reset percakapan
    └── JSX Render:
        ├── <header> → Logo, nama bot, status, tombol reset
        ├── <main> → Area pesan & typing indicator
        ├── <section> → Quick question buttons
        └── <footer> → Input textarea & tombol kirim
```

---

<div align="center">

**Dibuat sebagai bagian dari Tugas Sesi 3 — Bootcamp AI Engineer Hacktiv8**

🏝️ *Menjelajahi Nusantara bersama AI* 🇮🇩

</div>
