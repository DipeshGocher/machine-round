import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_db';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'dipesh@gmail.com';
    const adminPassword = 'Dipesh@123';

    // Check if an Admin user already exists by email or role
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { role: 'admin' }]
    });

    if (existingAdmin) {
      console.log('----------------------------------------------------');
      console.log(`Admin user already exists in the database!`);
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log('Cannot create another admin. Super Admin account is ready to use.');
      console.log('----------------------------------------------------');
    } else {
      const newAdmin = new User({
        name: 'Dipesh Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        status: 'Active'
      });
      await newAdmin.save();
      console.log('----------------------------------------------------');
      console.log('Admin user created successfully!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log('----------------------------------------------------');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Admin user:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedAdmin();
