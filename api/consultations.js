require('dotenv').config();
const mongoose = require('mongoose');
const { getBookingModel } = require('../models');

// Connect to MongoDB
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await connectToDatabase();
    const Booking = getBookingModel();
    const consultations = await Booking.find().sort({ createdAt: -1 });
    return res.status(200).json({ consultations });
  } catch (error) {
    console.error('GET /api/consultations error', error);
    return res.status(500).json({ error: 'Failed to fetch consultations' });
  }
};