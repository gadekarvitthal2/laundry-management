const { DressMaster, RollOrPress } = require('../models/dressMasterModel');

// Add new dress
exports.addDress = async (req, res) => {
  try {
    const { type, price } = req.body;

    const exists = await DressMaster.findOne({ type });
    if (exists) return res.status(400).json({ message: 'Dress type already exists' });

    const newDress = new DressMaster({ type, price });
    await newDress.save();

    res.status(201).json({ message: 'Dress type added', dress: newDress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all dress types
exports.getDresses = async (req, res) => {
  try {
    const dresses = await DressMaster.find().sort({ createdAt: -1 });
    res.json(dresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a dress type by ID
exports.deleteDress = async (req, res) => {
  try {
    const { id } = req.params;
    await DressMaster.findByIdAndDelete(id);
    res.json({ message: 'Dress type deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add new roll or press type
exports.addRollOrPress = async (req, res) => {
  try {
    const { rollOrPressType, price } = req.body;

    const exists = await RollOrPress.findOne({ rollOrPressType });
    if (exists) return res.status(400).json({ message: 'Roll or press type already exists' });

    const newRollOrPress = new RollOrPress({ rollOrPressType, price });
    await newRollOrPress.save();

    res.status(201).json({ message: 'Roll or press type added', rollOrPress: newRollOrPress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all roll or press types
exports.getRollOrPress = async (req, res) => {
  try {
    const rollOrPress = await RollOrPress.find().sort({ createdAt: -1 });
    res.json(rollOrPress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a roll or press type by ID
exports.deleteRollOrPress = async (req, res) => {
  try {
    const { id } = req.params;
    await RollOrPress.findByIdAndDelete(id);
    res.json({ message: 'Roll or press type deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
