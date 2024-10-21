const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
  salesOrderNumber: String,
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [
    {
      itemName: String,
      quantity: Number,
      rate: Number,
      discount: Number,
      amount: Number,
    },
  ],
  totalAmount: Number,
  salesOrderDate: Date,
  expectedShipmentDate: Date,
  paymentTerms: String,
  deliveryMethod: String,
  shippingCharges: Number,
  adjustment: Number,
  salesperson: String,
});

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);

module.exports = SalesOrder;
