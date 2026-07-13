import express from 'express'
import { placeOrder, getMyOrders, getOrderById, getOrders, updateOrderStatus, updateOrderTracking } from '../controllers/orderController.js'
import { protect, optionalProtect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = express.Router()

router.post('/', optionalProtect, placeOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getOrderById)

router.get('/', protect, isAdmin, getOrders)
router.put('/:id/status', protect, isAdmin, updateOrderStatus)
router.put('/:id/tracking', protect, isAdmin, updateOrderTracking)

export default router
