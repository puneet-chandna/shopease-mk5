import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { Product, ProductCollection } from '../../../models/Product'
import { ObjectId } from 'mongodb'

// In-memory cart
let cart: { productId: string; quantity: number }[] = []

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Assuming you have a Cart collection in MongoDB
    const cartDocument = await db.collection('carts').findOne({ _id: new ObjectId('66eec6eef46347bf4c0ba102') })

    if (!cartDocument) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const cartWithProducts = await Promise.all(
      cartDocument.items.map(async (item: { productId: string; quantity: number }) => {
        // Ensure the productId is a valid ObjectId
        if (!ObjectId.isValid(item.productId)) {
          return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
        }

        // Fetch product by productId
        const product = await db.collection<Product>(ProductCollection).findOne({ _id: (item.productId) })

        if (!product) {
          return { ...item, product: null } // Product not found, return null for product
        }

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
    const { productId, quantity } = await request.json()

    // Validate productId
    if (!ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Find the product in the database to ensure it exists
    const { db } = await connectToDatabase()
    const product = await db.collection<Product>(ProductCollection).findOne({ _id: (productId) })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const existingItem = cart.find(item => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ productId, quantity })
    }

    return NextResponse.json({ message: 'Item added to cart', cart })
  } catch (error) {
    console.error('Failed to add item to cart:', error)
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    // Validate productId
    if (!productId || !ObjectId.isValid(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Remove the item from the cart
    cart = cart.filter(item => item.productId !== productId)

    return NextResponse.json({ message: 'Item removed from cart', cart })
  } catch (error) {
    console.error('Failed to remove item from cart:', error)
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 })
  }
}
