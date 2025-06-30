const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema
const userSchema = new mongoose.Schema({
  ownerName: { type: String, required: true, trim: true },
  shopName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  shopAddress: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Export model
module.exports = mongoose.model('user_register', userSchema);
