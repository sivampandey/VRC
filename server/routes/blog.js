import express from 'express'
import { getBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/blogController.js'
import { protect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = express.Router()

router.get('/', getBlogPosts)
router.get('/:slug', getBlogPostBySlug)

router.post('/', protect, isAdmin, createBlogPost)
router.put('/:id', protect, isAdmin, updateBlogPost)
router.delete('/:id', protect, isAdmin, deleteBlogPost)

export default router
