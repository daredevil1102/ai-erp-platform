'use client'
import { useState } from 'react'
import { Target, Upload, Send, BarChart3, Users, Calendar, TrendingUp, Zap, X, Plus } from 'lucide-react'
import { clsx } from 'clsx'

type ModalType = 'create' | 'import' | 'viewLeads' | 'viewSequences' | null

export function Marketing() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'leads' | 'sequences'>('campaigns')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [campaignName, setCampaignName] = useState('')
  const [leadCount, setLeadCount] = useState(0)

  const openModal = (type: ModalType) => setActiveModal(type)
  const closeModal = () => setActiveModal(null)

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Marketing Automation</h1>
          <p className="text-muted text-sm md:text-base">AI-powered lead scoring, email sequences & WhatsApp outreach</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <button 
            onClick={() => openModal('import')}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            <Upload size={18} />
            <span>Import CSV</span>
          </button>
          <button 
            onClick={() => openModal('create')}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl bg-gradient-to-r from-accent to-cyan-400 text-primary font-semibold text-sm md:text-base"
          >
            <Zap size={18} />
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Leads', value: '0', icon: Users },
          { label: 'Hot Leads', value: '0', icon: TrendingUp, color: 'highlight' },
          { label: 'Open Rate', value: '--', icon: BarChart3 },
          { label: 'Active Campaigns', value: '0', icon: Target },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl md:rounded-2xl p-4 md:p-5">
            <stat.icon size={20} className={clsx('mb-3', stat.color ? `text-${stat.color}` : 'text-accent')} />
            <p className="text-xl md:text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit overflow-x-auto">
        {(['campaigns', 'leads', 'sequences'] as const).map((tab) => (
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

      {/* Content based on tab */}
      <div className="glass rounded-xl md:rounded-2xl p-6 md:p-12 flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px]">
        <Target size={40} className="text-muted mb-4 md:block hidden" />
        <h3 className="text-lg md:text-xl font-display font-semibold text-white mb-2">No {activeTab} yet</h3>
        <p className="text-muted text-center mb-6 text-sm md:text-base">
          {activeTab === 'campaigns' && 'Create your first marketing campaign to start engaging with leads'}
          {activeTab === 'leads' && 'Import leads to get started with AI-powered scoring'}
          {activeTab === 'sequences' && 'Create automated email sequences for your leads'}
        </p>
        <button 
          onClick={() => openModal('create')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold"
        >
          <Zap size={18} />
          Get Started
        </button>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-white">
                {activeModal === 'create' && 'Create Campaign'}
                {activeModal === 'import' && 'Import CSV'}
                {activeModal === 'viewLeads' && 'View Leads'}
                {activeModal === 'viewSequences' && 'View Sequences'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              {activeModal === 'create' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Campaign Name</label>
                    <input 
                      type="text" 
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" 
                      placeholder="Enter campaign name" 
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Channel</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none">
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Target Leads</label>
                    <input 
                      type="number" 
                      value={leadCount}
                      onChange={(e) => setLeadCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" 
                      placeholder="0" 
                    />
                  </div>
                  <button 
                    onClick={closeModal} 
                    className="w-full py-3 rounded-xl bg-accent text-primary font-semibold"
                  >
                    Create Campaign
                  </button>
                </>
              )}
              {activeModal === 'import' && (
                <>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                    <Upload size={40} className="text-muted mx-auto mb-4" />
                    <p className="text-white mb-2">Drag and drop CSV file here</p>
                    <p className="text-sm text-muted">or click to browse</p>
                  </div>
                  <button 
                    onClick={closeModal} 
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white"
                  >
                    Import Leads
                  </button>
                </>
              )}
              {activeModal === 'viewLeads' && (
                <p className="text-muted text-center py-8">Leads will appear here</p>
              )}
              {activeModal === 'viewSequences' && (
                <p className="text-muted text-center py-8">Sequences will appear here</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
