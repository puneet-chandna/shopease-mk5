'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '../../models/Product'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setLoading(false)
      })
  }, [])

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })
      if (response.ok) {
        alert('Product added to cart!')
      } else {
        alert('Failed to add product to cart. Please try again.')
      }
    } catch (error) {
      console.error('Error adding product to cart:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div key={product._id.toString()} className="bg-white p-6 rounded-lg shadow-lg">
              <Image src={product.image} alt={product.title} width={300} height={300} className="w-full h-48 object-cover mb-4 rounded" />
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
              <div className="flex justify-between">
                <Link
                  href={`/products/${product._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  View Details
                </Link>
                <button
                  onClick={() => addToCart(product._id.toString())}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}