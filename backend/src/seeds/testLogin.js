import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dipeshgurjer000_db_user:JUIEo092fHiI47Zw@cluster0.aube9xz.mongodb.net/mern_db?appName=Cluster0';

const testLogin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas mern_db');

    const testUsers = [
      { email: 'dipesh@gmail.com', password: 'Dipesh@123' },
      { email: 'rahul@gmail.com', password: 'Rahul@123' },
      { email: 'staff@gmail.com', password: 'Staff@123' }
    ];

    for (const test of testUsers) {
      const user = await User.findOne({ email: test.email }).select('+password');
      if (!user) {
        console.log(`❌ User NOT FOUND: ${test.email}`);
        continue;
      }

      const isMatch = await user.comparePassword(test.password);
      console.log(`User: ${test.email} | Role: ${user.role} | Status: ${user.status} | Password Match: ${isMatch ? '✅ MATCH' : '❌ MISMATCH'}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

testLogin();
