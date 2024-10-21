const express = require('express');
const router = express.Router();
const SalesOrder = require('../models/SalesOrder'); // Adjust the path to your models folder
const InvoiceOrder = require('../models/InvoiceOrder'); // Assuming you have an InvoiceOrder model
const nodemailer = require('nodemailer'); // For sending email

// Get all invoice orders
router.get('/', async (req, res) => {
  try {
    const invoiceOrders = await InvoiceOrder.find();
    res.json(invoiceOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice orders', error });
  }
});

// Get a specific invoice order by ID
router.get('/:id', async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findById(req.params.id).populate('customer'); // Populate customer data
    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales Order not found' });
    }

    // Extract customer details from the populated data
    const invoiceDetails = {
      ...salesOrder.toObject(),
      customerName: salesOrder.customer.firstName + ' ' + salesOrder.customer.lastName, // Assuming customer has firstName and lastName fields
      customerEmail: salesOrder.customer.email // Assuming customer has an email field
    };

    res.json(invoiceDetails);
  } catch (error) {
    console.error('Error fetching sales order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new invoice order
router.post('/', async (req, res) => {
  const {
    customer,
    salesOrderDate,
    expectedShipmentDate,
    paymentTerms,
    deliveryMethod,
    salesperson,
    items,
    shippingCharges,
    adjustment,
    totalAmount,
    termsAndConditions,
    attachments
  } = req.body;

  try {
    const newInvoiceOrder = new InvoiceOrder({
      customer,
      salesOrderDate,
      expectedShipmentDate,
      paymentTerms,
      deliveryMethod,
      salesperson,
      items,
      shippingCharges,
      adjustment,
      totalAmount,
      termsAndConditions,
      attachments,
    });

    const savedInvoiceOrder = await newInvoiceOrder.save();
    res.status(201).json(savedInvoiceOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating invoice order', error });
  }
});

// Send invoice via email
router.post('/sendInvoice/:id', async (req, res) => {
  try {
    console.log(`Received Request to send Invoice for ID: ${req.params.id}`);
    const invoiceOrder = await InvoiceOrder.findById(req.params.id).populate('customer'); // Assuming customer details are in a separate model
    if (!invoiceOrder) return res.status(404).json({ message: 'Invoice not found' });

    // Nodemailer configuration for sending email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'hathish113@gmail.com', 
        pass: 'pqaa siov azdw yyrw',  
      },
    });

    // Email message options
    const mailOptions = {
      from: 'invoice-ea@gmail.com',
      to: invoiceOrder.customerEmail, 
      subject: `Invoice for Sales Order ${invoiceOrder.salesOrderNumber}`,
      html: `
        <h2>Invoice Details</h2>
        <p><strong>Customer Name:</strong> ${invoiceOrder.customerName}</p>
        <p><strong>Sales Order Number:</strong> ${invoiceOrder.salesOrderNumber}</p>
        <p><strong>Sales Order Date:</strong> ${invoiceOrder.salesOrderDate.toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> Rs. ${invoiceOrder.totalAmount.toFixed(2)}</p>
        <p><strong>Payment Terms:</strong> ${invoiceOrder.paymentTerms || 'Not specified'}</p>
        <p><strong>Delivery Method:</strong> ${invoiceOrder.deliveryMethod || 'Not specified'}</p>
        
        <h3>Products</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #000; padding: 8px;">Item Name</th>
            <th style="border: 1px solid #000; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #000; padding: 8px;">Rate</th>
            <th style="border: 1px solid #000; padding: 8px;">Discount</th>
            <th style="border: 1px solid #000; padding: 8px;">Amount</th>
          </tr>
          ${invoiceOrder.items.map(item => `
            <tr>
              <td style="border: 1px solid #000; padding: 8px;">${item.itemName}</td>
              <td style="border: 1px solid #000; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #000; padding: 8px;">Rs. ${item.rate.toFixed(2)}</td>
              <td style="border: 1px solid #000; padding: 8px;">Rs. ${item.discount.toFixed(2)}</td>
              <td style="border: 1px solid #000; padding: 8px;">Rs. ${item.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>

        <p><strong>Shipping Charges:</strong> Rs. ${invoiceOrder.shippingCharges.toFixed(2)}</p>
        <p><strong>Adjustment:</strong> Rs. ${invoiceOrder.adjustment.toFixed(2)}</p>
        <h3>Total Amount Due: Rs. ${invoiceOrder.totalAmount.toFixed(2)}</h3>
        
        <p>Thank you for your business!</p>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email', error });
      }
      res.json({ message: 'Invoice sent successfully', info });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending invoice', error });
  }
});

module.exports = router;
