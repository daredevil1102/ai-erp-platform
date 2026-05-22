'use client'
import { useAppStore, Module } from '@/store/appStore'
import { 
  LayoutDashboard, Target, ShoppingCart, Truck, Wallet, Users, 
  Bot, Settings, ChevronLeft, ChevronRight, Zap
} from 'lucide-react'
import { clsx } from 'clsx'

const modules: { id: Module; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'marketing', label: 'Marketing', icon: <Target size={20} /> },
  { id: 'sales', label: 'Sales', icon: <ShoppingCart size={20} /> },
  { id: 'rfq', label: 'RFQ & Quotation', icon: <Target size={20} /> },
  { id: 'dispatch', label: 'Dispatch & Tracking', icon: <Truck size={20} /> },
  { id: 'finance', label: 'Finance & Collections', icon: <Wallet size={20} /> },
  { id: 'hr', label: 'HR & Payroll', icon: <Users size={20} /> },
  { id: 'agents', label: 'AI Agents', icon: <Bot size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
]

export function Sidebar() {
  const { currentModule, setModule, sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <aside 
      className={clsx(
        'fixed left-0 top-0 h-full z-50 transition-all duration-300',
        'bg-gradient-to-b from-secondary to-primary border-r border-white/5',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
                <Zap className="text-primary" size={20} fill="currentColor" />
              </div>
              <div className="absolute -inset-1 bg-accent/20 rounded-xl blur-sm animate-pulse-glow" />
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h1 className="font-display font-bold text-lg text-white">AI-ERP</h1>
                <p className="text-xs text-muted">v3.0 Single-Company</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setModule(mod.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                'hover:bg-white/5 group relative overflow-hidden',
                currentModule === mod.id && 'bg-accent/10 text-accent'
              )}
            >
              {currentModule === mod.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" />
              )}
              <span className={clsx(
                currentModule === mod.id ? 'text-accent' : 'text-muted group-hover:text-white'
              )}>
                {mod.icon}
              </span>
              {sidebarOpen && (
                <span className="font-medium text-sm animate-fade-in">
                  {mod.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            {sidebarOpen && <span className="text-sm text-muted">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
