# 📋 Update Fitur — TaskFlow Business Todo & Task Management
## Dokumen Perubahan dari Requirement Guru

**Versi:** 2.0.0  
**Tanggal:** 12 Agustus 2026  
**Berdasarkan:** PRD v1.0.0 (TaskFlow Personal)  
**Status:** Major Update — Personal → Business Grade

---

## ⚠️ Ringkasan Perubahan Utama

Aplikasi berubah scope dari **personal to-do list** menjadi **Business Todo & Task Management** yang mendukung kolaborasi tim, manajemen proyek, dan fitur enterprise. Beberapa fitur lama dipertahankan, sebagian besar diperluas atau ditambahkan baru.

---

## 🔧 Stack Teknologi

| Aspek | Sebelumnya | Sekarang |
|---|---|---|
| Framework | React.js + TypeScript | React.js + TypeScript |
| Styling | Tailwind CSS | Tailwind CSS |
| Storage | localStorage | localStorage |
| State | React Hooks | React Hooks + Context |
| Scope | Personal | Individual & Tim |

> ⚠️ **Catatan:** Fitur kolaborasi tim (Team Management, Comment, Approval, dll) tetap disimulasikan menggunakan localStorage — tidak ada backend/database eksternal.

---

## 🆕 Fitur Baru yang Ditambahkan

### 🔴 WAJIB (Must Have)

#### M01 — Authentication / Login
- Halaman login dengan form email + password
- Simulasi autentikasi via localStorage (user data tersimpan lokal)
- Role-based login: Admin, Manager, Member
- Halaman register / buat akun baru
- Persistent login (ingat sesi via localStorage)
- Logout dengan konfirmasi

#### M02 — Dashboard Utama
- Ringkasan statistik global:
  - **TOTAL TASK** — semua tugas aktif
  - **COMPLETED** — tugas selesai
  - **IN PROGRESS** — sedang dikerjakan
  - **OVERDUE** — melewati deadline
- Project progress bar per proyek aktif (contoh: 72%)
- Widget: burndown chart, task distribution pie chart
- Widget: deadline terdekat (7 hari ke depan)
- Widget: team workload (siapa mengerjakan apa)

#### M03 — Task Management (Diperluas dari F01–F04)
- Tugas bisa **didelegasikan ke anggota tim**
- Tugas bisa **dipindah dengan drag & drop** antar status/proyek
- 4 level prioritas:
  | Level | Ikon | Deskripsi |
  |---|---|---|
  | Low | 🔵 | Tidak mendesak |
  | Medium | 🟡 | Normal |
  | High | 🟠 | Penting |
  | Urgent | 🔴 | Harus segera |
- Status tugas: To Do → In Progress → Review → Done
- Deadline dengan indikator warna (terlambat/mendekati/aman)
- Assign ke 1 atau lebih anggota tim

#### M04 — Project Management
- Buat & kelola proyek dengan nama, deskripsi, warna, ikon
- Setiap proyek punya:
  - Dashboard internal (progress, statistik)
  - Daftar tugas terkait
  - Anggota yang terlibat
  - Milestone & deadline proyek
- Project progress bar otomatis dari % tugas selesai
- Status proyek: Active, On Hold, Completed, Archived

#### M05 — My Tasks
- Halaman personal untuk melihat semua tugas **milik pengguna yang login**
- Filter: Hari ini, Minggu ini, Terlambat, Selesai
- Sorting: deadline, prioritas, proyek
- Quick complete langsung dari halaman ini

#### M06 — Team Management
- Daftar anggota tim dengan nama, role, avatar
- Tambah/hapus/edit anggota (admin only)
- Lihat workload per anggota: berapa tugas aktif, selesai, terlambat
- Profile per anggota: statistik personal

#### M07 — Milestone
- Tonggak pencapaian per proyek
- Setiap milestone memiliki: nama, tanggal target, deskripsi, status
- Progress milestone otomatis berdasarkan tugas yang terkait
- Indikator visual: belum mulai / on track / terlewat / selesai
- Timeline view antar milestone dalam satu proyek

#### M08 — Checklist
- Checklist item di dalam tugas (berbeda dari sub-tugas)
- Template checklist yang bisa disimpan & dipakai ulang
- Progress bar otomatis dari % item tercentang
- Reorder item checklist via drag & drop

