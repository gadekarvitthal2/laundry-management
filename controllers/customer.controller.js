const Customer = require('../models/customer.model');
const Order = require('../models/orders');

exports.registerCustomer = async (req, res) => {
  try {
    const { fullName, phone, address, pickupPreference } = req.body;

    // Check if email or phone already exists
    const existingCustomer = await Customer.findOne({
      $or: [{ phone }]
    });

    if (existingCustomer) {
      return res.status(409).json({ message: 'Customer with same phone already exists.' });
    }

    const customer = new Customer({
      fullName,
      phone,
      address,
      pickupPreference
    });

    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully', customer });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Error registering customer', error });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

exports.updateOrderInfo = async (req, res) => {
  try {
    const customers = await Customer.find();

    await Promise.all(
      customers.map(async (customer) => {
        const latestOrder = await Order.findOne({ customerId: customer._id })
          .sort({ updatedAt: -1 })
          .lean();

        if (latestOrder) {
          await Customer.findByIdAndUpdate(
            customer._id,
            {
              $set: {
                bookingDate: latestOrder.pickupDetails?.date || null,
                totalAmount: latestOrder.charges?.totalAmount || 0,
              },
            }
          );
        }
      })
    );

    res.status(200).json({ message: 'Customer data updated with latest order info.' });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePickupDate = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { bookingDate } = req.body;

    if (!bookingDate) {
      return res.status(400).json({ error: 'bookingDate is required.' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: { bookingDate, isDelivered: true } },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.status(200).json({
      message: 'Pickup date updated successfully.',
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Error updating pickup date:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

