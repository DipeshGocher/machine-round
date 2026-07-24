import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import app from '../backend/app.js';
import { autoSeedInitialRoles } from '../backend/src/utils/autoSeed.js';

// Resolve IPv4 & Google DNS for Vercel Serverless environment
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

dotenv.config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dipeshgurjer000_db_user:JUIEo092fHiI47Zw@cluster0.aube9xz.mongodb.net/mern_db?appName=Cluster0';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false
    });
    isConnected = true;
    console.log('Serverless MongoDB connected successfully to mern_db');
    await autoSeedInitialRoles();
  } catch (err) {
    console.error('Serverless MongoDB connection error:', err);
  }
};

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
