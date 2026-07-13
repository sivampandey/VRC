import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../../store/cartSlice'
import { selectWishlist } from '../../store/wishlistSlice'
import { motion, AnimatePresence } from 'framer-motion'
import logoImg from '../../assets/logo.png'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const cartCount = useSelector(selectCartCount)
  const wishlist = useSelector(selectWishlist)
  const wishlistCount = wishlist.length

  const links = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'COLLECTIONS', path: '/collections' },
    { name: 'CUSTOM RUGS', path: '/custom-order' },
    { name: 'ABOUT', path: '/about' },
    { name: 'JOURNAL', path: '/journal' },
    { name: 'CONTACT', path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* NAVBAR */}
      <nav 
        className="nav sticky top-0 z-[999] w-full"
        style={{
          background: 'rgba(250, 245, 240, 0.45)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderBottom: '0.5px solid rgba(201, 165, 106, 0.18)',
          boxShadow: isScrolled ? '0 8px 32px rgba(22, 4, 0, 0.08)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <Link to="/" className="flex items-center select-none group py-0">
          <img
            src={logoImg}
            alt="Vaishnav Rug Collection"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            style={{ mixBlendMode: 'multiply' }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links hidden lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'nl font-medium'
                  : 'nl font-medium'
              }
              style={({ isActive }) => isActive ? {
                color: '#C9A56A',
                opacity: 1,
                borderBottom: '1.5px solid #C9A56A',
                paddingBottom: '2px'
              } : {}}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="nav-right">
          {/* Search Icon */}
          <i 
            className="ti ti-search" 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
          ></i>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="relative group flex items-center justify-center">
            <i className="ti ti-heart" aria-label="Wishlist"></i>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C9A56A] text-[#160400] font-jost text-[8px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon with badge style */}
          <Link to="/cart" className="cbadge flex items-center justify-center relative">
            <i className="ti ti-shopping-bag" aria-label="Cart"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C9A56A] text-[#160400] font-jost text-[8px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </Link>

          {/* Account Icon */}
          <Link to="/account/profile" className="flex items-center justify-center">
            <i className="ti ti-user" aria-label="Profile"></i>
          </Link>

          {/* Mobile Menu Toggle Icon */}
          <i 
            className="ti ti-menu-2 lg:hidden text-xl font-bold cursor-pointer" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          ></i>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[1000] lg:hidden flex justify-end">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black cursor-pointer"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-[280px] h-full overflow-y-auto p-6 border-l border-[#E0D5C8]/30 shadow-2xl flex flex-col z-10"
              style={{ 
                background: 'rgba(250, 245, 240, 0.85)', 
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)'
              }}
            >
              <div className="flex justify-between items-center pb-6 border-b border-[#E0D5C8]">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center select-none py-1">
                  <img
                    src={logoImg}
                    alt="Vaishnav Rug Collection"
                    className="h-10 w-auto object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </Link>
                <i 
                  className="ti ti-x text-2xl cursor-pointer text-[#160400] hover:text-[#C9A56A]"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                ></i>
              </div>

              <nav className="flex flex-col gap-6 py-12">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-cinzel text-lg tracking-widest transition-colors border-b border-[#E0D5C8]/40 pb-2"
                  style={({ isActive }) => isActive
                    ? { color: '#C9A56A', fontWeight: 700 }
                    : { color: '#160400' }
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto border-t border-[#E0D5C8] pt-6 text-center">
              <p className="font-cinzel text-[8px] tracking-[0.2em] text-[#C9A56A] uppercase font-semibold">
                Woven with Tradition, Made for Generations
              </p>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(22,4,0,0.92)', backdropFilter: 'blur(12px)' }}
          >
            <i 
              className="ti ti-x absolute top-6 right-6 text-3xl cursor-pointer text-white opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            ></i>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="w-full max-w-xl text-center space-y-6 px-4"
            >
              <h3 className="font-cinzel text-xs tracking-[0.3em] text-[#C9A56A] uppercase">
                Search the Collection
              </h3>

              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent text-center text-2xl font-cormorant py-3 focus:outline-none placeholder:text-white/30 text-white"
                  style={{ borderBottom: '1px solid rgba(201,165,106,0.45)' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="absolute right-0 bottom-3 text-white opacity-75 hover:opacity-100">
                  <i className="ti ti-arrow-right text-xl"></i>
                </button>
              </form>

              <p className="text-[10px] font-jost text-white/50 tracking-wider">
                Press Enter to search · Escape to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
