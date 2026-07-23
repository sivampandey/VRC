import React from 'react'
import { Sparkles, Leaf, Maximize2, Truck, Award } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'

export default function TrustBadges() {
  const badges = [
    { icon: Sparkles, text: <>HANDCRAFTED<br />BY ARTISANS</> },
    { icon: Leaf, text: <>NATURAL<br />MATERIALS</> },
    { icon: Maximize2, text: <>CUSTOM SIZES<br />AVAILABLE</> },
    { icon: Truck, text: <>PAN INDIA<br />DELIVERY</> },
    { icon: Award, text: <>100% AUTHENTIC<br />BHADOHI</> },
  ]

  return (
    <div className="trust" role="region" aria-label="Brand trust points">
      <div className="trust-inner">
        {badges.map((badge, idx) => {
          const Icon = badge.icon
          return (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.05}>
              <div className="ti-badge group">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9A56A] transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                <span>{badge.text}</span>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </div>
  )
}
