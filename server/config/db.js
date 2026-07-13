import mongoose from 'mongoose'
import User from '../models/User.js'

const connectDB = async () => {
  const defaultUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vrc'
  
  // Try both 127.0.0.1 and localhost if using default/local DB to handle IPv4/IPv6 loopback configuration discrepancies
  let urisToTry = [defaultUri]
  if (defaultUri.includes('127.0.0.1')) {
    urisToTry.push(defaultUri.replace('127.0.0.1', 'localhost'))
  } else if (defaultUri.includes('localhost')) {
    urisToTry.push(defaultUri.replace('localhost', '127.0.0.1'))
  }
  urisToTry = [...new Set(urisToTry)]

  let connected = false
  for (const uri of urisToTry) {
    try {
      console.log(`Connecting to database at: ${uri}`)
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 })
      console.log(`MongoDB Connected: ${conn.connection.host}`)
      connected = true
      break
    } catch (err) {
      console.warn(`[INFO] Connection failed for ${uri}: ${err.message}`)
    }
  }

  if (connected) {
    try {
      await User.syncIndexes()
      console.log('User indexes synced successfully.')
    } catch (indexErr) {
      console.warn('[WARNING] User index sync failed:', indexErr.message)
    }
    return
  }

  // Fallback to mongodb-memory-server if local connection is refused/unavailable
  console.warn('\n======================================================================')
  console.warn('[WARNING] Local MongoDB Connection Failed.')
  console.warn('Attempting to spin up In-Memory MongoDB Fallback...')
  console.warn('======================================================================\n')

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const mongoServer = await MongoMemoryServer.create()
    const memoryUri = mongoServer.getUri()
    console.log(`[INFO] In-Memory MongoDB Server started at: ${memoryUri}`)
    
    await mongoose.connect(memoryUri)
    console.log('MongoDB Connected to In-Memory Instance successfully.')

    // Auto-seed the in-memory database so the app is fully functional out-of-the-box
    try {
      const { seedDatabase } = await import('../seed.js')
      await seedDatabase()
      console.log('[SUCCESS] In-Memory MongoDB seeded successfully with default catalog.')
    } catch (seedErr) {
      console.warn('[WARNING] Failed to automatically seed In-Memory MongoDB:', seedErr.message)
    }

    try {
      await User.syncIndexes()
      console.log('User indexes synced successfully.')
    } catch (indexErr) {
      console.warn('[WARNING] User index sync failed:', indexErr.message)
    }

  } catch (memErr) {
    console.error('\n======================================================================')
    console.error(`[FATAL] Database Connection & In-Memory Fallback both failed.`)
    console.error(`Error: ${memErr.message}`)
    console.error('\n🔧 DIAGNOSTICS & RESOLUTIONS:')
    console.error('1. IF YOU WANT TO RUN MONGODB LOCALLY:')
    console.error('   - Ensure MongoDB is installed. Download: https://www.mongodb.com/try/download/community')
    console.error('   - Start the service:')
    console.error('     Windows: Run "net start MongoDB" in Administrator Command Prompt.')
    console.error('     macOS: Run "brew services start mongodb-community".')
    console.error('     Linux: Run "sudo systemctl start mongod".')
    console.error('2. IF YOU WANT TO USE CLOUD DATABASE (RECOMMENDED FOR MULTI-DEVICE):')
    console.error('   - Create a free cluster on MongoDB Atlas (https://www.mongodb.com/cloud/atlas).')
    console.error('   - Copy your connection string.')
    console.error('   - Update MONGODB_URI in your server/.env file, e.g.:')
    console.error('     MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/vrc?retryWrites=true&w=majority')
    console.error('======================================================================\n')
  }
}

export default connectDB
