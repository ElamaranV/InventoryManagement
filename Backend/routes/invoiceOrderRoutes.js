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

    const invoiceDetails = {
      ...salesOrder.toObject(),
      customerName: `${salesOrder.customer.firstName} ${salesOrder.customer.lastName}`,
      customerEmail: salesOrder.customer.email
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
    deliveryMethod,
    salesperson,
    items,
    shippingCharges = 50,
    adjustment,
    totalAmount,
    termsAndConditions,
    attachments,
    cgst,
    sgst,
  } = req.body;

  try {
    const newInvoiceOrder = new InvoiceOrder({
      customer,
      salesOrderDate,
      expectedShipmentDate,
      deliveryMethod,
      salesperson,
      items,
      shippingCharges,
      adjustment,
      totalAmount,
      termsAndConditions,
      attachments,
      cgst, 
      sgst,
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

    const salesOrder = await SalesOrder.findById(req.params.id).populate('customer');
    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales Order not found' });
    }

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
      cgst: salesOrder.cgst,
      sgst: salesOrder.sgst,
      subtotal: salesOrder.items.reduce((sum, item) => sum + item.amount, 0), // Calculate subtotal
    };

    // console.log('Invoice Details:', invoiceDetails);

    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: 'hathish113@gmail.com',
        pass: 'qkmu ugty oiav hide', 
      },
    });

    const mailOptions = {
      from: 'invoice-ea@gmail.com',
      to: invoiceDetails.customerEmail,
      subject: `Invoice for Sales Order ${invoiceDetails.salesOrderNumber}`,
      html: `
      <h2 style="text-align: center; font-family: Arial, sans-serif; color: #333;">Invoice Details</h2>

      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #555;">
        <p><strong>Customer Name:</strong> ${invoiceDetails.customerName}</p>
        <p><strong>Sales Order Number:</strong> ${invoiceDetails.salesOrderNumber}</p>
        <p><strong>Sales Order Date:</strong> ${invoiceDetails.salesOrderDate.toLocaleDateString()}</p>
      
        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">Products</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Item Name</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Rate (Rs.)</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Discount (Rs.)</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceDetails.items.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${item.itemName}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${item.rate.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${item.discount.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">Billing Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tbody>
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right;">Rs. ${(invoiceDetails.subtotal ? invoiceDetails.subtotal.toFixed(2) : '0.00')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>Shipping Charges:</strong></td>
              <td style="padding: 10px; text-align: right;">Rs. ${(invoiceDetails.shippingCharges ? invoiceDetails.shippingCharges.toFixed(2) : '0.00')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>CGST:</strong></td>
              <td style="padding: 10px; text-align: right;">Rs. ${(invoiceDetails.cgst ? invoiceDetails.cgst.toFixed(2) : '0.00')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>SGST:</strong></td>
              <td style="padding: 10px; text-align: right;">Rs. ${(invoiceDetails.sgst ? invoiceDetails.sgst.toFixed(2) : '0.00')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>Adjustment:</strong></td>
              <td style="padding: 10px; text-align: right;">Rs. ${(invoiceDetails.adjustment ? invoiceDetails.adjustment.toFixed(2) : '0.00')}</td>
            </tr>
            <tr style="background-color: #f5f5f5;">
              <td style="padding: 15px; text-align: right; font-size: 1.2em;"><strong>Total Amount Due:</strong></td>
              <td style="padding: 15px; text-align: right; font-size: 1.2em;"><strong>Rs. ${(invoiceDetails.totalAmount ? invoiceDetails.totalAmount.toFixed(2) : '0.00')}</strong></td>
            </tr>
          </tbody>
        </table>

        <p><strong>Payment Terms:</strong> ${invoiceDetails.paymentTerms || 'Not specified'}</p>
        <p><strong>Delivery Method:</strong> ${invoiceDetails.deliveryMethod || 'Not specified'}</p>

        <p style="text-align: center; margin-top: 30px;">Thank you for your business!</p>
      </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invoice sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
