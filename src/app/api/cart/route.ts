import { NextResponse } from 'next/server'
import { products } from '../../../data/products'

let cart: { productId: string; quantity: number }[] = []

export async function GET() {
  const cartWithProducts = cart.map(item => ({
    ...item,
    product: products.find(p => p._id === item.productId)
  }))
  return NextResponse.json(cartWithProducts)
}

export async function POST(request: Request) {
  const { productId, quantity } = await request.json()
  const existingItem = cart.find(item => item.productId === productId)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }
  return NextResponse.json({ message: 'Item added to cart' })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  cart = cart.filter(item => item.productId !== productId)
  return NextResponse.json({ message: 'Item removed from cart' })
}