import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Col, Row, Dropdown, Card } from 'react-bootstrap';
import axios from 'axios';
import './SalesOrder.css';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import Alertify from 'alertifyjs'; // for notifications

const SalesOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({
    customer: '',
    salesOrderDate: '',
    expectedShipmentDate: '',
    paymentTerms: '',
    deliveryMethod: '',
    salesperson: '',
    priceList: '',
    items: [],
    shippingCharges: 0,
    adjustment: 0,
    totalAmount: 0,
    termsAndConditions: '',
    attachments: [],
  });

  useEffect(() => {
    // Fetch customers and products from API
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get('http://localhost:5000/api/customers');
        const productResponse = await axios.get('http://localhost:5000/api/products');
        setCustomers(customerResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = (product) => {
    const newItem = {
      itemName: product.name,
      quantity: 1,
      rate: product.price,
      discount: 0,
      amount: product.price,
    };
    setOrder({ ...order, items: [...order.items, newItem] });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...order.items];
    updatedItems.splice(index, 1);
    setOrder({ ...order, items: updatedItems });
    calculateTotal();
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...order.items];
    updatedItems[index].quantity = value;
    updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate - (updatedItems[index].quantity * updatedItems[index].rate * updatedItems[index].discount / 100);
    setOrder({ ...order, items: updatedItems });
    calculateTotal();
  };

  const calculateTotal = () => {
    const subTotal = order.items.reduce((sum, item) => sum + item.amount, 0);
    const total = subTotal + Number(order.shippingCharges) + Number(order.adjustment);
    setOrder({ ...order, totalAmount: total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/salesorders', order);
      Alertify.success('Sales Order created successfully!');
      // Reset order state after submission
      setOrder({
        customer: '',
        salesOrderDate: '',
        expectedShipmentDate: '',
        paymentTerms: '',
        deliveryMethod: '',
        salesperson: '',
        priceList: '',
        items: [],
        shippingCharges: 0,
        adjustment: 0,
        totalAmount: 0,
        termsAndConditions: '',
        attachments: [],
      });
    } catch (error) {
      Alertify.error('Error creating Sales Order!');
    }
  };

  const handleAttachmentChange = (e) => {
    setOrder({ ...order, attachments: [...e.target.files] });
  };

  return (
    <>
      <Sidebar />
      <Card.Header className="text-center custom-card-header">
                <h3>Add Sales Order</h3>
       </Card.Header>
      <div className="main-content">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="customer">
                <Form.Label>Customer</Form.Label>
                <Form.Control
                  as="select"
                  value={order.customer}
                  onChange={(e) => setOrder({ ...order, customer: e.target.value })}
                  required
                >
                  <option>Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.firstName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="salesOrderDate">
                <Form.Label>Sales Order Date</Form.Label>
                <Form.Control
                  type="date"
                  value={order.salesOrderDate}
                  onChange={(e) => setOrder({ ...order, salesOrderDate: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="expectedShipmentDate">
                <Form.Label>Expected Shipment Date</Form.Label>
                <Form.Control
                  type="date"
                  value={order.expectedShipmentDate}
                  onChange={(e) => setOrder({ ...order, expectedShipmentDate: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="paymentTerms">
                <Form.Label>Payment Terms</Form.Label>
                <Form.Control
                  as="select"
                  value={order.paymentTerms}
                  onChange={(e) => setOrder({ ...order, paymentTerms: e.target.value })}
                >
                  <option>Select payment terms</option>
                  <option>Net 30</option>
                  <option>Net 60</option>
                  <option>Due on receipt</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="deliveryMethod">
                <Form.Label>Delivery Method</Form.Label>
                <Form.Control
                  type="text"
                  value={order.deliveryMethod}
                  onChange={(e) => setOrder({ ...order, deliveryMethod: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="salesperson">
                <Form.Label>Salesperson</Form.Label>
                <Form.Control
                  type="text"
                  value={order.salesperson}
                  onChange={(e) => setOrder({ ...order, salesperson: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="priceList">
                <Form.Label>Price List</Form.Label>
                <Form.Control
                  type="text"
                  value={order.priceList}
                  onChange={(e) => setOrder({ ...order, priceList: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="termsAndConditions">
                <Form.Label>Terms and Conditions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={order.termsAndConditions}
                  onChange={(e) => setOrder({ ...order, termsAndConditions: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Product Table */}
          <Table striped bordered hover className="mb-4">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </td>
                  <td>{item.rate}</td>
                  <td>{item.discount}%</td>
                  <td>{item.amount.toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveItem(index)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Dropdown className="mb-4">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Add Products
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {products.map((product) => (
                <Dropdown.Item key={product._id} onClick={() => handleAddItem(product)}>
                  {product.name} - ${product.price}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Row className="mb-4">
            <Col md={4}>
              <Form.Group controlId="shippingCharges">
                <Form.Label>Shipping Charges</Form.Label>
                <Form.Control
                  type="number"
                  value={order.shippingCharges}
                  onChange={(e) => {
                    setOrder({ ...order, shippingCharges: e.target.value });
                    calculateTotal();
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="adjustment">
                <Form.Label>Adjustment</Form.Label>
                <Form.Control
                  type="number"
                  value={order.adjustment}
                  onChange={(e) => {
                    setOrder({ ...order, adjustment: e.target.value });
                    calculateTotal();
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <h4>Total Amount: ${order.totalAmount.toFixed(2)}</h4>
            </Col>
          </Row>

          <Form.Group controlId="attachments">
            <Form.Label>Attachments</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleAttachmentChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit Sales Order
          </Button>
        </Form>
      </div>
      <Footer />
    </>
  );
};

export default SalesOrder;