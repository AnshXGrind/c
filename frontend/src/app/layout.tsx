import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Talentra - AI-Powered Career Growth Platform',
  description: 'Transform your career with AI-powered resume analysis, skills gap identification, personalized learning roadmaps, and expert career guidance.',
  keywords: ['resume', 'career', 'AI', 'job search', 'ATS', 'career assistant', 'skills gap', 'career roadmap', 'talentra'],
  authors: [{ name: 'Talentra' }],
  openGraph: {
    title: 'Talentra - AI-Powered Career Growth Platform',
    description: 'Transform your career with AI-powered resume analysis, skills gap identification, personalized learning roadmaps, and expert career guidance.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
