import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import { Product, ProductCollection } from '../../../../models/Product'
import { ObjectId } from 'mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const product = await db.collection(ProductCollection).findOne({ _id: new ObjectId(params.id) }) as Product | null
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}