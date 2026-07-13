import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.7,
  className = '',
  style = {}
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const getDirectionOffset = () => {
    switch (direction) {
      case 'up':
        return { y: 40, x: 0 }
      case 'left':
        return { x: 40, y: 0 }
      case 'right':
        return { x: -40, y: 0 }
      default:
        return { y: 40, x: 0 }
    }
  }

  const offset = getDirectionOffset()

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Premium bezier curve
      }}
    >
      {children}
    </motion.div>
  )
}
