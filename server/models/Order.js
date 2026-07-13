import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: { type: String },    // for guest checkout
  orderNumber: { type: String, required: true, unique: true, index: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'cod' },  // razorpay, cod
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  orderStatus: { type: String, enum: ['placed','confirmed','processing','shipped','delivered','cancelled'], default: 'placed' },
  subtotal: { type: Number, required: true },
  shippingCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: { type: String },
  trackingNumber: { type: String },
  trackingUrl: { type: String },
  deliveredAt: { type: Date }
}, {
  timestamps: true
})

const Order = mongoose.model('Order', orderSchema)
export default Order
