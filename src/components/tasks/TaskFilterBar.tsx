import React, { useState } from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import type { FilterStatus, FilterPriority, FilterDueDate, SortBy, SortOrder } from '../../context/TaskContext';
import clsx from 'clsx';

export const TaskFilterBar: React.FC = () => {
  const {
    filterStatus, setFilterStatus,
    filterPriority, setFilterPriority,
    filterDueDate, setFilterDueDate,
    sortBy, setSortBy,
    sortOrder, setSortOrder
  } = useTasks();

  const [isOpen, setIsOpen] = useState(false);

  // Count active filters (ignoring 'all' and sorting)
  let activeFiltersCount = 0;
  if (filterStatus !== 'all') activeFiltersCount++;
  if (filterPriority !== 'all') activeFiltersCount++;
  if (filterDueDate !== 'all') activeFiltersCount++;

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterDueDate('all');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border',
            isOpen || activeFiltersCount > 0
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          )}
        >
          <Filter size={16} />
          Filter & Sort
          {activeFiltersCount > 0 && (
            <span className="bg-purple-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1"
          >
            <X size={14} /> Clear filters
          </button>
        )}
      </div>

      {isOpen && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter</h4>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">Status: Semua</option>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">Prioritas: Semua</option>
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>

              <select
                value={filterDueDate}
                onChange={(e) => setFilterDueDate(e.target.value as FilterDueDate)}
                className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="all">Due Date: Semua</option>
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="overdue">Terlambat</option>
              </select>
            </div>
          </div>

          <div className="w-px bg-slate-100 hidden md:block"></div>

          <div className="flex-1 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort</h4>
            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-slate-50 text-slate-700 font-medium"
              >
                <option value="createdAt">Dibuat pada</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Prioritas</option>
                <option value="name">Nama</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown size={16} />
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
