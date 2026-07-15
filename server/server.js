import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'

// Route Imports
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import collectionRoutes from './routes/collections.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payments.js'
import customOrderRoutes from './routes/customOrders.js'
import reviewRoutes from './routes/reviews.js'
import userRoutes from './routes/users.js'
import blogRoutes from './routes/blog.js'

dotenv.config()

// Database connection
connectDB()

const app = express()

// CORS Configuration - Allow multiple origins for multi-device access
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []
].flat().filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                      origin.endsWith('.vercel.app') || 
                      origin.includes('localhost') || 
                      origin.includes('127.0.0.1')
                      
    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true
}))

// JSON and URL parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 200, // Limit each IP to 200 requests per window
  message: 'Too many requests from this IP address, please try again after 15 minutes.'
})
app.use('/api/', limiter)

// API Router registration
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/custom-orders', customOrderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/users', userRoutes)
app.use('/api/blog', blogRoutes)

// API service healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'active', brand: 'Vaishnav Rug Collection', service: 'VRC Core REST API Gateway' })
})

// Express global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`VRC Express Server listening on http://0.0.0.0:${PORT} (accessible from any network interface)`)
})
