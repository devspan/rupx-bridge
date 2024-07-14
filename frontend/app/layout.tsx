import Layout from '@/components/Layout'
import { Web3ContextProvider } from '@/contexts/Web3Context'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Web3ContextProvider>
          <Layout>{children}</Layout>
        </Web3ContextProvider>
      </body>
    </html>
  )
}