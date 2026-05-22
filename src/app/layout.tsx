import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-ERP Platform v3.0 | Single-Company Edition',
  description: 'AI-Native ERP + CRM + Dispatch + Collections Automation',
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%230a0a0f' width='100' height='100' rx='20'/><path d='M50 20 L70 50 L50 80 L30 50 Z' fill='%2300d4aa'/><circle cx='50' cy='50' r='10' fill='%230a0a0f'/></svg>",
        type: "image/svg+xml",
      },
    ],
  },
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
