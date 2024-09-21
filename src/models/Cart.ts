import mongoose from 'mongoose'

const CartSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }]
})

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema)

export default Cart