# 📋 Product Requirements Document (PRD)
## Aplikasi To-Do List — TaskFlow

**Versi:** 1.0.0  
**Tanggal:** 11 Agustus 2026  
**Author:** Rey  
**Stack:** React.js + TypeScript + localStorage  

---

## 1. 🎯 Ringkasan Produk

**TaskFlow** adalah aplikasi manajemen tugas berbasis web yang dirancang untuk membantu siswa, mahasiswa, pekerja kantoran, dan freelancer dalam mengelola pekerjaan sehari-hari secara efisien dan menyenangkan. Aplikasi ini dibangun dengan React.js + TypeScript, menyimpan data di localStorage, dan hadir dengan desain *colorful & playful* yang responsif penuh di semua perangkat.

---

## 2. 👥 Target Pengguna

| Segmen | Kebutuhan Utama |
|---|---|
| **Siswa / Mahasiswa** | Melacak tugas, deadline, dan jadwal belajar |
| **Pekerja Kantoran** | Manajemen pekerjaan harian & prioritas tim |
| **Freelancer** | Tracking proyek per klien & deadline kontrak |

---

## 3. 🌐 Informasi Teknis

| Aspek | Detail |
|---|---|
| **Framework** | React.js 18+ |
| **Bahasa** | TypeScript |
| **State Management** | React Hooks (useState, useReducer, useContext) |
| **Penyimpanan Data** | localStorage browser |
| **Styling** | Tailwind CSS / CSS Modules |
| **Internasionalisasi** | i18n — Bahasa Indonesia & Inggris |
| **Responsivitas** | Full Responsive (Mobile, Tablet, Desktop) |
| **Build Tool** | Vite |

---

## 4. 🗂️ Arsitektur Fitur

### 4.1 Fitur Utama (MVP)

#### F01 — Pembuatan Tugas (Task Creation)
- Input teks untuk judul tugas (wajib)
- Input textarea untuk deskripsi tugas (opsional)
- Tombol "Tambah Tugas" / "Add Task"
- Validasi: judul tidak boleh kosong
- Shortcut keyboard: `Enter` untuk submit

#### F02 — Daftar Tampilan (Task List)
- Menampilkan semua tugas dalam daftar terurut
- Tampilan card per tugas dengan informasi: judul, deskripsi, prioritas, kategori, due date, status
- Empty state illustration jika belum ada tugas
- Animasi smooth saat menambah / menghapus item

#### F03 — Penanda Selesai (Checkbox)
- Checkbox interaktif di setiap card tugas
- Tugas selesai: tampil dengan strikethrough + warna pudar
- Animasi celebrasi saat menandai selesai (konfeti mini)

#### F04 — Edit & Hapus
- Tombol edit membuka modal/inline edit
- Edit dapat mengubah: judul, deskripsi, prioritas, kategori, due date
- Tombol hapus dengan konfirmasi dialog
- Bulk delete: hapus semua tugas selesai sekaligus

#### F05 — Penyimpanan localStorage
- Auto-save setiap perubahan ke localStorage
- Load data otomatis saat aplikasi dibuka
- Tidak ada data yang hilang saat refresh halaman
- Key: `taskflow_tasks`, `taskflow_settings`

---

### 4.2 Fitur Organisasi & Prioritas

#### F06 — Skala Prioritas
| Level | Warna | Label ID | Label EN |
|---|---|---|---|
| Tinggi | 🔴 Merah | Tinggi | High |
| Sedang | 🟡 Kuning | Sedang | Medium |
| Rendah | 🟢 Hijau | Rendah | Low |

- Ditampilkan sebagai badge berwarna pada card
- Default prioritas: Sedang

#### F07 — Tenggat Waktu (Due Dates)
- Date picker untuk memilih tanggal deadline
- Indikator visual:
  - 🔴 Merah — sudah lewat deadline
  - 🟡 Kuning — deadline dalam 1–3 hari
  - ⚪ Normal — masih jauh
- Countdown label: "2 hari lagi" / "2 days left"

