'use client'
import { useState, useRef, DragEvent } from 'react'
import { FileText, Upload, Send, CheckCircle, Clock, Zap, X, Plus, File, MapPin, Phone, Truck, Building, GitCompare, RefreshCw } from 'lucide-react'
import { clsx } from 'clsx'

type ModalType = 'upload' | 'match' | 'create' | 'vendor' | 'comparison' | null

// Vendor types
interface Vendor {
  id: string
  name: string
  location: string
  loadingLocation: string
  contact: string
  phone: string
  materials: string[]
  rating: number
  priceRange: string
  responseTime: string
  status: 'active' | 'inactive'
}

// Transporter types
interface Transporter {
  id: string
  name: string
  vehicleType: string
  capacity: string
  currentLocation: string
  route: string
  available: boolean
  phone: string
}

// Comparison types
interface VendorComparison {
  vendorId: string
  price: number
  deliveryTime: string
  rating: number
  materialsMatch: boolean
}

// Mock vendors
const mockVendors: Vendor[] = [
  {
    id: 'V001',
    name: 'Sharma Industrial Supply',
    location: 'Mumbai, Maharashtra',
    loadingLocation: 'Warehouse 12, Thane Industrial Area',
    contact: 'Rajesh Sharma',
    phone: '+91 9876543210',
    materials: ['Steel Pipes', 'Industrial Motors', 'Bearings'],
    rating: 4.5,
    priceRange: '₹50,000 - ₹5,00,000',
    responseTime: '2 hours',
    status: 'active'
  },
  {
    id: 'V002',
    name: 'Patel Traders',
    location: 'Pune, Maharashtra',
    loadingLocation: 'Plot 45, Pimpri Industrial Estate',
    contact: 'Amit Patel',
    phone: '+91 8765432109',
    materials: ['CNC Parts', 'Safety Equipment', 'Tools'],
    rating: 4.2,
    priceRange: '₹20,000 - ₹2,00,000',
    responseTime: '4 hours',
    status: 'active'
  },
  {
    id: 'V003',
    name: 'Gupta Enterprises',
    location: 'Bangalore, Karnataka',
    loadingLocation: 'Unit 7, Peenya Industrial Area',
    contact: 'Suresh Gupta',
    phone: '+91 9988776655',
    materials: ['Electronics', 'Motors', 'Sensors'],
    rating: 4.8,
    priceRange: '₹1,00,000 - ₹10,00,000',
    responseTime: '1 hour',
    status: 'active'
  },
  {
    id: 'V004',
    name: 'Delhi Wholesale Co.',
    location: 'Delhi NCR',
    loadingLocation: 'Factory 15, Gurugram Industrial Zone',
    contact: 'Vikram Singh',
    phone: '+91 9123456789',
    materials: ['Steel Pipes', 'Heavy Machinery', 'Industrial Tools'],
    rating: 4.0,
    priceRange: '₹75,000 - ₹7,50,000',
    responseTime: '6 hours',
    status: 'active'
  }
]

// Mock transporters
const mockTransporters: Transporter[] = [
  { id: 'T001', name: 'Fast Move Logistics', vehicleType: 'Truck', capacity: '10 tons', currentLocation: 'Mumbai', route: 'Mumbai-Pune', available: true, phone: '+91 9000011111' },
  { id: 'T002', name: 'Quick Transport', vehicleType: 'Container', capacity: '20 tons', currentLocation: 'Pune', route: 'Pune-Bangalore', available: true, phone: '+91 9000022222' },
  { id: 'T003', name: 'Express Cargo', vehicleType: 'Truck', capacity: '15 tons', currentLocation: 'Bangalore', route: 'Bangalore-Hyderabad', available: false, phone: '+91 9000033333' },
  { id: 'T004', name: 'Raj Transport', vehicleType: 'Tempo', capacity: '5 tons', currentLocation: 'Delhi', route: 'Delhi-Jaipur', available: true, phone: '+91 9000044444' },
  { id: 'T005', name: 'Shree Transport', vehicleType: 'Container', capacity: '25 tons', currentLocation: 'Mumbai', route: 'Mumbai-Ahmedabad', available: true, phone: '+91 9000055555' },
]

// Order types
interface OrderItem {
  material: string
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  status: string
  createdAt: string
}

