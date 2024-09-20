'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CartItem {
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
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const response = await fetch('/api/cart')
    const data = await response.json()
    setCartItems(data)
  }

  const removeFromCart = async (productId: string) => {
    await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' })
    fetchCart()
  }

  const placeOrder = async () => {
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
      alert('Failed to place order. Please try again.')
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <Image src={item.product.image} alt={item.product.title} width={80} height={80} className="mr-4" />
                <div>
                  <h2 className="text-lg font-semibold">{item.product.title}</h2>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ${item.product.price.toFixed(2)}</p>
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
