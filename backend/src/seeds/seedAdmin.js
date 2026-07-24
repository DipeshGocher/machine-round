import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import { User } from '../models/userModel.js';

// Use Google Public DNS to bypass local Windows ISP SRV blocks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('DNS setServers notice:', e.message);
}

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_db';

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    const adminEmail = 'dipesh@gmail.com';
    const adminPassword = 'Dipesh@123';

    // Check if an Admin user already exists by email or role
    let existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { role: 'admin' }]
    });

    if (existingAdmin) {
      existingAdmin.name = 'Dipesh Admin';
      existingAdmin.email = adminEmail;
      existingAdmin.password = adminPassword; // Pre-save hook will hash it
      existingAdmin.role = 'admin';
      existingAdmin.status = 'Active';
      await existingAdmin.save();

      console.log('----------------------------------------------------');
      console.log(`Admin user updated/verified in MongoDB Atlas database!`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log('Super Admin account is ready to use for login.');
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
      console.log('Admin user created successfully in MongoDB Atlas!');
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
