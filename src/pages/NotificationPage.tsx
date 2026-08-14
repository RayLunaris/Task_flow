import React from 'react';
import { Bell, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useTranslation } from 'react-i18next';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { Button } from '../components/ui/Button';

export const NotificationPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary/40 dark:hover:border-primary/40 shadow-sm transition-all cursor-pointer group"
          title={t('common.back')}
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-slate-500 group-hover:text-primary dark:text-slate-400 dark:group-hover:text-primary" />
          <span>{t('common.back')}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Bell className="text-primary" size={32} />
            {t('notifications.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('notifications.subtitle')}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            variant="secondary"
            icon={<Check size={18} />}
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-slate-300 dark:text-slate-600" size={32} />
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{t('notifications.allCaughtUp')}</p>
            <p className="text-sm mt-1">{t('notifications.noNotifications')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationItem
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
