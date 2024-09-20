import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'
import Product from '../../../../models/Product'

export async function GET() {
  try {
    await connectToDatabase()
    const products = await Product.find({})
    return NextResponse.json(products)
  } catch (error) {
    console.error(error) 
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
