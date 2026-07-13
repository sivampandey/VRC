import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  coverImage: { type: String },
  category: { type: String, default: 'Weaving Tales' },
  author: { type: String, default: 'Rashmi Jaiswal' },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
})

const BlogPost = mongoose.model('BlogPost', blogPostSchema)
export default BlogPost
