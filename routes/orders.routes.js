const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders.controllers");


router.post("/", orderController.createOrder);
router.get("/", orderController.getOrdersByDateRange);
router.get("/cloth-sales-reports", orderController.getClothSalesReports);
router.get("/customer/:customerId", orderController.getOrdersByCustomer);
router.get('/customer/info/:customerId', orderController.getAllOrdersWithCustomerInfo);

module.exports = router;
