'use client'
import { useAppStore } from '@/store/appStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toast } from '@/components/common/Toast'
import { FloatingWidget } from '@/components/common/FloatingWidget'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Marketing } from '@/components/marketing/Marketing'
import { Sales } from '@/components/sales/Sales'
import { RFQ } from '@/components/rfq/RFQ'
import { Dispatch } from '@/components/dispatch/Dispatch'
import { Finance } from '@/components/finance/Finance'
import { Agents } from '@/components/agents/Agents'
import { Settings } from '@/components/settings/Settings'
import { EmailIntegration } from '@/components/automation/EmailIntegration'

export default function Home() {
  const { currentModule, sidebarOpen } = useAppStore()

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard': return <Dashboard />
      case 'marketing': return <Marketing />
      case 'sales': return <Sales />
      case 'rfq': return <RFQ />
      case 'dispatch': return <Dispatch />
      case 'finance': return <Finance />
      case 'automation': return <EmailIntegration />
      case 'agents': return <Agents />
      case 'settings': return <Settings />
      default: return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderModule()}
      </main>
      <Toast />
      <FloatingWidget />
    </div>
  )
}
