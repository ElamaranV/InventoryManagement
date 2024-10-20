// routes/salesorder.js
const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');

// Get all sales orders
router.get('/', async (req, res) => {
  try {
    const salesOrders = await SalesOrder.find();
    res.json(salesOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new sales order
router.post('/', async (req, res) => {
  const {
    salesOrderNumber,
    customer,
    reference,
    salesOrderDate,
    expectedShipmentDate,
    paymentTerms,
    deliveryMethod,
    salesperson,
    priceList,
    items,
    shippingCharges,
    adjustment,
    termsAndConditions,
    attachments,
  } = req.body;

  let subTotal = items.reduce((sum, item) => sum + item.quantity * item.rate - (item.quantity * item.rate * item.discount / 100), 0);
  let totalAmount = subTotal + (shippingCharges || 0) + (adjustment || 0);

  const newSalesOrder = new SalesOrder({
    salesOrderNumber, // Accept sales order number from the request body
    customer,
    reference,
    salesOrderDate,
    expectedShipmentDate,
    paymentTerms,
    deliveryMethod,
    salesperson,
    priceList,
    items,
    subTotal,
    shippingCharges,
    adjustment,
    totalAmount,
    termsAndConditions,
    attachments,
  });

  try {
    const savedOrder = await newSalesOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch a sales order by ID
router.get('/:id', async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });
    res.json(salesOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a sales order by ID
router.delete('/:id', async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id);
    if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });
    await salesOrder.remove();
    res.json({ message: 'Sales Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;


module.exports = router;
