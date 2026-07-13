import React from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../ui/ScrollReveal'
import CollectionCard from '../ui/CollectionCard'
import { collections } from '../../data/collections'

export default function FeaturedCollections() {
  // Let's filter the collections. We want to display all 5 collections in our grid just like the design
  // contains 5 cards! This aligns perfectly with our data of 5 items.
  const displayCollections = collections

  return (
    <section className="sec sec-off" role="region" aria-label="Our collections">
      <div className="container max-w-[1200px] mx-auto px-0">
        <div className="sec-hdr flex-col sm:flex-row gap-4 items-start sm:items-end">
          <ScrollReveal direction="up">
            <div className="sec-lbl">EXPLORE</div>
            <h2 className="sec-h2">Our Collections</h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.08}>
            <Link to="/collections" className="viewall">
              View All &nbsp;<i className="ti ti-arrow-right animate-pulse" aria-hidden="true"></i>
            </Link>
          </ScrollReveal>
        </div>

        <div className="col-grid mt-8">
          {displayCollections.map((col, idx) => (
            <ScrollReveal key={col.slug} direction="up" delay={idx * 0.05}>
              <CollectionCard collection={col} index={idx} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
