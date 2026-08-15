import type { Department } from '../types';

export const DEFAULT_DEPARTMENTS: Department[] = [
 {
 id: 'dept-uiux',
 name: 'Design & UI/UX',
 description: 'Perancangan antarmuka pengguna, prototyping, design system, dan riset pengalaman pengguna.',
 icon: 'Palette',
 color: 'purple',
 createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
 },
 {
 id: 'dept-eng',
 name: 'Engineering',
 description: 'Pengembangan teknologi frontend, backend REST/GraphQL API, cloud infrastructure, dan integrasi.',
 icon: 'Code2',
 color: 'blue',
 createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
 },
 {
 id: 'dept-product',
 name: 'Product',
 description: 'Perumusan roadmap fitur produk, prioritas sprint, KPI deliverable, dan validasi solusi.',
 icon: 'Rocket',
 color: 'teal',
 createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
 },
 {
 id: 'dept-marketing',
 name: 'Marketing',
 description: 'Strategi pertumbuhan digital, kampanye promosi berbayar/organik, branding, dan akuisisi pengguna.',
 icon: 'Megaphone',
 color: 'amber',
 createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
 },
 {
 id: 'dept-mgmt',
 name: 'Management & Operations',
 description: 'Tata kelola organisasi workspace, alokasi sumber daya bisnis, dan koordinasi lintas divisi.',
 icon: 'Briefcase',
 color: 'pink',
 createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
 },
 {
 id: 'dept-client',
 name: 'Client Partner',
 description: 'Komunikasi kemitraan, transparansi deliverable, dan hubungan kolaboratif dengan klien enterprise.',
 icon: 'Users',
 color: 'indigo',
 createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
 }
];

export const getDepartmentColorStyles = (color?: string) => {
 switch (color) {
 case 'purple':
 return {
 bg: 'bg-purple-50 dark:bg-purple-950/30',
 border: 'border-purple-200 dark:border-purple-900/60',
 text: 'text-primary dark:text-purple-400',
 badge: 'bg-purple-100 text-primary dark:bg-purple-900/50 dark:text-purple-300',
 ring: 'ring-purple-500/20',
 accent: '#9333ea',
 };
 case 'blue':
 return {
 bg: 'bg-subtle dark:bg-blue-950/30',
 border: 'border-blue-200 dark:border-blue-900/60',
 text: 'text-primary dark:text-primary',
 badge: 'bg-subtle text-primary dark:bg-blue-900/50 dark:text-primary',
 ring: 'ring-primary/20',
 accent: '#2563eb',
 };
 case 'teal':
 return {
 bg: 'bg-teal-50 dark:bg-teal-950/30',
 border: 'border-teal-200 dark:border-teal-900/60',
 text: 'text-teal-600 dark:text-teal-400',
 badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
 ring: 'ring-teal-500/20',
 accent: '#0d9488',
 };
 case 'amber':
 return {
 bg: 'bg-amber-50 dark:bg-amber-950/30',
 border: 'border-amber-200 dark:border-amber-900/60',
 text: 'text-amber-600 dark:text-amber-400',
 badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
 ring: 'ring-amber-500/20',
 accent: '#d97706',
 };
 case 'pink':
 return {
 bg: 'bg-pink-50 dark:bg-pink-950/30',
 border: 'border-pink-200 dark:border-pink-900/60',
 text: 'text-pink-600 dark:text-pink-400',
 badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
 ring: 'ring-pink-500/20',
 accent: '#db2777',
 };
 case 'indigo':
 return {
 bg: 'bg-indigo-50 dark:bg-indigo-950/30',
 border: 'border-indigo-200 dark:border-indigo-900/60',
 text: 'text-primary dark:text-indigo-400',
 badge: 'bg-indigo-100 text-primary dark:bg-indigo-900/50 dark:text-indigo-300',
 ring: 'ring-indigo-500/20',
 accent: '#4f46e5',
 };
 default:
 return {
 bg: 'bg-slate-50 dark:bg-[#242424]/40',
 border: 'border-border-color dark:border-border-color',
 text: 'text-slate-600 dark:text-slate-400',
 badge: 'bg-slate-100 text-slate-700 dark:bg-[#242424] dark:text-slate-300',
 ring: 'ring-slate-500/20',
 accent: '#64748b',
 };
 }
};
