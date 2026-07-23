import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

export default function CustomOrderCTA() {
  const steps = [
    {
      num: '1',
      title: 'CHOOSE SIZE & DESIGN',
      desc: 'Pick your dimensions, material, and pattern style'
    },
    {
      num: '2',
      title: 'SHARE REQUIREMENTS',
      desc: 'Upload references, describe your vision and budget'
    },
    {
      num: '3',
      title: 'GET YOUR QUOTE',
      desc: 'We respond within 24 hours with pricing and timeline'
    }
  ]

  return (
    <section className="cta-bg" role="region" aria-label="Custom rug order">
      {/* Ambient glow top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(201,165,106,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <ScrollReveal direction="up">
          <div className="cta-lbl">BESPOKE RUGS</div>
          <h2 className="cta-h2">Can't find what you're looking for?</h2>
          <p className="cta-p">
            We craft rugs to your exact size, colour, and design. Get a personalized quote within 24 hours from our master weavers in Bhadohi.
          </p>
        </ScrollReveal>

        <div className="cta-steps mt-4 sm:mt-12 mb-4 sm:mb-12">
          {steps.map((step, idx) => (
            <ScrollReveal key={step.num} direction="up" delay={idx * 0.1} className="w-full md:w-auto flex-1 flex justify-center">
              <motion.div
                className="cta-step"
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <motion.div
                  className="cta-sc"
                  whileHover={{
                    boxShadow: '0 0 32px rgba(201,165,106,0.6), 0 0 0 6px rgba(201,165,106,0.1)',
                    borderColor: 'rgba(201,165,106,0.8)',
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {step.num}
                </motion.div>
                <div className="cta-sn">{step.title}</div>
                <div className="cta-sd">{step.desc}</div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Buttons */}
        <ScrollReveal direction="up" delay={0.25}>
          <div className="cta-btns">
            <Link to="/custom-order">
              <motion.button
                className="btn-g"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                START CUSTOM ORDER &nbsp;<ArrowRight className="w-3.5 h-3.5 inline-block" />
              </motion.button>
            </Link>
            <a href="https://wa.me/918707630603" target="_blank" rel="noopener noreferrer">
              <motion.button
                className="btn-wa"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <MessageCircle className="w-4 h-4 inline-block" /> CHAT ON WHATSAPP
              </motion.button>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
