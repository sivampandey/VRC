import express from 'express'
import { addReview, getProductReviews, getPendingReviews, approveReview, deleteReview } from '../controllers/reviewController.js'
import { protect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'

import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/products/:id/reviews', protect, upload.array('reviewImages', 3), addReview)
router.get('/products/:id/reviews', getProductReviews)

router.get('/pending', protect, isAdmin, getPendingReviews)
router.put('/:id/approve', protect, isAdmin, approveReview)
router.delete('/:id', protect, isAdmin, deleteReview)

export default router
