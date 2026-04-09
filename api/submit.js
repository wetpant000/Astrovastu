require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/astrovastu';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema, 'consultation');

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await connectToDatabase();

    const { name, email, phone, service } = req.body;
    if (!name || !email || !phone || !service) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const booking = new Booking({ name, email, phone, service });
    const saved = await booking.save();

    // Send confirmation email to submitter
    const submitterMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Consultation Booking Confirmation',
      html: `
        <h2>Thank you for booking a consultation!</h2>
        <p>Dear ${name},</p>
        <p>Your booking for <strong>${service}</strong> has been received.</p>
        <p>We will contact you soon at ${phone} or ${email}.</p>
        <p>Best regards,<br>Pritha Ghosh Pramanik</p>
      `
    };

    // Send notification email to author
    const authorMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'pritha90@gmail.com',
      subject: 'New Consultation Booking',
      html: `
        <h2>New Client Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    // Send emails asynchronously
    transporter.sendMail(submitterMailOptions).catch(err => console.error('Submitter email error:', err));
    transporter.sendMail(authorMailOptions).catch(err => console.error('Author email error:', err));

    return res.status(201).json({ message: 'Booking saved and emails sent', booking: saved });
  } catch (error) {
    console.error('POST /api/submit error', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};