import express from 'express'
import { submitInquiry, getInquiries, updateInquiryStatus, getMyInquiries, deleteInquiry } from '../controllers/customOrderController.js'
import { protect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/', upload.array('referenceImages', 3), submitInquiry)
router.get('/my', protect, getMyInquiries)
router.get('/', protect, isAdmin, getInquiries)
router.put('/:id/status', protect, isAdmin, updateInquiryStatus)
router.delete('/:id', protect, deleteInquiry)

export default router
