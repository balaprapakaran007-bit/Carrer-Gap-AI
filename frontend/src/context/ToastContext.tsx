import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastItem['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Fixed bottom-right toast stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => {
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-xl text-xs font-medium backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200 ${
                t.type === 'success'
                  ? 'border-[var(--success)]/30 bg-[var(--surface)] text-[var(--success)]'
                  : t.type === 'error'
                  ? 'border-[var(--danger)]/30 bg-[var(--surface)] text-[var(--danger)]'
                  : t.type === 'warning'
                  ? 'border-[var(--warning)]/30 bg-[var(--surface)] text-[var(--warning)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {t.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--success)]" />}
                {t.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-[var(--danger)]" />}
                {t.type === 'warning' && <AlertCircle className="w-4 h-4 shrink-0 text-[var(--warning)]" />}
                {t.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[var(--primary)]" />}
                <span className="text-[var(--text)]">{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 transition shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
