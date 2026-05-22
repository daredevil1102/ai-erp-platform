'use client'
import { useState, useEffect, useCallback } from 'react'
import { Mail, Package, ArrowRight, RefreshCw, CheckCircle, XCircle, AlertCircle, MessageSquare, Send, User, Phone, Zap } from 'lucide-react'
import { clsx } from 'clsx'

// Types
interface Order {
  id: string
  customerEmail: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'rfq_sent' | 'vendor_matched' | 'dispatch' | 'invoiced' | 'completed' | 'failed'
  createdAt: string
  source: 'email' | 'manual' | 'api'
  rawData?: string
  whatsappHistory: WhatsAppMessage[]
}

interface OrderItem {
  sku: string
  name: string
  quantity: number
  price: number
}

interface EmailOrder {
  subject: string
  from: string
  body: string
  attachments: string[]
  timestamp: string
}

interface WhatsAppMessage {
  id: string
  stage: string
  message: string
  status: 'sent' | 'delivered' | 'failed'
  timestamp: string
}

interface WorkflowStage {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  notification: string
}

// Workflow stages with WhatsApp notifications
const workflowStages: WorkflowStage[] = [
  { id: 'email', name: 'Email Received', icon: <Mail size={14} />, color: 'from-blue-500 to-cyan-400', notification: '📧 Order #{id} received from {customer}' },
  { id: 'parse', name: 'Order Parsed', icon: <Package size={14} />, color: 'from-purple-500 to-pink-400', notification: '📦 Order #{id} parsed - {items} items, ₹{total}' },
  { id: 'rfq', name: 'RFQ Created', icon: <Send size={14} />, color: 'from-orange-500 to-yellow-400', notification: '📋 RFQ #{id} created for order - awaiting vendor quotes' },
  { id: 'vendor', name: 'Vendor Matched', icon: <User size={14} />, color: 'from-green-500 to-emerald-400', notification: '✅ Vendor matched for order #{id} - {vendor}' },
  { id: 'dispatch', name: 'Dispatched', icon: <Package size={14} />, color: 'from-teal-500 to-cyan-400', notification: '🚚 Order #{id} dispatched - tracking: {tracking}' },
  { id: 'invoice', name: 'Invoiced', icon: <CheckCircle size={14} />, color: 'from-accent to-cyan-400', notification: '💰 Invoice #{id} generated - ₹{amount} to collect' },
]

