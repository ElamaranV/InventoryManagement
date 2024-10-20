const mongoose = require('mongoose');

const SalesOrderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  salesOrderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  reference: String,
  salesOrderDate: {
    type: Date,
    required: true,
  },
  expectedShipmentDate: Date,
  paymentTerms: String,
  deliveryMethod: String,
  salesperson: String,
  priceList: String,
  items: [
    {
      itemName: String,
      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure quantity is at least 1
      },
      rate: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0, // Ensure discount is non-negative
      },
      amount: Number, // Calculated dynamically or stored here if needed
    },
  ],
  subTotal: Number, // Optional: Calculated or stored
  shippingCharges: {
    type: Number,
    default: 0, // Default to 0 if not provided
  },
  adjustment: {
    type: Number,
    default: 0, // Default to 0 if not provided
  },
  totalAmount: Number, // Calculated or stored
  termsAndConditions: String,
  attachments: [String], // For file uploads or links
}, { timestamps: true });

const SalesOrder = mongoose.model('SalesOrder', SalesOrderSchema);

module.exports = SalesOrder;
