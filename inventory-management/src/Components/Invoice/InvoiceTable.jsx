import React, { useState, useEffect } from 'react';
import { Button, Table, Col, Row, Modal, Card } from 'react-bootstrap';
import axios from 'axios';
import Alertify from 'alertifyjs';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const SalesOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  // Fetch customers, products, and sales orders from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerResponse, productResponse, salesOrderResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/customers'),
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/salesorder'),
        ]);
        setCustomers(customerResponse.data);
        setProducts(productResponse.data);
        setSalesOrders(salesOrderResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Fetch invoice details by ID
  const fetchInvoiceDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoiceorder/${id}`);
      setInvoiceDetails(response.data);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };

  // Handle showing modal with order details and fetch invoice details
  const handleShowModal = (order) => {
    console.log('Fetching invoice details for order ID:', order._id);
    setSelectedOrder(order);
    fetchInvoiceDetails(order._id);
    setShowModal(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setShowModal(false);
    setInvoiceDetails(null); // Reset invoice details
  };

  // Handle sending email
  const handleSendEmail = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/invoiceorder/sendInvoice/${selectedOrder._id}`);
      Alertify.success('Invoice sent to customer!');
      console.log(response);
    } catch (error) {
      Alertify.error('Error sending email.');
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar />
      <Card.Header className="text-center custom-card-header">
        <h3>Sales Orders</h3>
      </Card.Header>
      <div className="main-content">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>Sales Order Date</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {salesOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.salesOrderNumber}</td>
                <td>{customers.find((c) => c._id === order.customer)?.firstName}</td>
                <td>{new Date(order.salesOrderDate).toLocaleDateString()}</td>
                <td>Rs. {order.totalAmount.toFixed(2)}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowModal(order)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal to show order details */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Invoice Details - {selectedOrder?.salesOrderNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && invoiceDetails && (
            <>
              <Row>
                <Col md={6}>
                  <h5>Customer: {invoiceDetails.customerName}</h5>
                  <p>Sales Order Date: {new Date(invoiceDetails.salesOrderDate).toLocaleDateString()}</p>
                  <p>Expected Shipment Date: {new Date(invoiceDetails.expectedShipmentDate).toLocaleDateString()}</p>
                  <p>Payment Terms: {invoiceDetails.paymentTerms}</p>
                </Col>
                <Col md={6}>
                  <p>Delivery Method: {invoiceDetails.deliveryMethod}</p>
                  <p>Salesperson: {invoiceDetails.salesperson}</p>
                  <p>Shipping Charges: Rs. {invoiceDetails.shippingCharges}</p>
                  <p>Adjustment: Rs. {invoiceDetails.adjustment}</p>
                </Col>
              </Row>

              <Table striped bordered hover className="mt-4">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Discount</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceDetails.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {item.rate}</td>
                      <td>{item.discount}%</td>
                      <td>Rs. {item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h5 className="text-right mt-4">Total Amount: Rs. {invoiceDetails.totalAmount.toFixed(2)}</h5>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSendEmail}>
            Send Invoice via Email
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </>
  );
};

export default SalesOrder;
