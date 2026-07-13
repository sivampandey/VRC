import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  sku: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String },
    alt: { type: String }
  }],
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  category: { type: String, required: true },      // Traditional, Modern, Abstract, Silk, Flatweave, Kilim
  material: [{ type: String }],    // Wool, Silk, Jute, Cotton, Viscose
  weaveType: { type: String },     // Hand-Knotted, Hand-Tufted, Flatweave, Dhurrie
  origin: { type: String, default: 'Bhadohi' },        // Bhadohi, Jaipur, Kashmir
  price: { type: Number, required: true },
  salePrice: { type: Number },
  sizes: [{
    label: { type: String, required: true },       // "2x3 ft", "4x6 ft", "6x9 ft", "8x10 ft", "Custom"
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 }
  }],
  colors: [{ type: String }],
  colorHex: [{ type: String }],
  pattern: { type: String },
  pile: { type: String },
  washable: { type: Boolean, default: false },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  careInstructions: { type: String },
  deliveryDays: { type: Number, default: 7 },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  totalSold: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)
export default Product
