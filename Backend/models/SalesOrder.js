const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
  salesOrderNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      rate: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      amount: { type: Number, required: true, min: 0 },
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 },
  salesOrderDate: { type: Date, required: true },
  expectedShipmentDate: { type: Date, required: true },
  deliveryMethod: { type: String, required: true },
  shippingCharges: { type: Number, default: 50 }, // Default shipping charges set to 50
  adjustment: { type: Number, default: 0 },
  salesperson: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  cgst: { type: Number, default: 0, min: 0 }, // New field for CGST
  sgst: { type: Number, default: 0, min: 0 }, // New field for SGST
}, { timestamps: true });

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);

module.exports = SalesOrder;
