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
    console.log(`Received Request to send Invoice for Sales Order ID: ${req.params.id}`);

    // Fetch the Sales Order, which includes customer details and items
    const salesOrder = await SalesOrder.findById(req.params.id).populate('customer'); // Populate customer details
    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales Order not found' });
    }

    // Assuming that you want to create a new InvoiceOrder from the SalesOrder data
    const invoiceDetails = {
      customerName: `${salesOrder.customer.firstName} ${salesOrder.customer.lastName}`,
      customerEmail: salesOrder.customer.email,
      salesOrderNumber: salesOrder.salesOrderNumber,
      salesOrderDate: salesOrder.salesOrderDate,
      items: salesOrder.items, 
      totalAmount: salesOrder.totalAmount,
      paymentTerms: salesOrder.paymentTerms,
      deliveryMethod: salesOrder.deliveryMethod,
      shippingCharges: salesOrder.shippingCharges,
      adjustment: salesOrder.adjustment,
    };

    // Nodemailer configuration for sending email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'hathish113@gmail.com', 
        pass: 'qkmu ugty oiav hide', 
      },
    });

    // Email message options
    const mailOptions = {
      from: 'invoice-ea@gmail.com',
      to: invoiceDetails.customerEmail, 
      subject: `Invoice for Sales Order ${invoiceDetails.salesOrderNumber}`,
      html: `
        <h2>Invoice Details</h2>
        <p><strong>Customer Name:</strong> ${invoiceDetails.customerName}</p>
        <p><strong>Sales Order Number:</strong> ${invoiceDetails.salesOrderNumber}</p>
        <p><strong>Sales Order Date:</strong> ${invoiceDetails.salesOrderDate.toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> Rs. ${invoiceDetails.totalAmount.toFixed(2)}</p>
        <p><strong>Payment Terms:</strong> ${invoiceDetails.paymentTerms || 'Not specified'}</p>
        <p><strong>Delivery Method:</strong> ${invoiceDetails.deliveryMethod || 'Not specified'}</p>
        
        <h3>Products</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #000; padding: 8px;">Item Name</th>
            <th style="border: 1px solid #000; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #000; padding: 8px;">Rate</th>
            <th style="border: 1px solid #000; padding: 8px;">Discount</th>
            <th style="border: 1px solid #000; padding: 8px;">Amount</th>
          </tr>
          ${invoiceDetails.items.map(item => `
            <tr>
              <td style="border: 1px solid #000; padding: 8px;">${item.itemName}</td>
              <td style="border: 1px solid #000; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #000; padding: 8px;">Rs. ${item.rate.toFixed(2)}</td>
              <td style="border: 1px solid #000; padding: 8px;">Rs. ${item.discount.toFixed(2)}</td>
              <td style="border: 1px solid #000; padding: 8px;">Rs. ${item.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>

        <p><strong>Shipping Charges:</strong> Rs. ${invoiceDetails.shippingCharges.toFixed(2)}</p>
        <p><strong>Adjustment:</strong> Rs. ${invoiceDetails.adjustment.toFixed(2)}</p>
        <h3>Total Amount Due: Rs. ${invoiceDetails.totalAmount.toFixed(2)}</h3>
        
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
    console.error('Error in sending invoice:', error);
    res.status(500).json({ message: 'Error sending invoice', error });
  }
});

module.exports = router;
