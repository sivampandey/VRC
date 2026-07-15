// src/pages/account/Orders.jsx

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useGetMyOrdersQuery } from '../../store/api/ordersApi'
import { formatINR, formatDate } from '../../utils/format'

// ─── Status config ────────────────────────────────────────────
const STATUS = {
  placed:             { label: 'Order Placed', color: 'bg-sky-50 text-sky-700',      icon: Clock        },
  confirmed:          { label: 'Confirmed',    color: 'bg-indigo-50 text-indigo-700', icon: CheckCircle2 },
  processing:         { label: 'Processing',   color: 'bg-amber-50 text-amber-700',   icon: Package      },
  shipped:            { label: 'Shipped',      color: 'bg-blue-50 text-blue-700',     icon: Truck        },
  delivered:          { label: 'Delivered',    color: 'bg-green-50 text-green-700',   icon: CheckCircle2 },
  cancelled:          { label: 'Cancelled',    color: 'bg-red-50 text-red-700',       icon: XCircle      },
  return_requested:   { label: 'Return Req.',  color: 'bg-orange-50 text-orange-700',   icon: Clock        },
  exchange_requested: { label: 'Exchange Req.',color: 'bg-purple-50 text-purple-700',   icon: Clock        },
  returned:           { label: 'Returned',     color: 'bg-stone-50 text-stone-700',   icon: XCircle      },
  exchanged:          { label: 'Exchanged',    color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
}

// ─── Order Timeline ───────────────────────────────────────────
function OrderTimeline({ status }) {
  const steps = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']
  const currentIdx = steps.indexOf(status)
  return (
    <div className="flex items-center mt-4 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const done    = i <= currentIdx && status !== 'cancelled'
        const current = i === currentIdx && status !== 'cancelled'
        const cfg     = STATUS[step]
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none min-w-0">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                ${done ? 'bg-gold' : 'bg-cream-dark'}
                ${current ? 'ring-2 ring-gold ring-offset-2' : ''}
              `}>
                <cfg.icon size={13} className={done ? 'text-navy' : 'text-muted'} />
              </div>
              <span className={`font-cinzel text-[7px] tracking-[0.1em] text-center leading-tight max-w-[56px] ${done ? 'text-navy' : 'text-muted'}`}>
                {cfg.label.toUpperCase()}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-5 ${i < currentIdx && status !== 'cancelled' ? 'bg-gold' : 'bg-cream-dark'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Order Card ───────────────────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const cfg  = STATUS[order.orderStatus] || STATUS.placed
  const Icon = cfg.icon

  return (
    <div className="bg-white border border-cream-dark mb-4 overflow-hidden">
      {/* Card header */}
      <div className="flex flex-wrap items-start gap-4 p-5 lg:p-6">

        {/* Product thumbnail */}
        <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 bg-warmcream border border-cream-dark overflow-hidden">
          {order.items?.[0]?.image
            ? <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-warmcream to-cream-dark" />
          }
        </div>

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-cinzel text-[8.5px] tracking-[0.14em] text-muted">
              ORDER #{order.orderNumber}
            </span>
            <span className="text-muted/40">·</span>
            <span className="text-[11.5px] text-muted font-light">
              {formatDate(order.createdAt)}
            </span>
          </div>
          <h3 className="font-cormorant text-[17px] lg:text-[19px] text-navy font-medium leading-snug mb-1">
            {order.items?.[0]?.name}
            {order.items?.length > 1 && (
              <span className="font-jost text-[12px] text-muted font-light ml-2">
                +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
              </span>
            )}
          </h3>
          <p className="text-[12px] text-muted font-light mb-3">
            {order.items?.[0]?.size} · {order.items?.[0]?.quantity} item{order.items?.[0]?.quantity > 1 ? 's' : ''}
          </p>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-cinzel text-[8px] tracking-[0.12em] ${cfg.color}`}>
            <Icon size={11} />
            {cfg.label.toUpperCase()}
            {order.trackingNumber && order.orderStatus === 'shipped' && (
              <span className="ml-1 opacity-70">
                · ETA {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Soon'}
              </span>
            )}
          </span>
        </div>

        {/* Price + actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="font-cormorant text-[20px] text-navy font-medium">
            {formatINR(order.total)}
          </span>
          <span className="text-[11px] text-muted font-light capitalize">
            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
          </span>
          <div className="flex gap-2 mt-1">
            {order.trackingNumber && (
              <a
                href={order.trackingUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-cinzel text-[8.5px] tracking-[0.1em] bg-gold text-navy px-3 py-2 hover:bg-gold-dark transition-colors"
              >
                TRACK
              </a>
            )}
            <Link
              to={`/account/orders/${order._id}`}
              className="font-cinzel text-[8.5px] tracking-[0.1em] border border-cream-dark text-muted px-3 py-2 hover:border-navy hover:text-navy transition-colors"
            >
              DETAILS
            </Link>
          </div>
        </div>
      </div>

      {/* Expandable timeline */}
      {order.orderStatus !== 'cancelled' && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 lg:px-6 py-3 border-t border-cream-dark flex items-center justify-between text-[10px] font-cinzel tracking-[0.1em] text-muted hover:text-navy transition-colors cursor-pointer"
        >
          <span>ORDER PROGRESS</span>
          <ChevronRight size={14} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      )}

      {expanded && (
        <div className="px-5 lg:px-6 pb-5 border-t border-cream-dark bg-warmcream/50">
          <OrderTimeline status={order.orderStatus} />
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
const FILTERS = ['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED']

export default function Orders() {
  const [filter, setFilter] = useState('ALL')
  const { data, isLoading } = useGetMyOrdersQuery()

  const orders   = Array.isArray(data) ? data : (data?.orders || [])
  const filtered = orders.filter(o => {
    if (filter === 'ALL')       return true
    if (filter === 'ACTIVE')    return !['delivered', 'cancelled'].includes(o.orderStatus)
    if (filter === 'DELIVERED') return o.orderStatus === 'delivered'
    if (filter === 'CANCELLED') return o.orderStatus === 'cancelled'
    return true
  })

  return (
    <div className="px-5 sm:px-8 lg:px-10 xl:px-12 py-8 lg:py-10">

      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 font-cinzel text-[9.5px] tracking-[0.1em] text-muted mb-3">
            <span>HOME</span>
            <ChevronRight size={10} />
            <span>ACCOUNT</span>
            <ChevronRight size={10} />
            <span className="text-gold">MY ORDERS</span>
          </div>
          <h1 className="font-cormorant text-[2.2rem] lg:text-[2.6rem] text-navy font-semibold">
            My Orders
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
            <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-gold to-transparent" />
          </div>
        </div>
        <span className="font-cinzel text-[10px] tracking-wider text-muted">
          {orders.length} TOTAL ORDERS
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-cream-dark mb-6 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 lg:px-5 py-3 font-cinzel text-[9.5px] tracking-[0.12em] whitespace-nowrap
              border-b-2 mb-[-1px] transition-colors cursor-pointer
              ${filter === f ? 'border-gold text-navy' : 'border-transparent text-muted hover:text-navy'}
            `}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading
        ? Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white border border-cream-dark p-5 mb-4 animate-pulse">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-cream-dark" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-cream-dark rounded w-1/3" />
                <div className="h-4 bg-cream-dark rounded w-1/2" />
                <div className="h-3 bg-cream-dark rounded w-1/4" />
              </div>
            </div>
          </div>
        ))
        : filtered.length === 0
          ? (
            <div className="bg-white border border-cream-dark p-16 text-center">
              <Package size={48} className="text-cream-dark mx-auto mb-4" />
              <h3 className="font-cormorant text-[24px] text-navy mb-2">No orders yet</h3>
              <p className="text-[13px] text-muted font-light mb-6">Your order history will appear here.</p>
              <Link
                to="/shop"
                className="bg-gold text-navy font-cinzel text-[10px] tracking-[0.12em] px-8 py-3.5 inline-block hover:bg-gold-dark transition-colors"
              >
                EXPLORE COLLECTION
              </Link>
            </div>
          )
          : filtered.map(order => <OrderCard key={order._id} order={order} />)
      }
    </div>
  )
}
