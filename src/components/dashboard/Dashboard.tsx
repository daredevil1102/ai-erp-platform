'use client'
import { useState, useEffect } from 'react'
import { DollarSign, Users, Truck, Activity, Bell, ArrowUpRight, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const emptyChartData = [
  { month: '', value: 0 },
]

const emptyPieData = []

export function Dashboard() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Command Center</h1>
          <p className="text-muted">AI-Native ERP Platform v3.0 | Single-Company Edition</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass rounded-2xl px-6 py-3 flex items-center gap-3">
            <Activity className="text-muted" size={18} />
            <span className="font-mono text-xl text-white">{time}</span>
          </div>
          <button className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Bell size={20} className="text-muted" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '₹0', icon: DollarSign, color: 'accent' },
          { label: 'Active Leads', value: '0', icon: Users, color: 'highlight' },
          { label: 'In Transit', value: '0', icon: Truck, color: 'success' },
          { label: 'AI Tasks Today', value: '0', icon: Activity, color: 'warning' },
        ].map((stat, i) => (
          <div 
            key={stat.label}
            className="glass rounded-2xl p-6"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                stat.color === 'accent' && 'bg-accent/20 text-accent',
                stat.color === 'highlight' && 'bg-highlight/20 text-highlight',
                stat.color === 'success' && 'bg-success/20 text-success',
                stat.color === 'warning' && 'bg-warning/20 text-warning',
              )}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-muted text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-white">Revenue Trend</h3>
            <span className="text-sm text-muted">No data available</span>
          </div>
          <div className="h-[240px] flex items-center justify-center text-muted">
            <div className="text-center">
              <p className="mb-2">Revenue data will appear here</p>
              <p className="text-sm">Start adding transactions to see trends</p>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-6">Lead Sources</h3>
          <div className="h-[180px] flex items-center justify-center text-muted">
            <p>No lead data yet</p>
          </div>
        </div>
      </div>

      {/* Agent Activity & Live Tracking */}
      <div className="grid grid-cols-2 gap-6">
        {/* AI Agent Activity */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-white">AI Agent Activity</h3>
            <span className="text-sm text-muted">0 Active</span>
          </div>
          <div className="h-[200px] flex items-center justify-center text-muted">
            <p>AI agents will appear here when tasks are running</p>
          </div>
        </div>

        {/* Live Fleet Map */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-white">Live Fleet Tracking</h3>
            <span className="text-sm text-muted">0 Active Vehicles</span>
          </div>
          <div className="relative h-[200px] rounded-xl bg-gradient-to-br from-surface to-secondary overflow-hidden flex items-center justify-center">
            <p className="text-muted">Fleet tracking data will appear here</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Create Quote', icon: '📝', action: 'Generate new quotation' },
            { label: 'Send Campaign', icon: '📧', action: 'Launch email sequence' },
            { label: 'Track Shipment', icon: '🚚', action: 'Monitor delivery' },
            { label: 'Run Collection', icon: '💰', action: 'Trigger follow-ups' },
          ].map((action) => (
            <button 
              key={action.label}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
            >
              <span className="text-2xl mb-2 block">{action.icon}</span>
              <p className="font-medium text-white group-hover:text-accent transition-colors">{action.label}</p>
              <p className="text-xs text-muted">{action.action}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
