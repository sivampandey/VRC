// src/pages/account/OrderDetail.jsx

import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Package, Truck, CheckCircle2, Clock, XCircle, MapPin, CreditCard, Download } from 'lucide-react'
import { useGetOrderByIdQuery } from '../../store/api/ordersApi'
import { formatINR, formatDate } from '../../utils/format'

const STATUS = {
  placed:     { label: 'Order Placed', color: 'bg-sky-50 text-sky-700',      icon: Clock        },
  confirmed:  { label: 'Confirmed',    color: 'bg-indigo-50 text-indigo-700', icon: CheckCircle2 },
  processing: { label: 'Processing',   color: 'bg-amber-50 text-amber-700',   icon: Package      },
  shipped:    { label: 'Shipped',      color: 'bg-blue-50 text-blue-700',     icon: Truck        },
  delivered:  { label: 'Delivered',    color: 'bg-green-50 text-green-700',   icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',   color: 'bg-red-50 text-red-700',       icon: XCircle      },
}

function OrderTimeline({ status }) {
  const steps = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']
  const currentIdx = steps.indexOf(status)
  return (
    <div className="flex items-center overflow-x-auto py-4">
      {steps.map((step, i) => {
        const done    = i <= currentIdx && status !== 'cancelled'
        const current = i === currentIdx && status !== 'cancelled'
        const cfg     = STATUS[step]
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${done ? 'bg-gold' : 'bg-cream-dark'}
                ${current ? 'ring-2 ring-gold ring-offset-2' : ''}
              `}>
                <cfg.icon size={14} className={done ? 'text-navy' : 'text-muted'} />
              </div>
              <span className={`font-cinzel text-[7px] tracking-[0.1em] text-center leading-tight max-w-[60px] ${done ? 'text-navy' : 'text-muted'}`}>
                {cfg.label.toUpperCase()}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-5 ${i < currentIdx && status !== 'cancelled' ? 'bg-gold' : 'bg-cream-dark'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrderDetail() {
  const { id }  = useParams()
  const { data, isLoading, isError } = useGetOrderByIdQuery(id)
  const order = data && !data.order ? data : data?.order

  if (isLoading) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-cream-dark rounded w-1/4" />
          <div className="h-10 bg-cream-dark rounded w-1/3" />
          <div className="bg-white border border-cream-dark p-6 space-y-3">
            <div className="h-4 bg-cream-dark rounded w-1/2" />
            <div className="h-4 bg-cream-dark rounded w-2/3" />
            <div className="h-4 bg-cream-dark rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
        <div className="bg-white border border-cream-dark p-16 text-center">
          <Package size={48} className="text-cream-dark mx-auto mb-4" />
          <h3 className="font-cormorant text-[24px] text-navy mb-2">Order not found</h3>
          <p className="text-[13px] text-muted font-light mb-6">We could not find this order.</p>
          <Link to="/account/orders" className="bg-navy text-cream font-cinzel text-[10px] tracking-[0.12em] px-8 py-3.5 inline-block hover:bg-navy-light transition-colors">
            BACK TO ORDERS
          </Link>
        </div>
      </div>
    )
  }

  const cfg  = STATUS[order.orderStatus] || STATUS.placed
  const Icon = cfg.icon

  return (
    <div className="px-5 sm:px-8 lg:px-10 xl:px-12 py-8 lg:py-10">

      {/* Breadcrumb + title */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 font-cinzel text-[9.5px] tracking-[0.1em] text-muted mb-3">
          <Link to="/account/orders" className="hover:text-navy transition-colors">MY ORDERS</Link>
          <ChevronRight size={10} />
          <span className="text-gold">#{order.orderNumber}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <h1 className="font-cormorant text-[2rem] lg:text-[2.4rem] text-navy font-semibold leading-tight">
            Order #{order.orderNumber}
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-cinzel text-[8.5px] tracking-[0.12em] ${cfg.color}`}>
            <Icon size={13} />
            {cfg.label.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
          <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-gold to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Order progress */}
          {order.orderStatus !== 'cancelled' && (
            <div className="bg-white border border-cream-dark">
              <div className="px-6 py-4 border-b border-cream-dark">
                <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">ORDER PROGRESS</span>
              </div>
              <div className="px-6 pb-6">
                <OrderTimeline status={order.orderStatus} />
                {order.trackingNumber && (
                  <div className="mt-3 bg-warmcream px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-cinzel text-[8.5px] tracking-[0.14em] text-gold mb-0.5">TRACKING NUMBER</p>
                      <p className="font-jost text-[13px] text-navy font-medium">{order.trackingNumber}</p>
                    </div>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-cinzel text-[8.5px] tracking-[0.1em] bg-gold text-navy px-4 py-2 hover:bg-gold-dark transition-colors"
                      >
                        TRACK SHIPMENT
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white border border-cream-dark">
            <div className="px-6 py-4 border-b border-cream-dark flex items-center justify-between">
              <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">ORDER ITEMS</span>
              <span className="font-jost text-[12px] text-muted">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-cream-dark">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-4 p-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-warmcream border border-cream-dark overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-warmcream to-cream-dark" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-cormorant text-[16px] text-navy font-medium leading-snug mb-1">
                      {item.name}
                    </h4>
                    <p className="text-[12px] text-muted font-light mb-1">{item.size} · Qty: {item.quantity}</p>
                    <p className="font-jost text-[13px] text-navy font-medium">{formatINR(item.price)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-cormorant text-[17px] text-navy font-medium">
                      {formatINR(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Order summary */}
          <div className="bg-white border border-cream-dark">
            <div className="px-6 py-4 border-b border-cream-dark">
              <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">ORDER SUMMARY</span>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-jost text-[13px] text-muted font-light">Subtotal</span>
                <span className="font-jost text-[13px] text-navy">{formatINR(order.subtotal || order.total)}</span>
              </div>
              {order.shippingCost != null && (
                <div className="flex justify-between items-center">
                  <span className="font-jost text-[13px] text-muted font-light">Shipping</span>
                  <span className="font-jost text-[13px] text-navy">
                    {order.shippingCost === 0 ? 'Free' : formatINR(order.shippingCost)}
                  </span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="font-jost text-[13px] text-muted font-light">Discount</span>
                  <span className="font-jost text-[13px] text-green-600">−{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-cream-dark flex justify-between items-center">
                <span className="font-cinzel text-[10px] tracking-[0.14em] text-navy">TOTAL</span>
                <span className="font-cormorant text-[20px] text-navy font-medium">{formatINR(order.total)}</span>
              </div>
            </div>
            <div className="px-6 pb-5">
              <button className="w-full border border-cream-dark text-muted font-cinzel text-[9px] tracking-[0.12em] py-3 hover:border-navy hover:text-navy transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Download size={12} /> DOWNLOAD INVOICE
              </button>
            </div>
          </div>

          {/* Delivery address */}
          {order.shippingAddress && (
            <div className="bg-white border border-cream-dark">
              <div className="px-6 py-4 border-b border-cream-dark flex items-center gap-2">
                <MapPin size={14} className="text-gold" />
                <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">DELIVERY ADDRESS</span>
              </div>
              <div className="px-6 py-5">
                <address className="not-italic font-jost text-[13px] text-charcoal font-light leading-[1.85]">
                  <span className="font-medium">{order.shippingAddress.name}</span><br />
                  {order.shippingAddress.line1}<br />
                  {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                  {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}<br />
                  <span className="text-muted">{order.shippingAddress.phone}</span>
                </address>
              </div>
            </div>
          )}

          {/* Payment info */}
          <div className="bg-white border border-cream-dark">
            <div className="px-6 py-4 border-b border-cream-dark flex items-center gap-2">
              <CreditCard size={14} className="text-gold" />
              <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">PAYMENT</span>
            </div>
            <div className="px-6 py-5 space-y-2">
              <div className="flex justify-between">
                <span className="font-jost text-[12.5px] text-muted font-light">Method</span>
                <span className="font-jost text-[12.5px] text-navy capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-jost text-[12.5px] text-muted font-light">Status</span>
                <span className={`font-jost text-[12.5px] font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-jost text-[12.5px] text-muted font-light">Order date</span>
                <span className="font-jost text-[12.5px] text-navy">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