#### M09 — Search
- Global search bar di navbar (shortcut: `Ctrl+K` / `Cmd+K`)
- Cari: tugas, proyek, anggota tim, komentar
- Filter hasil: berdasarkan tipe, proyek, tanggal
- Recent searches tersimpan di localStorage

#### M10 — Role & Permission
- 3 role default:
  | Role | Akses |
  |---|---|
  | Admin | Full akses: kelola user, setting, semua data |
  | Manager | Kelola proyek & tim, bisa assign tugas |
  | Member | Hanya lihat & kelola tugas milik sendiri |
- Permission dikecek di setiap aksi sensitif (hapus, assign, approve)
- Role disimpan di localStorage per user

#### M11 — Setting
- **Profil:** nama, foto, role
- **Tampilan:** light/dark mode, bahasa (ID/EN), warna tema
- **Notifikasi:** toggle jenis notifikasi yang diterima
- **Akun:** ganti password (simulasi), logout semua sesi
- **Data:** export data (JSON), reset data aplikasi

---

### 🟡 OPSIONAL (Nice to Have)

#### O01 — Subtask (Ada di v1, diperluas)
- Subtask bisa diassign ke anggota berbeda
- Subtask bisa punya deadline sendiri
- Subtask bisa punya prioritas sendiri

#### O02 — Kanban Board
- Tampilan papan Kanban per proyek
- Kolom: **To Do | In Progress | Review | Done**
- Drag & drop kartu antar kolom
- Collapse kolom, tambah kolom kustom
- WIP limit per kolom (opsional)
- Warna kartu sesuai prioritas

#### O03 — Calendar (Ada di v1, diperluas)
- Tampilan kalender bulanan & mingguan
- Event dari: deadline tugas, milestone, reminder
- Drag & drop untuk reschedule deadline
- Filter per proyek / anggota

#### O04 — Department
- Pengelompokan anggota tim per departemen (misal: Dev, Design, Marketing)
- Filter tugas & laporan berdasarkan departemen
- Kepala departemen bisa lihat semua tugas anggotanya

#### O05 — Client
- Data klien: nama, perusahaan, email, nomor
- Hubungkan proyek ke klien tertentu
- Lihat semua proyek per klien

#### O06 — Approval
- Tugas tertentu butuh persetujuan sebelum dianggap selesai
- Alur: Submit for Review → Approved / Rejected (dengan catatan)
- Notifikasi otomatis ke approver & submitter
- History approval tersimpan

#### O07 — Comment
- Kolom komentar di setiap tugas
- Mention anggota dengan `@nama`
- Edit & hapus komentar sendiri
- Timestamp per komentar
- Komentar tersimpan di localStorage per tugas

#### O08 — Attachment
- Upload file simulasi (nama & ukuran file disimpan, file tidak benar-benar diupload)
- Tampilkan daftar attachment per tugas dengan ikon tipe file
- Hapus attachment

#### O09 — Recurring Task
- Tugas berulang dengan frekuensi: Harian, Mingguan, Bulanan, Kustom
- Auto-generate tugas baru saat tugas recurring selesai
- Indikator "🔁 Berulang" pada card tugas
- Edit recurring: hanya instance ini / semua instance

#### O10 — Reminder
- Set reminder per tugas: X jam / hari sebelum deadline
- Notifikasi in-app saat waktu reminder tiba
- Reminder tersimpan & dicek saat aplikasi dibuka

#### O11 — Notification
- Pusat notifikasi (klik bel di navbar)
- Jenis notifikasi:
  - Tugas baru diassign ke kamu
  - Deadline mendekati (1 hari lagi)
  - Komentar baru di tugas kamu
  - Approval request / hasil approval
  - Milestone tercapai
- Tandai sudah dibaca / hapus notifikasi
- Badge jumlah notifikasi belum dibaca

#### O12 — Time Tracking
- Tombol "Mulai / Stop" timer per tugas
- Total waktu terlacak ditampilkan di card tugas
- Riwayat sesi waktu per tugas
- Laporan waktu per anggota / proyek

#### O13 — Activity Log
- Log semua aksi: siapa, apa, kapan
- Contoh: "Rey membuat tugas 'Desain Logo' di Proyek Website — 12 Agu 10:30"
- Filter log per proyek / anggota / tanggal
- Tersimpan di localStorage, bisa di-scroll

