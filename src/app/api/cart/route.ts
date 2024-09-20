import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import Product from '../../../../models/Product'

let cart: { productId: string; quantity: number }[] = []


export async function GET() {
  try {
    await connectToDatabase()
    const cartWithProducts = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.productId)
        return { ...item, product }
      })
    )
    return NextResponse.json(cartWithProducts)
  } catch (error) {
    console.error(error) // Log the error
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
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