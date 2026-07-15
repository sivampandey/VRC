import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, Heart, ArrowLeft, MessageSquare, Truck, ShieldCheck, RefreshCw } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsWishlisted, toggleWishlist } from '../store/wishlistSlice'
import { addToCart } from '../store/cartSlice'
import { getProductBySlug, products } from '../data/products'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import ScrollReveal from '../components/ui/ScrollReveal'
import ProductCard from '../components/ui/ProductCard'

export default function ProductDetail() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' })
  const [zoomBackground, setZoomBackground] = useState('')

  const product = getProductBySlug(slug)

  // Wishlist Check
  const isWishlisted = useSelector((state) => 
    product ? selectIsWishlisted(product._id)(state) : false
  )

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0].label)
    }
  }, [product])

  if (!product) {
    return (
      <div className="py-24 text-center bg-offwhite min-h-screen">
        <h2 className="font-cormorant text-2xl text-navy font-bold">Product not found.</h2>
        <Link to="/shop" className="mt-4 inline-block"><Button variant="outline">Back to Shop</Button></Link>
      </div>
    )
  }

  // Get active size details
  const activeSizeObj = product.sizes.find(s => s.label === selectedSize)
  const displayPrice = activeSizeObj ? activeSizeObj.price : product.price
  const displaySalePrice = product.salePrice 
    ? (activeSizeObj ? Math.round(activeSizeObj.price * (product.salePrice / product.price)) : product.salePrice) 
    : null

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a rug size.')
      return
    }
    const itemToAdd = {
      ...product,
      price: displayPrice,
      salePrice: displaySalePrice
    }
    dispatch(addToCart({ product: itemToAdd, size: selectedSize, quantity: qty }))
    toast.success('Added to shopping bag!')
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a rug size.')
      return
    }
    const itemToAdd = {
      ...product,
      price: displayPrice,
      salePrice: displaySalePrice
    }
    dispatch(addToCart({ product: itemToAdd, size: selectedSize, quantity: qty }))
    navigate('/checkout')
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist(product))
    toast.success(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist!')
  }

  // Mouse Move Zoom effect on main image
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.pageX - left - window.scrollX) / width) * 100
    const y = ((e.pageY - top - window.scrollY) / height) * 100
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${product.images[0].url})`
    })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' })
  }

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })

  // WhatsApp link generator
  const getWhatsAppEnquiryLink = () => {
    const text = `Hi Vaishnav Rug Collection, I am interested in checking availability for "${product.name}" in size "${selectedSize}". Please share more details.`
    return `https://wa.me/918707630603?text=${encodeURIComponent(text)}`
  }

  // Fetch related products in the same collection
  const relatedProducts = products
    .filter(p => p.collection.slug === product.collection.slug && p._id !== product._id)
    .slice(0, 3)

  return (
    <>
      <Helmet>
        <title>{product.name} | Vaishnav Rug Collection</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back link */}
          <Link to="/shop" className="text-xs font-cinzel text-gold font-bold hover:text-navy flex items-center gap-1.5 uppercase mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Shop Gallery
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side: Zoomable Image Container */}
            <div className="space-y-4">
              <div 
                className="relative aspect-[3/4] w-full bg-cream overflow-hidden border border-border/40 cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={product.images[0].url} 
                  alt={product.images[0].alt || product.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Zoom overlay box */}
                <div 
                  className="absolute inset-0 pointer-events-none bg-no-repeat bg-[length:200%]"
                  style={zoomStyle}
                ></div>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {product.isNewArrival && (
                    <span className="bg-gold text-navy font-cinzel text-[10px] font-bold px-3 py-1 uppercase shadow-md">NEW</span>
                  )}
                  {product.salePrice && (
                    <span className="bg-burgundy text-white font-cinzel text-[10px] font-bold px-3 py-1 uppercase shadow-md">SALE</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Specs Column */}
            <div className="space-y-6">
              <div>
                <span className="font-cinzel text-xs text-gold tracking-[0.2em] font-semibold uppercase">
                  {product.collection.name}
                </span>
                <h1 className="font-cormorant text-3xl md:text-4xl text-navy font-bold mt-2 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-muted/80 mt-1 uppercase tracking-wider font-cinzel">
                  SKU: {product.sku} | Weave: {product.weaveType}
                </p>
              </div>

              {/* Rating stars */}
              <div className="flex items-center gap-2 border-b border-border/20 pb-4">
                <div className="flex items-center gap-0.5 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratings.average) ? 'fill-gold' : ''}`} />
                  ))}
                </div>
                <span className="text-xs text-muted font-medium">({product.ratings.count} reviews)</span>
              </div>

              {/* Dynamic Prices */}
              <div className="text-2xl font-bold text-gold-dark">
                {displaySalePrice ? (
                  <div className="flex items-center gap-3">
                    <span className="line-through text-muted text-base font-normal">{inrFormatter.format(displayPrice)}</span>
                    <span className="text-burgundy">{inrFormatter.format(displaySalePrice)}</span>
                  </div>
                ) : (
                  <span>{inrFormatter.format(displayPrice)}</span>
                )}
              </div>

              <p className="text-sm text-charcoal/80 leading-relaxed font-light">{product.description}</p>

              {/* Sizing dropdown chips */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-cinzel font-bold text-navy uppercase tracking-wider">Select Size</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSelectedSize(s.label)}
                      className={`px-4 py-2.5 border text-xs tracking-wider transition font-jost cursor-pointer ${
                        selectedSize === s.label
                          ? 'border-gold bg-gold/10 text-navy font-bold'
                          : 'border-border/60 text-muted hover:border-navy'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons row */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/20">
                {/* Qty Stepper */}
                <div className="flex border border-border/60 bg-cream">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 text-navy hover:bg-gold/10 font-bold">-</button>
                  <span className="px-5 py-3 text-navy font-semibold text-sm flex items-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-4 py-3 text-navy hover:bg-gold/10 font-bold">+</button>
                </div>

                {/* Add to Shopping Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow py-3.5 border border-navy text-navy font-cinzel text-[11px] tracking-widest uppercase hover:bg-cream transition-all duration-300 font-bold cursor-pointer"
                >
                  Add to Bag
                </button>

                {/* Direct Order */}
                <Button onClick={handleBuyNow} variant="primary" className="flex-grow py-3.5">
                  Direct Order
                </Button>

                <button 
                  onClick={handleWishlist}
                  className={`p-3.5 border border-border/60 hover:bg-cream transition cursor-pointer flex items-center justify-center ${isWishlisted ? 'text-burgundy bg-burgundy/5 border-burgundy/40' : 'text-navy'}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-burgundy' : ''}`} />
                </button>
              </div>

              {/* WhatsApp Enquiry option */}
              <a 
                href={getWhatsAppEnquiryLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-cinzel text-xs font-semibold tracking-widest py-3.5 uppercase transition shadow-md hover:shadow-lg"
              >
                <MessageSquare className="w-4 h-4 fill-white" /> WhatsApp Enquiry
              </a>

              {/* Delivery estimates and trust icons */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/20 text-center font-jost">
                <div className="flex flex-col items-center space-y-1.5">
                  <Truck className="w-5 h-5 text-gold" />
                  <span className="text-[10px] text-navy uppercase font-semibold">Free Shipping</span>
                  <span className="text-[9px] text-muted leading-tight">All orders in India</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5">
                  <RefreshCw className="w-5 h-5 text-gold" />
                  <span className="text-[10px] text-navy uppercase font-semibold">Easy Returns</span>
                  <span className="text-[9px] text-muted leading-tight">7 days exchange</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <span className="text-[10px] text-navy uppercase font-semibold">Authentic</span>
                  <span className="text-[9px] text-muted leading-tight">Hand-woven certificate</span>
                </div>
              </div>

              {/* Details Tabs Section */}
              <div className="pt-6 border-t border-border/20">
                <div className="flex border-b border-border/20 text-xs font-cinzel uppercase font-semibold tracking-widest text-muted">
                  <button 
                    onClick={() => setActiveTab('description')} 
                    className={`pb-2.5 pr-4 border-b-2 transition cursor-pointer ${activeTab === 'description' ? 'border-gold text-navy font-bold' : 'border-transparent'}`}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => setActiveTab('care')} 
                    className={`pb-2.5 px-4 border-b-2 transition cursor-pointer ${activeTab === 'care' ? 'border-gold text-navy font-bold' : 'border-transparent'}`}
                  >
                    Dimensions & Care
                  </button>
                </div>

                <div className="py-4 text-xs leading-relaxed text-charcoal/80">
                  {activeTab === 'description' && (
                    <div className="space-y-2">
                      <p><strong>Collection:</strong> {product.collection.name}</p>
                      <p><strong>Material Structure:</strong> {product.material.join(', ')}</p>
                      <p><strong>Weave Technique:</strong> {product.weaveType}</p>
                      <p><strong>Origin Hub:</strong> Bhadohi showroom, Mehboobpur</p>
                    </div>
                  )}
                  {activeTab === 'care' && (
                    <div className="space-y-2">
                      <p><strong>Pile Height:</strong> {product.pile}</p>
                      <p><strong>Pattern Style:</strong> {product.pattern}</p>
                      <p><strong>Care Advice:</strong> Professional carpet clean only. Vacuum regularly without a beater bar. Blot spills immediately with clean white cloth.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Related Products list */}
          {relatedProducts.length > 0 && (
            <div className="pt-24 border-t border-border/20">
              <span className="section-label text-center block">Signature Volume</span>
              <h2 className="font-cormorant text-2xl text-navy font-bold text-center mb-10">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
