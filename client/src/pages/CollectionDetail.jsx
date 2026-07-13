import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import ProductCard from '../components/ui/ProductCard'
import { collections } from '../data/collections'
import { getProductsByCollection } from '../data/products'
import Button from '../components/ui/Button'

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = collections.find(c => c.slug === slug)
  const collectionProducts = getProductsByCollection(slug)

  if (!collection) {
    return (
      <div className="py-24 text-center bg-offwhite min-h-screen">
        <h2 className="font-cormorant text-2xl text-navy font-bold">Collection not found.</h2>
        <Link to="/collections" className="mt-4 inline-block"><Button variant="outline">Back to Collections</Button></Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{collection.name} | Vaishnav Rug Collection</title>
        <meta name="description" content={collection.description} />
      </Helmet>

      <div className="py-24 bg-offwhite min-h-screen text-left font-jost">
        <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <Link to="/collections" className="text-xs font-cinzel text-gold font-bold hover:text-navy flex items-center gap-1.5 uppercase mb-4">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Collections
            </Link>
            <span className="section-label">Signature Volume</span>
            <h1 className="font-cormorant text-4xl text-navy font-bold leading-tight">{collection.name}</h1>
            <p className="text-sm text-muted mt-2 max-w-xl font-jost leading-relaxed font-light">{collection.description}</p>
            <div className="divider-gold mt-6"><span className="divider-gold-diamond"></span></div>
          </div>

          {collectionProducts.length === 0 ? (
            <div className="bg-white border border-border/40 py-24 text-center">
              <p className="text-muted text-sm">No designs available in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collectionProducts.map((product, idx) => (
                <ScrollReveal key={product._id} direction="up" delay={idx * 0.05}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
