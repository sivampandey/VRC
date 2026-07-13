import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectWishlist, removeFromWishlist } from '../store/wishlistSlice'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/ui/ScrollReveal'

export default function Wishlist() {
  const wishlistItems = useSelector(selectWishlist)
  const dispatch = useDispatch()

  const handleRemove = (id, name) => {
    dispatch(removeFromWishlist(id))
    toast.success(`${name} removed from wishlist.`)
  }

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })

  return (
    <>
      <Helmet>
        <title>Your Wishlist | Vaishnav Rug Collection</title>
        <meta name="description" content="View your saved rugs and carpets designs." />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[900px] mx-auto px-4">
          
          <ScrollReveal direction="up" className="text-center mb-10">
            <span className="section-label">Your Favorites</span>
            <h1 className="font-cormorant text-3xl md:text-4xl text-navy font-bold leading-tight">Wishlist</h1>
            <div className="divider-gold mt-6"><span className="divider-gold-diamond"></span></div>
          </ScrollReveal>

          {wishlistItems.length === 0 ? (
            <ScrollReveal direction="up" className="bg-white border border-border/40 py-16 text-center space-y-4">
              <Heart className="w-12 h-12 text-gold/60 mx-auto" />
              <p className="text-muted text-sm">Your wishlist is empty.</p>
              <Link to="/shop" className="inline-block">
                <Button variant="primary">Explore Designs</Button>
              </Link>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wishlistItems.map((item) => (
                <ScrollReveal key={item._id} direction="up" className="bg-white border border-border/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    <img 
                      src={item.images?.[0]?.url || item.image} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover border border-border/40 bg-cream shrink-0"
                    />
                    <div>
                      <h4 className="font-cormorant font-bold text-navy text-base leading-tight">
                        <Link to={`/shop/${item.slug}`} className="hover:text-gold transition">
                          {item.name}
                        </Link>
                      </h4>
                      <p className="text-xs text-gold-dark mt-1 font-semibold">
                        {inrFormatter.format(item.salePrice || item.price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-border/10 pt-3 sm:pt-0">
                    <Link to={`/shop/${item.slug}`} className="flex-grow sm:flex-grow-0">
                      <Button variant="outline" className="w-full sm:w-auto py-2 px-4 text-xs font-semibold uppercase">View Design</Button>
                    </Link>
                    <button 
                      onClick={() => handleRemove(item._id, item.name)}
                      className="text-muted hover:text-burgundy transition cursor-pointer p-1 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
