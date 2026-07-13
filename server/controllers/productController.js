import Product from '../models/Product.js'
import Collection from '../models/Collection.js'
import cloudinary from '../config/cloudinary.js'

// Helper to upload memory buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'vrc_products') => {
  return new Promise((resolve, reject) => {
    const base64Data = fileBuffer.toString('base64')
    const fileUri = `data:image/jpeg;base64,${base64Data}`
    cloudinary.uploader.upload(fileUri, { folder }, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

export const getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      collectionSlug, 
      material, 
      weaveType, 
      size, 
      color, 
      minPrice, 
      maxPrice, 
      sort, 
      search, 
      page = 1, 
      limit = 12 
    } = req.query

    const query = { isActive: true }

    // Text Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ]
    }

    // Faceted filtering
    if (category) query.category = category
    if (material) query.material = { $in: [material] }
    if (weaveType) query.weaveType = weaveType
    if (color) query.colors = { $in: [color] }

    if (collectionSlug) {
      const collectionObj = await Collection.findOne({ slug: collectionSlug })
      if (collectionObj) {
        query.collection = collectionObj._id
      }
    }

    if (size) {
      query['sizes.label'] = size
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    // Sorting options
    let sortQuery = { createdAt: -1 }
    if (sort === 'price-low') sortQuery = { price: 1 }
    else if (sort === 'price-high') sortQuery = { price: -1 }
    else if (sort === 'bestseller') sortQuery = { isBestseller: -1 }
    else if (sort === 'rating') sortQuery = { 'ratings.average': -1 }

    const skip = (Number(page) - 1) * Number(limit)
    const count = await Product.countDocuments(query)
    const items = await Product.find(query)
      .populate('collection', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit))

    return res.json({
      products: items,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    })
  } catch (error) {
    next(error)
  }
}

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const items = await Product.find({ isFeatured: true, isActive: true }).populate('collection', 'name slug')
    return res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getBestsellers = async (req, res, next) => {
  try {
    const items = await Product.find({ isBestseller: true, isActive: true }).populate('collection', 'name slug')
    return res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getNewArrivals = async (req, res, next) => {
  try {
    const items = await Product.find({ isNewArrival: true, isActive: true }).populate('collection', 'name slug')
    return res.json(items)
  } catch (error) {
    next(error)
  }
}

export const getProductBySlug = async (req, res, next) => {
  try {
    const item = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('collection', 'name slug description color')
    if (!item) {
      return res.status(404).json({ message: 'Product not found.' })
    }
    return res.json(item)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body)
    await product.save()
    return res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }
    return res.json(product)
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }
    return res.json({ message: 'Product deleted successfully.' })
  } catch (error) {
    next(error)
  }
}

export const uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded.' })
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer))
    const results = await Promise.all(uploadPromises)

    const newImages = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      alt: product.name
    }))

    product.images.push(...newImages)
    await product.save()

    return res.json(product)
  } catch (error) {
    next(error)
  }
}

export const removeProductImage = async (req, res, next) => {
  try {
    const { id, imgId } = req.params
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    const imageToRemove = product.images.find(img => img._id.toString() === imgId || img.public_id === imgId)
    if (!imageToRemove) {
      return res.status(404).json({ message: 'Image reference not found.' })
    }

    if (imageToRemove.public_id) {
      await cloudinary.uploader.destroy(imageToRemove.public_id)
    }

    product.images = product.images.filter(img => img._id.toString() !== imgId && img.public_id !== imgId)
    await product.save()

    return res.json(product)
  } catch (error) {
    next(error)
  }
}
