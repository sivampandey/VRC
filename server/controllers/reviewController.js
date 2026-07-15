import Review from '../models/Review.js'
import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'

const uploadToCloudinary = (fileBuffer, folder = 'vrc_reviews') => {
  return new Promise((resolve, reject) => {
    const fileBase64 = fileBuffer.toString('base64')
    const fileUri = `data:image/jpeg;base64,${fileBase64}`

    cloudinary.uploader.upload(fileUri, { folder }, (error, result) => {
      if (error) return reject(error)
      resolve(result.secure_url)
    })
  })
}

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true })
  const count = reviews.length
  const average = count > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count) : 0
  
  await Product.findByIdAndUpdate(productId, {
    ratings: { average, count }
  })
}

export const addReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body
    const productId = req.params.id

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    let imageUrls = []
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer))
        imageUrls = await Promise.all(uploadPromises)
      } catch (uploadErr) {
        console.warn('Image upload failed — proceeding without images:', uploadErr.message)
      }
    }

    const review = new Review({
      product: productId,
      user: req.user ? req.user._id : undefined,
      name: req.user ? req.user.name : (req.body.name || 'Anonymous'),
      rating: Number(rating),
      title,
      comment,
      images: imageUrls,
      isApproved: true, // Auto-approve to show instantly on the product details page
      isVerifiedPurchase: true
    })

    await review.save()
    await recalculateProductRating(productId)
    return res.status(201).json({ message: 'Review submitted successfully.', review })
  } catch (error) {
    next(error)
  }
}

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id, isApproved: true }).sort({ createdAt: -1 })
    return res.json(reviews)
  } catch (error) {
    next(error)
  }
}

export const getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false }).populate('product', 'name slug').sort({ createdAt: -1 })
    return res.json(reviews)
  } catch (error) {
    next(error)
  }
}

export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' })
    }

    review.isApproved = true
    await review.save()

    // Recalculate ratings
    await recalculateProductRating(review.product)

    return res.json({ message: 'Review approved.', review })
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' })
    }

    // Recalculate ratings
    await recalculateProductRating(review.product)

    return res.json({ message: 'Review deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
