'use client'
import { useState } from 'react'
import { Target, Upload, Send, BarChart3, Users, Calendar, TrendingUp, Zap } from 'lucide-react'
import { clsx } from 'clsx'

export function Marketing() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads' | 'sequences'>('campaigns')

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Marketing Automation</h1>
          <p className="text-muted">AI-powered lead scoring, email sequences & WhatsApp outreach</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Upload size={18} />
            <span>Import CSV</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-cyan-400 text-primary font-semibold">
            <Zap size={18} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: '0', icon: Users },
          { label: 'Hot Leads', value: '0', icon: TrendingUp, color: 'highlight' },
          { label: 'Open Rate', value: '--', icon: BarChart3 },
          { label: 'Active Campaigns', value: '0', icon: Target },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <stat.icon size={20} className={clsx('mb-3', stat.color ? `text-${stat.color}` : 'text-accent')} />
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {(['campaigns', 'leads', 'sequences'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-5 py-2 rounded-lg font-medium capitalize transition-all',
              activeTab === tab ? 'bg-accent text-primary' : 'text-muted hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px]">
        <Target size={48} className="text-muted mb-4" />
        <h3 className="text-xl font-display font-semibold text-white mb-2">No {activeTab} yet</h3>
        <p className="text-muted text-center mb-6">
          {activeTab === 'campaigns' && 'Create your first marketing campaign to start engaging with leads'}
          {activeTab === 'leads' && 'Import leads to get started with AI-powered scoring'}
          {activeTab === 'sequences' && 'Create automated email sequences for your leads'}
        </p>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold">
          <Zap size={18} />
          Get Started
        </button>
      </div>
    </div>
  )
}
