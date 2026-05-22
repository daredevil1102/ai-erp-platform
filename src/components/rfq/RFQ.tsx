'use client'
import { useState } from 'react'
import { FileText, Upload, Send, CheckCircle, Clock, Zap } from 'lucide-react'
import { clsx } from 'clsx'

export function RFQ() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'vendors' | 'comparison'>('rfqs')

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">RFQ & Quotation</h1>
          <p className="text-muted">AI-powered vendor matching, OCR extraction & quote generation</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Upload size={18} />
            <span>Upload PO</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-cyan-400 text-primary font-semibold">
            <Zap size={18} />
            AI Match Vendors
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Active RFQs', value: '0', icon: FileText },
          { label: 'Pending Response', value: '0', icon: Clock, color: 'warning' },
          { label: 'Quotations Sent', value: '0', icon: Send, color: 'accent' },
          { label: 'Avg Response Time', value: '--', icon: CheckCircle, color: 'success' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <stat.icon size={20} className={clsx('mb-3', stat.color ? `text-${stat.color}` : 'text-accent')} />
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {(['rfqs', 'vendors', 'comparison'] as const).map((tab) => (
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

      <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
        <FileText size={48} className="text-muted mb-4" />
        <h3 className="text-xl font-display font-semibold text-white mb-2">No {activeTab} yet</h3>
        <p className="text-muted text-center mb-6">
          {activeTab === 'rfqs' && 'Upload a Purchase Order to start processing RFQs'}
          {activeTab === 'vendors' && 'Add vendors to your database for AI-powered matching'}
          {activeTab === 'comparison' && 'RFQ responses will appear here for AI-powered comparison'}
        </p>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold">
          <Zap size={18} />
          Get Started
        </button>
      </div>
    </div>
  )
}
