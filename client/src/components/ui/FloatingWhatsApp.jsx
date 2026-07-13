import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false)
  const phoneNumber = '918707630603'
  const message = 'Hi Vaishnav Rug Collection, I need help'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  // Continuous floating loop animation keyframes
  const floatTransition = {
    y: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Small "Chat with us" text label that fades in on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block bg-navy text-cream font-cinzel text-[10px] font-semibold tracking-wider uppercase px-4 py-2 border border-gold/30 shadow-lg"
          >
            Chat with us
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main green circular button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          y: [-6, 0, -6],
        }}
        transition={floatTransition}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:shadow-[#25d366]/30 hover:shadow-2xl transition-shadow duration-300 relative group cursor-pointer rounded-full"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-transparent shrink-0" />
      </motion.a>
    </div>
  )
}
