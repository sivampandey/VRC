import Order from '../models/Order.js'
import Product from '../models/Product.js'
import sendEmail from '../utils/sendEmail.js'

const calculateOrder = async (items) => {
  if (!items || items.length === 0) {
    const error = new Error('Cart items cannot be empty.')
    error.statusCode = 400
    throw error
  }

  const normalizedItems = []

  for (const item of items) {
    const quantity = Number(item.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) {
      const error = new Error(`Invalid quantity for ${item.name || 'cart item'}.`)
      error.statusCode = 400
      throw error
    }

    const product = await Product.findById(item.product)
    if (!product || !product.isActive) {
      const error = new Error(`Product ${item.name || item.product} not found.`)
      error.statusCode = 404
      throw error
    }

    const sizeObj = product.sizes.find(s => s.label === item.size)
    if (!sizeObj) {
      const error = new Error(`Selected size is unavailable for ${product.name}.`)
      error.statusCode = 400
      throw error
    }

    if (sizeObj.stock < quantity) {
      const error = new Error(`Insufficient stock for ${product.name} in size ${item.size}.`)
      error.statusCode = 400
      throw error
    }

    const baseSizePrice = Number(sizeObj.price || product.price)
    const unitPrice = product.salePrice
      ? Math.round(baseSizePrice * (Number(product.salePrice) / Number(product.price)))
      : baseSizePrice

    normalizedItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || item.image,
      size: item.size,
      quantity,
      price: unitPrice
    })
  }

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return {
    items: normalizedItems,
    subtotal,
    shippingCharge: 0,
    discount: 0,
    total: subtotal
  }
}

export const deductOrderStock = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product)
    if (!product) {
      const error = new Error(`Product ${item.name} not found.`)
      error.statusCode = 404
      throw error
    }

    const sizeObj = product.sizes.find(s => s.label === item.size)
    if (!sizeObj || sizeObj.stock < item.quantity) {
      const error = new Error(`Insufficient stock for ${product.name} in size ${item.size}.`)
      error.statusCode = 400
      throw error
    }

    sizeObj.stock -= item.quantity
    product.totalSold += item.quantity
    await product.save()
  }
}