export function RFQ() {
  const [activeTab, setActiveTab] = useState<'rfqs' | 'vendors' | 'comparison'>('rfqs')
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [vendorName, setVendorName] = useState('')
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [vendors] = useState<Vendor[]>(mockVendors)
  const [transporters] = useState<Transporter[]>(mockTransporters)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [rfqs, setRfqs] = useState<{id: string; vendor: string; status: string; items: string[]}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openModal = (type: ModalType, vendor?: Vendor) => {
    setActiveModal(type)
    if (vendor) setSelectedVendor(vendor)
  }
  const closeModal = () => {
    setActiveModal(null)
    setSelectedVendor(null)
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

  // Generate comparison
  const generateComparison = () => {
    const mockOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [
        { material: 'Steel Pipes', quantity: 100 },
        { material: 'Industrial Motors', quantity: 50 }
      ],
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    setSelectedOrder(mockOrder)
    setActiveModal('comparison')
  }

  // Match vendors to order
  const matchVendors = (order: Order) => {
    const matchedRfqs = vendors
      .filter(v => v.materials.some(m => 
        order.items.some(item => item.material.toLowerCase().includes(m.toLowerCase()))
      ))
      .map(v => ({
        id: `RFQ-${Date.now()}-${v.id}`,
        vendor: v.name,
        status: 'matched',
        items: v.materials
      }))
    setRfqs(matchedRfqs)
    setActiveTab('rfqs')
    closeModal()
  }

  // Calculate comparison scores
  const getComparisonData = (order: Order) => {
    return vendors
      .filter(v => v.materials.some(m => 
        order.items.some(item => item.material.toLowerCase().includes(m.toLowerCase()))
      ))
      .map(v => {
        const matchedItems = order.items.filter(item => 
          v.materials.some(m => m.toLowerCase().includes(item.material.toLowerCase()))
        ).length
        
        return {
          vendor: v,
          matchedItems: matchedItems,
          matchPercentage: Math.round((matchedItems / order.items.length) * 100),
          priceScore: Math.round(v.rating * 20),
          deliveryScore: v.responseTime.includes('1 hour') ? 100 : v.responseTime.includes('2 hour') ? 80 : 60,
          totalScore: Math.round((v.rating * 25) + (matchedItems * 15) + (v.responseTime.includes('1 hour') ? 30 : v.responseTime.includes('2 hour') ? 20 : 10))
        }
      })
      .sort((a, b) => b.totalScore - a.totalScore)
  }

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
          { label: 'Active RFQs', value: rfqs.length.toString(), icon: FileText },
          { label: 'Connected Vendors', value: vendors.length.toString(), icon: Building, color: 'accent' },
          { label: 'Transporters', value: transporters.filter(t => t.available).length + '/' + transporters.length, icon: Truck, color: 'highlight' },
          { label: 'Comparisons', value: '0', icon: GitCompare },
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

      {/* RFQs Tab */}
      {activeTab === 'rfqs' && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Active RFQs ({rfqs.length})</h3>
            <button 
              onClick={() => openModal('match')}
              className="px-4 py-2 rounded-lg bg-accent text-primary text-sm"
            >
              New RFQ
            </button>
          </div>
          {rfqs.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={40} className="text-muted mx-auto mb-4" />
              <p className="text-muted">No active RFQs</p>
              <button 
                onClick={() => openModal('match')}
                className="mt-4 px-6 py-2 rounded-xl bg-accent text-primary"
              >
                Create RFQ
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {rfqs.map((rfq) => (
                <div key={rfq.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{rfq.id}</p>
                    <p className="text-muted text-sm">{rfq.vendor}</p>
                    <p className="text-muted text-xs mt-1">Status: {rfq.status}</p>
                  </div>
                  <button 
                    onClick={() => generateComparison()}
                    className="px-3 py-1 rounded-lg bg-white/10 text-sm"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="glass rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{vendor.name}</h3>
                  <p className="text-muted text-sm flex items-center gap-1 mt-1">
                    <Building size={14} /> {vendor.id}
                  </p>
                </div>
                <span className={clsx(
                  'px-2 py-1 rounded-full text-xs',
                  vendor.status === 'active' ? 'bg-success/20 text-success' : 'bg-muted/20 text-muted'
                )}>
                  {vendor.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-accent mt-1" />
                  <div>
                    <p className="text-muted text-xs">Location</p>
                    <p className="text-white text-sm">{vendor.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-warning mt-1" />
                  <div>
                    <p className="text-muted text-xs">Loading Point</p>
                    <p className="text-white text-sm">{vendor.loadingLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-green-400 mt-1" />
                  <div>
                    <p className="text-muted text-xs">Contact</p>
                    <p className="text-white text-sm">{vendor.contact}</p>
                    <p className="text-accent text-xs">{vendor.phone}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-muted text-xs mb-2">Materials Supplied:</p>
                <div className="flex flex-wrap gap-2">
                  {vendor.materials.map((mat, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-accent/20 text-accent text-xs">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white/5 rounded-xl">
                <div className="text-center">
                  <p className="text-accent text-lg font-bold">{vendor.rating}⭐</p>
                  <p className="text-muted text-xs">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-sm font-bold">{vendor.responseTime}</p>
                  <p className="text-muted text-xs">Response</p>
                </div>
                <div className="text-center">
                  <p className="text-highlight text-sm font-bold">{vendor.priceRange}</p>
                  <p className="text-muted text-xs">Price Range</p>
                </div>
              </div>

              <button 
                onClick={() => openModal('vendor', vendor)}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="glass rounded-xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              <GitCompare size={18} className="text-accent" />
              Vendor Comparison
            </h3>
            <button 
              onClick={generateComparison}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent text-primary text-xs md:text-sm"
            >
              <RefreshCw size={14} />
              Generate New
            </button>
          </div>
          
          {/* Mobile Card View - Shows on small screens */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {vendors.map((vendor) => {
              const match = Math.round((vendor.materials.length / 3) * 100)
              return (
                <div key={vendor.id} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium text-sm">{vendor.name}</p>
                      <p className="text-muted text-xs">{vendor.location}</p>
                    </div>
                    <span className="text-accent text-sm">{vendor.rating}⭐</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Match:</span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-xs',
                        match >= 75 ? 'bg-success/20 text-success' : match >= 50 ? 'bg-warning/20 text-warning' : 'bg-muted/20 text-muted'
                      )}>
                        {match}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Price:</span>
                      <span className="text-white">{vendor.priceRange}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Delivery:</span>
                      <span className="text-white">{vendor.responseTime}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-muted">Score:</span>
                      <span className="text-accent font-bold text-base">{Math.round(vendor.rating * 20)}</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 px-3 py-2 rounded-lg bg-accent text-primary text-xs font-medium">
                    Select Vendor
                  </button>
                </div>
              )
            })}
          </div>
          
          {/* Desktop Table View - Hidden on small screens */}
          <div className="hidden md:block overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 text-muted text-xs">Vendor</th>
                  <th className="text-center p-3 text-muted text-xs">Location</th>
                  <th className="text-center p-3 text-muted text-xs">Rating</th>
                  <th className="text-center p-3 text-muted text-xs">Match %</th>
                  <th className="text-center p-3 text-muted text-xs">Price</th>
                  <th className="text-center p-3 text-muted text-xs">Delivery</th>
                  <th className="text-center p-3 text-muted text-xs">Score</th>
                  <th className="text-center p-3 text-muted text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => {
                  const match = Math.round((vendor.materials.length / 3) * 100)
                  return (
                    <tr key={vendor.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-3">
                        <p className="text-white font-medium text-xs">{vendor.name}</p>
                        <p className="text-muted text-xs">{vendor.contact}</p>
                      </td>
                      <td className="p-3 text-center text-xs text-muted">{vendor.location}</td>
                      <td className="p-3 text-center text-xs text-accent">{vendor.rating}⭐</td>
                      <td className="p-3 text-center">
                        <span className={clsx(
                          'px-2 py-1 rounded-full text-xs',
                          match >= 75 ? 'bg-success/20 text-success' : match >= 50 ? 'bg-warning/20 text-warning' : 'bg-muted/20 text-muted'
                        )}>
                          {match}%
                        </span>
                      </td>
                      <td className="p-3 text-center text-xs text-white">{vendor.priceRange}</td>
                      <td className="p-3 text-center text-xs text-muted">{vendor.responseTime}</td>
                      <td className="p-3 text-center">
                        <span className="text-lg font-bold text-accent">{Math.round(vendor.rating * 20)}</span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="px-3 py-1 rounded-lg bg-accent text-primary text-xs">
                          Select
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transporters Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Truck size={20} className="text-accent" />
          Available Transporters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {transporters.map((transporter) => (
            <div key={transporter.id} className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium text-sm">{transporter.name}</p>
                <span className={clsx(
                  'w-2 h-2 rounded-full',
                  transporter.available ? 'bg-success' : 'bg-muted'
                )} />
              </div>
              <p className="text-muted text-xs mb-2">{transporter.vehicleType} • {transporter.capacity}</p>
              <div className="space-y-1">
                <p className="text-xs text-muted">From: {transporter.currentLocation}</p>
                <p className="text-xs text-muted">Route: {transporter.route}</p>
                <p className="text-xs text-accent">{transporter.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-white">
                {activeModal === 'upload' && 'Upload Purchase Order'}
                {activeModal === 'match' && 'AI Match Vendors'}
                {activeModal === 'vendor' && `Vendor: ${selectedVendor?.name}`}
                {activeModal === 'comparison' && 'Generate Comparison'}
                {activeModal === 'create' && 'Create RFQ'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} className="text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              {activeModal === 'upload' && (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <Upload size={40} className="text-muted mx-auto mb-4" />
                    <p className="text-white mb-2">
                      {uploadedFile ? `Selected: ${uploadedFile}` : 'Drag and drop PO file here'}
                    </p>
                    <p className="text-sm text-muted">PDF, DOC, or Image formats supported</p>
                    {uploadedFile && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-accent">
                        <File size={16} />
                        <span className="text-sm">{uploadedFile}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => { matchVendors({ id: `ORD-${Date.now()}`, items: [{ material: 'Steel Pipes', quantity: 100 }], status: 'pending', createdAt: new Date().toISOString() }) }}
                    className="w-full py-3 rounded-xl bg-accent text-primary font-semibold"
                    disabled={!uploadedFile}
                  >
                    Process PO
                  </button>
                </>
              )}
              
              {activeModal === 'match' && (
                <>
                  <p className="text-muted">AI will match your requirements with suitable vendors from our network.</p>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Required Materials</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none resize-none" 
                      rows={3}
                      placeholder="e.g., Steel Pipes, Industrial Motors, Bearings"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted mb-1 block">Quantity</label>
                      <input type="number" className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" placeholder="100" />
                    </div>
                    <div>
                      <label className="text-sm text-muted mb-1 block">Budget Range</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none" placeholder="₹50,000 - ₹5,00,000" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">Priority</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-white focus:border-accent outline-none appearance-none cursor-pointer">
                      <option value="low" className="bg-surface">Low</option>
                      <option value="normal" className="bg-surface">Normal</option>
                      <option value="high" className="bg-surface">High</option>
                      <option value="urgent" className="bg-surface">Urgent</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => { matchVendors({ id: `ORD-${Date.now()}`, items: [{ material: 'Steel Pipes', quantity: 100 }], status: 'pending', createdAt: new Date().toISOString() }); closeModal() }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-cyan-400 text-primary font-semibold"
                  >
                    Find Vendors
                  </button>
                </>
              )}

              {activeModal === 'vendor' && selectedVendor && (
                <>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-accent" />
                        <span className="text-muted text-sm">Location</span>
                      </div>
                      <p className="text-white">{selectedVendor.location}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Building size={16} className="text-warning" />
                        <span className="text-muted text-sm">Loading Point</span>
                      </div>
                      <p className="text-white">{selectedVendor.loadingLocation}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Phone size={16} className="text-green-400" />
                        <span className="text-muted text-sm">Contact Details</span>
                      </div>
                      <p className="text-white">{selectedVendor.contact}</p>
                      <p className="text-accent">{selectedVendor.phone}</p>
                    </div>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="w-full py-3 rounded-xl bg-accent text-primary font-semibold"
                  >
                    Create RFQ for Vendor
                  </button>
                </>
              )}

              {activeModal === 'comparison' && (
                <>
                  <div className="space-y-4">
                    {vendors.map((vendor) => (
                      <div key={vendor.id} className="p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">{vendor.name}</p>
                          <span className="text-accent">{vendor.rating}⭐</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted text-xs">Location</p>
                            <p className="text-white text-sm">{vendor.location}</p>
                          </div>
                          <div>
                            <p className="text-muted text-xs">Loading</p>
                            <p className="text-white text-sm">{vendor.loadingLocation}</p>
                          </div>
                          <div>
                            <p className="text-muted text-xs">Contact</p>
                            <p className="text-white text-sm">{vendor.phone}</p>
                          </div>
                          <div>
                            <p className="text-muted text-xs">Response</p>
                            <p className="text-white text-sm">{vendor.responseTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
