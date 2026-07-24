import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import { User } from '../models/userModel.js';
import { Franchise } from '../models/franchiseModel.js';

// Resolve IPv4 first and set Google DNS to bypass local ISP SRV blocks
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Fallback
}

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dipeshgurjer000_db_user:JUIEo092fHiI47Zw@cluster0.aube9xz.mongodb.net/mern_db?appName=Cluster0';

const seedFranchiseOwner = async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas for Franchise Owner seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    const ownerEmail = 'rahul@gmail.com';
    const ownerPassword = 'Rahul@123';
    const franchiseName = 'Rahul Food Franchise';
    const city = 'Delhi';

    // Check if Franchise Owner User already exists
    let ownerUser = await User.findOne({ email: ownerEmail });

    if (!ownerUser) {
      ownerUser = new User({
        name: 'Rahul Owner',
        email: ownerEmail,
        password: ownerPassword,
        role: 'franchise',
        status: 'Active'
      });
      await ownerUser.save();
      console.log(`Created Franchise Owner user: ${ownerEmail}`);
    } else {
      ownerUser.name = 'Rahul Owner';
      ownerUser.password = ownerPassword; // Pre-save hook will hash it
      ownerUser.role = 'franchise';
      ownerUser.status = 'Active';
      await ownerUser.save();
      console.log(`Updated Franchise Owner user: ${ownerEmail}`);
    }

    // Check if Franchise Record exists
    let franchise = await Franchise.findOne({ name: franchiseName });
    if (!franchise) {
      franchise = new Franchise({
        name: franchiseName,
        owner: ownerUser._id,
        city: city,
        status: 'Active'
      });
      await franchise.save();
      console.log(`Created Franchise record: ${franchiseName}`);
    } else {
      franchise.owner = ownerUser._id;
      franchise.city = city;
      franchise.status = 'Active';
      await franchise.save();
      console.log(`Updated Franchise record: ${franchiseName}`);
    }

    // Link Franchise ID back to Owner User
    ownerUser.franchise = franchise._id;
    await ownerUser.save();

    console.log('----------------------------------------------------');
    console.log('Franchise Owner Account Seeded Successfully in MongoDB Atlas!');
    console.log(`Franchise Name: ${franchiseName}`);
    console.log(`Email: ${ownerEmail}`);
    console.log(`Password: ${ownerPassword}`);
    console.log(`Role: franchise`);
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Franchise Owner user:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedFranchiseOwner();
