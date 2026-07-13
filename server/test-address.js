import mongoose from 'mongoose';
import User from './models/User.js';

async function test() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/vrc');
    console.log('DB Connected');
    
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      process.exit(0);
    }
    
    console.log('Found user:', user.email);
    console.log('Current addresses count:', user.addresses.length);
    
    user.addresses.push({
      label: 'Test',
      line1: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456'
    });
    
    await user.save();
    console.log('Address saved successfully. New count:', user.addresses.length);
    
    // Clean up
    user.addresses.pull({ label: 'Test' });
    await user.save();
    console.log('Test address cleaned up.');
    
    process.exit(0);
  } catch (err) {
    console.error('Error during test:', err);
    process.exit(1);
  }
}

test();
