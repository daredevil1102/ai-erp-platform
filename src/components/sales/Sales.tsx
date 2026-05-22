'use client'
import { useState } from 'react'
import { ShoppingCart, Clock, CheckCircle, AlertCircle, Activity, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import { useAppStore } from '@/store/appStore'
import { Modal } from '@/components/common/Modal'

export function Sales() {
  const { inquiries, addInquiry, addToast } = useAppStore()
  const [showNewInquiry, setShowNewInquiry] = useState(false)
  const [newInquiry, setNewInquiry] = useState({
    company: '',
    value: '',
    priority: 'medium',
    description: ''
  })

  const handleCreateInquiry = () => {
    if (!newInquiry.company.trim()) {
      addToast('Please enter a company name', 'error')
      return
    }
    if (!newInquiry.value.trim()) {
      addToast('Please enter an estimated value', 'error')
      return
    }
    
    addInquiry({
      id: `INQ-${Date.now()}`,
      company: newInquiry.company,
      value: newInquiry.value,
      priority: newInquiry.priority as "high" | "medium" | "low",
      status: 'response_pending',
      created: 'Just now'
    })
    
    setNewInquiry({ company: '', value: '', priority: 'medium', description: '' })
    setShowNewInquiry(false)
    addToast('Inquiry created successfully', 'success')
  }

  const handleStatusChange = (inquiryId: string, newStatus: string) => {
    addToast(`Inquiry status updated to ${newStatus}`, 'success')
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Sales Coordination</h1>
          <p className="text-muted">Manage inquiries, AI-assisted responses & follow-ups</p>
        </div>
        <button 
          onClick={() => setShowNewInquiry(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-highlight to-pink-500 text-white font-semibold"
        >
          <Plus size={18} />
          New Inquiry
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Open Inquiries', value: inquiries.filter(i => i.status === 'response_pending' || i.status === 'follow_up').length.toString(), icon: Clock, color: 'warning' },
          { label: 'Quoted', value: inquiries.filter(i => i.status === 'quoted').length.toString(), icon: CheckCircle, color: 'accent' },
          { label: 'Pending Response', value: inquiries.filter(i => i.status === 'negotiation').length.toString(), icon: AlertCircle, color: 'highlight' },
          { label: 'This Month Revenue', value: '₹0', icon: ShoppingCart, color: 'success' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <stat.icon size={20} className={clsx('mb-3', stat.color ? `text-${stat.color}` : 'text-accent')} />
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Inquiries */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-display font-semibold text-white">Recent Inquiries</h3>
            <button 
              onClick={() => setShowNewInquiry(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          
          {inquiries.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <ShoppingCart size={48} className="text-muted mb-4" />
              <h3 className="text-xl font-display font-semibold text-white mb-2">No inquiries yet</h3>
              <p className="text-muted text-center mb-6">Start by creating a new inquiry to track your sales pipeline</p>
              <button 
                onClick={() => setShowNewInquiry(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-highlight text-white font-semibold"
              >
                <Plus size={18} />
                New Inquiry
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-accent">{inquiry.id}</span>
                      <span className={clsx(
                        'w-2 h-2 rounded-full',
                        inquiry.priority === 'high' && 'bg-highlight',
                        inquiry.priority === 'medium' && 'bg-warning',
                        inquiry.priority === 'low' && 'bg-muted',
                      )} />
                    </div>
                    <span className="text-sm text-muted">{inquiry.created}</span>
                  </div>
                  <h4 className="text-white font-medium mb-2">{inquiry.company}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-accent">{inquiry.value}</span>
                    <select 
                      value={inquiry.status}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border-0 cursor-pointer"
                    >
                      <option value="response_pending">Response Pending</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="quoted">Quoted</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-display font-semibold text-white">Activity Feed</h3>
          </div>
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
            <Activity size={48} className="text-muted mb-4" />
            <h3 className="text-lg font-display font-semibold text-white mb-2">No activity yet</h3>
            <p className="text-muted text-sm max-w-xs">
              Activity from calls, emails, meetings, and WhatsApp will appear here as you interact with leads
            </p>
          </div>
        </div>
      </div>

      {/* New Inquiry Modal */}
      {showNewInquiry && (
        <Modal title="Create New Inquiry" onClose={() => setShowNewInquiry(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-2">Company Name *</label>
              <input
                type="text"
                value={newInquiry.company}
                onChange={(e) => setNewInquiry({ ...newInquiry, company: e.target.value })}
                placeholder="Enter company name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Estimated Value *</label>
              <input
                type="text"
                value={newInquiry.value}
                onChange={(e) => setNewInquiry({ ...newInquiry, value: e.target.value })}
                placeholder="e.g. ₹10L"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Priority</label>
              <select
                value={newInquiry.priority}
                onChange={(e) => setNewInquiry({ ...newInquiry, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Description</label>
              <textarea
                value={newInquiry.description}
                onChange={(e) => setNewInquiry({ ...newInquiry, description: e.target.value })}
                placeholder="Brief description of the inquiry..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setShowNewInquiry(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateInquiry}
                className="flex-1 px-4 py-3 rounded-xl bg-highlight text-white font-semibold hover:bg-highlight/80"
              >
                Create Inquiry
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