#### O14 — Report
- Laporan bisa diekspor sebagai JSON atau ditampilkan sebagai halaman cetak
- Jenis laporan:
  - Laporan tugas per proyek
  - Laporan produktivitas anggota
  - Laporan beban kerja tim
  - Laporan overdue & bottleneck

#### O15 — Analytics (Ada di v1, diperluas)
- Burndown chart per proyek
- Task distribution pie chart (by status, by priority, by assignee)
- Team workload bar chart
- Completion trend line chart (harian/mingguan)

#### O16 — Audit Log
- Log khusus aksi sensitif: login/logout, hapus data, perubahan role, approval
- Hanya bisa dilihat Admin
- Tidak bisa dihapus (append-only di localStorage)

#### O17 — Subscription/Billing *(Simulasi UI saja)*
- Halaman plan: Free / Pro / Business
- Tabel perbandingan fitur per plan
- Tombol "Upgrade" (tidak ada transaksi nyata)
- Badge plan aktif di profil

---

## 📊 Project Dashboard — Spesifikasi Lengkap

```
┌─────────────────────────────────────────────────────┐
│  Project: Website Revamp                  [Active]  │
│                                                     │
│  TOTAL TASK   COMPLETED   IN PROGRESS   OVERDUE    │
│     120          86           20           8        │
│                                                     │
│  Project Progress                         72%       │
│  ████████████████████░░░░░░░░░  72/100             │
│                                                     │
│  Waiting: 6                                         │
│                                                     │
│  Visual Widgets:                                    │
│  [Progress Bar] [Burndown Chart]                   │
│  [Task Distribution Pie] [Team Workload Bar]       │
│  [Deadline Timeline]                               │
└─────────────────────────────────────────────────────┘
```

**Kalkulasi otomatis:**
- `Progress %` = (Completed / Total) × 100
- `Overdue` = tugas dengan deadline < hari ini & status ≠ Done
- `In Progress` = tugas dengan status "In Progress" atau "Review"
- `Waiting` = tugas belum dimulai yang belum overdue

---

## 🔄 Todo — Fitur Khusus

Sesuai requirement guru, Todo (berbeda dari Task) memiliki fitur spesifik:

| Fitur | Detail |
|---|---|
| **Deadline** | Pilih tanggal & jam deadline |
| **Recurring** | Harian / Mingguan / Bulanan / Custom |
| **Reminder** | Notifikasi X waktu sebelum deadline |
| **Drag & Drop** | Ubah urutan todo dengan drag & drop |
| **Status** | Todo / Doing / Done |
| **Prioritas** | 🔵 Low · 🟡 Medium · 🟠 High · 🔴 Urgent |

---

## 🗃️ Update Struktur Data TypeScript

```typescript
// === TAMBAHAN / UPDATE dari v1 ===

// User & Auth
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed simulasi
  role: 'admin' | 'manager' | 'member';
  avatar?: string;
  department?: string;
  createdAt: string;
}

// Proyek
interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: 'active' | 'on_hold' | 'completed' | 'archived';
  clientId?: string;
  memberIds: string[];
  managerId: string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Task (diperluas)
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent'; // ← DIUBAH: tambah 'urgent'
  status: 'todo' | 'in_progress' | 'review' | 'done';
  projectId?: string;
  assigneeIds: string[]; // ← BARU: bisa multi-assign
  reporterId: string;    // ← BARU: siapa yang buat
  category: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  subTasks: SubTask[];
  checklists: ChecklistItem[];  // ← BARU
  attachments: Attachment[];    // ← BARU
  comments: Comment[];          // ← BARU
  timeEntries: TimeEntry[];     // ← BARU
  isRecurring: boolean;         // ← BARU
  recurringConfig?: RecurringConfig; // ← BARU
  reminderAt?: string;          // ← BARU
  needsApproval: boolean;       // ← BARU
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvalNote?: string;
  milestoneId?: string;         // ← BARU
  order: number;                // ← BARU: untuk drag & drop
  createdAt: string;
  updatedAt: string;
}

// Checklist item
interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

// Attachment (simulasi)
interface Attachment {
  id: string;
  name: string;
  size: number; // bytes
  type: string; // mime type
  uploadedBy: string;
  uploadedAt: string;
}

// Komentar
interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  mentions: string[]; // user IDs
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
}

// Time entry
interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startAt: string;
  endAt?: string;
  duration?: number; // menit
}

// Recurring config
interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // setiap X hari/minggu/bulan
  daysOfWeek?: number[]; // 0=Minggu, 1=Senin, dst
  endDate?: string;
}

// Milestone
interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  targetDate: string;
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
  taskIds: string[];
  createdAt: string;
}

// Notifikasi
interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'deadline_near' | 'comment' | 'approval' | 'milestone';
  title: string;
  message: string;
  relatedId?: string; // task/project/milestone ID
  isRead: boolean;
  createdAt: string;
}

// Departemen
interface Department {
  id: string;
  name: string;
  headId?: string; // kepala departemen
  memberIds: string[];
}

// Client
interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  projectIds: string[];
}

// Activity Log
interface ActivityLog {
  id: string;
  userId: string;
  action: string; // "created_task", "completed_task", "assigned_user", dll
  targetType: 'task' | 'project' | 'user' | 'milestone';
  targetId: string;
  targetName: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Audit Log (admin only)
interface AuditLog {
  id: string;
  userId: string;
  action: string; // "login", "delete_project", "change_role"
  ip?: string;
  createdAt: string;
}
```

