import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Collection from './models/Collection.js'
import Product from './models/Product.js'
import User from './models/User.js'

const collectionsToSeed = [
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f001'),
    name: 'Heritage Bhadohi',
    slug: 'heritage-bhadohi',
    subtitle: 'Classic Hand-Knotted Masterworks',
    description: 'Directly from the weaving epicenter of India, Mehboobpur, Bhadohi. These carpets carry a 400-year legacy of double-weft hand-knotting using premium local wool blends and classic Persian/Mughal medallions.',
    coverImage: { url: '/assets/collections/collection_heritage.jpg' },
    heroImage: { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1600' },
    color: '#1B2A45',
    isFeatured: true,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f002'),
    name: 'Silk Luxe',
    slug: 'silk-luxe',
    subtitle: 'Luminous Sheen & Fine Weaves',
    description: 'Impeccably woven using 100% pure fine mulberry silk and Banarasi weaves. These carpets possess a high-density, delicate pile that shimmer dynamically under varying light conditions.',
    coverImage: { url: '/assets/collections/collection_silk.jpg' },
    heroImage: { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1600' },
    color: '#C9A56A',
    isFeatured: true,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f003'),
    name: 'Modern Weave',
    slug: 'modern-weave',
    subtitle: 'Contemporary Geometric Formats',
    description: 'Clean profiles, abstract forms, and minimalist diamonds designed for modern urban flats. Blended using high-grade wool yarns with low pile profiles for a sleek look.',
    coverImage: { url: '/assets/collections/collection_modern.jpg' },
    heroImage: { url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1600' },
    color: '#2C2C2C',
    isFeatured: false,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f004'),
    name: 'Natural & Organic',
    slug: 'natural-organic',
    subtitle: 'Eco-Friendly Earthy Textures',
    description: 'Crafted using un-dyed local wool, organic jute fibers, and premium cotton flatweaves. Sustainable textures that celebrate the organic variations of earth elements.',
    coverImage: { url: '/assets/collections/collection_natural.jpg' },
    heroImage: { url: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=1600' },
    color: '#7A7065',
    isFeatured: false,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f005'),
    name: 'Mughal Gardens',
    slug: 'mughal-gardens',
    subtitle: 'Floral Grandeur of Amber Palace',
    description: 'Grand architectural medallion grids inspired by royal Mughal layout gardens. Rich colors of madder root burgundy and saffron gold woven into wool and silk piles.',
    coverImage: { url: '/assets/collections/collection_mughal.jpg' },
    heroImage: { url: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&q=80&w=1600' },
    color: '#8B1C1C',
    isFeatured: true,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f006'),
    name: 'Royal Dhurrie',
    slug: 'royal-dhurrie',
    subtitle: 'Heritage Flatweaves & Bold Stripes',
    description: 'Vibrantly hand-woven Indian dhurrie flatweaves rooted in Rajasthani and Agra traditions. Crafted on pit looms using high-twist cotton and wool yarns with bold geometric and stripe patterns.',
    coverImage: { url: '/assets/collections/collection_dhurrie.jpg' },
    heroImage: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=1600' },
    color: '#2D6A4F',
    isFeatured: true,
    isActive: true
  }
]

const productsToSeed = [
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f101'),
    name: 'Classic Persian Medallion',
    slug: 'classic-persian-medallion',
    sku: 'VRC-HB-001',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f001'),
    shortDescription: 'Classic Persian medallion rug hand-knotted in Bhadohi.',
    description: 'An intricate representation of classical Safavid floral motifs. Meticulously hand-knotted over six months using high-twist local wools for premium resilience.',
    images: [{ url: '/assets/products/carpet1.jpg', alt: 'Classic Persian Medallion Rug' }],
    category: 'Traditional',
    material: ['Local Highland Wool', 'Organic Cotton Warp'],
    weaveType: 'Hand-Knotted / Double Weft',
    price: 28500,
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
    ratings: { average: 4.8, count: 18 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f102'),
    name: 'Vintage Indigo Wash',
    slug: 'vintage-indigo-wash',
    sku: 'VRC-MW-001',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f003'),
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
    ratings: { average: 4.6, count: 9 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f103'),
    name: 'Imperial Crimson Oushak',
    slug: 'imperial-crimson-oushak',
    sku: 'VRC-HB-002',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f001'),
    shortDescription: 'Bold tribal motifs in saturated madder dyes.',
    description: 'Inspired by traditional Turkish Oushak designs with soft geometric floral medallions set on a striking crimson base.',
    images: [{ url: '/assets/products/carpet3.jpg', alt: 'Imperial Crimson Oushak' }],
    category: 'Traditional',
    material: ['100% Hand-Spun Wool'],
    weaveType: 'Hand-Knotted',
    price: 34000,
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
    ratings: { average: 4.9, count: 14 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f104'),
    name: 'Geometric Diamond Flatweave',
    slug: 'geometric-diamond-flatweave',
    sku: 'VRC-NO-001',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f004'),
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
    ratings: { average: 4.4, count: 11 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f105'),
    name: 'Royal Sapphire Medallion',
    slug: 'royal-sapphire-medallion',
    sku: 'VRC-HB-003',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f001'),
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
    ratings: { average: 4.8, count: 19 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f106'),
    name: 'Sage Green Palace Scroll',
    slug: 'sage-green-palace-scroll',
    sku: 'VRC-MG-001',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f005'),
    shortDescription: 'Elegantly repeating floral vines on a soft sage base.',
    description: 'Captures the botanical symmetry of the Amber Palace gardens. Meticulously detailed over several months using fine-spun local yarns.',
    images: [{ url: '/assets/products/carpet6.jpg', alt: 'Sage Green Palace Scroll' }],
    category: 'Traditional',
    material: ['Local Highland Wool'],
    weaveType: 'Fine Hand-Knotted',
    price: 36000,
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
    ratings: { average: 4.7, count: 7 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f107'),
    name: 'Earthy Terracotta Stripes',
    slug: 'earthy-terracotta-stripes',
    sku: 'VRC-RD-001',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f006'),
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
    ratings: { average: 4.5, count: 13 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f108'),
    name: 'Banarasi Silk Vines',
    slug: 'banarasi-silk-vines',
    sku: 'VRC-SL-001',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f002'),
    shortDescription: 'Luminous cream and blue vines in pure mulberry silk.',
    description: 'An architectural layout capturing the classical brocade borders of Banarasi silk. Possesses a glowing sheen.',
    images: [{ url: '/assets/products/carpet8.jpg', alt: 'Banarasi Silk Vines' }],
    category: 'Silk Masterpieces',
    material: ['100% Fine Mulberry Silk'],
    weaveType: 'Fine Hand-Knotted',
    price: 85000,
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
    ratings: { average: 4.9, count: 16 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f109'),
    name: 'Bold Tribal Diamond',
    slug: 'bold-tribal-diamond',
    sku: 'VRC-MW-002',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f003'),
    shortDescription: 'Striking black and ivory geometric diamonds.',
    description: 'A bold, modern design featuring high-contrast geometric lines. Ideal for contemporary living spaces and study rooms.',
    images: [{ url: '/assets/products/carpet9.jpg', alt: 'Bold Tribal Diamond' }],
    category: 'Modern / Abstract',
    material: ['100% Fine New Zealand Wool'],
    weaveType: 'Hand-Tufted',
    price: 24500,
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
    ratings: { average: 4.6, count: 8 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f110'),
    name: 'Aura Floral Lattice',
    slug: 'aura-floral-lattice',
    sku: 'VRC-SL-002',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f002'),
    shortDescription: 'Delicate floral sprays set in a light lattice grid.',
    description: 'Woven with wool and highlights of pure Banarasi silk. Delivers soft, intricate motifs with a luminous sheen.',
    images: [{ url: '/assets/products/carpet10.jpg', alt: 'Aura Floral Lattice' }],
    category: 'Silk Masterpieces',
    material: ['Hand-Spun Wool', 'Mulberry Silk highlights'],
    weaveType: 'Super Fine Hand-Knotted',
    price: 68000,
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
    ratings: { average: 4.8, count: 10 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f111'),
    name: 'Agra Green Striped Dhurrie',
    slug: 'agra-green-striped-dhurrie',
    sku: 'VRC-RD-002',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f006'),
    shortDescription: 'Classic Agra horizontal stripes in muted green cotton.',
    description: 'Inspired by traditional flat-woven striped dhurries of Agra. Meticulously hand-loomed with natural organic cotton yarns and organic dyes.',
    images: [{ url: '/assets/products/dhurrie1.jpg', alt: 'Agra Green Striped Dhurrie' }],
    category: 'Dhurrie Flatweaves',
    material: ['100% Organic Cotton'],
    weaveType: 'Hand-Woven Dhurrie',
    price: 11500,
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
    ratings: { average: 4.6, count: 12 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f112'),
    name: 'Bespoke Nomad Chevron Dhurrie',
    slug: 'bespoke-nomad-chevron-dhurrie',
    sku: 'VRC-RD-003',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f006'),
    shortDescription: 'Traditional nomad diamond lattice chevrons in natural beige.',
    description: 'A flat-woven masterwork capturing the geometric lattice styling of historical desert nomads. Reversible double-faced design.',
    images: [{ url: '/assets/products/dhurrie2.jpg', alt: 'Bespoke Nomad Chevron Dhurrie' }],
    category: 'Dhurrie Flatweaves',
    material: ['60% Highland Wool', '40% Cotton'],
    weaveType: 'Double-Faced Dhurrie (Reversible)',
    price: 14500,
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
    ratings: { average: 4.8, count: 20 }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f113'),
    name: 'Imperial Labyrinths Diamond Dhurrie',
    slug: 'imperial-labyrinths-diamond-dhurrie',
    sku: 'VRC-RD-004',
    collection: new mongoose.Types.ObjectId('60d5ec49f1b29a1b44b8f006'),
    shortDescription: 'High contrast black and gold geometric labyrinth diamonds.',
    description: 'A striking statement piece that merges historical labyrinth grids with high contrast geometric execution. Extremely resilient flatweave.',
    images: [{ url: '/assets/products/dhurrie3.jpg', alt: 'Imperial Labyrinths Diamond Dhurrie' }],
    category: 'Dhurrie Flatweaves',
    material: ['80% Highland Wool', '20% Cotton Warp'],
    weaveType: 'Heavy Flat-Woven Dhurrie',
    price: 16800,
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
    ratings: { average: 4.7, count: 15 }
  }
]

export const seedDatabase = async () => {
  console.log('Clearing database...')
  await Collection.deleteMany({})
  await Product.deleteMany({})
  await User.deleteMany({ role: 'admin' })

  console.log('Seeding Collections...')
  await Collection.insertMany(collectionsToSeed)
  console.log(`Seeded ${collectionsToSeed.length} collections.`)

  console.log('Seeding Products...')
  await Product.insertMany(productsToSeed)
  console.log(`Seeded ${productsToSeed.length} products.`)

  console.log('Seeding Default Admin User...')
  const adminUser = new User({
    name: 'VRC Administrator',
    email: 'admin@vaishnavrug.com',
    password: 'adminpassword',
    phone: '918707630603',
    role: 'admin'
  })
  await adminUser.save()
  console.log('Admin user seeded: admin@vaishnavrug.com / adminpassword')
}

const seed = async () => {
  await connectDB()
  await seedDatabase()
  console.log('Database Seeding Completed Successfully.')
  process.exit(0)
}

if (process.argv[1] && (process.argv[1].endsWith('seed.js') || process.argv[1].endsWith('seed'))) {
  seed().catch(err => {
    console.error('Error seeding database:', err)
    process.exit(1)
  })
}
