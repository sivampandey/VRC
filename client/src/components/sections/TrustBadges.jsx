import React from 'react'
import ScrollReveal from '../ui/ScrollReveal'

export default function TrustBadges() {
  const badges = [
    { iconClass: 'ti ti-needle-thread', text: <>HANDCRAFTED<br />BY ARTISANS</> },
    { iconClass: 'ti ti-leaf', text: <>NATURAL<br />MATERIALS</> },
    { iconClass: 'ti ti-arrows-maximize', text: <>CUSTOM SIZES<br />AVAILABLE</> },
    { iconClass: 'ti ti-truck-delivery', text: <>PAN INDIA<br />DELIVERY</> },
    { iconClass: 'ti ti-award', text: <>100% AUTHENTIC<br />BHADOHI</> },
  ]

  return (
    <div className="trust" role="region" aria-label="Brand trust points">
      <div className="trust-inner flex flex-wrap md:flex-nowrap justify-around gap-y-8 gap-x-4">
        {badges.map((badge, idx) => (
          <React.Fragment key={idx}>
            <ScrollReveal direction="up" delay={idx * 0.05} className="w-[45%] md:w-auto">
              <div className="ti-badge">
                <i className={badge.iconClass} aria-hidden="true"></i>
                <span>{badge.text}</span>
              </div>
            </ScrollReveal>
            {idx < badges.length - 1 && (
              <div className="tdiv hidden md:block"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
