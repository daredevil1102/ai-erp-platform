'use client'
import { useState } from 'react'
import { Bot, Zap, MessageSquare, Truck, Wallet, Users, Activity, X, Play, Pause, Settings } from 'lucide-react'
import { clsx } from 'clsx'

const modules = ['All', 'Marketing', 'Sales', 'RFQ', 'Dispatch', 'Finance', 'HR']

type ModalType = 'config' | 'activity' | null

export function Agents() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [runningAgents, setRunningAgents] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const openModal = (type: ModalType, agent?: string) => {
    setActiveModal(type)
    if (agent) setSelectedAgent(agent)
  }
  const closeModal = () => setActiveModal(null)

  const toggleAgent = (agent: string) => {
    setRunningAgents(prev => 
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">AI Agent Architecture</h1>
          <p className="text-muted text-sm md:text-base">15 production-ready AI agents across 6 modules • LangGraph orchestration</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/5 text-muted text-sm">
            <span className="hidden sm:inline">Running:</span>
            <span className="text-white font-bold">{runningAgents.length}</span>
          </div>
          <button 
            onClick={() => openModal('config')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            <Settings size={18} />
            <span>Configure</span>
          </button>
        </div>
      </div>

      {/* Module Filters */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit overflow-x-auto">
        {modules.map((mod) => (
          <button
            key={mod}
            onClick={() => setActiveFilter(mod)}
            className={clsx(
              'px-4 md:px-5 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm md:text-base',
              activeFilter === mod ? 'bg-accent text-primary' : 'text-muted hover:text-white'
            )}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Agent Modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { module: 'Marketing', count: 2, icon: MessageSquare, agents: ['LeadScorer', 'CampaignOptimizer'] },
            { module: 'Sales', count: 2, icon: Activity, agents: ['QuoteGenerator', 'FollowUpAgent'] },
            { module: 'RFQ', count: 4, icon: Zap, agents: ['OCRProcessor', 'VendorMatcher', 'PriceComparator', 'QuoteGenerator'] },
            { module: 'Dispatch', count: 2, icon: Truck, agents: ['RouteOptimizer', 'DeliveryTracker'] },
            { module: 'Finance', count: 3, icon: Wallet, agents: ['InvoiceParser', 'PaymentTracker', 'CollectionAgent'] },
            { module: 'HR', count: 2, icon: Users, agents: ['ResumeParser', 'InterviewScheduler'] },
          ].map((m) => (
            <div 
              key={m.module} 
              className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => openModal('activity', m.module)}
            >
              <m.icon size={24} className="mx-auto mb-2 text-muted" />
              <p className="text-2xl font-bold text-white">{m.count}</p>
              <p className="text-sm text-muted">{m.module}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Actions */}
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Quick Agent Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { name: 'LeadScorer', icon: MessageSquare, desc: 'Score leads automatically' },
            { name: 'QuoteGenerator', icon: Activity, desc: 'Generate quotes from data' },
            { name: 'VendorMatcher', icon: Zap, desc: 'Match RFQ to vendors' },
            { name: 'DeliveryTracker', icon: Truck, desc: 'Track all deliveries' },
          ].map((agent) => (
            <div key={agent.name} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <agent.icon size={20} className="text-muted" />
                <button 
                  onClick={() => toggleAgent(agent.name)}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    runningAgents.includes(agent.name) 
                      ? 'bg-success/20 text-success hover:bg-success/30' 
                      : 'bg-white/5 text-muted hover:bg-white/10'
                  )}
                >
                  {runningAgents.includes(agent.name) ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
              <p className="font-medium text-white text-sm">{agent.name}</p>
              <p className="text-xs text-muted">{agent.desc}</p>
              {runningAgents.includes(agent.name) && (
                <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs bg-success/20 text-success">Running</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Summary */}
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Agent Architecture Summary</h3>
        <div className="text-muted text-center py-4 text-sm md:text-base">
          <p>Agent activity will be tracked here as tasks are processed</p>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="glass rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-white">
                {activeModal === 'config' && 'Configure Agents'}
                {activeModal === 'activity' && `Agent Activity - ${selectedAgent}`}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              {activeModal === 'config' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">AI Model</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none">
                      <option value="claude">Claude 3.5 Sonnet</option>
                      <option value="gpt4">GPT-4</option>
                      <option value="gemini">Gemini Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Max Concurrent Tasks</label>
                    <input type="number" defaultValue={5} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Auto-retry on failure</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none">
                      <option value="3">3 times</option>
                      <option value="5">5 times</option>
                      <option value="0">Disabled</option>
                    </select>
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold">Save Configuration</button>
                </>
              )}
              {activeModal === 'activity' && (
                <div className="text-center py-8">
                  <Bot size={48} className="text-muted mx-auto mb-4" />
                  <p className="text-white mb-2">Agent activity for {selectedAgent} module</p>
                  <p className="text-muted text-sm">Tasks processed: 0</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