#### F08 — Kategorisasi
- Kategori default: Pribadi, Kerja, Sekolah, Belanja, Kesehatan
- Kemampuan membuat kategori kustom
- Warna berbeda per kategori
- Filter sidebar berdasarkan kategori

#### F09 — Sub-tugas (Nesting)
- Setiap tugas bisa memiliki sub-tugas (maks. 10 per tugas)
- Progress bar otomatis dari persentase sub-tugas selesai
- Collapsible sub-task list
- Sub-tugas bisa diceklis secara independen

---

### 4.3 Fitur Lanjutan

#### F10 — Sorting & Filtering
- **Filter berdasarkan:**
  - Status: Semua / Aktif / Selesai
  - Prioritas: Tinggi / Sedang / Rendah
  - Kategori: per kategori
  - Due Date: Hari ini / Minggu ini / Terlambat
- **Sort berdasarkan:**
  - Tanggal dibuat (terbaru/terlama)
  - Due date (terdekat/terjauh)
  - Prioritas (tinggi ke rendah)
  - Nama A–Z / Z–A
- Kombinasi filter + sort aktif bersamaan
- Badge jumlah filter aktif di tombol filter

#### F11 — Gamifikasi (Poin & Lencana)
- **Sistem Poin:**
  - Prioritas Rendah selesai = +10 poin
  - Prioritas Sedang selesai = +20 poin
  - Prioritas Tinggi selesai = +30 poin
  - Selesai sebelum deadline = bonus +10 poin
- **Level Pengguna:**
  | Level | Nama | Poin Dibutuhkan |
  |---|---|---|
  | 1 | Pemula / Rookie | 0 |
  | 2 | Pelajar / Learner | 100 |
  | 3 | Produktif / Productive | 300 |
  | 4 | Ahli / Expert | 600 |
  | 5 | Master | 1000 |
- **Lencana (Badge):**
  - 🔥 "Streak 7 Hari" — menyelesaikan tugas 7 hari berturut-turut
  - ⚡ "Kilat" — menyelesaikan 5 tugas dalam 1 hari
  - 🎯 "Tepat Waktu" — 10 tugas selesai sebelum deadline
  - 🏆 "Sempurna" — menyelesaikan semua tugas dalam satu minggu
- Progress bar level dengan animasi XP

#### F12 — Grafik Produktivitas
- **Grafik Harian:** Bar chart tugas selesai per hari (7 hari terakhir)
- **Grafik Mingguan:** Line chart tren produktivitas (4 minggu)
- **Statistik Ringkas:**
  - Total tugas dibuat
  - Total tugas selesai
  - Persentase completion rate
  - Rata-rata tugas selesai per hari
  - Streak hari aktif saat ini
- Warna grafik mengikuti tema colorful aplikasi
- Library: Recharts atau Chart.js

#### F13 — Mode Kalender & Mingguan
- **Tampilan Mingguan:** Grid 7 hari, tugas per hari
- **Tampilan Bulanan:** Kalender penuh, dot indicator per hari ada tugas
- Klik tanggal → filter tugas di hari tersebut
- Navigasi antar minggu/bulan dengan panah
- Highlight: hari ini, hari ada deadline

---

## 5. 🌍 Internasionalisasi (i18n)

- **Bahasa tersedia:** Indonesia (id) & English (en)
- **Implementasi:** react-i18next atau custom context
- Semua label, placeholder, pesan error, dan konten UI mengikuti bahasa yang dipilih
- Pilihan bahasa disimpan di localStorage
- Toggle bahasa di navbar (ID | EN)

---

## 6. 🎨 Desain & UI/UX

### Tema: Colorful & Playful
- **Primary Color:** Ungu/Violet (`#7C3AED`)
- **Accent:** Pink (`#EC4899`), Teal (`#14B8A6`), Orange (`#F97316`)
- **Background:** Gradient lembut (putih ke lavender muda)
- **Font:** Poppins (heading) + Inter (body)
- **Border Radius:** Rounded-xl (playful, tidak kaku)
- **Shadows:** Soft drop shadows dengan warna

