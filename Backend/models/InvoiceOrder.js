const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for an invoice order
const InvoiceOrderSchema = new Schema({
  salesOrderNumber: { type: String, required: true, unique: true },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', // Assuming you have a separate Customer model
    required: true 
  },
  customerName: { type: String, required: true }, // Store customer name
  customerEmail: { type: String, required: true }, // Store customer email
  salesOrderDate: { type: Date, required: true },
  expectedShipmentDate: { type: Date, required: true },
  deliveryMethod: { type: String },
  salesperson: { type: String },
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      amount: { type: Number, required: true },
    }
  ],
  shippingCharges: { type: Number, default: 50 }, // Set default shipping charges
  cgst: { type: Number, default: 0 }, // Set default CGST
  sgst: { type: Number, default: 0 }, // Set default SGST
  adjustment: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  termsAndConditions: { type: String },
  attachments: { type: Array, default: [] }, // Any file attachments like PDFs, images
}, { timestamps: true });

module.exports = mongoose.model('InvoiceOrder', InvoiceOrderSchema);
