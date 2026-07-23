import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function CollectionCard({ collection }) {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  // Magnetic tilt values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 280, damping: 28 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 280, damping: 28 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onClick={() => navigate(`/collections/${collection.slug}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      whileHover={{ scale: 1.018 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      className="relative group h-[240px] sm:h-[320px] md:h-[460px] w-full overflow-hidden shadow-xl rounded-sm cursor-pointer bg-[#160400]"
    >
      {/* Cover Image with Zoom Effect */}
      {collection.coverImage ? (
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-[#160400]/20" />
      )}

      {/* Dark elegant gradient wash overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/95 pointer-events-none" />

      {/* Gold shimmer sweep on hover */}
      <div
        className="absolute inset-0 pointer-events-none z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'linear-gradient(115deg, transparent 20%, rgba(201,165,106,0.14) 50%, transparent 80%)',
          backgroundSize: '300% 100%',
          animation: 'goldShimmer 2s ease forwards',
        }}
      />

      {/* Collection Details Container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10 text-left flex flex-col justify-end">

        {/* Subtitle / Volume Label */}
        <motion.span
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="font-cinzel text-[7.5px] sm:text-[9px] tracking-[0.2em] text-[#C9A56A] uppercase font-bold mb-0.5 sm:mb-1.5"
        >
          {collection.subtitle ? collection.subtitle.split(' & ')[0] : 'Signature Volume'}
        </motion.span>

        {/* Collection Name */}
        <h3 className="font-cormorant text-lg sm:text-2xl md:text-3xl text-white font-bold leading-tight mb-1 sm:mb-2 group-hover:text-[#C9A56A] transition-colors duration-300">
          {collection.name}
        </h3>

        {/* Piece Count */}
        <div className="font-cinzel text-[7px] sm:text-[8px] tracking-widest text-white/60 uppercase font-semibold mb-1.5 sm:mb-3">
          {collection.productCount || 0} masterworks catalogued
        </div>

        {/* Smooth Reveal Details on hover */}
        <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-24 group-hover:opacity-100 transition-all duration-700 ease-in-out">
          <p className="font-jost text-xs text-white/70 line-clamp-2 leading-relaxed mb-4">
            {collection.description}
          </p>
          <div className="font-cinzel text-[9px] tracking-widest text-[#C9A56A] font-bold flex items-center gap-1.5">
            EXPLORE COLLECTION
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            >→</motion.span>
          </div>
        </div>

      </div>

      {/* Top border gold — slides down from top on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C9A56A] via-[#E8C97A] to-[#C9A56A] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

      {/* Corner ornament top-right */}
      <div className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full rotate-90">
          <path d="M4 4 L4 16 M4 4 L16 4" stroke="#C9A56A" strokeWidth="1" />
        </svg>
      </div>
    </motion.div>
  )
}
