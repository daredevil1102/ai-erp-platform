'use client'
import { Database, Zap, Shield, Mail, MessageSquare, Users, Key, FileText, X, Plus, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'

type ModalType = 'configure' | 'addMember' | 'addApiKey' | null

export function Settings() {
  const [activeTab, setActiveTab] = useState('integrations')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [notifications, setNotifications] = useState({
    emailLeads: false,
    whatsappDispatch: false,
    paymentReminder: false,
    dailySummary: false,
  })
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)

  const openModal = (type: ModalType, name?: string) => {
    setActiveModal(type)
    if (name) setSelectedIntegration(name)
  }
  const closeModal = () => setActiveModal(null)

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Settings</h1>
        <p className="text-muted text-sm md:text-base">Configure integrations, team access & platform settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit overflow-x-auto">
        {['integrations', 'team', 'notifications', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-4 md:px-5 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap text-sm md:text-base',
              activeTab === tab ? 'bg-accent text-primary' : 'text-muted hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              { name: 'WhatsApp Business API', icon: MessageSquare, color: '#25D366' },
              { name: 'Amazon SES', icon: Mail, color: '#FF9900' },
              { name: 'Anthropic Claude', icon: Zap, color: '#00D9FF' },
              { name: 'PostgreSQL + pgvector', icon: Database, color: '#336791' },
            ].map((int) => (
              <div key={int.name} className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${int.color}20` }}
                    >
                      <int.icon size={24} style={{ color: int.color }} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm md:text-base">{int.name}</h4>
                      <span className="px-2 py-1 rounded-full text-xs bg-muted/20 text-muted">
                        Not configured
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => openModal('configure', int.name)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm w-full sm:w-auto"
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="glass rounded-xl md:rounded-2xl overflow-hidden">
          <div className="p-4 md:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-base md:text-lg font-display font-semibold text-white">Team Members (RBAC)</h3>
            <button 
              onClick={() => openModal('addMember')}
              className="px-4 py-2 rounded-xl bg-accent text-primary font-medium text-sm"
            >
              Add Member
            </button>
          </div>
          <div className="p-6 md:p-12 flex flex-col items-center justify-center">
            <Users size={40} className="text-muted mb-4 md:block hidden" />
            <h3 className="text-lg md:text-xl font-display font-semibold text-white mb-2">No team members yet</h3>
            <p className="text-muted text-center mb-6 text-sm md:text-base">Add team members to manage access permissions</p>
            <button 
              onClick={() => openModal('addMember')}
              className="px-6 py-3 rounded-xl bg-accent text-primary font-semibold"
            >
              Add First Member
            </button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4">
          <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Notification Preferences</h3>
          {[
            { key: 'emailLeads', label: 'Email notifications for new leads' },
            { key: 'whatsappDispatch', label: 'WhatsApp alerts for dispatch updates' },
            { key: 'paymentReminder', label: 'Payment reminder notifications' },
            { key: 'dailySummary', label: 'Daily AI activity summary' },
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <span className="text-white text-sm md:text-base">{pref.label}</span>
              <button 
                onClick={() => toggleNotification(pref.key as keyof typeof notifications)}
                className={clsx(
                  'w-12 h-6 rounded-full transition-colors relative',
                  notifications[pref.key as keyof typeof notifications] ? 'bg-accent' : 'bg-muted'
                )}
              >
                <div className={clsx(
                  'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                  notifications[pref.key as keyof typeof notifications] ? 'left-7' : 'left-1'
                )} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <Shield size={24} className="text-muted" />
              <h3 className="text-base md:text-lg font-display font-semibold text-white">API Keys</h3>
              <button 
                onClick={() => openModal('addApiKey')}
                className="ml-auto px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="p-6 md:p-8 flex flex-col items-center justify-center">
              <Key size={40} className="text-muted mb-4 md:block hidden" />
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">No API keys configured</h3>
              <p className="text-sm text-muted text-center">Add your API keys to connect AI services</p>
            </div>
          </div>
          <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Audit Log</h3>
            <div className="p-6 md:p-8 flex flex-col items-center justify-center">
              <FileText size={40} className="text-muted mb-4 md:block hidden" />
              <p className="text-muted text-center text-sm md:text-base">Audit logs will appear here</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-white">
                {activeModal === 'configure' && `Configure ${selectedIntegration}`}
                {activeModal === 'addMember' && 'Add Team Member'}
                {activeModal === 'addApiKey' && 'Add API Key'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              {activeModal === 'configure' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">API Key</label>
                    <input type="password" className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" placeholder="Enter API key" />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Webhook URL (optional)</label>
                    <input type="url" className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" placeholder="https://..." />
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold flex items-center justify-center gap-2">
                    <Check size={18} />
                    Save Configuration
                  </button>
                </>
              )}
              {activeModal === 'addMember' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" placeholder="user@company.com" />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Role</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none appearance-none cursor-pointer">
                      <option value="admin" className="bg-surface">Admin</option>
                      <option value="manager" className="bg-surface">Manager</option>
                      <option value="user" className="bg-surface">User</option>
                      <option value="viewer" className="bg-surface">Viewer</option>
                    </select>
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold flex items-center justify-center gap-2">
                    <Plus size={18} />
                    Add Member
                  </button>
                </>
              )}
              {activeModal === 'addApiKey' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Service Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" placeholder="e.g., Claude API" />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">API Key</label>
                    <input type="password" className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" placeholder="sk-..." />
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold flex items-center justify-center gap-2">
                    <Plus size={18} />
                    Add API Key
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
