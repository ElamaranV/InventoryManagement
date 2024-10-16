const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor'); // Adjust the path as necessary

// Create a new vendor
router.post('/', async (req, res) => {
  try {
    const {
      vendorID,
      vendorName,
      phoneNumber,
      email,
      companyName,
      gstin,
      billingAddress,
      shippingAddress,
      bankDetails,
    } = req.body;

    // Create a new vendor instance
    const newVendor = new Vendor({
      vendorID,
      vendorName,
      phoneNumber,
      email,
      companyName,
      gstin,
      billingAddress,
      shippingAddress,
      bankDetails,
    });

    // Save the vendor to the database
    await newVendor.save();
    res.status(201).json({ message: 'Vendor created successfully!', vendor: newVendor });
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(500).json({ message: 'Error creating vendor', error });
  }
});

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors' });
  }
});

// Get the most recent vendor
router.get('/latest', async (req, res) => {
  try {
    const latestVendor = await Vendor.findOne().sort({ _id: -1 }); // Sort by _id in descending order
    res.json(latestVendor);
  } catch (error) {
    console.error('Error fetching latest vendor:', error);
    res.status(500).json({ message: 'Error fetching latest vendor' });
  }
});

// Update vendor route
router.put('/:id', async (req, res) => {
  const vendorId = req.params.id;
  const updateData = req.body;

  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, updateData, { new: true });
    res.json(updatedVendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ message: 'Error updating vendor', error });
  }
});

// Delete vendor route
router.delete('/:id', async (req, res) => {
  try {
    const vendorId = req.params.id;
    
    // Use findByIdAndDelete to find and delete in one step
    const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ message: 'Server error. Could not delete vendor.' });
  }
});

// Export the router
module.exports = router;
