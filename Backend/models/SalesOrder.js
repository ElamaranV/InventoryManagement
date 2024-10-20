// models/SalesOrder.js
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
      },
      rate: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      amount: Number,
    },
  ],
  subTotal: Number,
  shippingCharges: Number,
  adjustment: Number,
  totalAmount: Number,
  termsAndConditions: String,
  attachments: [String],
}, { timestamps: true });

const SalesOrder = mongoose.model('SalesOrder', SalesOrderSchema);

module.exports = SalesOrder;
