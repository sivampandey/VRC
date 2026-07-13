export const products = [
  {
    _id: '60d5ec49f1b29a1b44b8f101',
    name: 'Classic Persian Medallion',
    slug: 'classic-persian-medallion',
    sku: 'VRC-HB-001',
    collection: { _id: '60d5ec49f1b29a1b44b8f001', name: 'Heritage Bhadohi', slug: 'heritage-bhadohi' },
    shortDescription: 'Classic Persian medallion rug hand-knotted in Bhadohi.',
    description: 'An intricate representation of classical Safavid floral motifs. Meticulously hand-knotted over six months using high-twist local wools for premium resilience.',
    images: [{ url: '/assets/products/carpet1.jpg', alt: 'Classic Persian Medallion Rug' }],
    category: 'Traditional',
    material: ['Local Highland Wool', 'Organic Cotton Warp'],
    weaveType: 'Hand-Knotted / Double Weft',
    price: 28500,
    salePrice: null,
    sizes: [
      { label: '5x8 ft', price: 28500, stock: 3 },
      { label: '6x9 ft', price: 38500, stock: 2 },
      { label: '8x10 ft', price: 57000, stock: 1 }
    ],
    colors: ['Cream', 'Royal Navy', 'Saffron Gold'],
    pattern: 'Medallion',
    pile: 'Medium Pile (12mm)',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    ratings: { average: 4.8, count: 18 },
    totalSold: 42
  },
  {
    _id: '60d5ec49f1b29a1b44b8f102',
    name: 'Vintage Indigo Wash',
    slug: 'vintage-indigo-wash',
    sku: 'VRC-MW-001',
    collection: { _id: '60d5ec49f1b29a1b44b8f003', name: 'Modern Weave', slug: 'modern-weave' },
    shortDescription: 'Distressed vintage styling in deep indigo tones.',
    description: 'Features a contemporary distressed look with variations of indigo blue and washed cream tones, suitable for high-traffic living spaces.',
    images: [{ url: '/assets/products/carpet2.jpg', alt: 'Vintage Indigo Wash' }],
    category: 'Modern / Abstract',
    material: ['Wool & Tencel blend'],
    weaveType: 'Loom-Woven',
    price: 19500,
    salePrice: 17000,
    sizes: [
      { label: '5x8 ft', price: 19500, stock: 4 },
      { label: '6x9 ft', price: 26000, stock: 3 },
      { label: '8x10 ft', price: 38000, stock: 2 }
    ],
    colors: ['Indigo Blue', 'Ivory'],
    pattern: 'Distressed Abstract',
    pile: 'Low Pile (6mm)',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: true,
    ratings: { average: 4.6, count: 9 },
    totalSold: 15
  },
  {
    _id: '60d5ec49f1b29a1b44b8f103',
    name: 'Imperial Crimson Oushak',
    slug: 'imperial-crimson-oushak',
    sku: 'VRC-HB-002',
    collection: { _id: '60d5ec49f1b29a1b44b8f001', name: 'Heritage Bhadohi', slug: 'heritage-bhadohi' },
    shortDescription: 'Bold tribal motifs in saturated madder dyes.',
    description: 'Inspired by traditional Turkish Oushak designs with soft geometric floral medallions set on a striking crimson base.',
    images: [{ url: '/assets/products/carpet3.jpg', alt: 'Imperial Crimson Oushak' }],
    category: 'Traditional',
    material: ['100% Hand-Spun Wool'],
    weaveType: 'Hand-Knotted',
    price: 34000,
    salePrice: null,
    sizes: [
      { label: '5x8 ft', price: 34000, stock: 2 },
      { label: '6x9 ft', price: 46000, stock: 3 },
      { label: '8x10 ft', price: 62000, stock: 1 }
    ],
    colors: ['Crimson Red', 'Gold', 'Teal'],
    pattern: 'Oushak Medallions',
    pile: 'Medium Pile (10mm)',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: false,
    ratings: { average: 4.9, count: 14 },
    totalSold: 22
  },
  {
    _id: '60d5ec49f1b29a1b44b8f104',
    name: 'Geometric Diamond Flatweave',
    slug: 'geometric-diamond-flatweave',
    sku: 'VRC-NO-001',
    collection: { _id: '60d5ec49f1b29a1b44b8f004', name: 'Natural & Organic', slug: 'natural-organic' },
    shortDescription: 'Nordic minimalist diamond designs in organic wool.',
    description: 'A flat-woven rug that merges sustainable design with modern geometric symmetry. Perfect for casual dining and modern bedrooms.',
    images: [{ url: '/assets/products/carpet4.jpg', alt: 'Geometric Diamond Flatweave' }],
    category: 'Natural Flatweaves',
    material: ['80% Un-dyed Wool', '20% Jute Warp'],
    weaveType: 'Hand-Woven flatweave',
    price: 15500,
    salePrice: 13500,
    sizes: [
      { label: '5x8 ft', price: 15500, stock: 6 },
      { label: '6x9 ft', price: 21000, stock: 4 }
    ],
    colors: ['Charcoal Black', 'Warm Beige'],
    pattern: 'Scandinavian Diamond Grid',
    pile: 'Flatweave (No Pile)',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    ratings: { average: 4.4, count: 11 },
    totalSold: 18
  },
  {
    _id: '60d5ec49f1b29a1b44b8f105',
    name: 'Royal Sapphire Medallion',
    slug: 'royal-sapphire-medallion',
    sku: 'VRC-HB-003',
    collection: { _id: '60d5ec49f1b29a1b44b8f001', name: 'Heritage Bhadohi', slug: 'heritage-bhadohi' },
    shortDescription: 'Historic palace layout in royal blue and golden silk highlights.',
    description: 'Crafted with premium highland wool and highlights of pure mulberry silk to enhance the scrollwork medallion borders.',
    images: [{ url: '/assets/products/carpet5.jpg', alt: 'Royal Sapphire Medallion' }],
    category: 'Traditional',
    material: ['Hand-Spun Wool', 'Mulberry Silk highlights'],
    weaveType: 'Hand-Knotted / Double Weft',
    price: 48000,
    salePrice: 42000,
    sizes: [
      { label: '5x8 ft', price: 48000, stock: 2 },
      { label: '6x9 ft', price: 62000, stock: 2 },
      { label: '8x10 ft', price: 89000, stock: 1 }
    ],
    colors: ['Royal Blue', 'Gold', 'Antique Ivory'],
    pattern: 'Safavid Medallion',
    pile: 'Plush Pile (12mm)',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    ratings: { average: 4.8, count: 19 },
    totalSold: 30
  },
  {
    _id: '60d5ec49f1b29a1b44b8f106',
    name: 'Sage Green Palace Scroll',
    slug: 'sage-green-palace-scroll',
    sku: 'VRC-MG-001',
    collection: { _id: '60d5ec49f1b29a1b44b8f005', name: 'Mughal Gardens', slug: 'mughal-gardens' },
    shortDescription: 'Elegantly repeating floral vines on a soft sage base.',
    description: 'Captures the botanical symmetry of the Amber Palace gardens. Meticulously detailed over several months using fine-spun local yarns.',
    images: [{ url: '/assets/products/carpet6.jpg', alt: 'Sage Green Palace Scroll' }],
    category: 'Traditional',
    material: ['Local Highland Wool'],
    weaveType: 'Fine Hand-Knotted',
    price: 36000,
    salePrice: null,
    sizes: [
      { label: '5x8 ft', price: 36000, stock: 4 },
      { label: '6x9 ft', price: 48500, stock: 3 },
      { label: '8x10 ft', price: 69000, stock: 2 }
    ],
    colors: ['Sage Green', 'Crimson Red', 'Cream'],
    pattern: 'Mughal Floral Scroll',
    pile: 'Medium Pile (11mm)',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    ratings: { average: 4.7, count: 7 },
    totalSold: 12
  },
  {
    _id: '60d5ec49f1b29a1b44b8f107',
    name: 'Earthy Terracotta Stripes',
    slug: 'earthy-terracotta-stripes',
    sku: 'VRC-RD-001',
    collection: { _id: '60d5ec49f1b29a1b44b8f006', name: 'Royal Dhurrie', slug: 'royal-dhurrie' },
    shortDescription: 'Traditional flat-woven dhurrie with mineral-dyed bands.',
    description: 'Handcrafted on traditional pit looms in Bhadohi. A sturdy cotton-wool weave with horizontal stripes in warm earth tones.',
    images: [{ url: '/assets/products/carpet7.jpg', alt: 'Earthy Terracotta Stripes' }],
    category: 'Natural Flatweaves',
    material: ['70% Organic Cotton', '30% Highland Wool'],
    weaveType: 'Pit-Loom Hand-Woven Dhurrie',
    price: 12500,
    salePrice: 9800,
    sizes: [
      { label: '4x6 ft', price: 8500, stock: 5 },
      { label: '5x8 ft', price: 12500, stock: 4 },
      { label: '6x9 ft', price: 16800, stock: 2 }
    ],
    colors: ['Terracotta Orange', 'Olive Green', 'Cream'],
    pattern: 'Horizontal Block Stripes',
    pile: 'Flatweave (No Pile)',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    ratings: { average: 4.5, count: 13 },
    totalSold: 21
  },
  {
    _id: '60d5ec49f1b29a1b44b8f108',
    name: 'Banarasi Silk Vines',
    slug: 'banarasi-silk-vines',
    sku: 'VRC-SL-001',
    collection: { _id: '60d5ec49f1b29a1b44b8f002', name: 'Silk Luxe', slug: 'silk-luxe' },
    shortDescription: 'Luminous cream and blue vines in pure mulberry silk.',
    description: 'An architectural layout capturing the classical brocade borders of Banarasi silk. Possesses a glowing sheen.',
    images: [{ url: '/assets/products/carpet8.jpg', alt: 'Banarasi Silk Vines' }],
    category: 'Silk Masterpieces',
    material: ['100% Fine Mulberry Silk'],
    weaveType: 'Fine Hand-Knotted',
    price: 85000,
    salePrice: null,
    sizes: [
      { label: '5x8 ft', price: 85000, stock: 2 },
      { label: '6x9 ft', price: 115000, stock: 1 }
    ],
    colors: ['Ivory Cream', 'Lapis Blue', 'Gold'],
    pattern: 'Floral Vine Border',
    pile: 'Low Sheen Pile (8mm)',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    ratings: { average: 4.9, count: 16 },
    totalSold: 26
  },
  {
    _id: '60d5ec49f1b29a1b44b8f109',
    name: 'Bold Tribal Diamond',
    slug: 'bold-tribal-diamond',
    sku: 'VRC-MW-002',
    collection: { _id: '60d5ec49f1b29a1b44b8f003', name: 'Modern Weave', slug: 'modern-weave' },
    shortDescription: 'Striking black and ivory geometric diamonds.',
    description: 'A bold, modern design featuring high-contrast geometric lines. Ideal for contemporary living spaces and study rooms.',
    images: [{ url: '/assets/products/carpet9.jpg', alt: 'Bold Tribal Diamond' }],
    category: 'Modern / Abstract',
    material: ['100% Fine New Zealand Wool'],
    weaveType: 'Hand-Tufted',
    price: 24500,
    salePrice: null,
    sizes: [
      { label: '5x8 ft', price: 24500, stock: 3 },
      { label: '6x9 ft', price: 33000, stock: 2 }
    ],
    colors: ['Charcoal Black', 'Ivory'],
    pattern: 'Tribal Geometric Chevron',
    pile: 'Thick Plush Pile (15mm)',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    ratings: { average: 4.6, count: 8 },
    totalSold: 14
  },
  {
    _id: '60d5ec49f1b29a1b44b8f110',
    name: 'Aura Floral Lattice',
    slug: 'aura-floral-lattice',
    sku: 'VRC-SL-002',
    collection: { _id: '60d5ec49f1b29a1b44b8f002', name: 'Silk Luxe', slug: 'silk-luxe' },
    shortDescription: 'Delicate floral sprays set in a light lattice grid.',
    description: 'Woven with wool and highlights of pure Banarasi silk. Delivers soft, intricate motifs with a luminous sheen.',
    images: [{ url: '/assets/products/carpet10.jpg', alt: 'Aura Floral Lattice' }],
    category: 'Silk Masterpieces',
    material: ['Hand-Spun Wool', 'Mulberry Silk highlights'],
    weaveType: 'Super Fine Hand-Knotted',
    price: 68000,
    salePrice: 59000,
    sizes: [
      { label: '5x8 ft', price: 68000, stock: 2 },
      { label: '6x9 ft', price: 89000, stock: 2 }
    ],
    colors: ['Soft Cream', 'Saffron Gold', 'Rose Pink'],
    pattern: 'Lattice Floral Sprays',
    pile: 'Fine Low Pile (9mm)',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    ratings: { average: 4.8, count: 10 },
    totalSold: 19
  },
  {
    _id: '60d5ec49f1b29a1b44b8f111',
    name: 'Agra Green Striped Dhurrie',
    slug: 'agra-green-striped-dhurrie',
    sku: 'VRC-RD-002',
    collection: { _id: '60d5ec49f1b29a1b44b8f006', name: 'Royal Dhurrie', slug: 'royal-dhurrie' },
    shortDescription: 'Classic Agra horizontal stripes in muted green cotton.',
    description: 'Inspired by traditional flat-woven striped dhurries of Agra. Meticulously hand-loomed with natural organic cotton yarns and organic dyes.',
    images: [{ url: '/assets/products/dhurrie1.jpg', alt: 'Agra Green Striped Dhurrie' }],
    category: 'Dhurrie Flatweaves',
    material: ['100% Organic Cotton'],
    weaveType: 'Hand-Woven Dhurrie',
    price: 11500,
    salePrice: null,
    sizes: [
      { label: '5x8 ft', price: 11500, stock: 5 },
      { label: '6x9 ft', price: 15500, stock: 3 }
    ],
    colors: ['Sage Green', 'Warm Beige'],
    pattern: 'Horizontal Stripes',
    pile: 'Flatweave (No Pile)',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    ratings: { average: 4.6, count: 12 },
    totalSold: 18
  },
  {
    _id: '60d5ec49f1b29a1b44b8f112',
    name: 'Bespoke Nomad Chevron Dhurrie',
    slug: 'bespoke-nomad-chevron-dhurrie',
    sku: 'VRC-RD-003',
    collection: { _id: '60d5ec49f1b29a1b44b8f006', name: 'Royal Dhurrie', slug: 'royal-dhurrie' },
    shortDescription: 'Traditional nomad diamond lattice chevrons in natural beige.',
    description: 'A flat-woven masterwork capturing the geometric lattice styling of historical desert nomads. Reversible double-faced design.',
    images: [{ url: '/assets/products/dhurrie2.jpg', alt: 'Bespoke Nomad Chevron Dhurrie' }],
    category: 'Dhurrie Flatweaves',
    material: ['60% Highland Wool', '40% Cotton'],
    weaveType: 'Double-Faced Dhurrie (Reversible)',
    price: 14500,
    salePrice: 12800,
    sizes: [
      { label: '5x8 ft', price: 14500, stock: 4 },
      { label: '6x9 ft', price: 19500, stock: 2 }
    ],
    colors: ['Camel Beige', 'Charcoal Black'],
    pattern: 'Geometric Nomad Lattice',
    pile: 'Flatweave (Reversible)',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    ratings: { average: 4.8, count: 20 },
    totalSold: 35
  },
  {
    _id: '60d5ec49f1b29a1b44b8f113',
    name: 'Imperial Labyrinths Diamond Dhurrie',
    slug: 'imperial-labyrinths-diamond-dhurrie',
    sku: 'VRC-RD-004',
    collection: { _id: '60d5ec49f1b29a1b44b8f006', name: 'Royal Dhurrie', slug: 'royal-dhurrie' },
    shortDescription: 'High contrast black and gold geometric labyrinth diamonds.',
    description: 'A striking statement piece that merges historical labyrinth grids with high contrast geometric execution. Extremely resilient flatweave.',
    images: [{ url: '/assets/products/dhurrie3.jpg', alt: 'Imperial Labyrinths Diamond Dhurrie' }],
    category: 'Dhurrie Flatweaves',
    material: ['80% Highland Wool', '20% Cotton Warp'],
    weaveType: 'Heavy Flat-Woven Dhurrie',
    price: 16800,
    salePrice: null,
    sizes: [
      { label: '5x8 ft', price: 16800, stock: 3 },
      { label: '6x9 ft', price: 22000, stock: 2 }
    ],
    colors: ['Charcoal Black', 'Golden Beige'],
    pattern: 'Labyrinth Diamond Grid',
    pile: 'Flatweave (No Pile)',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    ratings: { average: 4.7, count: 15 },
    totalSold: 22
  }
]

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured)
}

export function getBestsellers() {
  return products.filter((product) => product.isBestseller)
}

export function getNewArrivals() {
  return products.filter((product) => product.isNewArrival)
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCollection(collectionSlug) {
  return products.filter((product) => product.collection.slug === collectionSlug)
}
