import User from '../models/User.js'
import Order from '../models/Order.js'

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    
    // Get orders count and total spent
    const orders = await Order.find({ user: req.user._id })
    const ordersCount = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    
    return res.json({
      ...user.toObject(),
      ordersCount,
      wishlistCount: user.wishlist?.length || 0,
      totalSpent
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone
    user.city = req.body.city || user.city
    
    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar
    }
    
    // Update preferences if provided
    if (req.body.preferences) {
      user.preferences = {
        newsletter: req.body.preferences.newsletter !== undefined ? req.body.preferences.newsletter : user.preferences?.newsletter,
        orderAlerts: req.body.preferences.orderAlerts !== undefined ? req.body.preferences.orderAlerts : user.preferences?.orderAlerts,
        whatsapp: req.body.preferences.whatsapp !== undefined ? req.body.preferences.whatsapp : user.preferences?.whatsapp
      }
    }

    const updatedUser = await user.save()
    
    // Get orders count and total spent
    const orders = await Order.find({ user: updatedUser._id })
    const ordersCount = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    
    return res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        preferences: updatedUser.preferences,
        ordersCount,
        wishlistCount: updatedUser.wishlist?.length || 0,
        totalSpent,
        createdAt: updatedUser.createdAt,
        addresses: updatedUser.addresses
      },
      token: null // Client will keep existing token
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    if (await user.matchPassword(oldPassword)) {
      user.password = newPassword
      await user.save()
      return res.json({ message: 'Password changed successfully.' })
    } else {
      return res.status(400).json({ message: 'Incorrect old password.' })
    }
  } catch (error) {
    next(error)
  }
}

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const { label, name, phone, line1, line2, city, state, pincode, isDefault } = req.body
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false)
    }

    user.addresses.push({ label, name, phone, line1, line2, city, state, pincode, isDefault })
    await user.save()
    return res.json(user.addresses)
  } catch (error) {
    next(error)
  }
}

export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const { id } = req.params
    const address = user.addresses.id(id)
    if (!address) return res.status(404).json({ message: 'Address not found.' })

    const { label, name, phone, line1, line2, city, state, pincode, isDefault } = req.body
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false)
    }

    address.label = label || address.label
    address.name = name || address.name
    address.phone = phone || address.phone
    address.line1 = line1 || address.line1
    address.line2 = line2 || address.line2
    address.city = city || address.city
    address.state = state || address.state
    address.pincode = pincode || address.pincode
    if (isDefault !== undefined) address.isDefault = isDefault

    await user.save()
    return res.json(user.addresses)
  } catch (error) {
    next(error)
  }
}

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    user.addresses.pull({ _id: req.params.id })
    await user.save()
    return res.json(user.addresses)
  } catch (error) {
    next(error)
  }
}

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist')
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json(user.wishlist)
  } catch (error) {
    next(error)
  }
}

export const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    const { productId } = req.params
    const index = user.wishlist.indexOf(productId)

    if (index >= 0) {
      user.wishlist.splice(index, 1)
    } else {
      user.wishlist.push(productId)
    }

    await user.save()
    return res.json(user.wishlist)
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    return res.json(users)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' })
    }

    await User.findByIdAndDelete(req.params.id)
    return res.json({ message: 'User deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
