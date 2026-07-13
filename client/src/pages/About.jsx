import React from 'react'
import { Helmet } from 'react-helmet-async'
import ScrollReveal from '../components/ui/ScrollReveal'
import aboutBgImg from '../assets/about_bg.jpg'

export default function About() {
  return (
    <>
      <Helmet>
        <title>Our Story & Heritage | Vaishnav Rug Collection</title>
        <meta name="description" content="Discover the craftsmanship and legacy of VRC. Sourced directly from Bhadohi weavers." />
      </Helmet>

      {/* Main Wrapper container */}
      <div className="relative min-h-screen text-left font-jost overflow-hidden bg-black">
        
        {/* Blurred background image layer (no added color, just blurred photo with slight darkening for readability) */}
        <div 
          className="absolute inset-0 pointer-events-none scale-110"
          style={{
            backgroundImage: `url(${aboutBgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px) brightness(0.4)'
          }}
        />

        <div className="relative z-10 container max-w-[800px] mx-auto px-4">
          
          {/* Top Title Section */}
          <div className="text-center pt-32 pb-12">
            <ScrollReveal direction="up">
              <span className="block font-cinzel text-[#C9A56A] text-[9.5px] uppercase tracking-[0.25em] font-bold">
                ESTABLISHED 2005
              </span>
              <h1 className="font-cormorant text-4xl md:text-5xl text-white font-normal leading-tight mt-2">
                Our Story & Heritage
              </h1>
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-px w-8 bg-[#C9A56A]/60"></div>
                <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A56A]"></div>
                <div className="h-px w-8 bg-[#C9A56A]/60"></div>
              </div>
            </ScrollReveal>
          </div>

          {/* Content Section */}
          <div className="pb-24 space-y-12">
            
            <ScrollReveal direction="up" className="space-y-6 text-white text-opacity-95 leading-relaxed font-light text-base">
              <p className="text-white text-opacity-95">
                Vaishnav Rug Collection (VRC) is a luxury brand rooted in the historical weaving epicenter of India — <strong>Bhadohi, Uttar Pradesh</strong>. Directed by proprietor <strong>Rashmi Jaiswal</strong>, VRC bridges ancestral artisanal legacies with high-end modern interior aesthetics.
              </p>
              <p className="text-white text-opacity-95">
                Our design laboratory and main showroom are located in Mehboobpur, near the landmark St. Xavier School and Indra Mill Chauraha. Here, we draft classical floral grids and oversee the complete, weeks-long processing of raw highland wool and fine mulberry silk.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" className="border-t border-[#C9A56A]/25 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-[#C9A56A] uppercase tracking-wider">Craftsmanship</h4>
                <p className="text-xs text-white text-opacity-80 leading-relaxed">Honoring the double-weft double-knot method that keeps carpets durable for generations.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-[#C9A56A] uppercase tracking-wider">Sustainability</h4>
                <p className="text-xs text-white text-opacity-80 leading-relaxed">Sourcing organic jute, local wool fibers, and natural dyes to maintain eco-friendly looms.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-[#C9A56A] uppercase tracking-wider">Community</h4>
                <p className="text-xs text-white text-opacity-80 leading-relaxed">Directly supporting and funding master weavers in Mehboobpur, maintaining fair wages.</p>
              </div>
            </ScrollReveal>

          </div>
          
        </div>
      </div>
    </>
  )
}
