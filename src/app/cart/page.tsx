'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface CartItem {
  _id: string
  productId: string
  quantity: number
  product: {
    _id: string
    title: string
    price: number
    image: string
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setCartItems(data)
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error('Invalid cart data')
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setError('Failed to load cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to remove item from cart')
      }
      await fetchCart()
    } catch (error) {
      console.error('Error removing item from cart:', error)
      setError('Failed to remove item. Please try again.')
    }
  }

  const placeOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: cartItems }),
      })

      if (response.ok) {
        alert('Order placed successfully!')
        setCartItems([])
        router.push('/products')
      } else {
        throw new Error('Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      setError('Failed to place order. Please try again.')
    }
  }

  const total = cartItems.reduce((sum, item) => {
    const price = typeof item.product?.price === 'number' ? item.product.price : 0
    return sum + price * item.quantity
  }, 0)

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading cart...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl mb-4">Your cart is empty.</p>
          <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <Image src={item.product?.image || '/placeholder.svg'} alt={item.product?.title || 'Product'} width={80} height={80} className="mr-4" />
                <div>
                  <h2 className="text-lg font-semibold">{item.product?.title || 'Unknown Product'}</h2>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ${typeof item.product?.price === 'number' ? item.product.price.toFixed(2) : 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-8">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <button
              onClick={placeOrder}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  )
}