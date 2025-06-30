const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String, // e.g. "orderId"
  sequence_value: Number
});
    
module.exports = mongoose.model('Counter', counterSchema);
