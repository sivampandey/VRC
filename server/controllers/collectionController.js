import Collection from '../models/Collection.js'
import Product from '../models/Product.js'

export const getCollections = async (req, res, next) => {
  try {
    const items = await Collection.find({ isActive: true }).sort({ sortOrder: 1 })
    return res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getCollectionBySlug = async (req, res, next) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug, isActive: true })
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' })
    }
    const products = await Product.find({ collection: collection._id, isActive: true })
    return res.json({ collection, products })
  } catch (error) {
    next(error)
  }
}

export const createCollection = async (req, res, next) => {
  try {
    const collection = new Collection(req.body)
    await collection.save()
    return res.status(201).json(collection)
  } catch (error) {
    next(error)
  }
}

export const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' })
    }
    return res.json(collection)
  } catch (error) {
    next(error)
  }
}

export const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id)
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' })
    }
    return res.json({ message: 'Collection deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
