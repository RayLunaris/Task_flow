import React, { useState } from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import type { FilterStatus, FilterPriority, FilterDueDate, SortBy } from '../../context/TaskContext';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export const TaskFilterBar: React.FC = () => {
  const {
    filterStatus, setFilterStatus,
    filterPriority, setFilterPriority,
    filterDueDate, setFilterDueDate,
    sortBy, setSortBy,
    sortOrder, setSortOrder
  } = useTasks();

  const { t } = useTranslation();
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
              ? 'bg-[#E3F2FD] dark:bg-blue-900/30 text-[#0D47A1] dark:text-blue-300 border-[#90CAF9] dark:border-blue-800'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          )}
        >
          <Filter size={16} />
          {t('filter.filterAndSort')}
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium flex items-center gap-1"
          >
            <X size={14} /> {t('filter.clearFilters')}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-top-2 flex flex-col md:flex-row gap-4 transition-colors duration-300">
          
          <div className="flex-1 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Filter</h4>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">{t('filter.status')}: {t('common.all')}</option>
                <option value="active">{t('filter.active')}</option>
                <option value="completed">{t('filter.completed')}</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">{t('taskCard.priority')}: {t('common.all')}</option>
                <option value="high">{t('priority.high')}</option>
                <option value="medium">{t('priority.medium')}</option>
                <option value="low">{t('priority.low')}</option>
              </select>

              <select
                value={filterDueDate}
                onChange={(e) => setFilterDueDate(e.target.value as FilterDueDate)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">{t('filter.dueDate')}: {t('common.all')}</option>
                <option value="today">{t('filter.today')}</option>
                <option value="week">{t('filter.thisWeek')}</option>
                <option value="overdue">{t('filter.overdue')}</option>
              </select>
            </div>
          </div>

          <div className="w-px bg-slate-100 dark:bg-slate-800 hidden md:block"></div>

          <div className="flex-1 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sort</h4>
            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="createdAt">{t('filter.createdAt')}</option>
                <option value="dueDate">{t('filter.dueDate')}</option>
                <option value="priority">{t('taskCard.priority')}</option>
                <option value="name">{t('filter.name')}</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
