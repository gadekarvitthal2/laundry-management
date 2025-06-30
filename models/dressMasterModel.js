const mongoose = require('mongoose');

// Dress Master Schema
const dressMasterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

// Roll or Press Master Schema
const rollOrPressSchema = new mongoose.Schema(
  {
    rollOrPressType: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

// Export both models
const DressMaster = mongoose.model('DressMaster', dressMasterSchema);
const RollOrPress = mongoose.model('RollOrPress', rollOrPressSchema);

module.exports = {
  DressMaster,
  RollOrPress
};
