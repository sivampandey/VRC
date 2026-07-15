// src/components/account/AccountLayout.jsx
// Sticky sidebar + main content wrapper for all /account/* routes

import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, ShoppingBag, MapPin, Heart,
  Lock, LogOut,
} from 'lucide-react'
import { logout, selectCurrentUser } from '../../store/authSlice'
import { selectWishlist } from '../../store/wishlistSlice'

const navLinks = [
  { to: '/account/profile',   label: 'MY PROFILE',   icon: User,        short: 'Profile'  },
  { to: '/account/orders',    label: 'MY ORDERS',     icon: ShoppingBag, short: 'Orders'   },
  { to: '/account/addresses', label: 'ADDRESSES',     icon: MapPin,      short: 'Address'  },
  { to: '/account/wishlist',  label: 'WISHLIST',      icon: Heart,       short: 'Wishlist' },
  { to: '/account/security',  label: 'SECURITY',      icon: Lock,        short: 'Security' },
]

export default function AccountLayout() {
  const user     = useSelector(selectCurrentUser)
  const wishlist = useSelector(selectWishlist)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // ── Auth guard: redirect to login if not authenticated ──
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  function handleLogout() {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-warmcream flex">

      {/* ─── SIDEBAR ─── */}
      <aside className="
        hidden md:flex flex-col
        w-[260px] lg:w-[280px] xl:w-[300px]
        bg-navy flex-shrink-0
        sticky top-0 h-screen overflow-y-auto
      ">
        {/* User Card */}
        <div className="px-7 pt-8 pb-6 border-b border-gold/10">

          {/* Avatar */}
          <div className="relative w-[72px] h-[72px] mb-4">
            <div className="
              w-full h-full rounded-full
              bg-gradient-to-br from-navy-light to-navy
              border-2 border-gold
              flex items-center justify-center
              font-cinzel text-[22px] text-gold tracking-wider
              overflow-hidden
            ">
              {user?.avatar
                ? <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                : initials
              }
            </div>
            {/* Edit avatar button */}
            <button
              className="
                absolute bottom-0 right-0
                w-[22px] h-[22px] rounded-full
                bg-gold flex items-center justify-center
                hover:bg-gold-dark transition-colors cursor-pointer
              "
              aria-label="Change avatar"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#160400" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>

          {/* Name & email */}
          <h2 className="font-cormorant text-[22px] text-cream font-medium leading-tight mb-1">
            {user?.name || 'Guest User'}
          </h2>
          <p className="text-[11.5px] text-cream/40 font-light mb-3 truncate">
            {user?.email}
          </p>

          {/* VRC Member badge */}
          <div className="inline-flex items-center gap-1.5 border border-gold/35 bg-gold/10 px-3 py-1.5">
            <span className="text-gold text-[9px]">◆</span>
            <span className="font-cinzel text-[8.5px] tracking-[0.18em] text-gold">VRC MEMBER</span>
          </div>

          {/* Quick stats */}
          <div className="flex mt-4 border border-gold/12 divide-x divide-gold/12">
            {[
              { num: user?.ordersCount ?? 0,           label: 'ORDERS' },
              { num: wishlist.length,                   label: 'SAVED'  },
              { num: user?.addresses?.length ?? 0,      label: 'ADDR.'  },
            ].map(stat => (
              <div key={stat.label} className="flex-1 text-center py-2.5">
                <div className="font-cormorant text-[20px] text-cream font-light">{stat.num}</div>
                <div className="font-cinzel text-[6.5px] tracking-[0.14em] text-gold/55 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4" aria-label="Account navigation">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center gap-3 px-7 py-3.5 transition-all duration-200
                border-l-2 group
                ${isActive
                  ? 'bg-gold/8 border-gold text-cream'
                  : 'border-transparent text-cream/40 hover:text-cream/75 hover:bg-cream/5 hover:border-gold/40'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={`flex-shrink-0 transition-colors ${isActive ? 'text-gold' : 'text-cream/40 group-hover:text-cream/70'}`}
                  />
                  <span className={`font-cinzel text-[10px] tracking-[0.12em] transition-colors ${isActive ? 'text-cream' : ''}`}>
                    {label}
                  </span>
                  {label === 'WISHLIST' && wishlist.length > 0 && (
                    <span className="ml-auto bg-gold text-navy text-[8px] font-semibold px-1.5 py-0.5 font-jost">
                      {wishlist.length}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-7 py-5 border-t border-gold/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-cream/40 hover:text-cream/70 transition-colors group cursor-pointer"
          >
            <LogOut size={15} className="group-hover:text-gold/60 transition-colors" />
            <span className="font-cinzel text-[10px] tracking-[0.12em]">SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 min-w-0 pb-24 md:pb-10 bg-warmcream">
        {/* Mobile Header Banner */}
        <div className="md:hidden bg-navy text-cream px-6 py-5 flex items-center justify-between border-b border-gold/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d0b04] to-navy border border-gold flex items-center justify-center font-cinzel text-sm text-gold">
              {initials}
            </div>
            <div>
              <h2 className="font-cormorant text-lg font-medium leading-none mb-0.5">{user?.name}</h2>
              <p className="text-[10px] text-cream/40 truncate max-w-[150px]">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-[#C9A56A]/30 bg-[#C9A56A]/5 px-2.5 py-1.5 text-[#C9A56A] hover:bg-[#C9A56A]/15 transition-colors rounded cursor-pointer"
          >
            <LogOut size={12} />
            <span className="font-cinzel text-[8px] tracking-wider font-semibold">SIGN OUT</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── MOBILE BOTTOM TAB BAR ─── */}
      <nav
        className="
          fixed bottom-0 inset-x-0 bg-navy border-t border-gold/12
          flex md:hidden z-50
        "
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Mobile account navigation"
      >
        {navLinks.slice(0, 4).map(({ to, short, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors
              ${isActive ? 'text-gold' : 'text-cream/35'}
            `}
          >
            <Icon size={18} />
            <span className="font-cinzel text-[7px] tracking-wider">{short.toUpperCase()}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
