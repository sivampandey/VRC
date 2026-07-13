import mongoose from 'mongoose'

const customOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  size: { type: String, required: true },
  shape: { type: String, enum: ['Rectangle', 'Round', 'Runner', 'Square', 'Oval'], default: 'Rectangle' },
  material: { type: String },
  color: { type: String },
  pattern: { type: String },
  budget: { type: String },
  description: { type: String },
  referenceImages: [{ type: String }],
  status: { type: String, enum: ['new','contacted','quoted','confirmed','rejected'], default: 'new' },
  adminNotes: { type: String }
}, {
  timestamps: true
})

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema)
export default CustomOrder
