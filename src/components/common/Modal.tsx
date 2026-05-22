'use client'
import { useAppStore } from '@/store/appStore'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ModalProps {
  title: string
  children: React.ReactNode
  onClose?: () => void
}

export function Modal({ title, children, onClose }: ModalProps) {
  const { closeModal } = useAppStore()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose || closeModal}
      />
      <div className="relative glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-white">{title}</h2>
          <button 
            onClick={onClose || closeModal}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
