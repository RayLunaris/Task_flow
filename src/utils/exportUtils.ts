import type { Task, Project, User, Milestone } from '../types';

export interface ExportDataParams {
  tasks: Task[];
  projects: Project[];
  users: User[];
  milestones: Milestone[];
  language?: string;
}

export const exportTasksToExcel = ({
  tasks,
  projects,
  users,
  milestones,
  language = 'id'
}: ExportDataParams) => {
  const isId = language === 'id';

  const headers = isId
    ? [
        'No',
        'ID Tugas',
        'Nama Tugas',
        'Deskripsi',
        'Kategori',
        'Prioritas',
        'Status',
        'Selesai',
        'Tenggat Waktu',
        'Proyek',
        'Milestone',
        'Penerima Tugas',
        'Progres Sub-tugas',
        'Waktu Terlacak',
        'Dibuat Pada'
      ]
    : [
        'No',
        'Task ID',
        'Task Title',
        'Description',
        'Category',
        'Priority',
        'Status',
        'Completed',
        'Due Date',
        'Project',
        'Milestone',
        'Assignees',
        'Sub-tasks Progress',
        'Time Spent',
        'Created At'
      ];

  const escapeHtml = (text?: string | number | null) => {
    if (text === undefined || text === null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatTimeSpent = (timeEntries?: Task['timeEntries']) => {
    if (!timeEntries || timeEntries.length === 0) return '0m';
    const totalSecs = timeEntries.reduce((acc, curr) => {
      if (curr.duration) return acc + curr.duration;
      if (curr.endAt) {
        return acc + Math.floor((new Date(curr.endAt).getTime() - new Date(curr.startAt).getTime()) / 1000);
      }
      return acc;
    }, 0);

    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const rows = tasks.map((task, index) => {
    const project = projects.find(p => p.id === task.projectId);
    const milestone = milestones.find(m => m.id === task.milestoneId);
    const assigneeNames = (task.assigneeIds || [])
      .map(id => users.find(u => u.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const subtasksTotal = (task.subTasks || []).length;
    const subtasksCompleted = (task.subTasks || []).filter(st => st.completed).length;
    const subtaskString = subtasksTotal > 0 ? `${subtasksCompleted}/${subtasksTotal}` : '-';

    const statusLabels: Record<string, string> = isId
      ? { todo: 'Akan Dikerjakan', in_progress: 'Sedang Dikerjakan', review: 'Ditinjau', done: 'Selesai' }
      : { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done' };

    const priorityLabels: Record<string, string> = isId
      ? { urgent: 'Mendesak', high: 'Tinggi', medium: 'Sedang', low: 'Rendah' }
      : { urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low' };

    return `
      <tr style="height: 24px;">
        <td style="text-align: center; border: 1px solid #E2E8F0; padding: 6px;">${index + 1}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; font-family: monospace; font-size: 11px;">${escapeHtml(task.id)}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; font-weight: bold; color: #1E293B;">${escapeHtml(task.title)}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; color: #64748B;">${escapeHtml(task.description || '-')}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px;">${escapeHtml(task.category || 'General')}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; text-transform: capitalize;">${escapeHtml(priorityLabels[task.priority] || task.priority)}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px;">${escapeHtml(statusLabels[task.status] || task.status)}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; text-align: center;">${task.completed ? (isId ? 'Ya' : 'Yes') : (isId ? 'Tidak' : 'No')}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px;">${escapeHtml(task.dueDate || '-')}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; font-weight: 500;">${escapeHtml(project?.name || '-')}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px;">${escapeHtml(milestone?.name || '-')}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px;">${escapeHtml(assigneeNames || '-')}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; text-align: center;">${escapeHtml(subtaskString)}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; text-align: center;">${escapeHtml(formatTimeSpent(task.timeEntries))}</td>
        <td style="border: 1px solid #E2E8F0; padding: 6px; color: #64748B; font-size: 11px;">${escapeHtml(task.createdAt ? new Date(task.createdAt).toLocaleString(isId ? 'id-ID' : 'en-US') : '-')}</td>
      </tr>
    `;
  }).join('');

  // XML / HTML spreadsheet template
  const excelTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${isId ? 'Daftar Tugas' : 'Task List'}</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          th {
            background-color: #2196F3;
            color: #FFFFFF;
            font-weight: bold;
            font-size: 12px;
            padding: 8px;
            border: 1px solid #90CAF9;
            text-align: left;
          }
          tr:nth-child(even) {
            background-color: #F8FAFC;
          }
          td {
            font-size: 12px;
            color: #334155;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #0D47A1; margin-bottom: 4px;">TaskFlow - ${isId ? 'Laporan Ekspor Data Tugas' : 'Task Data Export Report'}</h2>
          <p style="color: #64748B; font-size: 12px; margin-top: 0; margin-bottom: 12px;">
            ${isId ? 'Dihasilkan pada' : 'Generated on'}: ${new Date().toLocaleString(isId ? 'id-ID' : 'en-US')} | ${isId ? 'Total Tugas' : 'Total Tasks'}: ${tasks.length}
          </p>
          <table border="1" cellpadding="4" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  // Create downloadable Blob
  const blob = new Blob([excelTemplate], {
    type: 'application/vnd.ms-excel;charset=utf-8;'
  });

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadLink.href = url;
  downloadLink.download = `TaskFlow_Export_${dateStr}.xls`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
