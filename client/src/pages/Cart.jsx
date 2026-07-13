import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, clearCart } from '../store/cartSlice'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/ui/ScrollReveal'

export default function Cart() {
  const cartItems = useSelector(selectCartItems)
  const cartTotal = useSelector(selectCartTotal)
  const dispatch = useDispatch()

  const handleRemove = (id, size, name) => {
    dispatch(removeFromCart({ id, size }))
    toast.success(`${name} in size ${size} removed.`)
  }

  const handleQtyChange = (id, size, val) => {
    dispatch(updateQuantity({ id, size, quantity: Math.max(1, val) }))
  }

  const handleClear = () => {
    dispatch(clearCart())
    toast.success('Shopping bag cleared.')
  }

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })

  return (
    <>
      <Helmet>
        <title>Shopping Bag | Vaishnav Rug Collection</title>
        <meta name="description" content="View items in your shopping bag and proceed to secure checkout." />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[900px] mx-auto px-4">
          
          <ScrollReveal direction="up" className="mb-10 text-center">
            <span className="section-label">Your Selection</span>
            <h1 className="font-cormorant text-3xl md:text-4xl text-navy font-bold leading-tight">Shopping Bag</h1>
            <div className="divider-gold mt-6"><span className="divider-gold-diamond"></span></div>
          </ScrollReveal>

          {cartItems.length === 0 ? (
            <ScrollReveal direction="up" className="bg-white border border-border/40 py-16 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-gold/60 mx-auto" />
              <p className="text-muted text-sm">Your shopping bag is currently empty.</p>
              <Link to="/shop" className="inline-block">
                <Button variant="primary">Explore Designs</Button>
              </Link>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Side: Items List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-border/40 divide-y divide-border/20 px-6">
                  {cartItems.map((item, idx) => (
                    <div key={`${item._id}-${item.size}`} className="py-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover border border-border/40 bg-cream shrink-0"
                        />
                        <div className="space-y-1">
                          <h4 className="font-cormorant font-bold text-navy text-base leading-tight">
                            <Link to={`/shop/${item.slug}`} className="hover:text-gold transition">
                              {item.name}
                            </Link>
                          </h4>
                          <span className="text-[10px] uppercase font-cinzel text-gold font-bold tracking-wider">
                            Size: {item.size}
                          </span>
                          <span className="block text-[11px] text-muted">
                            Unit Price: {inrFormatter.format(item.salePrice || item.price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-8 w-full sm:w-auto border-t sm:border-t-0 border-border/10 pt-3 sm:pt-0">
                        {/* Qty selectors */}
                        <div className="flex border border-border/60 bg-offwhite text-xs">
                          <button onClick={() => handleQtyChange(item._id, item.size, item.quantity - 1)} className="px-2.5 py-1 text-navy hover:bg-gold/10 font-bold">-</button>
                          <span className="px-3.5 py-1 flex items-center text-navy font-semibold">{item.quantity}</span>
                          <button onClick={() => handleQtyChange(item._id, item.size, item.quantity + 1)} className="px-2.5 py-1 text-navy hover:bg-gold/10 font-bold">+</button>
                        </div>

                        <span className="font-semibold text-navy text-sm w-20 text-right sm:text-right">
                          {inrFormatter.format((item.salePrice || item.price) * item.quantity)}
                        </span>

                        <button 
                          onClick={() => handleRemove(item._id, item.size, item.name)}
                          className="text-muted hover:text-burgundy transition cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center px-2">
                  <Link to="/shop" className="text-xs font-cinzel text-gold hover:text-navy uppercase font-semibold">
                    &lt; Continue Shopping
                  </Link>
                  <button 
                    onClick={handleClear}
                    className="text-xs font-cinzel text-muted hover:text-burgundy uppercase font-semibold cursor-pointer"
                  >
                    Clear Bag
                  </button>
                </div>
              </div>

              {/* Right Side: Order summary */}
              <div className="bg-white border border-border/40 p-6 space-y-6">
                <h3 className="font-cinzel text-xs font-bold text-navy uppercase tracking-wider border-b border-border/20 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-3.5 text-xs text-charcoal">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-semibold">{inrFormatter.format(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Shipping</span>
                    <span className="text-gold font-bold uppercase tracking-wider">Free (India)</span>
                  </div>
                  <div className="h-[1px] bg-border/20 my-2"></div>
                  <div className="flex justify-between text-sm font-bold text-navy">
                    <span>Total</span>
                    <span className="text-gold-dark text-base">{inrFormatter.format(cartTotal)}</span>
                  </div>
                </div>

                <Link to="/checkout" className="block w-full">
                  <Button variant="primary" className="w-full py-3.5 flex items-center justify-center gap-1.5 font-bold uppercase">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  )
}
