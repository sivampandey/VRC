import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CollectionCard({ collection }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/collections/${collection.slug}`)}
      className="relative group h-[480px] w-full overflow-hidden shadow-xl rounded-sm cursor-pointer bg-[#160400] transition-all duration-500 hover:shadow-2xl"
    >
      {/* Cover Image with Zoom Effect */}
      {collection.coverImage ? (
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[#160400]/20" />
      )}

      {/* Dark elegant gradient wash overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/90 pointer-events-none" />

      {/* Collection Details Container */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-left flex flex-col justify-end">
        
        {/* Subtitle / Volume Label */}
        <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#C9A56A] uppercase font-bold mb-1.5 transition-transform duration-500">
          {collection.subtitle ? collection.subtitle.split(' & ')[0] : 'Signature Volume'}
        </span>

        {/* Collection Name */}
        <h3 className="font-cormorant text-2xl md:text-3xl text-white font-bold leading-tight mb-2 group-hover:text-[#C9A56A] transition-colors duration-300">
          {collection.name}
        </h3>

        {/* Piece Count */}
        <div className="font-cinzel text-[8px] tracking-widest text-white/50 uppercase font-semibold mb-3">
          {collection.productCount || 0} masterworks catalogued
        </div>

        {/* Smooth Reveal Details (Description & Call to Action on hover) */}
        <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-24 group-hover:opacity-100 transition-all duration-700 ease-in-out">
          <p className="font-jost text-xs text-white/70 line-clamp-2 leading-relaxed mb-4">
            {collection.description}
          </p>
          <div className="font-cinzel text-[9px] tracking-widest text-[#C9A56A] font-bold flex items-center gap-1.5">
            EXPLORE COLLECTION 
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>

      </div>

      {/* Top border gold highlights */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A56A] to-[#160400] transform -translate-y-1 group-hover:translate-y-0 transition-transform duration-300" />
    </div>
  )
}
