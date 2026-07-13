import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ui/ScrollReveal'

export const journalPosts = [
  {
    title: 'The Art of Hand-Knotting: A Bhadohi Legacy',
    slug: 'art-of-hand-knotting',
    excerpt: 'Explore the 400-year history of double-weft hand-knotted carpet weaving in the heart of Uttar Pradesh.',
    coverImage: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&q=80&w=800',
    date: 'July 5, 2026',
    author: 'Rashmi Jaiswal',
    category: 'Weaving Heritage'
  },
  {
    title: 'Sourcing Silk: The Mulberry Weaves of Banaras',
    slug: 'sourcing-silk',
    excerpt: 'How fine mulberry silk fibers are spun and woven into high density luxury VRC carpets.',
    coverImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800',
    date: 'June 28, 2026',
    author: 'Rashmi Jaiswal',
    category: 'Material Spotlight'
  },
  {
    title: 'Eco-friendly Flatweaves: The Rise of Organic Jute',
    slug: 'organic-jute-flatweaves',
    excerpt: 'Discover why sustainability-focused flatwoven jute dhurries are leading modern urban interior layouts.',
    coverImage: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=800',
    date: 'May 14, 2026',
    author: 'Rashmi Jaiswal',
    category: 'Modern Living'
  }
]

export default function Journal() {
  return (
    <>
      <Helmet>
        <title>VRC Design Journal | Vaishnav Rug Collection</title>
        <meta name="description" content="Read weaving stories, design guides, and collection launch updates from Bhadohi." />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[1000px] mx-auto px-4">
          
          <ScrollReveal direction="up" className="text-center mb-16">
            <span className="section-label">Artisanal Chronicles</span>
            <h1 className="font-cormorant text-3xl md:text-4xl text-navy font-bold leading-tight">The VRC Journal</h1>
            <div className="divider-gold mt-6"><span className="divider-gold-diamond"></span></div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journalPosts.map((post, idx) => (
              <ScrollReveal key={post.slug} direction="up" delay={idx * 0.1}>
                <Link
                  to={`/journal/${post.slug}`}
                  className="bg-white border border-border/40 overflow-hidden flex flex-col group hover:shadow-lg transition duration-300 h-full block"
                >
                  <div className="aspect-[16/10] bg-cream overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="font-cinzel text-[10px] text-gold tracking-widest uppercase font-bold">{post.category}</span>
                      <h3 className="font-cormorant text-lg text-navy font-semibold line-clamp-2 group-hover:text-gold transition">
                        {post.title}
                      </h3>
                      <p className="text-xs text-charcoal/80 line-clamp-3 leading-relaxed font-light">{post.excerpt}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border/20 mt-4 text-[10px] text-muted">
                      <span>By {post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
