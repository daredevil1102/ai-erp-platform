'use client'
import { useState, useEffect, useCallback } from 'react'
import { Mail, Package, ArrowRight, RefreshCw, CheckCircle, XCircle, AlertCircle, Link, Zap } from 'lucide-react'
import { clsx } from 'clsx'

// Types
interface Order {
  id: string
  customerEmail: string
  customerName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  source: 'email' | 'manual' | 'api'
  rawData?: string
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

// Simulated email orders (in production, this would come from email webhook)
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
`,
    attachments: [],
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
]

export function EmailIntegration() {
  const [emailOrders, setEmailOrders] = useState<EmailOrder[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [autoImport, setAutoImport] = useState(true)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [integrationStatus, setIntegrationStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected')

  // Simulate fetching emails from webhook
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

  // Parse email content to extract order details
  const parseEmailToOrder = (email: EmailOrder): Order => {
    const body = email.body.toLowerCase()
    const customerName = email.from.split('@')[0].replace('.', ' ').replace(/[0-9]/g, '')
    
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
      items,
      total,
      status: 'pending',
      createdAt: email.timestamp,
      source: 'email',
      rawData: email.body
    }
  }

  const importEmailOrder = async (email: EmailOrder) => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const order = parseEmailToOrder(email)
      setOrders(prev => [order, ...prev])
      setEmailOrders(prev => prev.filter(e => e.subject !== email.subject))
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

  const processOrder = async (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'processing' } : o
    ))
    await new Promise(resolve => setTimeout(resolve, 2000))
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'completed' } : o
    ))
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="text-warning" size={16} />
      case 'processing': return <RefreshCw className="text-accent animate-spin" size={16} />
      case 'completed': return <CheckCircle className="text-success" size={16} />
      case 'failed': return <XCircle className="text-red-500" size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Email Order Import</h2>
          <p className="text-muted text-sm md:text-base">Automatically import orders from email receipts</p>
        </div>
        <div className="flex items-center gap-4">
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
            <span>Sync Emails</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-3 h-3 rounded-full',
            integrationStatus === 'connected' ? 'bg-success animate-pulse' : 
            integrationStatus === 'syncing' ? 'bg-warning animate-pulse' : 'bg-muted'
          )} />
          <span className="text-sm text-muted">
            {integrationStatus === 'connected' && 'Email inbox connected'}
            {integrationStatus === 'syncing' && 'Syncing...'}
            {integrationStatus === 'disconnected' && 'Disconnected'}
          </span>
        </div>
        {lastSync && (
          <span className="text-xs text-muted">
            Last sync: {new Date(lastSync).toLocaleTimeString()}
          </span>
        )}
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
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
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

        {/* Imported Orders */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package size={20} className="text-success" />
              Imported Orders ({orders.length})
            </h3>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package size={40} className="text-muted mx-auto mb-2" />
                <p className="text-muted">No orders imported yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <p className="text-white font-medium text-sm">{order.id}</p>
                      </div>
                      <p className="text-muted text-xs mt-1">{order.customerName}</p>
                      <p className="text-muted text-xs">{order.customerEmail}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-accent font-bold">₹{order.total.toLocaleString()}</span>
                        <span className="text-muted text-xs">• {order.items.length} items</span>
                      </div>
                    </div>
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => processOrder(order.id)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-accent to-cyan-400 text-primary text-xs font-medium whitespace-nowrap"
                      >
                        Process
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Automated Workflow</h3>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {[
            { step: 'Email', icon: Mail, color: 'from-blue-500 to-cyan-400' },
            { step: 'Parse', icon: Package, color: 'from-purple-500 to-pink-400' },
            { step: 'RFQ', icon: ArrowRight, color: 'from-orange-500 to-yellow-400' },
            { step: 'Vendors', icon: ArrowRight, color: 'from-red-500 to-orange-400' },
            { step: 'Dispatch', icon: ArrowRight, color: 'from-green-500 to-emerald-400' },
            { step: 'Invoice', icon: CheckCircle, color: 'from-accent to-cyan-400' },
          ].map((step, i) => (
            <div key={i} className="flex items-center">
              <div className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r text-xs',
                step.color
              )}>
                <step.icon size={14} className="text-primary" />
                <span className="text-primary font-medium whitespace-nowrap">{step.step}</span>
              </div>
              {i < 5 && <ArrowRight size={14} className="text-muted mx-1 md:mx-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-accent" />
          Email Integration Setup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-2">1. Configure Webhook</h4>
            <p className="text-muted text-sm mb-3">Set up email forwarding or webhook to:</p>
            <code className="text-accent text-xs bg-white/5 px-2 py-1 rounded block">POST /api/email-webhook</code>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-2">2. Email Format</h4>
            <p className="text-muted text-sm">Include order details in email body with quantity, price, and total</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-2">3. Auto-Processing</h4>
            <p className="text-muted text-sm">Orders automatically flow through RFQ → Vendors → Dispatch → Invoice</p>
          </div>
        </div>
      </div>
    </div>
  )
}