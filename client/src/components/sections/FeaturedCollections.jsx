import React from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'
import CollectionCard from '../ui/CollectionCard'
import MobileSwipeSlider from '../ui/MobileSwipeSlider'
import { collections } from '../../data/collections'

export default function FeaturedCollections() {
  const displayCollections = collections

  return (
    <section className="sec sec-off" role="region" aria-label="Our collections">
      <div className="container max-w-[1200px] mx-auto px-0">

        {/* ── Desktop header (hidden on mobile — slider has its own) ── */}
        <div className="sec-hdr flex-col sm:flex-row gap-4 items-start sm:items-end hidden md:flex">
          <ScrollReveal direction="up">
            <div className="sec-lbl">EXPLORE</div>
            <h2 className="sec-h2">Our Collections</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.08}>
            <Link to="/collections" className="viewall">
              View All &nbsp;<i className="ti ti-arrow-right" aria-hidden="true"></i>
            </Link>
          </ScrollReveal>
        </div>

        {/* ── Mobile: swipeable single-card slider ── */}
        {/* ── Desktop: normal 3-col grid ── */}
        <MobileSwipeSlider
          items={displayCollections}
          label="EXPLORE"
          title="Our Collections"
          viewAllLink={{ to: '/collections', label: 'View All' }}
          renderCard={(col, idx) => (
            <CollectionCard key={col.slug} collection={col} index={idx} />
          )}
          sectionClass="mt-8"
          gridClass="col-grid"
        />

      </div>
    </section>
  )
}
