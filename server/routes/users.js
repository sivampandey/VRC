import express from 'express'
import { getProfile, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, getWishlist, toggleWishlist, getUsers, deleteUser } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = express.Router()

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.put('/password', protect, changePassword)

router.post('/addresses', protect, addAddress)
router.put('/addresses/:id', protect, updateAddress)
router.delete('/addresses/:id', protect, deleteAddress)

router.get('/wishlist', protect, getWishlist)
router.post('/wishlist/:productId', protect, toggleWishlist)

router.get('/', protect, isAdmin, getUsers)
router.delete('/:id', protect, isAdmin, deleteUser)

export default router
