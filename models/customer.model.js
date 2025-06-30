const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  // email:    { type: String, required: false ,sparse: true},
  phone:    { type: String, required: true, unique: true },
  address:  { type: String, required: true },
  pickupDate: Date,         // <-- Add this
  totalAmount: Number  , // <-- Add this
  isDelivered: Boolean  , // <-- Add this
  pickupPreference: { type: String, enum: ['Home', 'Shop'], default: 'Shop' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
