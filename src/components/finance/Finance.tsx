'use client'
import { useState } from 'react'
import { Wallet, DollarSign, Clock, AlertTriangle, Zap, Plus, Send } from 'lucide-react'
import { clsx } from 'clsx'
import { useAppStore } from '@/store/appStore'
import { Modal } from '@/components/common/Modal'

export function Finance() {
  const { receivables, addReceivable, runCollections, sendReminders, addToast } = useAppStore()
  const [showAddReceivable, setShowAddReceivable] = useState(false)
  const [newReceivable, setNewReceivable] = useState({
    company: '',
    amount: '',
    dueDate: '',
    priority: 'medium'
  })

  const handleAddReceivable = () => {
    if (!newReceivable.company.trim()) {
      addToast('Please enter company name', 'error')
      return
    }
    if (!newReceivable.amount.trim()) {
      addToast('Please enter amount', 'error')
      return
    }
    
    const daysUntilDue = Math.floor(Math.random() * 14) - 5
    addReceivable({
      company: newReceivable.company,
      amount: newReceivable.amount,
      due: daysUntilDue < 0 ? `Overdue ${Math.abs(daysUntilDue)}d` : `Due in ${daysUntilDue}d`,
      priority: newReceivable.priority as any,
      status: daysUntilDue < 0 ? 'critical' : daysUntilDue <= 3 ? 'pending' : 'on_track'
    })
    
    setNewReceivable({ company: '', amount: '', dueDate: '', priority: 'medium' })
    setShowAddReceivable(false)
    addToast('Receivable added successfully', 'success')
  }

  const handleRunCollections = () => {
    runCollections()
    setTimeout(() => {
      addToast('AI analyzed payment patterns and generated strategies', 'success')
    }, 2000)
  }

  const handleSendReminders = () => {
    sendReminders()
  }

  const overdueCount = receivables.filter(r => r.status === 'critical' || r.status === 'pending').length

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Finance & Collections</h1>
          <p className="text-muted">AI-powered payment follow-ups & receivables management</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddReceivable(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Plus size={18} />
            <span>Add Receivable</span>
          </button>
          <button 
            onClick={handleRunCollections}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-highlight to-pink-500 text-white font-semibold"
          >
            <Zap size={18} />
            Run Collections AI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Receivables', value: receivables.length.toString(), icon: Wallet },
          { label: 'Overdue/Pending', value: overdueCount.toString(), icon: AlertTriangle, color: 'highlight' },
          { label: 'On Track', value: receivables.filter(r => r.status === 'on_track').length.toString(), icon: DollarSign, color: 'success' },
          { label: 'AI Tasks Pending', value: overdueCount.toString(), icon: Clock, color: 'warning' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <stat.icon size={20} className={clsx('mb-3', stat.color ? `text-${stat.color}` : 'text-accent')} />
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Collection Trend */}
        <div className="col-span-2 glass rounded-2xl p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-6">Collection Overview</h3>
          {receivables.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-muted">
              <div className="text-center">
                <DollarSign size={48} className="mx-auto mb-4" />
                <p className="mb-2">Add receivables to track collections</p>
                <p className="text-sm">Start managing your payment follow-ups</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-success/10">
                <div>
                  <p className="text-sm text-muted">On Track</p>
                  <p className="text-2xl font-bold text-success">{receivables.filter(r => r.status === 'on_track').length}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-warning/10">
                <div>
                  <p className="text-sm text-muted">Pending</p>
                  <p className="text-2xl font-bold text-warning">{receivables.filter(r => r.status === 'pending').length}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-highlight/10">
                <div>
                  <p className="text-sm text-muted">Critical/Overdue</p>
                  <p className="text-2xl font-bold text-highlight">{receivables.filter(r => r.status === 'critical').length}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collection Queue */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-display font-semibold text-white">AI Priority Queue</h3>
          </div>
          <div className="p-4 space-y-3">
            {receivables.slice(0, 4).map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{item.company}</span>
                  <span className="text-highlight font-bold">{item.amount}</span>
                </div>
                <span className={clsx(
                  'px-2 py-1 rounded-full text-xs',
                  item.status === 'critical' && 'bg-highlight/20 text-highlight',
                  item.status === 'pending' && 'bg-warning/20 text-warning',
                  item.status === 'on_track' && 'bg-success/20 text-success',
                )}>
                  {item.due}
                </span>
              </div>
            ))}
            {receivables.length === 0 && (
              <div className="p-8 text-center">
                <Wallet size={32} className="text-muted mx-auto mb-2" />
                <p className="text-muted text-sm">No pending collections</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receivables Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-display font-semibold text-white">Outstanding Receivables</h3>
          {receivables.length > 0 && (
            <button 
              onClick={handleSendReminders}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Send size={16} />
              <span>Send Reminders</span>
            </button>
          )}
        </div>
        
        {receivables.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <DollarSign size={48} className="text-muted mb-4" />
            <h3 className="text-xl font-display font-semibold text-white mb-2">No receivables yet</h3>
            <p className="text-muted text-center mb-6">Add outstanding payments to track collections</p>
            <button 
              onClick={() => setShowAddReceivable(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold"
            >
              <Plus size={18} />
              Add Receivable
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-sm text-muted font-medium">Company</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Amount</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Due Date</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Priority</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Status</th>
                <th className="text-left p-4 text-sm text-muted font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {receivables.map((item, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{item.company}</td>
                  <td className="p-4 text-accent font-bold">{item.amount}</td>
                  <td className="p-4 text-muted text-sm">{item.due}</td>
                  <td className="p-4">
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium uppercase',
                      item.priority === 'high' && 'bg-highlight/20 text-highlight',
                      item.priority === 'medium' && 'bg-warning/20 text-warning',
                      item.priority === 'low' && 'bg-success/20 text-success',
                    )}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={clsx(
                      'px-3 py-1 rounded-full text-xs font-medium capitalize',
                      item.status === 'critical' && 'bg-highlight/20 text-highlight',
                      item.status === 'pending' && 'bg-warning/20 text-warning',
                      item.status === 'on_track' && 'bg-success/20 text-success',
                    )}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => addToast('WhatsApp reminder sent to ' + item.company, 'success')}
                      className="text-sm text-accent hover:underline"
                    >
                      Send WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Receivable Modal */}
      {showAddReceivable && (
        <Modal title="Add New Receivable" onClose={() => setShowAddReceivable(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-2">Company Name *</label>
              <input
                type="text"
                value={newReceivable.company}
                onChange={(e) => setNewReceivable({ ...newReceivable, company: e.target.value })}
                placeholder="Enter company name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Amount *</label>
              <input
                type="text"
                value={newReceivable.amount}
                onChange={(e) => setNewReceivable({ ...newReceivable, amount: e.target.value })}
                placeholder="e.g. ₹5L"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Due Date</label>
              <input
                type="date"
                value={newReceivable.dueDate}
                onChange={(e) => setNewReceivable({ ...newReceivable, dueDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Priority</label>
              <select
                value={newReceivable.priority}
                onChange={(e) => setNewReceivable({ ...newReceivable, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setShowAddReceivable(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddReceivable}
                className="flex-1 px-4 py-3 rounded-xl bg-highlight text-white font-semibold hover:bg-highlight/80"
              >
                Add Receivable
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
