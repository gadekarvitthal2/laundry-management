const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  productName: String,
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  rollorpressproduct: String,
});

const OrderSchema = new mongoose.Schema({
  billNumber: {
    type: String, // Using String to allow 5-digit formatting like '00001'
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  serviceType: {
    type: String,
    required: true,
  },
  items: [OrderItemSchema],
  pickupDetails: {
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    charge: {
      type: Number,
      default: 0,
    },
  },
  deliveryDetails: {
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    charge: {
      type: Number,
      default: 0,
    },
  },
  charges: {
    subtotal: Number,
    taxAmount: Number,
    totalAmount: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
