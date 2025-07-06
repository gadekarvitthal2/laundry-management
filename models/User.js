const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  ownerName: String,
  shopName: String,
  email: { type: String, unique: true },
  phone: String,
  shopAddress: String,
  city: String,
  pincode: String,
  password: String
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);