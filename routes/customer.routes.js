const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.post('/register', customerController.registerCustomer);
router.get('/all', customerController.getAllCustomers);
router.put("/update-latest-order-info", customerController.updateOrderInfo);
router.put("/:customerId/update-pickup-date", customerController.updatePickupDate);


module.exports = router;
