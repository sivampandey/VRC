import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice'
import { addToCart } from '../../store/cartSlice'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isWishlisted = useSelector(selectIsWishlisted(product._id))

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  })

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    dispatch(toggleWishlist(product))
    toast.success(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist!')
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    const defaultSize = product.sizes?.[0]?.label || 'Standard'
    dispatch(addToCart({ product, size: defaultSize, quantity: 1 }))
    toast.success('Added to shopping bag!')
  }

  // Get primary image url
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600'

  // Map index to the CSS patterns from the design file for default background fallback
  const fallbackClasses = ['rp1', 'rp2', 'rp3', 'rp4']
  const fallbackClass = fallbackClasses[index % fallbackClasses.length]

  return (
    <motion.div
      onClick={() => navigate(`/shop/${product.slug}`)}
      className="pcard flex flex-col h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -5,
        boxShadow: '0 28px 60px rgba(22,4,0,0.20), 0 0 0 1px rgba(201,165,106,0.15)',
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      {/* Image / Frame Wrapper */}
      <div className={`pimg p-frame ${fallbackClass}`}>
        <img
          src={primaryImage}
          alt={product.name}
          className="pimg-bg object-cover w-full h-full"
          loading="lazy"
        />

        {/* Hover slide/fade add to cart overlay */}
        <div className="p-over">
          <motion.button
            onClick={handleAddToCart}
            className="p-over-btn tracking-widest"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ADD TO BAG
          </motion.button>
        </div>

        {/* Wishlist Heart Overlay */}
        <motion.button
          onClick={handleWishlistToggle}
          className="p-heart flex items-center justify-center"
          style={{ border: 'none', padding: 0 }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          animate={isWishlisted ? { scale: [1, 1.3, 1] } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          <Heart
            size={18}
            className={isWishlisted ? 'text-[#8B1C1C] fill-[#8B1C1C]' : 'text-[#7A7065]'}
            aria-hidden="true"
          />
        </motion.button>

        {/* Badges top-left */}
        {product.isBestseller && (
          <motion.span
            className="pbadge pn font-semibold"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            BESTSELLER
          </motion.span>
        )}
        {!product.isBestseller && product.isNewArrival && (
          <motion.span
            className="pbadge pn font-semibold"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            NEW
          </motion.span>
        )}
        {product.salePrice && (
          <motion.span
            className="pbadge ps font-semibold"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            SALE
          </motion.span>
        )}
      </div>

      {/* Info details */}
      <div className="pinfo flex flex-col flex-grow">
        <div className="pcol">{product.collection?.name?.toUpperCase() || 'SIGNATURE RANGE'}</div>
        <div className="pname line-clamp-1">{product.name}</div>

        <div className="pprow mt-auto">
          {product.salePrice ? (
            <>
              <span className="psale">{inrFormatter.format(product.salePrice)}</span>
              <span className="porig">{inrFormatter.format(product.price)}</span>
            </>
          ) : (
            <span className="pprice">{inrFormatter.format(product.price)}</span>
          )}
        </div>

        {/* Rating stars & review count */}
        {product.ratings !== undefined && (
          <div className="pstars">
            <span className="stars-g font-serif">
              {'★'.repeat(Math.round(product.ratings.average))}
              {'☆'.repeat(5 - Math.round(product.ratings.average))}
            </span>
            <span className="rcnt">({product.ratings.count || 48})</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
