# 🎨 Revisi Desain — TaskFlow Business Todo & Task Management
## Dokumen Perubahan Tema & Phase Implementasi UI

**Versi:** 2.1.0  
**Tanggal:** 13 Agustus 2026  
**Jenis Perubahan:** Major Design Revision  
**Status:** Dari Colorful & Playful → Clean Professional  

---

## 1. 📌 Ringkasan Perubahan Desain

Tema desain berubah total dari **Colorful & Playful** (PRD v1.0) menjadi **Clean Professional** yang terinspirasi dari referensi desain business dashboard modern. Perubahan ini menyesuaikan target pengguna yang kini mencakup konteks bisnis dan tim profesional.

| Aspek | Sebelumnya (v1) | Sekarang (v2) |
|---|---|---|
| Gaya | Colorful & Playful | Clean Professional |
| Nuansa | Duolingo + Todoist | Linear + Notion |
| Background | Gradient lavender cerah | Abu-abu muda `#EEEDF8` |
| Sidebar | Full width + label teks | Icon only, ramping (56px) |
| Sidebar warna | Putih / lavender | Navy gelap `#1E1B4B` |
| Aksen utama | Violet `#7C3AED` | Indigo `#4F46E5` |
| Font heading | Poppins (rounded) | Inter (clean) |
| Card style | Rounded-2xl + soft shadow | Rounded-xl + 0.5px border |
| Animasi | Banyak + konfeti | Minimal + subtle |
| Warna per fitur | Banyak warna cerah | Terbatas, bermakna |

---

## 2. 🎨 Design System Baru

### 2.1 Palet Warna

```
Primary:
  Indigo       #4F46E5   → aksi utama, sidebar aktif, CTA
  Navy         #1E1B4B   → sidebar background, heading utama
  Lavender bg  #EEEDF8   → page background

Semantic (status & makna):
  Hijau        #16A34A   → selesai / success
  Biru         #2563EB   → in progress / info
  Merah        #DC2626   → overdue / danger / urgent
  Kuning       #CA8A04   → warning / medium
  Orange       #EA580C   → high priority

Prioritas (4 level):
  🔵 #2563EB   Low
  🟡 #CA8A04   Medium
  🟠 #EA580C   High
  🔴 #DC2626   Urgent

Neutral:
  Putih        #FFFFFF   → card background
  Border       #E5E7EB   → garis pembatas card
  Muted text   #6B7280   → teks sekunder
  Subtle bg    #F8F7FF   → item list, hover state
```

### 2.2 Tipografi

```
Font utama:   Inter (semua elemen)
Font fallback: system-ui, sans-serif

Hierarki:
  Hero/H1    : 26px / 700 / #1E1B4B
  H2         : 18px / 600 / #1E1B4B
  H3 (card)  : 13–14px / 600 / #1E1B4B
  Body       : 12–13px / 400 / #374151
  Caption    : 10–11px / 400 / #6B7280
  Label/badge: 10–11px / 500 / sesuai warna
```

### 2.3 Komponen Kunci

**Sidebar**
- Lebar: 56px (icon only, tanpa label)
- Background: `#1E1B4B` (navy gelap)
- Icon aktif: background `#4F46E5`, icon putih
- Icon default: warna `#8B8FC7`
- Avatar user di paling bawah

**Topbar / Navbar**
- Background: sama dengan page (`#EEEDF8`)
- Berisi: tab navigasi, search bar, toggle tema, notifikasi, tombol aksi
- Search shortcut: `Ctrl+K`

**Card**
- Background: `#FFFFFF`
- Border: `0.5px solid #E5E7EB`
- Border radius: `14px`
- Padding: `14px 16px`
- Tanpa drop shadow

**Button Primary**
- Background: `#4F46E5`
- Teks: putih
- Border radius: `8px`
- Padding: `6px 14px`

**Badge / Tag Prioritas**
- Pill kecil `border-radius: 20px`
- Warna background muda + teks gelap senada
- Contoh urgent: `background #FEE2E2`, `color #DC2626`

**Progress Bar**
- Tinggi: 4–5px
- Background track: `#EDE9FE`
- Fill: `#4F46E5`
- Border radius: penuh

**Avatar**
- Lingkaran dengan inisial
- Ukuran: 22px (xs), 32px (sm), 44px (md)
- Warna background bervariasi per user

### 2.4 Layout Grid

```
Desktop (>1024px):
  Sidebar     : 56px (fixed left)
  Topbar      : full width, 52px height
  Content     : flex 1, padding 16px 20px
  Grid utama  : 3 kolom (1fr 1fr 1.1fr)
  Grid bawah  : 3 kolom (1.1fr 1fr 0.9fr)
  Gap antar card : 14px

Tablet (768–1024px):
  Sidebar     : collapsible (icon → hidden)
  Konten      : 2 kolom
  Topbar      : hamburger menu

Mobile (<768px):
  Sidebar     : bottom navigation bar
  Konten      : 1 kolom, full width
  Topbar      : compact
```

---

## 3. 🗂️ Menu Utama (Final)

Sesuai permintaan, menu yang diimplementasikan:

