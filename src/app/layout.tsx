import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-ERP Platform v3.0 | Single-Company Edition',
  description: 'AI-Native ERP + CRM + Dispatch + Collections Automation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased gradient-mesh min-h-screen">
        {children}
      </body>
    </html>
  )
}
