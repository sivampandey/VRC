import mongoose from 'mongoose'

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  subtitle: { type: String },
  description: { type: String },
  coverImage: {
    url: { type: String },
    public_id: { type: String }
  },
  heroImage: {
    url: { type: String },
    public_id: { type: String }
  },
  color: { type: String, default: '#1B2A45' }, // Accent color mapping
  sortOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
})

const Collection = mongoose.model('Collection', collectionSchema)
export default Collection
