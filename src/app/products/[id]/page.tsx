'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Product } from '../../../models/Product'

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching product:', error)
        setLoading(false)
      })
  }, [id])

  const addToCart = async () => {
    if (!product) return

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product._id.toString(), quantity: 1 }),
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

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading product...</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Error loading product. Please try again.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image src={product.image} alt={product.title} width={500} height={500} className="w-full h-auto object-cover rounded" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
            </p>
            <p className="text-gray-600 mb-4">In Stock: {product.stock}</p>
            <button
              onClick={addToCart}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}