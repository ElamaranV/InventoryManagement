const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema({
    salesOrderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    reference: {
        type: String,
        required: true,
    },
    salesOrderDate: {
        type: Date,
        required: true,
    },
    expectedShipmentDate: {
        type: Date,
        required: true,
    },
    paymentTerms: {
        type: String,
        required: true,
    },
    deliveryMethod: {
        type: String,
        default: '',
    },
    salesperson: {
        type: String,
        default: '',
    },
    priceList: {
        type: String,
        default: '',
    },
    items: [{
        itemName: String,
        quantity: Number,
        rate: Number,
        discount: Number,
        amount: Number
    }],
    shippingCharges: {
        type: Number,
        default: 0,
    },
    adjustment: {
        type: Number,
        default: 0,
    },
    termsAndConditions: {
        type: String,
        default: '',
    },
    attachments: {
        type: [String],
        default: [],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

// Example method to calculate totals (if needed)
salesOrderSchema.methods.calculateTotals = function () {
  this.subTotal = this.items.reduce((sum, item) => 
    sum + item.quantity * item.rate - (item.quantity * item.rate * item.discount / 100), 0
  );
  this.totalAmount = this.subTotal + (this.shippingCharges || 0) + (this.adjustment || 0);
};

const SalesOrder = mongoose.model('SalesOrder', salesOrderSchema);
module.exports = SalesOrder;