// Simulated email orders
const mockEmailOrders: EmailOrder[] = [
  {
    subject: 'New Order #ORD-2024-001 - ABC Corp',
    from: 'orders@abccorp.com',
    body: `Order Details:
Product: Industrial Motors Model-X500
Quantity: 10 units
Price: ₹50,000 per unit
Total: ₹5,00,000

Customer: ABC Corporation
Contact: rajesh.kumar@abccorp.com
Phone: +91 9876543210
`,
    attachments: ['order_2024_001.pdf'],
    timestamp: new Date().toISOString()
  },
  {
    subject: 'Purchase Order - DEF Industries',
    from: 'procurement@defindustries.in',
    body: `Items Required:
1. CNC Machine Parts - 50 units @ ₹5000
2. Safety Equipment - 100 sets @ ₹2000
Total Order Value: ₹4,50,000

Delivery Address: DEF Industries, Pune
Contact: +91 8765432109
`,
    attachments: [],
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
]

// Simulated vendors
const mockVendors = [
  { name: 'Sharma Industries', phone: '+91 9123456789' },
  { name: 'Patel Supplies', phone: '+91 9988776655' },
  { name: 'Gupta Enterprises', phone: '+91 9876543210' },
]

export function EmailIntegration() {
  const [emailOrders, setEmailOrders] = useState<EmailOrder[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [autoImport, setAutoImport] = useState(true)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [integrationStatus, setIntegrationStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [defaultPhone, setDefaultPhone] = useState('+91 9876543210')

  const fetchEmails = useCallback(async () => {
    setIntegrationStatus('syncing')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setEmailOrders(mockEmailOrders)
    setIntegrationStatus('connected')
    setLastSync(new Date().toISOString())
  }, [])

  useEffect(() => {
    fetchEmails()
    const interval = setInterval(fetchEmails, 30000)
    return () => clearInterval(interval)
  }, [fetchEmails])

  // Send WhatsApp notification
  const sendWhatsApp = async (orderId: string, stage: string, customMessage?: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order || !whatsappEnabled) return

    const stageInfo = workflowStages.find(s => s.id === stage)
    let message = customMessage || stageInfo?.notification || 'Update for order #{id}'
    
    // Replace placeholders
    message = message
      .replace('{id}', order.id)
      .replace('{customer}', order.customerName)
      .replace('{items}', order.items.length.toString())
      .replace('{total}', order.total.toLocaleString())
      .replace('{vendor}', mockVendors[0].name)
      .replace('{tracking}', `TRK${Date.now().toString().slice(-8)}`)
      .replace('{amount}', order.total.toLocaleString())

    const whatsappMsg: WhatsAppMessage = {
      id: `WA-${Date.now()}`,
      stage,
      message,
      status: 'sent',
      timestamp: new Date().toISOString()
    }

    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, whatsappHistory: [...o.whatsappHistory, whatsappMsg] }
        : o
    ))
  }

  const parseEmailToOrder = (email: EmailOrder): Order => {
    const phoneMatch = email.body.match(/\+91[\s\d]{10}/) || [defaultPhone]
    const customerName = email.from.split('@')[0].replace(/[._]/g, ' ').replace(/[0-9]/g, '')
    
    const items: OrderItem[] = []
    const qtyMatch = email.body.match(/quantity[:\s]*(\d+)/i)
    const priceMatch = email.body.match(/₹?([\d,]+)\s*(?:per|unit|each)?/i)
    const totalMatch = email.body.match(/total[:\s]*₹?([\d,]+)/i)
    
    if (qtyMatch && priceMatch) {
      items.push({
        sku: `SKU-${Date.now()}`,
        name: email.subject.split('-').pop()?.trim() || 'Product',
        quantity: parseInt(qtyMatch[1]),
        price: parseInt(priceMatch[1].replace(/,/g, ''))
      })
    }

    const total = totalMatch 
      ? parseInt(totalMatch[1].replace(/,/g, ''))
      : items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerEmail: email.from,
      customerName: customerName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      customerPhone: phoneMatch[0],
      items,
      total,
      status: 'pending',
      createdAt: email.timestamp,
      source: 'email',
      rawData: email.body,
      whatsappHistory: []
    }
  }

  const importEmailOrder = async (email: EmailOrder) => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const order = parseEmailToOrder(email)
      setOrders(prev => [order, ...prev])
      setEmailOrders(prev => prev.filter(e => e.subject !== email.subject))
      
      // Send initial WhatsApp notification
      await sendWhatsApp(order.id, 'email')
    } catch (error) {
      console.error('Failed to import order:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const importAllPending = async () => {
    setIsProcessing(true)
    for (const email of emailOrders) {
      await importEmailOrder(email)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    setIsProcessing(false)
  }

  // Process order through workflow with WhatsApp notifications
  const processOrder = async (orderId: string) => {
    const stages = ['parse', 'rfq', 'vendor', 'dispatch', 'invoice', 'completed']
    
    for (const stage of stages) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: stage as Order['status'] } : o
      ))
      
      await sendWhatsApp(orderId, stage)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  }

  // Manual send WhatsApp for specific stage
  const sendCustomWhatsApp = async (orderId: string, message: string) => {
    const whatsappMsg: WhatsAppMessage = {
      id: `WA-${Date.now()}`,
      stage: 'custom',
      message,
      status: 'sent',
      timestamp: new Date().toISOString()
    }

    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, whatsappHistory: [...o.whatsappHistory, whatsappMsg] }
        : o
    ))
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="text-warning" size={16} />
      case 'processing': return <RefreshCw className="text-accent animate-spin" size={16} />
      case 'rfq_sent': return <Send className="text-orange-400" size={16} />
      case 'vendor_matched': return <User className="text-green-400" size={16} />
      case 'dispatch': return <Package className="text-teal-400" size={16} />
      case 'invoiced': return <CheckCircle className="text-accent" size={16} />
      case 'completed': return <CheckCircle className="text-success" size={16} />
      case 'failed': return <XCircle className="text-red-500" size={16} />
      default: return <AlertCircle className="text-muted" size={16} />
    }
  }

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      rfq_sent: 'RFQ Sent',
      vendor_matched: 'Vendor Matched',
      dispatch: 'Dispatched',
      invoiced: 'Invoiced',
      completed: 'Completed',
      failed: 'Failed'
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Automation Hub</h2>
          <p className="text-muted text-sm md:text-base">Email → Orders → WhatsApp Updates → Workflow</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* WhatsApp Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
            <MessageSquare size={18} className={whatsappEnabled ? 'text-green-400' : 'text-muted'} />
            <span className="text-sm text-muted">WhatsApp:</span>
            <button 
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={clsx(
                'w-10 h-5 rounded-full transition-colors relative',
                whatsappEnabled ? 'bg-green-500' : 'bg-muted'
              )}
            >
              <div className={clsx(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                whatsappEnabled ? 'left-5' : 'left-0.5'
              )} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Auto-import:</span>
            <button 
              onClick={() => setAutoImport(!autoImport)}
              className={clsx(
                'w-12 h-6 rounded-full transition-colors relative',
                autoImport ? 'bg-accent' : 'bg-muted'
              )}
            >
              <div className={clsx(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                autoImport ? 'left-7' : 'left-1'
              )} />
            </button>
          </div>
          <button 
            onClick={fetchEmails}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={18} className={isProcessing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={clsx(
              'w-3 h-3 rounded-full',
              integrationStatus === 'connected' ? 'bg-success animate-pulse' : 
              integrationStatus === 'syncing' ? 'bg-warning animate-pulse' : 'bg-muted'
            )} />
            <span className="text-sm text-muted">
              {integrationStatus === 'connected' && 'Email + WhatsApp Connected'}
              {integrationStatus === 'syncing' && 'Syncing...'}
              {integrationStatus === 'disconnected' && 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5">
            <Phone size={14} className="text-green-400" />
            <span className="text-xs text-muted">Default: {defaultPhone}</span>
          </div>
        </div>
        {lastSync && (
          <span className="text-xs text-muted">
            Last sync: {new Date(lastSync).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Workflow Visualization */}
      <div className="glass rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-accent" />
          WhatsApp Workflow Stages
        </h3>
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
          {workflowStages.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r text-xs whitespace-nowrap',
                step.color
              )}>
                <span className="text-primary">{step.icon}</span>
                <span className="text-primary font-medium">{step.name}</span>
              </div>
              {i < workflowStages.length - 1 && <ArrowRight size={14} className="text-muted mx-1 md:mx-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Emails */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail size={20} className="text-accent" />
              Pending Emails ({emailOrders.length})
            </h3>
            {emailOrders.length > 0 && (
              <button 
                onClick={importAllPending}
                disabled={isProcessing}
                className="px-4 py-2 rounded-lg bg-accent text-primary text-sm font-medium"
              >
                Import All
              </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {emailOrders.length === 0 ? (
              <div className="text-center py-8">
                <Mail size={40} className="text-muted mx-auto mb-2" />
                <p className="text-muted">No pending emails</p>
              </div>
            ) : (
              emailOrders.map((email, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{email.subject}</p>
                      <p className="text-muted text-xs mt-1">{email.from}</p>
                      <p className="text-muted text-xs">{new Date(email.timestamp).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => importEmailOrder(email)}
                      disabled={isProcessing}
                      className="px-3 py-1 rounded-lg bg-accent text-primary text-xs font-medium whitespace-nowrap"
                    >
                      Import
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Orders with WhatsApp */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package size={20} className="text-success" />
              Orders ({orders.length})
            </h3>
          </div>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package size={40} className="text-muted mx-auto mb-2" />
                <p className="text-muted">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <p className="text-white font-medium text-sm">{order.id}</p>
                        <span className="px-2 py-0.5 rounded text-xs bg-accent/20 text-accent">{getStatusLabel(order.status)}</span>
                      </div>
                      <p className="text-muted text-xs mt-1">{order.customerName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone size={12} className="text-green-400" />
                        <span className="text-muted text-xs">{order.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-accent font-bold">₹{order.total.toLocaleString()}</span>
                        <span className="text-muted text-xs">• {order.items.length} items</span>
                        {order.whatsappHistory.length > 0 && (
                          <span className="flex items-center gap-1 text-green-400 text-xs">
                            <MessageSquare size={12} /> {order.whatsappHistory.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => processOrder(order.id)}
                          className="px-3 py-1 rounded-lg bg-gradient-to-r from-accent to-cyan-400 text-primary text-xs font-medium whitespace-nowrap"
                        >
                          Process
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1"
                      >
                        <MessageSquare size={12} />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                  
                  {/* WhatsApp History Dropdown */}
                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <h4 className="text-xs text-muted mb-2 flex items-center gap-1">
                        <MessageSquare size={12} /> WhatsApp History
                      </h4>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto">
                        {order.whatsappHistory.length === 0 ? (
                          <p className="text-xs text-muted italic">No messages sent yet</p>
                        ) : (
                          order.whatsappHistory.map((msg, i) => (
                            <div key={msg.id} className="p-2 bg-white/5 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-accent capitalize">{msg.stage}</span>
                                <span className="text-xs text-muted">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-sm text-white mt-1">{msg.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Custom message..."
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-accent"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              sendCustomWhatsApp(order.id, e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <button 
                          onClick={() => sendCustomWhatsApp(order.id, 'Custom message from team')}
                          className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm flex items-center gap-1"
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Integration Guide */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-green-400" />
          WhatsApp Notification Setup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-2">📧 Email → Order</h4>
            <p className="text-muted text-sm">Configure email webhook to receive order emails automatically</p>
            <code className="text-accent text-xs bg-white/5 px-2 py-1 rounded block mt-2">POST /api/email-webhook</code>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-2">🔄 Auto Workflow</h4>
            <p className="text-muted text-sm">Each stage triggers WhatsApp notification to customer and team</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-2">📱 WhatsApp Business</h4>
            <p className="text-muted text-sm">Connect WhatsApp Business API for automated message delivery</p>
          </div>
        </div>
      </div>
    </div>
  )
}