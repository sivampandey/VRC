import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import Button from '../components/ui/Button'
import { journalPosts } from './Journal'

export default function JournalPost() {
  const { slug } = useParams()
  const post = journalPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="py-24 text-center bg-offwhite min-h-screen font-jost">
        <h2 className="font-cormorant text-2xl text-navy font-bold">Journal entry not found.</h2>
        <Link to="/journal" className="mt-4 inline-block"><Button variant="outline">Back to Journal</Button></Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | VRC Editorial</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[800px] mx-auto px-4 space-y-8">
          
          <Link to="/journal" className="text-xs font-cinzel text-gold font-bold hover:text-navy flex items-center gap-1.5 uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Journal Index
          </Link>

          <ScrollReveal direction="up" className="space-y-4">
            <span className="font-cinzel text-[10px] text-gold tracking-widest uppercase font-bold">{post.category}</span>
            <h1 className="font-cormorant text-3xl md:text-4xl text-navy font-bold leading-tight">{post.title}</h1>
            <div className="flex gap-4 text-xs text-muted">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </ScrollReveal>

          {/* Cover image */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="aspect-[16/9] w-full overflow-hidden border border-border/40 bg-cream">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </ScrollReveal>

          {/* Full content body */}
          <ScrollReveal direction="up" delay={0.2} className="space-y-6 text-charcoal/90 text-sm leading-relaxed font-light font-jost">
            <p>
              Handcrafted rugs are more than decorative accents; they are historical records woven in thread. In Bhadohi, India's legendary Carpet City, this tradition dates back to the late 16th century during the reign of Mughal Emperor Akbar. Traditional weavers have passed down the double-weft double-knot method row by row, warp by warp.
            </p>
            <p>
              At Vaishnav Rug Collection, we collaborate directly with weaving families in Mehboobpur and surrounding districts to document and protect this legacy. By sourcing fine mulberry silk threads from Varanasi and blending them with durable organic wools, VRC designs remain resilient for generations.
            </p>
            <p>
              Modern interiors benefit from the organic texture, heavy weight, and light-shimmer capabilities of these carpets. Whether selecting the geometric lines of a flatwoven jute dhurrie or the imperial grandeur of a Mughal medallion, commissioning a VRC rug brings a piece of Indian weaving history into your home.
            </p>
          </ScrollReveal>

        </div>
      </div>
    </>
  )
}
