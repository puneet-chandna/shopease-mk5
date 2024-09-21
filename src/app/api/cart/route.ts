import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const cartItems = await db.collection('cart').find({}).toArray()
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await db.collection('products').findOne({ _id: new ObjectId(item.productId) })
        return { ...item, product }
      })
    )
    return NextResponse.json(cartWithProducts)
  } catch (error) {
    console.error('Failed to fetch cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { productId, quantity } = await request.json()
    const existingItem = await db.collection('cart').findOne({ productId })
    if (existingItem) {
      await db.collection('cart').updateOne(
        { productId },
        { $inc: { quantity: quantity } }
      )
    } else {
      await db.collection('cart').insertOne({ productId, quantity })
    }
    return NextResponse.json({ message: 'Item added to cart' })
  } catch (error) {
    console.error('Failed to add item to cart:', error)
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    await db.collection('cart').deleteOne({ productId })
    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Failed to remove item from cart:', error)
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 })
  }
}