import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate } from 'react-router-dom'; 
import alertify from 'alertifyjs'; // Import alertify for notifications
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import './AddCustomer.css'; // Custom CSS

export default function AddCustomer() {
  const navigate = useNavigate();
  const [newCustomer, setNewCustomer] = useState({
    salutation: '',
    firstName: '',
    lastName: '',
    companyName: '',
    displayName: '',
    email: '',
    phoneType: 'work', // Default to work phone
    workPhone: '',
    mobilePhone: '',
    billingAddress: '',
    shippingAddress: '',
  });

  const [copyBilling, setCopyBilling] = useState(false);
  const [ errors, setErrors] = useState({});

  const validateForm = () =>{
    const errors = {};

    if( newCustomer.displayName.trim() === ''){
      errors.displayName = 'Customer Display Name is required';
    }

    if(!newCustomer.email.includes('@')){
      errors.email = 'Invalid email format';
    }

    const phoneNumber = newCustomer.phoneType === 'work' ? newCustomer.workPhone : newCustomer.mobilePhone;
    if(phoneNumber.trim().length < 10){
      errors.phone = 'Phone number must be at least 10 digits !';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm()){
      return;
    }
    
    try {
      // Send data to the backend
      const response = await axios.post('http://localhost:5000/api/customers', newCustomer);
      alertify.success('Customer added successfully'); // Show success message
      // console.log('Customer added successfully:', response.data);

      // Reset form fields
      setNewCustomer({
        salutation: '',
        firstName: '',
        lastName: '',
        companyName: '',
        displayName: '',
        email: '',
        phoneType: 'work',
        workPhone: '',
        mobilePhone: '',
        billingAddress: '',
        shippingAddress: '',
      });
    } catch (error) {
      alertify.error('Error adding customer'); // Show error message
      console.error('Error adding customer:', error);
    }
  };

  const handleCancel = () => {
    navigate('/customers'); // Redirect to the customers page on cancel
  };

  return (
    <>
      <Sidebar />
      <Container className="mt-4">
        <Row>
          <Col>
            <Card className="shadow-sm custom-card">
              <Card.Header className="custom-card-header">
                <h3>Add New Customer</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Type</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Business"
                        type="radio"
                        name="customerType"
                        id="business"
                        value="business"
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        inline
                        label="Individual"
                        type="radio"
                        name="customerType"
                        id="individual"
                        value="individual"
                        onChange={handleInputChange}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formSalutation">
                    <Form.Label>Primary Contact</Form.Label>
                    <Row>
                      <Col md={2}>
                        <Form.Select name="salutation" value={newCustomer.salutation} onChange={handleInputChange}>
                          <option value="">Salutation</option>
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </Form.Select>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={newCustomer.firstName}
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={newCustomer.lastName}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formCompanyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={newCustomer.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formDisplayName">
                    <Form.Label className="text-danger">Customer Display Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="displayName"
                      value={newCustomer.displayName}
                      onChange={handleInputChange}
                      placeholder="Enter display name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={newCustomer.email}
                      onChange={handleInputChange}
                      placeholder="Enter customer's email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPhoneType">
                    <Form.Label>Customer Phone</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Work Phone"
                        type="radio"
                        name="phoneType"
                        id="workPhone"
                        value="work"
                        checked={newCustomer.phoneType === 'work'}
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        inline
                        label="Mobile"
                        type="radio"
                        name="phoneType"
                        id="mobilePhone"
                        value="mobile"
                        checked={newCustomer.phoneType === 'mobile'}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Form.Control
                      type="text"
                      name={newCustomer.phoneType === 'work' ? 'workPhone' : 'mobilePhone'}
                      value={newCustomer.phoneType === 'work' ? newCustomer.workPhone : newCustomer.mobilePhone}
                      onChange={handleInputChange}
                      placeholder={`Enter ${newCustomer.phoneType === 'work' ? 'work' : 'mobile'} phone`}
                      required
                    />
                  </Form.Group>

                  <Tabs defaultActiveKey="address" className="mb-3">
                    <Tab eventKey="address" title="Address">
                      <Row>
                        <Col>
                          <h5>Billing Address</h5>
                          <Form.Control
                            as="textarea"
                            name="billingAddress"
                            value={newCustomer.billingAddress}
                            onChange={handleInputChange}
                            placeholder="Enter billing address"
                          />
                        </Col>
                        <Col>
                          <h5>Shipping Address</h5>
                          <Form.Check
                            label="Copy billing address"
                            checked={copyBilling}
                            onChange={(e) => {
                              setCopyBilling(e.target.checked);
                              if (e.target.checked) {
                                setNewCustomer((prevState) => ({
                                  ...prevState,
                                  shippingAddress: prevState.billingAddress,
                                }));
                              }
                            }}
                          />
                          <Form.Control
                            as="textarea"
                            name="shippingAddress"
                            value={newCustomer.shippingAddress}
                            onChange={handleInputChange}
                            placeholder="Enter shipping address"
                          />
                        </Col>
                      </Row>
                    </Tab>
                  </Tabs>

                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Add Customer
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