| No | Menu | Icon | Keterangan |
|---|---|---|---|
| 1 | Dashboard | layout-dashboard | Halaman utama & ringkasan |
| 2 | Tugas Saya | checklist | Tugas yang diassign ke user login |
| 3 | Proyek | folder | Daftar & detail proyek |
| 4 | Kanban | layout-kanban | Board drag & drop |
| 5 | Milestone | flag | Tonggak pencapaian per proyek |
| 6 | Tim | users | Manajemen anggota & workload |
| 7 | Kalender | calendar | Tampilan kalender & deadline |
| 8 | Analitik | chart-bar | Grafik & statistik produktivitas |
| 9 | Laporan | file-analytics | Generate & export laporan |
| 10 | Pengaturan | settings | Profil, tema, bahasa, role |

---

## 4. 🗓️ Phase Implementasi UI

Pembangunan UI dibagi menjadi 5 phase berdasarkan prioritas dan ketergantungan antar komponen.

---

### ⚡ Phase 1 — Fondasi & Auth
**Estimasi: Minggu 1**  
Membangun kerangka aplikasi, design system, dan alur autentikasi.

**Yang dibangun:**
- Setup design system: CSS variables, token warna, tipografi, komponen dasar (Button, Badge, Card, Input, Modal, Avatar)
- Layout utama: AppShell dengan sidebar + topbar
- Sidebar icon-only dengan navigasi aktif
- Topbar dengan search bar, toggle tema, notifikasi, tombol aksi
- Halaman Login — form email + password, simulasi auth localStorage
- Halaman Register — form buat akun baru
- Role selection saat register: Admin / Manager / Member
- Redirect otomatis setelah login
- Protected route (halaman tertentu hanya bisa diakses setelah login)
- Light mode & Dark mode toggle

**Output:** Aplikasi bisa dibuka, login, dan navigasi antar halaman.

---

### 📋 Phase 2 — Dashboard & Tugas Saya
**Estimasi: Minggu 2**  
Halaman utama yang pertama dilihat pengguna setelah login.

**Yang dibangun:**

*Dashboard:*
- Hero section: sapaan user + tagline
- Widget fitur cepat (3 card: Kelola tugas, Sinkron, Kolaborasi)
- Widget Notifikasi: item notifikasi terbaru, tandai baca, hapus
- Widget Penugasan: tugas yang diassign ke user
- Widget Kalender mini: bulan berjalan + dot tugas per hari
- Widget Tugas Hari Ini: list tugas + progress bar + metadata
- Widget Project Stats: progress bar proyek aktif + stat mini (Total, Selesai, Proses, Terlambat)
- Card rapat/event mendatang dengan tombol terima/tolak
- Card upgrade Pro (UI saja, tanpa transaksi)

*Tugas Saya:*
- Filter: Hari ini / Minggu ini / Terlambat / Selesai / Semua
- Sorting: deadline, prioritas, nama
- List tugas dengan badge prioritas (🔵🟡🟠🔴), status, deadline
- Quick complete (checkbox langsung dari list)
- Indikator overdue (merah) dan mendekati deadline (kuning)
- Empty state jika tidak ada tugas

**Output:** Dashboard informatif dan halaman tugas personal berfungsi penuh.

---

### 🗂️ Phase 3 — Proyek, Kanban & Milestone
**Estimasi: Minggu 3**  
Inti dari fitur manajemen proyek dan visualisasi kerja.

**Yang dibangun:**

*Proyek:*
- Halaman daftar proyek: card per proyek (nama, progress, anggota, deadline)
- Filter & sort proyek: status, tanggal, nama
- Form buat / edit proyek: nama, deskripsi, warna, ikon, deadline, assign anggota
- Halaman detail proyek:
  - Header: nama, status, progress bar, deadline, anggota
  - Statistik: Total Task, Completed, In Progress, Overdue, Waiting
  - Tab: Tugas | Milestone | Anggota | Aktivitas
  - Burndown chart (visual progress vs waktu)
  - Task distribution (pie chart by status & priority)
  - Team workload bar chart

*Kanban Board:*
- 4 kolom: To Do | In Progress | Review | Done
- Drag & drop kartu antar kolom (menggunakan @dnd-kit/core)
- Card kanban: judul, badge prioritas, assignee avatar, due date, jumlah komentar
- Tambah kartu baru langsung dari kolom
- Collapse kolom
- Filter board per assignee / prioritas
- Warna card header sesuai prioritas

*Milestone:*
- List milestone per proyek
- Card milestone: nama, tanggal target, status (Not Started / On Track / At Risk / Completed), progress bar dari task terkait
- Timeline view antar milestone
- Form tambah / edit milestone
- Status otomatis berdasarkan % task selesai & jarak deadline

**Output:** Manajemen proyek end-to-end dengan visualisasi Kanban dan Milestone.

---

### 👥 Phase 4 — Tim & Kalender
**Estimasi: Minggu 4**  
Fitur kolaborasi tim dan tampilan berbasis waktu.

**Yang dibangun:**

