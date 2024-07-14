import { Web3ContextProvider } from '../contexts/Web3Context'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Web3ContextProvider>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </Web3ContextProvider>
      </body>
    </html>
  )
}