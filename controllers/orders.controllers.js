// const OrderItemSchema = require('../models/orders').OrderItemSchema;
const Order = require("../models/orders");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const Counter = require("../models/couter.model");

async function getNextBillNumber() {
  const counter = await Counter.findByIdAndUpdate(
    "orderId",
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value.toString().padStart(6, "0"); // 👈 6-digit format
}

exports.createOrder =
  ("/",
  async (req, res) => {
    try {
      // const orderData = req.body;
      const billNumber = await getNextBillNumber();
      const orderData = {
        ...req.body,
        billNumber,
        createdAt: new Date(),
      };
      // Validate order data
      if (
        !orderData.customerId ||
        !orderData.serviceType ||
        !orderData.items ||
        orderData.items.length === 0
      ) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      // Create new order
      const newOrder = new Order(orderData);
      const savedOrder = await newOrder.save();

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: savedOrder,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to place order", error });
    }
  });

exports.getOrdersByDateRange = async (req, res) => {
  const { range } = req.query;
  const now = new Date();
  let start;

  switch (range) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarterly":
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = null;
  }

  const query = start ? { createdAt: { $gte: start } } : {};
  const orders = await Order.find(query).populate("customerId").lean();
  res.json(orders);
};

exports.getClothSalesReports = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;

    let matchStage = {};

    // Handle different periods
    switch (period) {
      case "today":
        matchStage = {
          createdAt: {
            $gte: moment().startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
        };
        break;

      case "monthly":
        matchStage = {
          createdAt: {
            $gte: moment().startOf("month").toDate(),
            $lte: moment().endOf("month").toDate(),
          },
        };
        break;

      case "quarterly":
        matchStage = {
          createdAt: {
            $gte: moment().startOf("quarter").toDate(),
            $lte: moment().endOf("quarter").toDate(),
          },
        };
        break;

      case "yearly":
        matchStage = {
          createdAt: {
            $gte: moment().startOf("year").toDate(),
            $lte: moment().endOf("year").toDate(),
          },
        };
        break;

      case "custom":
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Invalid date range" });
          }
          matchStage = {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          };
        } else {
          return res
            .status(400)
            .json({ message: "Start date and end date are required" });
        }
        break;

      default:
        // If no period provided, fetch all
        matchStage = {};
        break;
    }

    const reports = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          totalQuantity: { $sum: "$items.quantity" },
          totalAmount: {
            $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] },
          },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json(reports);
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    const orders = await Order.find({ customerId })
      .populate("customerId")
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders by customer:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

exports.getAllOrdersWithCustomerInfo = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Convert customerId to ObjectId
    const objectId = new mongoose.Types.ObjectId(customerId);

    // Aggregation pipeline
    // const results = await Order.aggregate([
    //   { $match: { customerId: objectId } },
    //   {
    //     $lookup: {
    //       from: "customers", // collection name (plural, lowercased)
    //       localField: "customerId",
    //       foreignField: "_id",
    //       as: "customerInfo",
    //     },
    //   },
    //   { $unwind: "$customerInfo" }, // flatten customerInfo array
    //   {
    //     $project: {
    //       serviceType: 1,
    //       items: 1,
    //       pickupDetails: 1,
    //       deliveryDetails: 1,
    //       charges: 1,
    //       createdAt: 1,
    //       fullName: "$customerInfo.fullName",
    //       address: "$customerInfo.address",
    //       phone: "$customerInfo.phone",
    //       isDelivered: "$customerInfo.isDelivered",
    //       totalAmount: "$customerInfo.totalAmount",
    //       pickupPreference: "$customerInfo.pickupPreference",
    //       billNumber: 1, // Include billNumber from Order
    //     },
    //   },
    //   { $sort: { createdAt: -1 } }
    // ]);
    const results = await Order.aggregate([
      { $match: { customerId: objectId } },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      { $unwind: "$customerInfo" },
      {
        $project: {
          serviceType: 1,
          items: 1,
          pickupDetails: 1,
          deliveryDetails: 1,
          charges: 1,
          createdAt: 1,
          fullName: "$customerInfo.fullName",
          address: "$customerInfo.address",
          phone: "$customerInfo.phone",
          isDelivered: 1, // Keep this from Order
          totalAmount: 1,
          pickupPreference: 1,
          billNumber: 1,
        },
      },
      { $sort: { createdAt: -1 } }, // ✅ Sort latest first
    ]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error in fetching orders with customer info:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.updateDeliveryDate = async (req, res) => {
  try {
    const { customerId, orderId } = req.params;
    const { deliveryNotifiedDate } = req.body;

    if (!deliveryNotifiedDate) {
      return res
        .status(400)
        .json({ error: "Delivery Notification Date is required." });
    }

    // Find and update the latest (most recent) order for the customer
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, customerId },
      {
        $set: {
          deliveryNotifiedDate: new Date(deliveryNotifiedDate),
          isDelivered: true,
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ error: "Order not found for this customer." });
    }

    res.status(200).json({
      message: "Delivery date updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating delivery date:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
