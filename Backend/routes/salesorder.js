const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');
const multer = require('multer');
const path = require('path');

const generateSalesOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Combine to form 'INYYYYMMDDHHMMSS'
  return `IN${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Create a new Sales Order
router.post('/', async (req, res) => {
  const {
    customer,
    salesOrderDate,
    expectedShipmentDate,
    deliveryMethod,
    salesperson,
    priceList,
    items,
    subTotal,
    shippingCharges,
    cgst,
    sgst,
    adjustment = 0, // Default adjustment to 0 if not provided
    totalAmount,
    termsAndConditions,
  } = req.body;

  try {
    // Use the function to generate a patternized sales order number
    const newSalesOrder = new SalesOrder({
      customer,
      salesOrderNumber: generateSalesOrderNumber(),
      salesOrderDate,
      expectedShipmentDate,
      deliveryMethod,
      salesperson,
      priceList,
      items,
      subTotal,
      shippingCharges,
      cgst,
      sgst,
      adjustment: Number(adjustment), // Ensure adjustment is a number
      totalAmount,
      termsAndConditions,
    });

    const savedSalesOrder = await newSalesOrder.save();
    res.status(201).json(savedSalesOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sales order', error });
  }
});

// Fetch all Sales Orders
router.get('/', async (req, res) => {
  try {
    const salesOrders = await SalesOrder.find();
    res.json(salesOrders);
  } catch (error) {
    console.error("Error fetching Sales Orders:", error);
    res.status(500).json({ message: 'Error fetching sales orders', error: error.message });
  }
});

module.exports = router;
