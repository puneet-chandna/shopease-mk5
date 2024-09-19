import { NextResponse } from 'next/server'
import { products } from '../../../data/products'

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newProduct = {
    _id: (products.length + 1).toString(),
    ...body
  }
  products.push(newProduct)
  return NextResponse.json(newProduct, { status: 201 })
}