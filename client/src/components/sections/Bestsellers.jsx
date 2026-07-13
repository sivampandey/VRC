import React from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'
import ProductCard from '../ui/ProductCard'
import { getBestsellers } from '../../data/products'

export default function Bestsellers() {
  const items = getBestsellers()

  return (
    <section className="sec" role="region" aria-label="Bestselling rugs">
      <div className="container max-w-[1200px] mx-auto px-0">
        <div className="sec-hdr flex-col sm:flex-row gap-4 items-start sm:items-end">
          <ScrollReveal direction="up">
            <div className="sec-lbl">MOST LOVED</div>
            <h2 className="sec-h2">Best Sellers</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.08}>
            <Link to="/shop" className="viewall">
              View All &nbsp;<i className="ti ti-arrow-right animate-pulse" aria-hidden="true"></i>
            </Link>
          </ScrollReveal>
        </div>

        <div className="prods mt-8">
          {items.slice(0, 4).map((product, idx) => (
            <ScrollReveal key={product._id} direction="up" delay={idx * 0.05}>
              <ProductCard product={product} index={idx} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
