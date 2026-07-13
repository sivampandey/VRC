import { createSlice } from '@reduxjs/toolkit'
import { setCredentials, logout } from './authSlice'

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('vrc_user')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

const getCartFromStorage = (userId) => {
  try {
    const raw = localStorage.getItem(`vrc_cart_${userId}`)
    if (raw) return JSON.parse(raw)
    
    // Fallback/migration: if user is guest and old vrc_cart exists, load it and rename/clear it
    if (userId === 'guest') {
      const oldRaw = localStorage.getItem('vrc_cart')
      if (oldRaw) {
        localStorage.removeItem('vrc_cart')
        localStorage.setItem('vrc_cart_guest', oldRaw)
        return JSON.parse(oldRaw)
      }
    }
    return []
  } catch (e) {
    console.error('Error loading cart from localStorage', e)
    return []
  }
}

const saveCartToStorage = (userId, items) => {
  try {
    localStorage.setItem(`vrc_cart_${userId}`, JSON.stringify(items))
  } catch (e) {
    console.error('Error saving cart to localStorage', e)
  }
}

const initialUser = getInitialUser()
const initialUserId = initialUser ? initialUser._id : 'guest'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromStorage(initialUserId),
    userId: initialUserId,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, size, quantity = 1 } = action.payload
      const existingItem = state.items.find(
        (item) => item._id === product._id && item.size === size
      )
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image || (product.images?.[0]?.url || product.image),
          category: product.category,
          size: size,
          quantity: quantity,
        })
      }
      saveCartToStorage(state.userId, state.items)
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload
      state.items = state.items.filter(
        (item) => !(item._id === id && item.size === size)
      )
      saveCartToStorage(state.userId, state.items)
    },
    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload
      const item = state.items.find(
        (item) => item._id === id && item.size === size
      )
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
      saveCartToStorage(state.userId, state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.userId, [])
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCredentials, (state, action) => {
        const user = action.payload.user
        const userId = user ? user._id : 'guest'
        state.userId = userId
        state.items = getCartFromStorage(userId)
      })
      .addCase(logout, (state) => {
        state.userId = 'guest'
        state.items = getCartFromStorage('guest')
      })
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (acc, item) => acc + (item.salePrice || item.price) * item.quantity,
    0
  )

export default cartSlice.reducer
