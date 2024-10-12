// models/Vendor.js
const mongoose = require('mongoose');

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  vendorID: { type: String, required: true },
  vendorName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  gstin: { type: String, required: true },
});

// Vendor Model
const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
