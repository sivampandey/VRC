import express from 'express'
import { getCollections, getCollectionBySlug, createCollection, updateCollection, deleteCollection } from '../controllers/collectionController.js'
import { protect } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = express.Router()

router.get('/', getCollections)
router.get('/:slug', getCollectionBySlug)

router.post('/', protect, isAdmin, createCollection)
router.put('/:id', protect, isAdmin, updateCollection)
router.delete('/:id', protect, isAdmin, deleteCollection)

export default router
