'use client'
import { Database, Zap, Shield, Mail, MessageSquare, Users, Key, FileText } from 'lucide-react'
import { clsx } from 'clsx'
import { useState } from 'react'

export function Settings() {
  const [activeTab, setActiveTab] = useState('integrations')

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Settings</h1>
        <p className="text-muted">Configure integrations, team access & platform settings</p>
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        {['integrations', 'team', 'notifications', 'security'].map((tab) => (
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

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {[
              { name: 'WhatsApp Business API', icon: MessageSquare, color: '#25D366' },
              { name: 'Amazon SES', icon: Mail, color: '#FF9900' },
              { name: 'Anthropic Claude', icon: Zap, color: '#00D9FF' },
              { name: 'PostgreSQL + pgvector', icon: Database, color: '#336791' },
            ].map((int) => (
              <div key={int.name} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${int.color}20` }}
                    >
                      <int.icon size={24} style={{ color: int.color }} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{int.name}</h4>
                      <span className="px-2 py-1 rounded-full text-xs bg-muted/20 text-muted">
                        Not configured
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm">
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-display font-semibold text-white">Team Members (RBAC)</h3>
            <button className="px-4 py-2 rounded-xl bg-accent text-primary font-medium">
              Add Member
            </button>
          </div>
          <div className="p-12 flex flex-col items-center justify-center">
            <Users size={48} className="text-muted mb-4" />
            <h3 className="text-xl font-display font-semibold text-white mb-2">No team members yet</h3>
            <p className="text-muted text-center mb-6">Add team members to manage access permissions</p>
            <button className="px-6 py-3 rounded-xl bg-accent text-primary font-semibold">
              Add First Member
            </button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-display font-semibold text-white mb-4">Notification Preferences</h3>
          {[
            { label: 'Email notifications for new leads', enabled: false },
            { label: 'WhatsApp alerts for dispatch updates', enabled: false },
            { label: 'Payment reminder notifications', enabled: false },
            { label: 'Daily AI activity summary', enabled: false },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <span className="text-white">{pref.label}</span>
              <button className="w-12 h-6 rounded-full transition-colors relative bg-muted">
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={24} className="text-muted" />
              <h3 className="text-lg font-display font-semibold text-white">API Keys</h3>
            </div>
            <div className="p-12 flex flex-col items-center justify-center">
              <Key size={48} className="text-muted mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No API keys configured</h3>
              <p className="text-sm text-muted text-center">Add your API keys to connect AI services</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-display font-semibold text-white mb-4">Audit Log</h3>
            <div className="p-12 flex flex-col items-center justify-center">
              <FileText size={48} className="text-muted mb-4" />
              <p className="text-muted text-center">Audit logs will appear here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
