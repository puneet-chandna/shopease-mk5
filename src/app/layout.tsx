import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ShopEase',
  description: 'Your one-stop shop for all your needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-3xl font-bold text-gray-900">ShopEase</Link>
              <div className="flex space-x-4">
                <Link href="/products" className="text-gray-500 hover:text-gray-900">Products</Link>
                <Link href="/cart" className="text-gray-500 hover:text-gray-900">Cart</Link>
              </div>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}