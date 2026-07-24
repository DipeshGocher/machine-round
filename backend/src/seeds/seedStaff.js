import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import { User } from '../models/userModel.js';
import { Franchise } from '../models/franchiseModel.js';

dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Fallback
}

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dipeshgurjer000_db_user:JUIEo092fHiI47Zw@cluster0.aube9xz.mongodb.net/mern_db?appName=Cluster0';

const seedStaff = async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas for Staff seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    const franchise = await Franchise.findOne({ name: 'Rahul Food Franchise' });
    if (!franchise) {
      console.error('Rahul Food Franchise not found. Run seedFranchiseOwner first.');
      process.exit(1);
    }

    const staffEmail = 'staff@gmail.com';
    const staffPassword = 'Staff@123';

    let staffUser = await User.findOne({ email: staffEmail });
    if (!staffUser) {
      staffUser = new User({
        name: 'Alex Staff',
        email: staffEmail,
        password: staffPassword,
        role: 'staff',
        designation: 'Senior Chef',
        franchise: franchise._id,
        status: 'Active'
      });
      await staffUser.save();
      console.log(`Created Staff user: ${staffEmail}`);
    } else {
      staffUser.name = 'Alex Staff';
      staffUser.password = staffPassword; // Pre-save hook will hash it
      staffUser.role = 'staff';
      staffUser.designation = 'Senior Chef';
      staffUser.franchise = franchise._id;
      staffUser.status = 'Active';
      await staffUser.save();
      console.log(`Updated Staff user: ${staffEmail}`);
    }

    console.log('----------------------------------------------------');
    console.log('Staff Account Seeded Successfully in MongoDB Atlas!');
    console.log(`Assigned Franchise: ${franchise.name}`);
    console.log(`Email: ${staffEmail}`);
    console.log(`Password: ${staffPassword}`);
    console.log(`Role: staff`);
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Staff user:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedStaff();
