import { create } from 'zustand'

export type Module = 'dashboard' | 'marketing' | 'sales' | 'rfq' | 'dispatch' | 'finance' | 'agents' | 'automation' | 'settings'

// Marketing Types
export interface Lead {
  id: string
  company: string
  score: number
  source: string
  status: 'hot' | 'warm' | 'cold'
  lastContact: string
}

export interface Campaign {
  id: string
  name: string
  status: 'active' | 'scheduled' | 'completed'
  sent: number
  opens: number
  clicks: number
  leads: number
}

// Sales Types
export interface Inquiry {
  id: string
  company: string
  value: string
  priority: 'high' | 'medium' | 'low'
  status: string
  created: string
}

// RFQ Types
export interface Vendor {
  id: string
  name: string
  rating: number
  avgPrice: string
  responseRate: number
  status?: string
}

export interface RFQ {
  id: string
  vendor: string
  status: string
  sentAt: string
  response?: string
}

// Dispatch Types
export interface Vehicle {
  id: string
  driver: string
  location: string
  eta: string
  status: 'in_transit' | 'delivered' | 'delayed' | 'idle'
  progress: number
}

// Finance Types
export interface Receivable {
  company: string
  amount: string
  due: string
  priority: 'high' | 'medium' | 'low'
  status: string
}

// HR Types
export interface Employee {
  id: string
  name: string
  role: string
  dept: string
  salary: string
  status: 'active' | 'on_leave'
}

export interface ComplianceItem {
  date: string
  item: string
  priority: 'high' | 'medium' | 'low'
  days: number
}

// Team Types
export interface TeamMember {
  id: string
  name: string
  role: string
  permissions: string
}

// Notification Preferences
export interface NotificationPref {
  label: string
  enabled: boolean
}

// Email Order Types
export interface EmailOrder {
  id: string
  subject: string
  from: string
  body: string
  timestamp: string
  status: 'pending' | 'imported' | 'processed'
}

export interface ImportedOrder {
  id: string
  customerEmail: string
  customerName: string
  items: { sku: string; name: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  source: 'email' | 'manual' | 'api'
}

interface AppState {
  // Navigation
  currentModule: Module
  sidebarOpen: boolean
  setModule: (module: Module) => void
  toggleSidebar: () => void
  
  // Modal state
  activeModal: string | null
  modalData: any
  openModal: (modal: string, data?: any) => void
  closeModal: () => void
  
  // Toast notifications
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  removeToast: (id: string) => void
  
  // Marketing
  leads: Lead[]
  campaigns: Campaign[]
  activeMarketingTab: 'campaigns' | 'leads' | 'sequences'
  addLead: (lead: Lead) => void
  addCampaign: (campaign: Campaign) => void
  setMarketingTab: (tab: 'campaigns' | 'leads' | 'sequences') => void
  
  // Sales
  inquiries: Inquiry[]
  addInquiry: (inquiry: Inquiry) => void
  
  // RFQ
  rfqs: RFQ[]
  vendors: Vendor[]
  activeRFQTab: 'rfqs' | 'vendors' | 'comparison'
  addRFQ: (rfq: RFQ) => void
  addVendor: (vendor: Vendor) => void
  setRFQTab: (tab: 'rfqs' | 'vendors' | 'comparison') => void
  sendVendorRFQ: (vendorId: string) => void
  
  // Dispatch
  vehicles: Vehicle[]
  addVehicle: (vehicle: Vehicle) => void
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void
  
  // Finance
  receivables: Receivable[]
  addReceivable: (receivable: Receivable) => void
  runCollections: () => void
  sendReminders: () => void
  
  // HR
  employees: Employee[]
  complianceItems: ComplianceItem[]
  addEmployee: (employee: Employee) => void
  addComplianceItem: (item: ComplianceItem) => void
  
  // Settings
  teamMembers: TeamMember[]
  notificationPrefs: NotificationPref[]
  addTeamMember: (member: TeamMember) => void
  toggleNotification: (index: number) => void
  
  // AI Agents
  activeAgentFilter: string
  setAgentFilter: (filter: string) => void
  
