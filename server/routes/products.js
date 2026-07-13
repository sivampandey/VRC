import express from 'express'
import { getProducts, getFeaturedProducts, getBestsellers, getNewArrivals, getProductBySlug, createProduct, updateProduct, deleteProduct, uploadProductImages, removeProductImage } from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/featured', getFeaturedProducts)
router.get('/bestsellers', getBestsellers)
router.get('/new-arrivals', getNewArrivals)
router.get('/:slug', getProductBySlug)

router.post('/', protect, isAdmin, createProduct)
router.put('/:id', protect, isAdmin, updateProduct)
router.delete('/:id', protect, isAdmin, deleteProduct)

router.post('/:id/images', protect, isAdmin, upload.array('images', 5), uploadProductImages)
router.delete('/:id/images/:imgId', protect, isAdmin, removeProductImage)

export default router