---

## 📁 Update Struktur Folder

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── AppShell.tsx          ← BARU
│   ├── auth/                     ← BARU
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskDetail.tsx        ← BARU
│   │   ├── SubTaskItem.tsx
│   │   ├── TaskFilterBar.tsx
│   │   └── TaskDragDrop.tsx      ← BARU
│   ├── projects/                 ← BARU
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDashboard.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ProjectStats.tsx
│   ├── kanban/                   ← BARU
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── KanbanCard.tsx
│   ├── team/                     ← BARU
│   │   ├── TeamList.tsx
│   │   ├── MemberCard.tsx
│   │   └── WorkloadChart.tsx
│   ├── milestones/               ← BARU
│   │   ├── MilestoneList.tsx
│   │   └── MilestoneTimeline.tsx
│   ├── comments/                 ← BARU
│   │   ├── CommentList.tsx
│   │   └── CommentForm.tsx
│   ├── notifications/            ← BARU
│   │   ├── NotificationPanel.tsx
│   │   └── NotificationItem.tsx
│   ├── dashboard/
│   │   ├── ProductivityChart.tsx
│   │   ├── StatsCard.tsx
│   │   ├── GamificationPanel.tsx
│   │   ├── BurndownChart.tsx     ← BARU
│   │   └── TeamWorkload.tsx      ← BARU
│   ├── calendar/
│   │   ├── CalendarView.tsx
│   │   └── WeeklyView.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── ProgressBar.tsx
│       ├── ConfettiEffect.tsx
│       ├── DragDropList.tsx      ← BARU
│       ├── Avatar.tsx            ← BARU
│       └── SearchModal.tsx       ← BARU (Ctrl+K)
├── pages/                        ← BARU (route per halaman)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── TodoPage.tsx
│   ├── TasksPage.tsx
│   ├── ProjectsPage.tsx
│   ├── KanbanPage.tsx
│   ├── CalendarPage.tsx
│   ├── MyTasksPage.tsx
│   ├── TeamPage.tsx
│   ├── MilestonePage.tsx
│   ├── ReportPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── SettingPage.tsx
│   └── NotFoundPage.tsx
├── hooks/
│   ├── useTasks.ts
│   ├── useLocalStorage.ts
│   ├── useGamification.ts
│   ├── useI18n.ts
│   ├── useAuth.ts                ← BARU
│   ├── useProjects.ts            ← BARU
│   ├── useNotifications.ts       ← BARU
│   ├── useTimeTracker.ts         ← BARU
│   └── useDragDrop.ts            ← BARU
├── context/
│   ├── TaskContext.tsx
│   ├── SettingsContext.tsx
│   ├── GamificationContext.tsx
│   ├── AuthContext.tsx           ← BARU
│   └── NotificationContext.tsx   ← BARU
├── utils/
│   ├── dateUtils.ts
│   ├── taskUtils.ts
│   ├── storageUtils.ts
│   ├── authUtils.ts              ← BARU
│   ├── permissionUtils.ts        ← BARU
│   └── exportUtils.ts            ← BARU
├── locales/
│   ├── id.json
│   └── en.json
├── types/
│   └── index.ts                  ← UPDATE besar
└── App.tsx
```

---

## 🗓️ Update Roadmap Pengembangan

### Phase 1 — Auth & Core MVP (Minggu 1–2)
- [ ] Setup routing (react-router-dom)
- [ ] Halaman Login & Register (simulasi localStorage)
- [ ] AuthContext + role-based permission
- [ ] CRUD Task dasar + assign ke user
- [ ] CRUD Todo dengan drag & drop
- [ ] Dashboard utama (statistik dasar)

### Phase 2 — Project & Team (Minggu 3)
- [ ] CRUD Project + Project Dashboard
- [ ] Team Management + workload view
- [ ] My Tasks halaman personal
- [ ] Milestone & timeline
- [ ] Kanban Board dengan drag & drop

### Phase 3 — Fitur Kolaborasi (Minggu 4)
- [ ] Comment + mention
- [ ] Attachment (simulasi)
- [ ] Approval workflow
- [ ] Checklist + template
- [ ] Notification center

### Phase 4 — Fitur Lanjutan (Minggu 5)
- [ ] Recurring task
- [ ] Reminder & time tracking
- [ ] Activity log & audit log
- [ ] Department & Client
- [ ] Search global (Ctrl+K)

### Phase 5 — Analytics & Polish (Minggu 6)
- [ ] Report & Analytics lengkap
- [ ] Burndown chart & team workload
- [ ] Gamifikasi (tetap dari v1)
- [ ] i18n ID/EN full
- [ ] Full responsive + dark mode
- [ ] Testing & bug fix
- [ ] Build siap deploy (Vercel/Netlify)

---

## ✅ Kriteria Keberhasilan v2.0

- [ ] Login/logout berfungsi dengan role berbeda (Admin, Manager, Member)
- [ ] Semua fitur **wajib** dari guru berjalan tanpa error
- [ ] Data tidak hilang saat refresh (localStorage)
- [ ] Kanban Board drag & drop berjalan mulus
- [ ] Tampil baik di Mobile (320px), Tablet (768px), Desktop (1440px)
- [ ] Mendukung bahasa Indonesia & Inggris
- [ ] Bisa di-build (`npm run build`) tanpa error TypeScript
- [ ] Siap deploy ke Vercel / Netlify
- [ ] Lighthouse: Performance ≥ 80, Accessibility ≥ 90

---

## 📌 Modul Wajib vs Opsional (Rekap dari Guru)

| No | Modul | Status |
|---|---|---|
| 1 | Authentication / Login | ✅ Wajib |
| 2 | Dashboard | ✅ Wajib |
| 3 | Todo | ✅ Wajib |
| 4 | Task Management | ✅ Wajib |
| 5 | Project Management | ✅ Wajib |
| 6 | Subtask | 🟡 Opsional |
| 7 | Kanban Board | 🟡 Opsional |
| 8 | Calendar | 🟡 Opsional |
| 9 | My Tasks | ✅ Wajib |
| 10 | Team Management | ✅ Wajib |
| 11 | Department | 🟡 Opsional |
| 12 | Client | 🟡 Opsional |
| 13 | Milestone | ✅ Wajib |
| 14 | Approval | 🟡 Opsional |
| 15 | Comment | 🟡 Opsional |
| 16 | Attachment | 🟡 Opsional |
| 17 | Checklist | ✅ Wajib |
| 18 | Recurring Task | 🟡 Opsional |
| 19 | Reminder | 🟡 Opsional |
| 20 | Notification | 🟡 Opsional |
| 21 | Time Tracking | 🟡 Opsional |
| 22 | Activity Log | 🟡 Opsional |
| 23 | Report | 🟡 Opsional |
| 24 | Analytics | 🟡 Opsional |
| 25 | Search | ✅ Wajib |
| 26 | Role & Permission | ✅ Wajib |
| 27 | Setting | ✅ Wajib |
| 28 | Subscription/Billing | 🟡 Opsional (UI saja) |
| 29 | Audit Log | 🟡 Opsional |

**Total Wajib: 11 modul | Opsional: 18 modul**

---

*Dokumen ini adalah addendum dari PRD v1.0.0. Baca bersama prd.md untuk konteks lengkap.*
