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

const getWishlistFromStorage = (userId) => {
  try {
    const raw = localStorage.getItem(`vrc_wishlist_${userId}`)
    if (raw) return JSON.parse(raw)

    // Fallback/migration: if user is guest and old vrc_wishlist exists, load it and rename/clear it
    if (userId === 'guest') {
      const oldRaw = localStorage.getItem('vrc_wishlist')
      if (oldRaw) {
        localStorage.removeItem('vrc_wishlist')
        localStorage.setItem('vrc_wishlist_guest', oldRaw)
        return JSON.parse(oldRaw)
      }
    }
    return []
  } catch (e) {
    console.error('Error loading wishlist from localStorage', e)
    return []
  }
}

const saveWishlistToStorage = (userId, items) => {
  try {
    localStorage.setItem(`vrc_wishlist_${userId}`, JSON.stringify(items))
  } catch (e) {
    console.error('Error saving wishlist to localStorage', e)
  }
}

const normalizeProduct = (product) => ({
  ...product,
  image: product.image || product.images?.[0]?.url || '',
  collectionName:
    typeof product.collection === 'string'
      ? product.collection
      : product.collection?.name || '',
})

const mergeWishlistItems = (...lists) => {
  const byId = new Map()
  lists.flat().forEach((item) => {
    if (item?._id) byId.set(item._id, normalizeProduct(item))
  })
  return Array.from(byId.values())
}

const initialUser = getInitialUser()
const initialUserId = initialUser ? initialUser._id : 'guest'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: getWishlistFromStorage(initialUserId),
    userId: initialUserId,
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = normalizeProduct(action.payload)
      const index = state.items.findIndex((item) => item._id === product._id)
      if (index >= 0) {
        state.items.splice(index, 1)
      } else {
        state.items.push(product)
      }
      saveWishlistToStorage(state.userId, state.items)
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload
      state.items = state.items.filter((item) => item._id !== id)
      saveWishlistToStorage(state.userId, state.items)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCredentials, (state, action) => {
      const user = action.payload.user
      const userId = user ? user._id : 'guest'
      const guestItems = getWishlistFromStorage('guest')
      const userItems = getWishlistFromStorage(userId)
      const mergedItems = mergeWishlistItems(userItems, guestItems)
      state.userId = userId
      state.items = mergedItems
      saveWishlistToStorage(userId, mergedItems)
      })
      .addCase(logout, (state) => {
        state.userId = 'guest'
        state.items = getWishlistFromStorage('guest')
      })
  }
})

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions

export const selectWishlist = (state) => state.wishlist.items
export const selectIsWishlisted = (id) => (state) =>
  state.wishlist.items.some((item) => item._id === id)

export default wishlistSlice.reducer
