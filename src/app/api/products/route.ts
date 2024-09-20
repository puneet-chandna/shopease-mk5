import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import { Product, ProductCollection } from '../../../models/Product'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const products = await db.collection(ProductCollection).find({}).toArray() as Product[]
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const result = await db.collection(ProductCollection).insertOne(body)
    return NextResponse.json({ _id: result.insertedId, ...body }, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}