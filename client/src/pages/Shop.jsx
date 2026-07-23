import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../components/ui/ScrollReveal'
import ProductCard from '../components/ui/ProductCard'
import { products } from '../data/products'
import { collections } from '../data/collections'

export default function Shop() {
  const [selectedCollections, setSelectedCollections] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedPattern, setSelectedPattern] = useState('')
  const [priceRange, setPriceRange] = useState(120000)
  const [sortBy, setSortBy] = useState('newest')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  
  const categories = ['Traditional', 'Silk Masterpieces', 'Modern / Abstract', 'Natural Flatweaves', 'Royal Floral Collections']
  const materials = ['Wool', 'Silk', 'Jute', 'Cotton']
  const sizes = ['4x6 ft', '5x8 ft', '6x9 ft', '8x10 ft']
  const colors = ['Cream', 'Royal Navy', 'Saffron Gold', 'Burgundy', 'Natural Grey', 'Ivory', 'Indigo Blue', 'Madder Root Red']
  
  const handleCollectionToggle = (slug) => {
    setSelectedCollections(prev => 
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    )
  }

  const resetFilters = () => {
    setSelectedCollections([])
    setSelectedCategory('')
    setSelectedMaterial('')
    setSelectedSize('')
    setSelectedColor('')
    setSelectedPattern('')
    setPriceRange(120000)
    setSearchParams({})
  }

  // Faceted Filtering Logics
  const filteredProducts = products.filter(product => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = product.name.toLowerCase().includes(query)
      const matchesDesc = product.description.toLowerCase().includes(query)
      const matchesSku = product.sku.toLowerCase().includes(query)
      const matchesCategory = product.category.toLowerCase().includes(query)
      if (!matchesName && !matchesDesc && !matchesSku && !matchesCategory) return false
    }
    if (selectedCollections.length > 0 && !selectedCollections.includes(product.collection.slug)) return false
    if (selectedCategory && product.category !== selectedCategory) return false
    if (selectedMaterial && !product.material.some(m => m.toLowerCase().includes(selectedMaterial.toLowerCase()))) return false
    if (selectedSize && !product.sizes.some(s => s.label === selectedSize)) return false
    if (selectedColor && !product.colors.includes(selectedColor)) return false
    if (selectedPattern && product.pattern !== selectedPattern) return false
    
    const finalPrice = product.salePrice || product.price
    if (finalPrice > priceRange) return false

    return true
  })

  // Sorting logics
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.price
    const priceB = b.salePrice || b.price
    if (sortBy === 'price-low') return priceA - priceB
    if (sortBy === 'price-high') return priceB - priceA
    if (sortBy === 'bestseller') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)
    if (sortBy === 'rating') return b.ratings.average - a.ratings.average
    return b.isNewArrival - a.isNewArrival 
  })

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })

  return (
    <>
      <Helmet>
        <title>Showroom Catalog | Vaishnav Rug Collection</title>
        <meta name="description" content="Browse our luxury rugs and carpets collections. Filter by category, material, and custom sizes." />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="text-xs text-muted/80 uppercase tracking-widest font-cinzel mb-8">
            <Link to="/" className="hover:text-gold transition">Home</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-navy font-semibold">Shop Gallery</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* 1. Sidebar Filters for Desktop */}
            <aside className="w-full lg:w-[280px] bg-white border border-border/40 p-6 space-y-8 shrink-0 hidden lg:block">
              <div className="flex justify-between items-center border-b border-border/20 pb-4">
                <h3 className="font-cinzel text-xs tracking-widest font-bold text-navy uppercase flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold" /> Filters
                </h3>
                <button onClick={resetFilters} className="text-[10px] uppercase font-cinzel text-gold hover:text-navy cursor-pointer">
                  Clear All
                </button>
              </div>

              {/* Collections section */}
              <div className="space-y-3.5">
                <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Collections</h4>
                <div className="space-y-2 text-xs text-muted">
                  {collections.map((col) => (
                    <label key={col.slug} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCollections.includes(col.slug)}
                        onChange={() => handleCollectionToggle(col.slug)}
                        className="accent-gold"
                      />
                      <span>{col.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Category</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-offwhite border border-border/50 p-2.5 text-xs text-navy focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Material selector */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Material</h4>
                <div className="flex flex-wrap gap-2">
                  {materials.map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(selectedMaterial === m ? '' : m)}
                      className={`px-3 py-1.5 border text-[10px] tracking-wider uppercase font-cinzel transition-all ${
                        selectedMaterial === m ? 'border-gold bg-gold/10 text-navy font-bold' : 'border-border/60 text-muted hover:border-navy'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing presets */}
              <div className="space-y-3">
                <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Preset Size</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      className={`px-3 py-1.5 border text-[10px] tracking-wider uppercase font-cinzel transition-all ${
                        selectedSize === s ? 'border-gold bg-gold/10 text-navy font-bold' : 'border-border/60 text-muted hover:border-navy'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range selector slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-cinzel font-bold text-navy uppercase">
                  <span>Max Price</span>
                  <span className="text-gold-dark">{inrFormatter.format(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="120000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

            </aside>

            {/* 2. Main Content Column */}
            <div className="flex-grow w-full space-y-6">
              
              {/* Header Grid and sort bar */}
              <div className="bg-white border border-border/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-muted uppercase font-cinzel font-bold tracking-wider">
                  {filteredProducts.length} Designs found
                </span>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center justify-center gap-2 border border-border/40 text-xs p-2.5 bg-white text-navy font-cinzel tracking-wider cursor-pointer flex-grow sm:flex-grow-0 animate-fadeIn"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-gold" /> Filter
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-offwhite border border-border/40 text-xs p-2.5 text-navy font-cinzel tracking-wider focus:outline-none flex-grow sm:w-[180px] cursor-pointer"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="price-low">Sort: Price Low-High</option>
                    <option value="price-high">Sort: Price High-Low</option>
                    <option value="bestseller">Sort: Bestsellers</option>
                    <option value="rating">Sort: Best Rated</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(searchQuery || selectedCollections.length > 0 || selectedCategory || selectedMaterial || selectedSize || selectedColor || selectedPattern) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] uppercase font-cinzel text-muted tracking-wider mr-2">Active Filters:</span>
                  {searchQuery && (
                    <span className="bg-cream text-navy border border-border/50 text-[10px] px-2.5 py-1 flex items-center gap-1.5 uppercase font-cinzel">
                      Search: "{searchQuery}"
                      <X className="w-3 h-3 text-muted hover:text-navy cursor-pointer" onClick={() => {
                        const newParams = new URLSearchParams(searchParams)
                        newParams.delete('search')
                        setSearchParams(newParams)
                      }} />
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="bg-cream text-navy border border-border/50 text-[10px] px-2.5 py-1 flex items-center gap-1.5 uppercase font-cinzel">
                      {selectedCategory}
                      <X className="w-3 h-3 text-muted hover:text-navy cursor-pointer" onClick={() => setSelectedCategory('')} />
                    </span>
                  )}
                  {selectedMaterial && (
                    <span className="bg-cream text-navy border border-border/50 text-[10px] px-2.5 py-1 flex items-center gap-1.5 uppercase font-cinzel">
                      {selectedMaterial}
                      <X className="w-3 h-3 text-muted hover:text-navy cursor-pointer" onClick={() => setSelectedMaterial('')} />
                    </span>
                  )}
                  {selectedSize && (
                    <span className="bg-cream text-navy border border-border/50 text-[10px] px-2.5 py-1 flex items-center gap-1.5 uppercase font-cinzel">
                      {selectedSize}
                      <X className="w-3 h-3 text-muted hover:text-navy cursor-pointer" onClick={() => setSelectedSize('')} />
                    </span>
                  )}
                  {selectedCollections.map(slug => (
                    <span key={slug} className="bg-cream text-navy border border-border/50 text-[10px] px-2.5 py-1 flex items-center gap-1.5 uppercase font-cinzel">
                      {collections.find(c => c.slug === slug)?.name}
                      <X className="w-3 h-3 text-muted hover:text-navy cursor-pointer" onClick={() => handleCollectionToggle(slug)} />
                    </span>
                  ))}
                  <button onClick={resetFilters} className="text-[10px] font-cinzel text-gold hover:text-navy uppercase underline ml-2 cursor-pointer">
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Card Grid */}
              {sortedProducts.length === 0 ? (
                <div className="bg-white border border-border/40 py-16 text-center">
                  <p className="text-muted text-xs sm:text-sm">No rugs match your selected filters. Please clear filters and try again.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
                  {sortedProducts.map((prod, idx) => (
                    <ScrollReveal key={prod._id} direction="up" delay={idx * 0.05}>
                      <ProductCard product={prod} />
                    </ScrollReveal>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black"
            />
            
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-[300px] bg-white shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col z-10"
            >
              <div className="flex justify-between items-center border-b border-border/20 pb-4">
                <h3 className="font-cinzel text-xs tracking-widest font-bold text-navy uppercase flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gold" /> Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-muted hover:text-navy cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter controls inside mobile drawer */}
              <div className="space-y-6 flex-grow text-left">
                {/* Collections */}
                <div className="space-y-3">
                  <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Collections</h4>
                  <div className="space-y-2 text-xs text-muted">
                    {collections.map((col) => (
                      <label key={col.slug} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCollections.includes(col.slug)}
                          onChange={() => handleCollectionToggle(col.slug)}
                          className="accent-gold"
                        />
                        <span>{col.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Category</h4>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-offwhite border border-border/50 p-2.5 text-xs text-navy focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Material */}
                <div className="space-y-3">
                  <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Material</h4>
                  <div className="flex flex-wrap gap-2">
                    {materials.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMaterial(selectedMaterial === m ? '' : m)}
                        className={`px-3 py-1.5 border text-[10px] tracking-wider uppercase font-cinzel transition-all ${
                          selectedMaterial === m ? 'border-gold bg-gold/10 text-navy font-bold' : 'border-border/60 text-muted hover:border-navy'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-3">
                  <h4 className="font-cinzel text-[11px] font-bold tracking-wider text-navy uppercase">Preset Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                        className={`px-3 py-1.5 border text-[10px] tracking-wider uppercase font-cinzel transition-all ${
                          selectedSize === s ? 'border-gold bg-gold/10 text-navy font-bold' : 'border-border/60 text-muted hover:border-navy'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-cinzel font-bold text-navy uppercase">
                    <span>Max Price</span>
                    <span className="text-gold-dark">{inrFormatter.format(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="120000"
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>
              </div>

              {/* Bottom Buttons inside drawer */}
              <div className="pt-4 border-t border-border/20 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="flex-grow py-3 border border-navy text-navy font-cinzel text-[10px] font-semibold tracking-wider uppercase hover:bg-cream/40 transition cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-grow py-3 bg-gold text-navy font-cinzel text-[10px] font-semibold tracking-wider uppercase hover:bg-gold-dark transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
