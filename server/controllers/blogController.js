import BlogPost from '../models/BlogPost.js'

export const getBlogPosts = async (req, res, next) => {
  try {
    const items = await BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 })
    return res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getBlogPostBySlug = async (req, res, next) => {
  try {
    const item = await BlogPost.findOne({ slug: req.params.slug, isPublished: true })
    if (!item) {
      return res.status(404).json({ message: 'Journal post not found.' })
    }
    return res.json(item)
  } catch (error) {
    next(error)
  }
}

export const createBlogPost = async (req, res, next) => {
  try {
    const item = new BlogPost(req.body)
    await item.save()
    return res.status(201).json(item)
  } catch (error) {
    next(error)
  }
}

export const updateBlogPost = async (req, res, next) => {
  try {
    const item = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!item) {
      return res.status(404).json({ message: 'Journal post not found.' })
    }
    return res.json(item)
  } catch (error) {
    next(error)
  }
}

export const deleteBlogPost = async (req, res, next) => {
  try {
    const item = await BlogPost.findByIdAndDelete(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Journal post not found.' })
    }
    return res.json({ message: 'Journal post deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
