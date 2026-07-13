// src/pages/account/Wishlist.jsx

import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Heart, ShoppingBag, Trash2, ChevronRight } from 'lucide-react'
import { selectWishlist, removeFromWishlist } from '../../store/wishlistSlice'
import { addToCart } from '../../store/cartSlice'
import { formatINR } from '../../utils/format'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const wishlist = useSelector(selectWishlist)
  const dispatch = useDispatch()

  function handleMoveToCart(item) {
    dispatch(
      addToCart({
        product:  item,
        size:     item.sizes?.[0]?.label || item.defaultSize || 'Default',
        quantity: 1,
      })
    )
    dispatch(removeFromWishlist(item._id))
    toast.success(`${item.name} added to cart`)
  }

  const getCollectionName = (item) => {
    if (item.collectionName) return item.collectionName
    if (typeof item.collection === 'string') return item.collection
    return item.collection?.name || ''
  }

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
            <span className="text-gold">WISHLIST</span>
          </div>
          <h1 className="font-cormorant text-[2.2rem] lg:text-[2.6rem] text-navy font-semibold">
            My Wishlist
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
            <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-gold to-transparent" />
          </div>
        </div>
        <span className="font-cinzel text-[10px] tracking-wider text-muted">
          {wishlist.length} ITEM{wishlist.length !== 1 ? 'S' : ''} SAVED
        </span>
      </div>

      {/* Empty state */}
      {wishlist.length === 0 ? (
        <div className="bg-white border border-cream-dark p-16 text-center">
          <Heart size={48} className="text-cream-dark mx-auto mb-4" />
          <h3 className="font-cormorant text-[24px] text-navy mb-2">Your wishlist is empty</h3>
          <p className="text-[13px] text-muted font-light mb-6">Save items you love to revisit them later.</p>
          <Link
            to="/shop"
            className="bg-gold text-navy font-cinzel text-[10px] tracking-[0.12em] px-8 py-3.5 inline-block hover:bg-gold-dark transition-colors"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(item => (
            <div key={item._id} className="bg-white border border-cream-dark group overflow-hidden">

              {/* Product image */}
              <Link to={`/shop/${item.slug}`} className="block relative aspect-square overflow-hidden">
                {item.image || item.images?.[0]?.url
                  ? (
                    <img
                      src={item.image || item.images?.[0]?.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  )
                  : <div className="w-full h-full bg-gradient-to-br from-warmcream to-cream-dark" />
                }

                {/* Hover overlay: remove button */}
                <button
                  onClick={e => { e.preventDefault(); dispatch(removeFromWishlist(item._id)) }}
                  className="
                    absolute top-2 right-2 w-7 h-7
                    bg-white/90 border border-cream-dark
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                    hover:bg-red-50 hover:border-burgundy/30
                    cursor-pointer
                  "
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={12} className="text-burgundy" />
                </button>
              </Link>

              {/* Card body */}
              <div className="p-3 lg:p-4">
                {getCollectionName(item) && (
                  <p className="font-cinzel text-[7.5px] tracking-[0.18em] text-gold mb-1">
                    {getCollectionName(item).toUpperCase()}
                  </p>
                )}
                <h3 className="font-cormorant text-[15px] lg:text-[17px] text-navy font-medium leading-snug mb-2 line-clamp-2">
                  <Link to={`/shop/${item.slug}`} className="hover:text-gold transition-colors">
                    {item.name}
                  </Link>
                </h3>
                <p className="font-jost text-[13px] text-navy font-medium mb-3">
                  {formatINR(item.salePrice || item.price)}
                  {item.salePrice && item.salePrice < item.price && (
                    <span className="ml-2 text-[11px] text-muted line-through font-normal">
                      {formatINR(item.price)}
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 bg-navy text-cream font-cinzel text-[8px] tracking-[0.1em] py-2.5 flex items-center justify-center gap-1.5 hover:bg-navy-light transition-colors cursor-pointer"
                  >
                    <ShoppingBag size={11} /> ADD TO CART
                  </button>
                  <button
                    onClick={() => dispatch(removeFromWishlist(item._id))}
                    className="border border-cream-dark p-2.5 text-muted hover:text-burgundy hover:border-burgundy/40 transition-colors cursor-pointer"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
