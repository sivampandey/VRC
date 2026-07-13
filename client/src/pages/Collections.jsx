import React from 'react'
import { Helmet } from 'react-helmet-async'
import ScrollReveal from '../components/ui/ScrollReveal'
import CollectionCard from '../components/ui/CollectionCard'
import { collections } from '../data/collections'

export default function Collections() {
  return (
    <>
      <Helmet>
        <title>Collections Catalog | Vaishnav Rug Collection</title>
        <meta name="description" content="Explore signature handcrafted carpet lines from Vaishnav Rug Collection." />
      </Helmet>

      {/* Classy modern studio catalog layout */}
      <div className="py-24 bg-[#FAF8F5] min-h-screen text-center font-jost">
        <div className="container max-w-[1200px] mx-auto px-4">
          
          {/* Curated Studio Intro */}
          <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center mb-16">
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-[#C9A56A] uppercase font-bold">Curated Volumes</span>
            <h1 className="font-cormorant text-4xl md:text-5xl text-[#160400] font-light mt-3 mb-4 leading-tight">Our Collections</h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-[#C9A56A]/40"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A56A]"></div>
              <div className="h-px w-12 bg-[#C9A56A]/40"></div>
            </div>
            <p className="font-jost text-sm text-[#7A7065] leading-relaxed max-w-xl mx-auto">
              Explore signature handcrafted volumes representing a unique convergence of regional heritage, double-weft knotting techniques, and contemporary forms.
            </p>
          </ScrollReveal>

          {/* Luxury Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col, idx) => (
              <ScrollReveal key={col.slug} direction="up" delay={idx * 0.1}>
                <CollectionCard collection={col} />
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
