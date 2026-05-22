'use client'
import { useState } from 'react'
import { FileText, Upload, Send, CheckCircle, Clock, Zap, X, Plus } from 'lucide-react'
import { clsx } from 'clsx'

type ModalType = 'upload' | 'match' | 'create' | null

export function RFQ() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'vendors' | 'comparison'>('rfqs')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [vendorName, setVendorName] = useState('')

  const openModal = (type: ModalType) => setActiveModal(type)
  const closeModal = () => setActiveModal(null)

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">RFQ & Quotation</h1>
          <p className="text-muted text-sm md:text-base">AI-powered vendor matching, OCR extraction & quote generation</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <button 
            onClick={() => openModal('upload')}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            <Upload size={18} />
            <span>Upload PO</span>
          </button>
          <button 
            onClick={() => openModal('match')}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl bg-gradient-to-r from-accent to-cyan-400 text-primary font-semibold text-sm md:text-base"
          >
            <Zap size={18} />
            AI Match Vendors
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Active RFQs', value: '0', icon: FileText },
          { label: 'Pending Response', value: '0', icon: Clock, color: 'warning' },
          { label: 'Quotations Sent', value: '0', icon: Send, color: 'accent' },
          { label: 'Avg Response Time', value: '--', icon: CheckCircle, color: 'success' },
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
        {(['rfqs', 'vendors', 'comparison'] as const).map((tab) => (
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
      <div className="glass rounded-xl md:rounded-2xl p-6 md:p-12 flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
        <FileText size={40} className="text-muted mb-4 md:block hidden" />
        <h3 className="text-lg md:text-xl font-display font-semibold text-white mb-2">No {activeTab} yet</h3>
        <p className="text-muted text-center mb-6 text-sm md:text-base">
          {activeTab === 'rfqs' && 'Upload a Purchase Order to start processing RFQs'}
          {activeTab === 'vendors' && 'Add vendors to your database for AI-powered matching'}
          {activeTab === 'comparison' && 'RFQ responses will appear here for AI-powered comparison'}
        </p>
        <button 
          onClick={() => openModal('upload')}
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
                {activeModal === 'upload' && 'Upload Purchase Order'}
                {activeModal === 'match' && 'AI Match Vendors'}
                {activeModal === 'create' && 'Create RFQ'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              {activeModal === 'upload' && (
                <>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                    <Upload size={40} className="text-muted mx-auto mb-4" />
                    <p className="text-white mb-2">Drag and drop PO file here</p>
                    <p className="text-sm text-muted">PDF, DOC, or Image formats supported</p>
                  </div>
                  <button 
                    onClick={closeModal} 
                    className="w-full py-3 rounded-xl bg-accent text-primary font-semibold"
                  >
                    Process PO
                  </button>
                </>
              )}
              {activeModal === 'match' && (
                <>
                  <p className="text-muted mb-4">AI will analyze your requirements and match with suitable vendors from your database.</p>
                  <div>
                    <label className="text-sm text-muted mb-1 block">RFQ Description</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none resize-none" 
                      rows={4}
                      placeholder="Describe your requirements..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Budget Range</label>
                    <div className="flex gap-2">
                      <input type="number" className="w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" placeholder="Min" />
                      <input type="number" className="w-1/2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" placeholder="Max" />
                    </div>
                  </div>
                  <button 
                    onClick={closeModal} 
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-cyan-400 text-primary font-semibold"
                  >
                    Find Vendors
                  </button>
                </>
              )}
              {activeModal === 'create' && (
                <>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Vendor Name</label>
                    <input 
                      type="text" 
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none" 
                      placeholder="Enter vendor name" 
                    />
                  </div>
                  <button 
                    onClick={closeModal} 
                    className="w-full py-3 rounded-xl bg-accent text-primary font-semibold"
                  >
                    Create RFQ
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
