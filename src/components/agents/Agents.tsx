'use client'
import { useState, useRef, DragEvent } from 'react'
import { Bot, Zap, MessageSquare, Truck, Wallet, Users, Activity, X, Play, Pause, Settings, Upload } from 'lucide-react'
import { clsx } from 'clsx'

const modules = ['All', 'Marketing', 'Sales', 'RFQ', 'Dispatch', 'Finance', 'HR']

type ModalType = 'config' | 'activity' | null

const agentModules = [
  { module: 'Marketing', count: 2, icon: MessageSquare, agents: ['LeadScorer', 'CampaignOptimizer'] },
  { module: 'Sales', count: 2, icon: Activity, agents: ['QuoteGenerator', 'FollowUpAgent'] },
  { module: 'RFQ', count: 4, icon: Zap, agents: ['OCRProcessor', 'VendorMatcher', 'PriceComparator', 'QuoteGenerator'] },
  { module: 'Dispatch', count: 2, icon: Truck, agents: ['RouteOptimizer', 'DeliveryTracker'] },
  { module: 'Finance', count: 3, icon: Wallet, agents: ['InvoiceParser', 'PaymentTracker', 'CollectionAgent'] },
  { module: 'HR', count: 2, icon: Users, agents: ['ResumeParser', 'InterviewScheduler'] },
]

const quickAgents = [
  { name: 'LeadScorer', module: 'Marketing', icon: MessageSquare, desc: 'Score leads automatically' },
  { name: 'QuoteGenerator', module: 'Sales', icon: Activity, desc: 'Generate quotes from data' },
  { name: 'VendorMatcher', module: 'RFQ', icon: Zap, desc: 'Match RFQ to vendors' },
  { name: 'DeliveryTracker', module: 'Dispatch', icon: Truck, desc: 'Track all deliveries' },
  { name: 'InvoiceParser', module: 'Finance', icon: Wallet, desc: 'Parse invoices automatically' },
  { name: 'ResumeParser', module: 'HR', icon: Users, desc: 'Score resumes with AI' },
]

export function Agents() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [runningAgents, setRunningAgents] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredModules = activeFilter === 'All' 
    ? agentModules 
    : agentModules.filter(m => m.module === activeFilter)

  const filteredQuickAgents = activeFilter === 'All'
    ? quickAgents
    : quickAgents.filter(a => a.module === activeFilter)

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

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-accent/50')
  }

  const handleDragLeave = (e: DragEvent) => {
    e.currentTarget.classList.remove('border-accent/50')
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-accent/50')
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file.name)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file.name)
  }

  const triggerFileInput = () => fileInputRef.current?.click()

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

      {/* Agent Grid - Updates based on filter */}
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">
          Agent Modules {activeFilter !== 'All' && <span className="text-accent">- {activeFilter}</span>}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredModules.map((m) => (
            <div 
              key={m.module} 
              className={clsx(
                'text-center p-4 rounded-xl transition-colors cursor-pointer',
                activeFilter === m.module 
                  ? 'bg-accent/20 border-2 border-accent' 
                  : 'bg-white/5 hover:bg-white/10'
              )}
              onClick={() => openModal('activity', m.module)}
            >
              <m.icon size={24} className="mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-white">{m.count}</p>
              <p className="text-sm text-muted">{m.module}</p>
              {activeFilter !== 'All' && (
                <p className="text-xs text-accent mt-1">{m.agents.length} agents</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agent Actions - Updates based on filter */}
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Quick Agent Actions</h3>
        {filteredQuickAgents.length === 0 ? (
          <p className="text-muted text-center py-8">No agents in this category</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredQuickAgents.map((agent) => (
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
        )}
      </div>

      {/* Upload Agent Config */}
      <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-display font-semibold text-white mb-4">Upload Agent Configuration</h3>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".json,.yaml,.yml"
        />
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
        >
          <Upload size={40} className="text-muted mx-auto mb-4" />
          <p className="text-white mb-2">
            {uploadedFile ? `Selected: ${uploadedFile}` : 'Drag and drop agent config file here'}
          </p>
          <p className="text-sm text-muted">JSON or YAML files supported</p>
          {uploadedFile && (
            <button 
              onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }}
              className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
            >
              Clear
            </button>
          )}
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
                    <select className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none appearance-none cursor-pointer">
                      <option value="claude" className="bg-surface">Claude 3.5 Sonnet</option>
                      <option value="gpt4" className="bg-surface">GPT-4</option>
                      <option value="gemini" className="bg-surface">Gemini Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Max Concurrent Tasks</label>
                    <input type="number" defaultValue={5} className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Priority Level</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none appearance-none cursor-pointer">
                      <option value="low" className="bg-surface">Low</option>
                      <option value="normal" className="bg-surface">Normal</option>
                      <option value="high" className="bg-surface">High</option>
                      <option value="critical" className="bg-surface">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Auto-retry on failure</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none appearance-none cursor-pointer">
                      <option value="3" className="bg-surface">3 times</option>
                      <option value="5" className="bg-surface">5 times</option>
                      <option value="0" className="bg-surface">Disabled</option>
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
                  <div className="mt-4 text-left">
                    <p className="text-sm text-muted mb-2">Agents in this module:</p>
                    {agentModules.find(m => m.module === selectedAgent)?.agents.map((agent, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg mb-2">
                        <span className="text-white text-sm">{agent}</span>
                        <button 
                          onClick={() => toggleAgent(agent)}
                          className={clsx(
                            'px-3 py-1 rounded-lg text-xs',
                            runningAgents.includes(agent) 
                              ? 'bg-success/20 text-success' 
                              : 'bg-white/10 text-muted'
                          )}
                        >
                          {runningAgents.includes(agent) ? 'Stop' : 'Start'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
