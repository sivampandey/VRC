import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

/**
 * MobileSwipeSlider
 * - On mobile (< md): shows one card at a time with swipe/drag + dot indicators
 * - On desktop (≥ md): renders children in a normal grid (controlled by parent CSS)
 *
 * Props:
 *   items        – array of data items
 *   renderCard   – (item, index) => JSX  (the card to render)
 *   title        – section heading string
 *   label        – small label above heading
 *   viewAllLink  – { to, label }
 *   sectionClass – extra CSS class on <section>
 */
export default function MobileSwipeSlider({
  items = [],
  renderCard,
  title,
  label,
  viewAllLink,
  sectionClass = '',
  gridClass = '',
}) {
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragX = useMotionValue(0)
  const containerRef = useRef(null)

  const CARD_WIDTH = typeof window !== 'undefined'
    ? (window.innerWidth < 640 ? 220 : Math.min(window.innerWidth - 32, 340))
    : 220
  const GAP = 12

  // Go to a specific slide
  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx))
    setCurrent(clamped)
    animate(dragX, -(clamped * (CARD_WIDTH + GAP)), {
      type: 'spring',
      stiffness: 280,
      damping: 30,
    })
  }

  const handleDragEnd = (_, info) => {
    setIsDragging(false)
    const threshold = CARD_WIDTH * 0.22
    if (info.offset.x < -threshold) goTo(current + 1)
    else if (info.offset.x > threshold) goTo(current - 1)
    else goTo(current) // snap back
  }

  return (
    <>
      {/* ─── MOBILE VIEW (< md) ─── */}
      <div className="block md:hidden">
        {/* Header */}
        <div className="flex items-end justify-between mb-5 px-4">
          <div>
            {label && (
              <p className="font-cinzel text-[9px] tracking-[0.22em] text-[#C9A56A] mb-1 uppercase font-bold">
                {label}
              </p>
            )}
            {title && (
              <h2 className="font-cormorant text-[28px] text-[#160400] font-semibold leading-tight">
                {title}
              </h2>
            )}
          </div>
          {viewAllLink && (
            <a
              href={viewAllLink.to}
              className="font-cinzel text-[9px] tracking-widest text-[#7A7065] border-b border-[#E0D5C8] pb-0.5 flex items-center gap-1 shrink-0 mb-1"
            >
              {viewAllLink.label || 'View All'} →
            </a>
          )}
        </div>

        {/* Swipe Track */}
        <div
          ref={containerRef}
          className="overflow-hidden"
          style={{ paddingLeft: 16, paddingRight: 16 }}
        >
          <motion.div
            className="flex"
            style={{
              x: dragX,
              gap: GAP,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            drag="x"
            dragConstraints={{
              left: -(items.length - 1) * (CARD_WIDTH + GAP),
              right: 0,
            }}
            dragElastic={0.08}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                style={{
                  minWidth: CARD_WIDTH,
                  width: CARD_WIDTH,
                  flexShrink: 0,
                  pointerEvents: isDragging ? 'none' : 'auto',
                }}
                animate={{
                  scale: idx === current ? 1 : 0.95,
                  opacity: idx === current ? 1 : 0.65,
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderCard(item, idx)}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="transition-all duration-300"
              style={{
                width: idx === current ? 22 : 6,
                height: 6,
                borderRadius: 3,
                background: idx === current ? '#C9A56A' : '#E0D5C8',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Swipe hint — shows only once briefly */}
        {current === 0 && (
          <motion.p
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="text-center font-cinzel text-[8px] tracking-widest text-[#7A7065]/60 mt-3 uppercase pointer-events-none"
          >
            ← swipe to explore →
          </motion.p>
        )}
      </div>

      {/* ─── DESKTOP VIEW (≥ md) — normal grid via parent CSS ─── */}
      <div className={`hidden md:block ${sectionClass}`}>
        <div className={gridClass}>
          {items.map((item, idx) => renderCard(item, idx))}
        </div>
      </div>
    </>
  )
}
