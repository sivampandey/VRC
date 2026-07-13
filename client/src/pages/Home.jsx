import React from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/sections/Hero'
import TrustBadges from '../components/sections/TrustBadges'
import FeaturedCollections from '../components/sections/FeaturedCollections'
import CraftProcess from '../components/sections/CraftProcess'
import Bestsellers from '../components/sections/Bestsellers'
import CustomOrderCTA from '../components/sections/CustomOrderCTA'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Vaishnav Rug Collection | Premium Handcrafted Bhadohi Carpets</title>
        <meta name="description" content="Explore luxury handcrafted carpets and rugs from Vaishnav Rug Collection. Custom size ordering and hand-knotted legacy directly from Bhadohi, India." />
      </Helmet>
      
      <div className="bg-offwhite min-h-screen">
        <Hero />
        <TrustBadges />
        <FeaturedCollections />
        <CraftProcess />
        <Bestsellers />
        <CustomOrderCTA />
      </div>
    </>
  )
}
