import mongoose from 'mongoose'
import User from './models/User.js'

import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/vrc'

async function listAndPromoteUsers() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB\n')

  const users = await User.find({}).select('name email role createdAt')
  
  if (users.length === 0) {
    console.log('No users found in database.')
    process.exit(0)
  }

  console.log('=== ALL REGISTERED USERS ===')
  users.forEach((u, i) => {
    console.log(`${i + 1}. ${u.name} | ${u.email} | Role: ${u.role} | Joined: ${u.createdAt?.toLocaleDateString()}`)
  })

  // Promote the first non-admin user to admin (or all if arg is 'all')
  const targetEmail = process.argv[2]
  
  if (targetEmail) {
    const user = await User.findOne({ email: targetEmail })
    if (!user) {
      console.log(`\nUser with email "${targetEmail}" not found.`)
    } else {
      user.role = 'admin'
      await user.save()
      console.log(`\n✅ Successfully promoted "${user.name}" (${user.email}) to ADMIN role.`)
    }
  } else {
    console.log('\nTo promote a user to admin, run:')
    console.log('  node make-admin.js <email>')
  }

  await mongoose.disconnect()
}

listAndPromoteUsers().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
