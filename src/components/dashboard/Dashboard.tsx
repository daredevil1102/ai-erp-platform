'use client'
import { useState, useEffect } from 'react'
import { DollarSign, Users, Truck, Activity, Bell, ArrowUpRight, Plus, X, FileText, Send, TruckIcon, DollarSignIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const emptyChartData = [
  { month: '', value: 0 },
]

const emptyPieData = []

type ModalType = 'notifications' | 'quote' | 'campaign' | 'shipment' | 'collection' | null

export function Dashboard() {
  const [time, setTime] = useState('--:--:--')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [notifications, setNotifications] = useState<{id: number; text: string; time: string; read: boolean}[]>([])
  const [hasNotification, setHasNotification] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    const update = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickAction = (action: string) => {
    if (action === 'quote') setActiveModal('quote')
    else if (action === 'campaign') setActiveModal('campaign')
    else if (action === 'shipment') setActiveModal('shipment')
    else if (action === 'collection') setActiveModal('collection')
  }

  const closeModal = () => setActiveModal(null)

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Command Center</h1>
          <p className="text-muted text-sm md:text-base">AI-Native ERP Platform v3.0 | Single-Company Edition</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <div className="glass rounded-xl md:rounded-2xl px-4 md:px-6 py-2 md:py-3 flex items-center gap-2 md:gap-3">
            <Activity className="text-muted hidden sm:block" size={18} />
            <span className="font-mono text-lg md:text-xl text-white">{time}</span>
          </div>
          <button 
            className="relative p-2 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            onClick={() => setActiveModal('notifications')}
          >
            <Bell size={18} className="text-muted" />
            {hasNotification && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Revenue', value: '₹0', icon: DollarSign, color: 'accent' },
          { label: 'Active Leads', value: '0', icon: Users, color: 'highlight' },
          { label: 'In Transit', value: '0', icon: Truck, color: 'success' },
          { label: 'AI Tasks Today', value: '0', icon: Activity, color: 'warning' },
        ].map((stat, i) => (
          <div 
            key={stat.label}
            className="glass rounded-xl md:rounded-2xl p-4 md:p-6"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={clsx(
                'w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center',
                stat.color === 'accent' && 'bg-accent/20 text-accent',
                stat.color === 'highlight' && 'bg-highlight/20 text-highlight',
                stat.color === 'success' && 'bg-success/20 text-success',
                stat.color === 'warning' && 'bg-warning/20 text-warning',
              )}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
            <p className="text-muted text-sm mb-1">{stat.label}</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <div className="col-span-1 lg:col-span-2 glass rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-display font-semibold text-white">Revenue Trend</h3>
            <span className="text-sm text-muted hidden sm:inline">No data available</span>
          </div>
          <div className="h-[180px] md:h-[240px] flex items-center justify-center text-muted">
            <div className="text-center">
              <p className="mb-2 text-sm md:text-base">Revenue data will appear here</p>
              <p className="text-xs md:text-sm">Start adding transactions to see trends</p>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4 md:mb-6">Lead Sources</h3>
          <div className="h-[150px] md:h-[180px] flex items-center justify-center text-muted">
            <p className="text-sm">No lead data yet</p>
          </div>
        </div>
      </div>

      {/* Agent Activity & Live Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* AI Agent Activity */}
        <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-display font-semibold text-white">AI Agent Activity</h3>
            <span className="text-sm text-muted">0 Active</span>
          </div>
          <div className="h-[160px] md:h-[200px] flex items-center justify-center text-muted">
            <p className="text-sm text-center px-4">AI agents will appear here when tasks are running</p>
          </div>
        </div>

        {/* Live Fleet Map */}
        <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-display font-semibold text-white">Live Fleet Tracking</h3>
            <span className="text-sm text-muted">0 Active Vehicles</span>
          </div>
          <div className="relative h-[160px] md:h-[200px] rounded-xl bg-gradient-to-br from-surface to-secondary overflow-hidden flex items-center justify-center">
            <p className="text-muted text-sm text-center px-4">Fleet tracking data will appear here</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Create Quote', icon: '📝', action: 'quote', desc: 'Generate new quotation' },
            { label: 'Send Campaign', icon: '📧', action: 'campaign', desc: 'Launch email sequence' },
            { label: 'Track Shipment', icon: '🚚', action: 'shipment', desc: 'Monitor delivery' },
            { label: 'Run Collection', icon: '💰', action: 'collection', desc: 'Trigger follow-ups' },
          ].map((action) => (
            <button 
              key={action.label}
              onClick={() => handleQuickAction(action.action)}
              className="p-3 md:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
            >
              <span className="text-xl md:text-2xl mb-2 block">{action.icon}</span>
              <p className="font-medium text-white group-hover:text-accent transition-colors text-sm md:text-base">{action.label}</p>
              <p className="text-xs text-muted hidden md:block">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-white">
                {activeModal === 'notifications' && 'Notifications'}
                {activeModal === 'quote' && 'Create Quote'}
                {activeModal === 'campaign' && 'Send Campaign'}
                {activeModal === 'shipment' && 'Track Shipment'}
                {activeModal === 'collection' && 'Run Collection'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              {activeModal === 'notifications' && (
                notifications.length === 0 ? (
                  <p className="text-muted text-center py-8">No notifications yet</p>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 rounded-lg bg-white/5">
                      <p className="text-white text-sm">{n.text}</p>
                      <p className="text-muted text-xs mt-1">{n.time}</p>
                    </div>
                  ))
                )
              )}
              {activeModal === 'quote' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Customer Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" placeholder="Enter customer name" />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Amount</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" placeholder="₹0.00" />
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold">Generate Quote</button>
                </>
              )}
              {activeModal === 'campaign' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Campaign Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" placeholder="Enter campaign name" />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Target Audience</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none">
                      <option value="">Select audience</option>
                      <option value="leads">All Leads</option>
                      <option value="customers">All Customers</option>
                    </select>
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold">Launch Campaign</button>
                </>
              )}
              {activeModal === 'shipment' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Tracking ID</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" placeholder="Enter tracking ID" />
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold">Track Shipment</button>
                </>
              )}
              {activeModal === 'collection' && (
                <>
                  <p className="text-muted mb-4">Trigger automated collection follow-ups for pending invoices.</p>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Days Overdue</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none">
                      <option value="7">7+ days</option>
                      <option value="14">14+ days</option>
                      <option value="30">30+ days</option>
                    </select>
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold">Run Collection</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
