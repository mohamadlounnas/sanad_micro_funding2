import type { Metadata } from 'next'
import { Alexandria } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const alexandria = Alexandria({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Sanad - Micro-Investment Platform',
  description: 'Connecting investors with small business dreams in Algeria',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={alexandria.className}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
} 