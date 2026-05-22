'use client'
import { useState } from 'react'
import { Bot, Zap, MessageSquare, Truck, Wallet, Users, Activity } from 'lucide-react'
import { clsx } from 'clsx'

const modules = ['All', 'Marketing', 'Sales', 'RFQ', 'Dispatch', 'Finance', 'HR']

export function Agents() {
  const [activeFilter, setActiveFilter] = useState('All')

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">AI Agent Architecture</h1>
          <p className="text-muted">15 production-ready AI agents across 6 modules • LangGraph orchestration</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-muted">
            <span>Total Tasks Today:</span>
            <span className="text-white font-bold">0</span>
          </div>
        </div>
      </div>

      {/* Module Filters */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {modules.map((mod) => (
          <button
            key={mod}
            onClick={() => setActiveFilter(mod)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all',
              activeFilter === mod ? 'bg-accent text-primary' : 'text-muted hover:text-white'
            )}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Bot size={64} className="text-muted mb-4" />
        <h3 className="text-xl font-display font-semibold text-white mb-2">AI Agents Ready</h3>
        <p className="text-muted text-center mb-6 max-w-md">
          The platform is configured with 15 AI agents ready to automate your business processes. 
          Agents will become active as you start using the system.
        </p>
        <div className="grid grid-cols-6 gap-4">
          {[
            { module: 'Marketing', count: 2, icon: MessageSquare },
            { module: 'Sales', count: 2, icon: Activity },
            { module: 'RFQ', count: 4, icon: Zap },
            { module: 'Dispatch', count: 2, icon: Truck },
            { module: 'Finance', count: 3, icon: Wallet },
            { module: 'HR', count: 2, icon: Users },
          ].map((m) => (
            <div key={m.module} className="text-center p-4 rounded-xl bg-white/5">
              <m.icon size={24} className="mx-auto mb-2 text-muted" />
              <p className="text-2xl font-bold text-white">{m.count}</p>
              <p className="text-sm text-muted">{m.module}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Summary */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">Agent Architecture Summary</h3>
        <div className="text-muted text-center">
          <p>Agent activity will be tracked here as tasks are processed</p>
        </div>
      </div>
    </div>
  )
}
