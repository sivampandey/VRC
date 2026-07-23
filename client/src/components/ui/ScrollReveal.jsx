import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.75,
  distance = 36,
  className = '',
  style = {}
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.08 })

  const getDirectionOffset = () => {
    switch (direction) {
      case 'up':    return { y: distance, x: 0 }
      case 'down':  return { y: -distance, x: 0 }
      case 'left':  return { x: distance, y: 0 }
      case 'right': return { x: -distance, y: 0 }
      default:      return { y: distance, x: 0 }
    }
  }

  const offset = getDirectionOffset()

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      animate={isInView
        ? { opacity: 1, x: 0, y: 0 }
        : { opacity: 0, ...offset }
      }
      transition={{
        type: 'spring',
        stiffness: 60,
        damping: 18,
        mass: 0.9,
        delay: delay,
        // Fallback to tween for opacity
        opacity: { duration: duration * 0.8, ease: 'easeOut', delay },
      }}
    >
      {children}
    </motion.div>
  )
}
