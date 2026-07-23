import React from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'
import ProductCard from '../ui/ProductCard'
import MobileSwipeSlider from '../ui/MobileSwipeSlider'
import { getBestsellers } from '../../data/products'

export default function Bestsellers() {
  const items = getBestsellers().slice(0, 4)

  return (
    <section className="sec" role="region" aria-label="Bestselling rugs">
      <div className="container max-w-[1200px] mx-auto px-0">

        {/* ── Desktop header (hidden on mobile — slider has its own header) ── */}
        <div className="sec-hdr flex-col sm:flex-row gap-4 items-start sm:items-end hidden md:flex">
          <ScrollReveal direction="up">
            <div className="sec-lbl">MOST LOVED</div>
            <h2 className="sec-h2">Best Sellers</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.08}>
            <Link to="/shop" className="viewall">
              View All &nbsp;<i className="ti ti-arrow-right" aria-hidden="true"></i>
            </Link>
          </ScrollReveal>
        </div>

        {/* ── Mobile: swipeable single-card slider ── */}
        {/* ── Desktop: normal 4-col grid ── */}
        <MobileSwipeSlider
          items={items}
          label="MOST LOVED"
          title="Best Sellers"
          viewAllLink={{ to: '/shop', label: 'View All' }}
          renderCard={(product, idx) => (
            <ProductCard key={product._id} product={product} index={idx} />
          )}
          sectionClass="mt-8"
          gridClass="prods"
        />

      </div>
    </section>
  )
}
