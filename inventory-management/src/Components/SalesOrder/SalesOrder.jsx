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

  // Fetch customers and products from API
  useEffect(() => {
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

  // Handle adding product to sales order
  const handleAddItem = (product) => {
    const newItem = {
      itemName: product.productTitle,
      quantity: 1,
      rate: product.openingStockPrice,
      discount: 0,
      amount: product.price,
      productId: product._id // Capture the product ID for later use
    };
    setOrder({ ...order, items: [...order.items, newItem] });
  };

  // Handle removing product from sales order
  const handleRemoveItem = (index) => {
    const updatedItems = [...order.items];
    updatedItems.splice(index, 1);
    setOrder({ ...order, items: updatedItems });
    calculateTotal();
  };

 


  // Handle changing product quantity
  const handleQuantityChange = (index, value) => {
    const updatedItems = [...order.items];
    const quantity = Math.max(0, value); // Ensure quantity is not less than 0

    if (value < 0) {
      Alertify.warning('Quantity cannot be less than 0');
    }

    updatedItems[index].quantity = quantity;
    updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
      - (updatedItems[index].quantity * updatedItems[index].rate * updatedItems[index].discount / 100);
    setOrder({ ...order, items: updatedItems });
    calculateTotal();
  };

  const handleShippingChange = (e) => {
    const value = Math.max(0, parseFloat(e.target.value) || 0); // Convert to number and ensure it's not negative
    setOrder((prevOrder) => ({ ...prevOrder, shippingCharges: value }));
    calculateTotal(); // Recalculate total
  };
  
  const handleAdjustmentChange = (e) => {
    const value = Math.max(0, parseFloat(e.target.value) || 0); // Convert to number and ensure it's not negative
    setOrder((prevOrder) => ({ ...prevOrder, adjustment: value }));
    calculateTotal(); // Recalculate total
  };

  // Calculate total amount
  const calculateTotal = () => {
    const subTotal = order.items.reduce((sum, item) => sum + item.amount, 0);
    const shipping = Number(order.shippingCharges) || 0 ;
    const adjustment = Number(order.adjustment) ||0;
    const total = subTotal + shipping+ adjustment;
    setOrder({ ...order, totalAmount: total });
  };

  // Update product stock after sales order submission
  const updateProductStock = async () => {
    const stockUpdatePromises = order.items.map(async (item) => {
      const productToUpdate = products.find((product) => product._id === item.productId);
      if (productToUpdate) {
        const updatedStock = productToUpdate.openingStock - item.quantity;
        return axios.put(`http://localhost:5000/api/products/${productToUpdate._id}`, {
          openingStock: updatedStock,
        });
      }
    });

    try {
      await Promise.all(stockUpdatePromises);
      Alertify.success('Product stock updated successfully!');
    } catch (error) {
      Alertify.error('Error updating product stock.');
    }
  };

  // Handle sales order form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/salesorder', order);
      Alertify.success('Sales Order created successfully!');

      // Update the product stock after successful sales order submission
      await updateProductStock();

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

  // Handle file attachment changes
 

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
                  {/* Check for undefined before calling toFixed */}
                  <td>{item.amount ? item.amount.toFixed(2) : '0.00'}</td> 
                  {/* Action button to remove item */}
                  <td>
                    <Button variant="danger" onClick={() => handleRemoveItem(index)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Dropdown to add products */}
          <Dropdown className="mb-4">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Add Products
            </Dropdown.Toggle>

            {/* Product options */}
            <Dropdown.Menu>
              {products.map((product) => (
                <Dropdown.Item key={product._id} onClick={() => handleAddItem(product)}>
                  {product. productTitle} - Rs.{product.openingStockPrice}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

     

           


         
          <Row className="mt-4">
            <Col md={6}>
              <h5>Total Amount:Rs. {order.totalAmount.toFixed(2)}</h5>
            </Col>
           
          </Row>

          {/* Submit button for the form */}
          {/* Submit Sales Order button */}
          <Button variant="primary" type="submit">Submit Sales Order</Button>

        </Form>

      </div>

      {/* Footer component included */}
      {<Footer />}
      
    </>
  );
};

export default SalesOrder;