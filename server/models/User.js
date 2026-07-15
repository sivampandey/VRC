import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  name: { type: String },
  phone: { type: String },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
})

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, index: true },
  phone: { type: String, unique: true, sparse: true, index: true },
  password: { type: String, required: true },
  avatar: { type: String },
  city: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  refreshToken: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: true },
  // ─── User Preferences ───
  preferences: {
    newsletter: { type: Boolean, default: true },
    orderAlerts: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true }
  }
}, {
  timestamps: true
})

// Hashing hook on save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Verification helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
