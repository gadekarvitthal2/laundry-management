const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  // email:    { type: String, required: false ,sparse: true},
  phone:    { type: String, required: true, unique: false },
  address:  { type: String, required: false },
  bookingDate: Date,         // <-- Add this
  totalAmount: Number  , // <-- Add this
  isDelivered: Boolean  , // <-- Add this
  pickupPreference: { type: String, enum: ['Home', 'Shop'], default: 'Shop' },
  createdAt: { type: Date, default: Date.now },
  billNumber: { type: String, default: null }, // Removed unique constraint and field, not needed for customers
});

module.exports = mongoose.model('Customer', customerSchema);
