const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Use a function to avoid model overwrite issues
function getBookingModel() {
  try {
    return mongoose.model('Booking');
  } catch {
    return mongoose.model('Booking', bookingSchema, 'consultation');
  }
}

module.exports = { getBookingModel };