  // Automation - Email Orders
  emailOrders: EmailOrder[]
  importedOrders: ImportedOrder[]
  autoImportEnabled: boolean
  lastEmailSync: string | null
  addEmailOrder: (order: EmailOrder) => void
  importEmailOrder: (orderId: string) => void
  processOrder: (orderId: string) => void
  toggleAutoImport: () => void
  setLastEmailSync: (time: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentModule: 'dashboard',
  sidebarOpen: true,
  setModule: (module) => set({ currentModule: module }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Modal state
  activeModal: null,
  modalData: null,
  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  
  // Toasts
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Date.now().toString()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => get().removeToast(id), 3000)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  
  // Marketing
  leads: [],
  campaigns: [],
  activeMarketingTab: 'campaigns',
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  addCampaign: (campaign) => set((state) => ({ campaigns: [...state.campaigns, campaign] })),
  setMarketingTab: (tab) => set({ activeMarketingTab: tab }),
  
  // Sales
  inquiries: [],
  addInquiry: (inquiry) => set((state) => ({ inquiries: [...state.inquiries, inquiry] })),
  
  // RFQ
  rfqs: [],
  vendors: [],
  activeRFQTab: 'rfqs',
  addRFQ: (rfq) => set((state) => ({ rfqs: [...state.rfqs, rfq] })),
  addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
  setRFQTab: (tab) => set({ activeRFQTab: tab }),
  sendVendorRFQ: (vendorId) => {
    const { vendors, addToast } = get()
    const vendor = vendors.find(v => v.id === vendorId)
    if (vendor) {
      const rfq: RFQ = {
        id: `RFQ-${Date.now()}`,
        vendor: vendor.name,
        status: 'sent',
        sentAt: 'Just now',
        response: undefined
      }
      set((state) => ({ rfqs: [...state.rfqs, rfq] }))
      addToast(`RFQ sent to ${vendor.name}`, 'success')
    }
  },
  
  // Dispatch
  vehicles: [],
  addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
  updateVehicle: (id, updates) => set((state) => ({ 
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v) 
  })),
  
  // Finance
  receivables: [],
  addReceivable: (receivable) => set((state) => ({ receivables: [...state.receivables, receivable] })),
  runCollections: () => {
    const { addToast } = get()
    addToast('AI Collections started processing...', 'info')
  },
  sendReminders: () => {
    const { receivables, addToast } = get()
    const count = receivables.length
    addToast(`Payment reminders sent to ${count} clients`, 'success')
  },
  
  // HR
  employees: [],
  complianceItems: [],
  addEmployee: (employee) => set((state) => ({ employees: [...state.employees, employee] })),
  addComplianceItem: (item) => set((state) => ({ complianceItems: [...state.complianceItems, item] })),
  
  // Settings
  teamMembers: [],
  notificationPrefs: [
    { label: 'Email notifications for new leads', enabled: false },
    { label: 'WhatsApp alerts for dispatch updates', enabled: false },
    { label: 'Payment reminder notifications', enabled: false },
    { label: 'Daily AI activity summary', enabled: false },
  ],
  addTeamMember: (member) => set((state) => ({ teamMembers: [...state.teamMembers, member] })),
  toggleNotification: (index) => set((state) => ({
    notificationPrefs: state.notificationPrefs.map((pref, i) => 
      i === index ? { ...pref, enabled: !pref.enabled } : pref
    )
  })),
  
  // AI Agents
  activeAgentFilter: 'All',
  setAgentFilter: (filter) => set({ activeAgentFilter: filter }),
  
  // Automation - Email Orders
  emailOrders: [],
  importedOrders: [],
  autoImportEnabled: true,
  lastEmailSync: null,
  addEmailOrder: (order) => set((state) => ({ emailOrders: [...state.emailOrders, order] })),
  importEmailOrder: (orderId) => {
    const { emailOrders, importedOrders, addToast } = get()
    const order = emailOrders.find(o => o.id === orderId)
    if (order) {
      const imported: ImportedOrder = {
        id: `ORD-${Date.now()}`,
        customerEmail: order.from,
        customerName: order.from.split('@')[0].replace(/[._]/g, ' '),
        items: [],
        total: 0,
        status: 'pending',
        createdAt: order.timestamp,
        source: 'email'
      }
      set({
        emailOrders: emailOrders.filter(o => o.id !== orderId),
        importedOrders: [imported, ...importedOrders]
      })
      addToast('Order imported successfully', 'success')
    }
  },
  processOrder: (orderId) => {
    set((state) => ({
      importedOrders: state.importedOrders.map(o => 
        o.id === orderId ? { ...o, status: 'processing' } : o
      )
    }))
    setTimeout(() => {
      set((state) => ({
        importedOrders: state.importedOrders.map(o => 
          o.id === orderId ? { ...o, status: 'completed' } : o
        )
      }))
    }, 2000)
  },
  toggleAutoImport: () => set((state) => ({ autoImportEnabled: !state.autoImportEnabled })),
  setLastEmailSync: (time) => set({ lastEmailSync: time }),
}))
