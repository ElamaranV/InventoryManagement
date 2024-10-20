const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Create a new sales order
router.post('/', upload.array('attachments'), async (req, res) => {
  try {
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
    } = req.body;

    const attachments = req.files ? req.files.map(file => file.filename) : [];

    const newSalesOrder = new SalesOrder({
      salesOrderNumber,
      customer,
      reference,
      salesOrderDate,
      expectedShipmentDate,
      paymentTerms,
      deliveryMethod,
      salesperson,
      priceList,
      items: JSON.parse(items),
      shippingCharges: parseFloat(shippingCharges),
      adjustment: parseFloat(adjustment),
      termsAndConditions,
      attachments,
    });

    // Calculate totals (if applicable)
    newSalesOrder.calculateTotals();

    const savedOrder = await newSalesOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating sales order:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Sales Order number already exists' });
    }
    res.status(400).json({ message: 'Error creating sales order', error: err.message });
  }
});

// ... (rest of the routes remain the same)

module.exports = router;
// ... (rest of the routes remain the same) ...

// Get a sales order by ID (excluding soft-deleted ones)
router.get('/:id', async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findById(req.params.id);
        if (!salesOrder || salesOrder.isDeleted) {
            return res.status(404).json({ message: 'Sales Order not found' });
        }
        res.json(salesOrder);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching sales order', error: err.message });
    }
});

// Delete a sales order by ID (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findById(req.params.id);
        if (!salesOrder || salesOrder.isDeleted) {
            return res.status(404).json({ message: 'Sales Order not found' });
        }
        salesOrder.isDeleted = true;
        await salesOrder.save();
        res.json({ message: 'Sales Order marked as deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting sales order', error: err.message });
    }
});

module.exports = router;
