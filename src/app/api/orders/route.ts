import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'
import Order from '../../../models/Order'

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { products } = await request.json()
    const order = new Order({ products })
    await order.save()
    return NextResponse.json({ message: 'Order placed successfully', orderId: order._id })
  } catch (error) {
    console.error(error) 
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}


