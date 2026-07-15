import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { deductOrderStock } from './orderController.js'

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' })
    }

    const appOrder = await Order.findById(orderId)
    if (!appOrder) {
      return res.status(404).json({ message: 'Associated order not found.' })
    }

    if (appOrder.paymentMethod !== 'razorpay') {
      return res.status(400).json({ message: 'This order is not configured for Razorpay payment.' })
    }

    if (appOrder.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order is already paid.' })
    }

    // Check stock before creating Razorpay order to prevent charging for out-of-stock items
    for (const item of appOrder.items) {
      const product = await Product.findById(item.product)
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.name || 'item'} is no longer active or available.` })
      }
      const sizeObj = product.sizes.find(s => s.label === item.size)
      if (!sizeObj || sizeObj.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name} in size ${item.size}.` })
      }
    }
    
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder'

    const instance = new Razorpay({
      key_id,
      key_secret
    })

    const options = {
      amount: Math.round(appOrder.total * 100), // in paise
      currency: 'INR',
      receipt: appOrder.orderNumber
    }

    const razorpayOrder = await instance.orders.create(options)
    appOrder.razorpayOrderId = razorpayOrder.id
    await appOrder.save()

    return res.json(razorpayOrder)
  } catch (error) {
    next(error)
  }
}

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder'
    const hmac = crypto.createHmac('sha256', key_secret)
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
    const generated_signature = hmac.digest('hex')

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ status: 'failed', message: 'Signature verification failed.' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Associated order not found.' })
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ status: 'failed', message: 'Payment does not match this order.' })
    }

    if (order.paymentStatus !== 'paid') {
      await deductOrderStock(order)
      order.paymentStatus = 'paid'
      order.razorpayPaymentId = razorpay_payment_id
      await order.save()
    }

    return res.json({ status: 'success', message: 'Payment verified successfully.' })
  } catch (error) {
    next(error)
  }
}
