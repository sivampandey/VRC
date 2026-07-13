import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Collection from './models/Collection.js';
import Order from './models/Order.js';

const check = async () => {
  await connectDB();
  const collectionsCount = await Collection.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  console.log('Database Status:');
  console.log('Collections count:', collectionsCount);
  console.log('Products count:', productsCount);
  console.log('Orders count:', ordersCount);
  
  if (productsCount > 0) {
    const sample = await Product.findOne();
    console.log('Sample Product ID format:', sample._id);
  }
  
  process.exit(0);
};

check();