*Tim:*
- Halaman daftar anggota: grid card (avatar, nama, role, departemen)
- Filter per role & departemen
- Card anggota: avatar, nama, role badge, jumlah tugas aktif, completion rate
- Workload chart: bar chart siapa mengerjakan berapa tugas
- Halaman profil anggota: info, statistik personal, daftar tugas aktif
- Form tambah / edit anggota (Admin only)
- Konfirmasi hapus anggota (Admin only)

*Kalender:*
- Toggle tampilan: Bulanan | Mingguan
- Tampilan bulanan:
  - Grid 7 hari, navigasi antar bulan
  - Dot indikator per tanggal ada tugas (warna = prioritas)
  - Klik tanggal → panel tugas hari itu muncul di bawah
  - Highlight: hari ini (lingkaran indigo), deadline overdue (merah)
- Tampilan mingguan:
  - Grid 7 kolom (hari), tugas sebagai chip berwarna
  - Chip bisa diklik → buka detail tugas
- Drag & drop untuk reschedule deadline (opsional)
- Filter per proyek / assignee

**Output:** Manajemen tim dengan workload view dan kalender interaktif.

---

### 📊 Phase 5 — Analitik, Laporan & Pengaturan
**Estimasi: Minggu 5–6**  
Fitur pelaporan, visualisasi data, dan konfigurasi aplikasi.

**Yang dibangun:**

*Analitik:*
- Stat cards baris atas: Total Dibuat, Total Selesai, Completion Rate, Rata-rata/hari
- Bar chart mingguan: tugas dibuat vs selesai per hari (7 hari terakhir)
- Line chart tren bulanan (4 minggu)
- Pie chart distribusi tugas: by status, by priority, by assignee
- Team workload horizontal bar chart
- Burndown chart per proyek aktif
- Filter periode: 7 hari / 30 hari / 3 bulan

*Laporan:*
- Form generate laporan: pilih tipe, periode, proyek, anggota
- Tipe laporan:
  - Laporan Tugas per Proyek
  - Laporan Produktivitas Anggota
  - Laporan Beban Kerja Tim
  - Laporan Overdue & Bottleneck
- Preview laporan di halaman
- Export sebagai JSON atau tampilan cetak (print-friendly)

*Pengaturan:*
- Tab Profil: nama, foto (avatar), role, departemen
- Tab Tampilan: light/dark mode, bahasa (ID/EN), warna aksen
- Tab Notifikasi: toggle per jenis notifikasi
- Tab Akun: ganti password (simulasi), logout semua sesi
- Tab Data: export semua data (JSON), reset data aplikasi
- Role & Permission: tabel akses per role (Admin only)

**Output:** Aplikasi lengkap, siap deploy ke Vercel / Netlify.

---

## 5. 📊 Ringkasan Phase

| Phase | Fokus | Estimasi | Output Utama |
|---|---|---|---|
| 1 | Fondasi & Auth | Minggu 1 | Login, layout, design system |
| 2 | Dashboard & Tugas Saya | Minggu 2 | Dashboard informatif, tugas personal |
| 3 | Proyek, Kanban & Milestone | Minggu 3 | Manajemen proyek end-to-end |
| 4 | Tim & Kalender | Minggu 4 | Kolaborasi tim, kalender interaktif |
| 5 | Analitik, Laporan & Setting | Minggu 5–6 | Laporan, grafik, konfigurasi |

---

## 6. 📦 Dependensi Tambahan untuk UI

```bash
# Drag & drop (Kanban + Todo reorder)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Chart / Grafik (Analitik & Dashboard)
npm install recharts

# Date picker (Deadline, Kalender)
npm install react-day-picker date-fns

# Icon (Tabler icons)
npm install @tabler/icons-react
```

---

## 7. ✅ Checklist Komponen UI Global

Komponen ini dibuat di Phase 1 dan digunakan di semua phase selanjutnya:

- [ ] `Button` — primary, secondary, ghost, danger
- [ ] `Badge` / `Tag` — prioritas, status, kategori
- [ ] `Card` — wrapper card standar
- [ ] `Modal` — dialog konfirmasi & form
- [ ] `Input` / `Textarea` — field form
- [ ] `Select` / `Dropdown` — pilihan opsi
- [ ] `Avatar` — inisial user dengan warna
- [ ] `ProgressBar` — horizontal, dengan label %
- [ ] `Sidebar` — icon-only, navigasi aktif
- [ ] `Topbar` — search, toggle, aksi
- [ ] `EmptyState` — ilustrasi + teks saat data kosong
- [ ] `LoadingSpinner` — indikator loading
- [ ] `ToastNotification` — pesan sukses / error
- [ ] `ConfirmDialog` — konfirmasi hapus / aksi kritis
- [ ] `SearchModal` — modal search global (Ctrl+K)
- [ ] `PriorityBadge` — 🔵🟡🟠🔴 dengan label
- [ ] `StatusBadge` — To Do / In Progress / Review / Done
- [ ] `DragHandle` — ikon untuk drag & drop item

---

*Dokumen ini adalah addendum dari update-fitur.md dan prd.md. Baca ketiganya untuk konteks lengkap proyek TaskFlow.*
