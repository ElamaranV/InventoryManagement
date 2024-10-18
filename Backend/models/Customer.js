const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  salutation: {
    type: String,
    enum: ['Mr', 'Ms', 'Dr', 'Mrs', 'Miss'], // Restrict values for salutation
  },
  firstName: {
    type: String,
    required: true,
    trim: true, // Remove extra spaces
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true, // Company name might not be mandatory for individuals
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure that display name is unique
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensure email uniqueness
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email format validation
  },
  phoneType: {
    type: String,
    enum: ['work', 'mobile'], // Limit phone types to work or mobile
    required: true,
  },
  workPhone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        // Only validate if phoneType is work
        return this.phoneType !== 'work' || /^[0-9]{10}$/.test(v);
      },
      message: 'Work phone must be a 10-digit number.',
    },
  },
  mobilePhone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        // Only validate if phoneType is mobile
        return this.phoneType !== 'mobile' || /^[0-9]{10}$/.test(v);
      },
      message: 'Mobile phone must be a 10-digit number.',
    },
  },
  billingAddress: {
    type: String,
    required: true, // Assume billing address is mandatory
    trim: true,
  },
  shippingAddress: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set timestamp when customer is created
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);