export const placeOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'cod', notes } = req.body

    if (!shippingAddress?.name || !shippingAddress?.phone || !shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.pincode) {
      return res.status(400).json({ message: 'Complete shipping address is required.' })
    }

    if (!['cod', 'razorpay'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Unsupported payment method.' })
    }

    const calculated = await calculateOrder(items)
    const orderNumber = 'VRC-' + Math.floor(100000 + Math.random() * 900000)
    const order = new Order({
      user: req.user ? req.user._id : undefined,
      guestEmail: req.user ? undefined : req.body.guestEmail,
      orderNumber,
      items: calculated.items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      subtotal: calculated.subtotal,
      shippingCharge: calculated.shippingCharge,
      discount: calculated.discount,
      total: calculated.total,
      notes
    })

    if (paymentMethod === 'cod') {
      await deductOrderStock(order)
    }

    await order.save()

    // Send confirmation email
    const emailTo = req.user ? req.user.email : req.body.guestEmail
    if (emailTo) {
      await sendEmail({
        to: emailTo,
        subject: `Order Confirmation - ${orderNumber}`,
        text: `Thank you for ordering with Vaishnav Rug Collection. Order Number: ${orderNumber}. Grand Total: ₹${order.total}.`,
        html: `<h2>Thank you for your order!</h2><p>Your order <strong>${orderNumber}</strong> has been successfully placed. We will ship it soon.</p><p>Grand Total: ₹${order.total}</p>`
      })
    }

    return res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { guestEmail: req.user.email }
      ]
    }).sort({ createdAt: -1 })
    return res.json(orders)
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name slug SKU')
    if (!order) {
      return res.status(404).json({ message: 'Order reference not found.' })
    }
    
    // Authorization check
    if (req.user.role !== 'admin' && order.user?.toString() !== req.user._id.toString() && order.guestEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to view this order.' })
    }

    return res.json(order)
  } catch (error) {
    next(error)
  }
}

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    return res.json(orders)
  } catch (error) {
    next(error)
  }
}
// ─── Beautiful HTML order status email template ──────────────────────────────
const buildClientOrderStatusEmail = (order, newStatus) => {
  const { orderNumber, shippingAddress, total, trackingNumber, trackingUrl } = order
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Status Updated</title>
  <style>
    body { margin: 0; padding: 0; background: #F4EFE8; font-family: Georgia, 'Times New Roman', serif; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #FAF5F0; }
    .header { background: #1B2A45; padding: 36px 40px; text-align: center; }
    .header-logo { font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.3em; color: #C9A56A; text-transform: uppercase; margin-bottom: 6px; }
    .header-title { font-size: 24px; color: #FAF5F0; font-weight: normal; letter-spacing: 0.04em; margin: 0; }
    .gold-bar { height: 3px; background: linear-gradient(90deg, transparent, #C9A56A, transparent); }
    .body { padding: 40px; }
    .greeting { font-size: 18px; color: #1B2A45; margin-bottom: 8px; }
    .status-badge { display: inline-block; background: #C9A56A; color: #1B2A45; padding: 8px 16px; font-family: Arial, sans-serif; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; margin-bottom: 24px; }
    .weavers-box { background: #F2EBE1; padding: 20px 24px; margin-bottom: 28px; border-left: 3px solid #C9A56A; }
    .weavers-box p { font-size: 13px; color: #5C5046; margin: 0; line-height: 1.6; }
    .cta-btn { display: inline-block; background: #1B2A45; color: #FAF5F0; text-decoration: none; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.2em; font-weight: bold; text-transform: uppercase; padding: 14px 32px; }
    .footer { background: #1B2A45; padding: 24px 40px; text-align: center; }
    .footer p { color: #FAF5F0; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.08em; margin: 4px 0; opacity: 0.7; }
    .footer .brand { color: #C9A56A; font-size: 12px; letter-spacing: 0.2em; opacity: 1; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">Vaishnav Rug Collection</div>
      <h1 class="header-title">Order Status Updated</h1>
    </div>
    <div class="gold-bar"></div>
    <div class="body">
      <p class="greeting">Dear ${shippingAddress.name || 'Valued Customer'},</p>
      <p style="font-size: 14px; color: #5C5046; line-height: 1.7; margin-bottom: 20px;">
        The status of your order <strong>${orderNumber}</strong> has been updated to:
      </p>
      <span class="status-badge">${newStatus}</span>

      ${newStatus === 'shipped' && trackingNumber ? `
      <div class="weavers-box">
        <p>
          <strong>Shipment Tracking Info:</strong><br/>
          Tracking Number: <strong>${trackingNumber}</strong><br/>
          ${trackingUrl ? `<a href="${trackingUrl}" target="_blank" style="color: #C9A56A; font-weight: bold; text-decoration: underline;">Track shipment online &gt;</a>` : ''}
        </p>
      </div>
      ` : ''}

      <p style="font-size: 13px; color: #7A7065; line-height: 1.6; margin-bottom: 28px;">
        You can review your order milestones, details, and tracking updates anytime in your order portal.
      </p>

      <div style="text-align: center; margin-bottom: 36px;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/account/orders" class="cta-btn">
          Track Your Orders
        </a>
      </div>
    </div>
    <div class="footer">
      <p class="brand">VAISHNAV RUG COLLECTION</p>
      <p>Woven with Tradition, Made for Generations.</p>
      <p>© ${new Date().getFullYear()} Vaishnav Rug Collection. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Dear ${shippingAddress.name || 'Valued Customer'},

The status of your order ${orderNumber} has been updated to: ${newStatus.toUpperCase()}.
${newStatus === 'shipped' && trackingNumber ? `Tracking Number: ${trackingNumber}\n` : ''}

Track order milestones on: ${process.env.CLIENT_URL || 'http://localhost:5173'}/account/orders

— Vaishnav Rug Collection
  `.trim()

  return { html, text }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
      return res.status(404).json({ message: 'Order reference not found.' })
    }

    const oldStatus = order.orderStatus
    if (orderStatus) {
      order.orderStatus = orderStatus
      if (orderStatus === 'delivered') {
        order.deliveredAt = new Date()
      }

      // Restore stock if cancelled by Admin
      if (orderStatus === 'cancelled' && oldStatus !== 'cancelled') {
        for (const item of order.items) {
          const product = await Product.findById(item.product)
          if (product) {
            const sizeObj = product.sizes.find(s => s.label === item.size)
            if (sizeObj) {
              sizeObj.stock += item.quantity
            }
            if (product.totalSold >= item.quantity) {
              product.totalSold -= item.quantity
            }
            await product.save()
          }
        }
      }
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus
    }

    await order.save()

    // Send email on status change
    if (orderStatus && orderStatus !== oldStatus) {
      const emailTo = order.user ? order.user.email : order.guestEmail
      if (emailTo) {
        const { html, text } = buildClientOrderStatusEmail(order, orderStatus)
        sendEmail({
          to: emailTo,
          subject: `📦 Order Update: ${orderStatus.toUpperCase()} — ${order.orderNumber}`,
          html,
          text
        }).then(sent => {
          if (sent) console.log(`[Email] Order status update email sent to ${emailTo}`)
        })
      }
    }

    return res.json(order)
  } catch (error) {
    next(error)
  }
}

export const updateOrderTracking = async (req, res, next) => {
  try {
    const { trackingNumber, trackingUrl } = req.body
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
      return res.status(404).json({ message: 'Order reference not found.' })
    }

    order.trackingNumber = trackingNumber
    order.trackingUrl = trackingUrl
    
    let statusChanged = false
    if (order.orderStatus === 'placed' || order.orderStatus === 'confirmed') {
      order.orderStatus = 'shipped'
      statusChanged = true
    }

    await order.save()

    // Send shipment notification email
    const emailTo = order.user ? order.user.email : order.guestEmail
    if (emailTo) {
      const { html, text } = buildClientOrderStatusEmail(order, 'shipped')
      sendEmail({
        to: emailTo,
        subject: `🚚 Order Shipped — ${order.orderNumber}`,
        html,
        text
      }).then(sent => {
        if (sent) console.log(`[Email] Tracking update email sent to ${emailTo}`)
      })
    }

    return res.json(order)
  } catch (error) {
    next(error)
  }
}

export const cancelMyOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order reference not found.' })
    }

    // Check authorization: User must be the owner of the order
    if (order.user?.toString() !== req.user._id.toString() && order.guestEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to cancel this order.' })
    }

    // Check status: Can only cancel if order status is 'placed' or 'confirmed'
    if (!['placed', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Order cannot be cancelled once it is processed or shipped.' })
    }

    const oldStatus = order.orderStatus
    order.orderStatus = 'cancelled'
    await order.save()

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        const sizeObj = product.sizes.find(s => s.label === item.size)
        if (sizeObj) {
          sizeObj.stock += item.quantity
        }
        if (product.totalSold >= item.quantity) {
          product.totalSold -= item.quantity
        }
        await product.save()
      }
    }

    // Send email on status change
    const emailTo = order.user ? order.user.email : order.guestEmail
    if (emailTo) {
      const { html, text } = buildClientOrderStatusEmail(order, 'cancelled')
      sendEmail({
        to: emailTo,
        subject: `📦 Order Update: CANCELLED — ${order.orderNumber}`,
        html,
        text
      }).then(sent => {
        if (sent) console.log(`[Email] Order cancellation email sent to ${emailTo}`)
      })
    }

    return res.json(order)
  } catch (error) {
    next(error)
  }
}

export const requestReturnExchange = async (req, res, next) => {
  try {
    const { actionType, reason, notes } = req.body // actionType: 'return' or 'exchange'
    
    if (!['return', 'exchange'].includes(actionType)) {
      return res.status(400).json({ message: 'Invalid return/exchange action type.' })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order reference not found.' })
    }

    // Authorization
    if (order.user?.toString() !== req.user._id.toString() && order.guestEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to request return for this order.' })
    }

    // Check status: Can only request return if order is delivered
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ message: 'Return/exchange can only be requested for delivered orders.' })
    }

    // Check window: must be within 7 days of delivery
    const deliveryDate = order.deliveredAt || order.updatedAt
    const timeDiff = new Date() - new Date(deliveryDate)
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
    if (daysDiff > 7) {
      return res.status(400).json({ message: 'Return/exchange period of 7 days has expired.' })
    }

    // Update order status
    order.orderStatus = actionType === 'return' ? 'return_requested' : 'exchange_requested'
    order.notes = `[Return/Exchange Request: ${actionType.toUpperCase()}] Reason: ${reason}. Notes: ${notes || ''}. ${order.notes || ''}`
    await order.save()

    // Send email on status change
    const emailTo = order.user ? order.user.email : order.guestEmail
    if (emailTo) {
      const { html, text } = buildClientOrderStatusEmail(order, order.orderStatus)
      sendEmail({
        to: emailTo,
        subject: `📦 Order Update: ${actionType.toUpperCase()} REQUESTED — ${order.orderNumber}`,
        html,
        text
      }).then(sent => {
        if (sent) console.log(`[Email] Return/Exchange update email sent to ${emailTo}`)
      })
    }

    return res.json(order)
  } catch (error) {
    next(error)
  }
}
