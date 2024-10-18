const express = require('express');
const router = express.Router(); // <-- This is required to define the router
const Customer = require('../models/Customer');

// @route   POST /api/customers
// @desc    Add a new customer
// @access  Public
router.post('/', async (req, res) => {
  const { salutation, firstName, lastName, companyName, displayName, email, phoneType, workPhone, mobilePhone, billingAddress, shippingAddress } = req.body;

  try {
    const newCustomer = new Customer({
      salutation,
      firstName,
      lastName,
      companyName,
      displayName,
      email,
      phoneType,
      workPhone,
      mobilePhone,
      billingAddress,
      shippingAddress,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error saving customer:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
