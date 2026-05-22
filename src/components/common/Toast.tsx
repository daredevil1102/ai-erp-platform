'use client'
import { useAppStore } from '@/store/appStore'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

export function Toast() {
  const { toasts, removeToast } = useAppStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up',
            'backdrop-blur-md border',
            toast.type === 'success' && 'bg-success/20 border-success/30 text-success',
            toast.type === 'error' && 'bg-highlight/20 border-highlight/30 text-highlight',
            toast.type === 'info' && 'bg-accent/20 border-accent/30 text-accent'
          )}
        >
          {toast.type === 'success' && <CheckCircle size={18} />}
          {toast.type === 'error' && <XCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-70"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
