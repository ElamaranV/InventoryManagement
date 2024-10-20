const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder');
const multer = require('multer');
const path = require('path');

// Create a new Sales Order
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      salesOrderDate,
      expectedShipmentDate,
      paymentTerms,
      deliveryMethod,
      salesperson,
      priceList,
      items,
      shippingCharges,
      adjustment,
      termsAndConditions
    } = req.body;

    // Calculate subtotal and total amount
    const subTotal = items.reduce((sum, item) => 
      sum + item.quantity * item.rate - (item.quantity * item.rate * item.discount / 100), 
      0
    );
    
    const totalAmount = subTotal + Number(shippingCharges) + Number(adjustment);

    const newSalesOrder = new SalesOrder({
      customer,
      salesOrderNumber: 'SO' + Date.now(),
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
    });

    await newSalesOrder.save();
    res.status(201).json({ message: 'Sales order created successfully!', salesOrder: newSalesOrder });
  } catch (error) {
    console.error('Error creating sales order:', error);
    res.status(500).json({ message: 'Error creating sales order', error: error.message });
  }
});

module.exports = router;