### Komponen Utama
| Komponen | Keterangan |
|---|---|
| Navbar | Logo, toggle bahasa, toggle dark mode, user level |
| Sidebar | Kategori, filter cepat, statistik mini |
| Task Card | Card dengan badge prioritas, kategori, due date, progress sub-task |
| Add Task Modal | Form lengkap tambah/edit tugas |
| Dashboard | Grafik produktivitas + gamifikasi |
| Calendar View | Tampilan kalender/mingguan |

### Responsivitas
| Breakpoint | Perilaku |
|---|---|
| Mobile (<768px) | Sidebar jadi bottom nav, card full-width, modal full-screen |
| Tablet (768–1024px) | Sidebar collapsible, 2 kolom card |
| Desktop (>1024px) | Sidebar tetap, layout 3 panel |

---

## 7. 🗃️ Struktur Data (TypeScript Interface)

```typescript
// Task utama
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate?: string; // ISO date string
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  subTasks: SubTask[];
}

// Sub-tugas
interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

// Kategori
interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// Data gamifikasi
interface UserProgress {
  totalPoints: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  lastActiveDate: string;
  completedTasksHistory: DailyRecord[];
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt: string;
}

interface DailyRecord {
  date: string;
  completed: number;
  created: number;
}

// Pengaturan aplikasi
interface AppSettings {
  language: 'id' | 'en';
  theme: 'light' | 'dark';
  defaultCategory: string;
  defaultPriority: 'high' | 'medium' | 'low';
}
```

---

## 8. 📁 Struktur Folder Proyek

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── BottomNav.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── SubTaskItem.tsx
│   │   └── TaskFilterBar.tsx
│   ├── dashboard/
│   │   ├── ProductivityChart.tsx
│   │   ├── StatsCard.tsx
│   │   └── GamificationPanel.tsx
│   ├── calendar/
│   │   ├── CalendarView.tsx
│   │   └── WeeklyView.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── ProgressBar.tsx
│       └── ConfettiEffect.tsx
├── hooks/
│   ├── useTasks.ts
│   ├── useLocalStorage.ts
│   ├── useGamification.ts
│   └── useI18n.ts
├── context/
│   ├── TaskContext.tsx
│   ├── SettingsContext.tsx
│   └── GamificationContext.tsx
├── utils/
│   ├── dateUtils.ts
│   ├── taskUtils.ts
│   └── storageUtils.ts
├── locales/
│   ├── id.json
│   └── en.json
├── types/
│   └── index.ts
└── App.tsx
```

---

## 9. 🚀 Roadmap Pengembangan

### Phase 1 — MVP (Minggu 1–2)
- [ ] Setup project (Vite + React + TypeScript + Tailwind)
- [ ] Implementasi localStorage hooks
- [ ] CRUD task dasar
- [ ] UI task card & task list
- [ ] Checkbox selesai

### Phase 2 — Organisasi (Minggu 3)
- [ ] Sistem prioritas & kategori
- [ ] Due date & indikator warna
- [ ] Sub-tugas dengan progress bar
- [ ] Sorting & filtering

### Phase 3 — Lanjutan (Minggu 4–5)
- [ ] Sistem gamifikasi (poin, level, lencana)
- [ ] Grafik produktivitas
- [ ] Mode kalender & mingguan

### Phase 4 — Polish (Minggu 6)
- [ ] Internasionalisasi (i18n) ID/EN
- [ ] Full responsive & dark mode
- [ ] Animasi & micro-interaction
- [ ] Testing & bug fix
- [ ] Deployment (Vercel/Netlify)

---

## 10. ✅ Kriteria Keberhasilan (Definition of Done)

- [ ] Semua fitur MVP berfungsi tanpa error
- [ ] Data tersimpan & tidak hilang saat refresh
- [ ] Tampil baik di Mobile (320px), Tablet (768px), Desktop (1440px)
- [ ] Mendukung bahasa Indonesia & Inggris
- [ ] Lighthouse score: Performance ≥ 85, Accessibility ≥ 90
- [ ] Zero TypeScript error saat build
- [ ] Kode terdokumentasi dengan JSDoc komentar

---

*Dokumen ini merupakan living document dan dapat diperbarui seiring perkembangan proyek.*
