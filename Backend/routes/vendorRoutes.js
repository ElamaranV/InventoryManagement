// routes/vendorRoutes.js
const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor'); // Adjust the path as necessary

// Create a new vendor
router.post('/', async (req, res) => {
  try {
    const { vendorID, vendorName, phoneNumber, email, companyName, gstin } = req.body;

    // Create a new vendor instance
    const newVendor = new Vendor({
      vendorID,
      vendorName,
      phoneNumber,
      email,
      companyName,
      gstin,
    });

    // Save the vendor to the database
    await newVendor.save();
    res.status(201).json({ message: 'Vendor created successfully!', vendor: newVendor });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ message: 'Error creating vendor', error });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('Fetching vendors...'); // Add this log to see if the route is hit
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors' });
  }
});



// Export the router
module.exports = router;
