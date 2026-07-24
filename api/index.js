import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../backend/app.js';

dotenv.config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dipeshgurjer000_db_user:JUIEo092fHiI47Zw@cluster0.aube9xz.mongodb.net/?appName=Cluster0';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Serverless MongoDB connected successfully');
  } catch (err) {
    console.error('Serverless MongoDB connection error:', err);
  }
};

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
