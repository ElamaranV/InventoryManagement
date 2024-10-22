import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Col, Row, InputGroup, Container } from 'react-bootstrap';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import alertify from 'alertifyjs';
import './addVendor.css';

const AddVendor = () => {
  const [vendor, setVendor] = useState({
    vendorID: '',
    vendorName: '',
    countryCode: '+91',
    phoneNumber: '',
    email: '',
    companyName: '',
    gstin: '',
    billingAddress: '',
    shippingAddress: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  });

  const [emailError, setEmailError] = useState('');
  const [gstinError, setGstinError] = useState('');
  const [accountNumberError, setAccountNumberError] = useState('');
  const [ifscError, setIfscError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [copyBillingAddress, setCopyBillingAddress] = useState(false);
  const countryCodes = [
    { name: 'India', code: '+91' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Australia', code: '+61' },
  ];

  useEffect(() => {
    const fetchLastVendorID = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vendors/latest');
        const lastVendor = response.data;

        if (lastVendor) {
          const lastIDNumber = parseInt(lastVendor.vendorID.replace('VEN', ''), 10);
          const newVendorID = `VEN${lastIDNumber + 1}`;
          setVendor((prevVendor) => ({ ...prevVendor, vendorID: newVendorID }));
        } else {
          setVendor((prevVendor) => ({ ...prevVendor, vendorID: 'VEN100' }));
        }
      } catch (error) {
        alertify.error('Error fetching last vendor ID.');
        setVendor((prevVendor) => ({ ...prevVendor, vendorID: 'VEN100' }));
      }
    };

    fetchLastVendorID();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handleCopyBillingAddress = () => {
    setCopyBillingAddress(!copyBillingAddress);
    if (!copyBillingAddress) {
      setVendor((prevVendor) => ({
        ...prevVendor,
        shippingAddress: prevVendor.billingAddress,
      }));
    }
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  const validateGSTIN = (gstin) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin);
  const validateAccountNumber = (accountNumber) => /^[0-9]{9,18}$/.test(accountNumber);
  const validateIFSC = (ifsc) => /^[A-Z]{4}0[0-9]{6}$/.test(ifsc);
  const validatePhoneNumber = (phoneNumber) => /^[0-9]{10}$/.test(phoneNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(vendor.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');

    if (!validateGSTIN(vendor.gstin)) {
      setGstinError('Please enter a valid GST Identification Number.');
      return;
    }
    setGstinError('');

    if (!validateAccountNumber(vendor.accountNumber)) {
      setAccountNumberError('Please enter a valid account number (9-18 digits).');
      return;
    }
    setAccountNumberError('');

    if (!validatePhoneNumber(vendor.phoneNumber)) {
      setPhoneNumberError('Please enter a valid 10-digit phone number.');
      return;
    }
    setPhoneNumberError('');

    if (!validateIFSC(vendor.ifsc)) {
      setIfscError('Please enter a valid IFSC code.');
      return;
    }
    setIfscError('');

    try {
      const response = await axios.post('http://localhost:5000/api/vendors', vendor);
      alertify.success('Vendor added successfully!');
      setVendor({
        vendorID: `VEN${parseInt(vendor.vendorID.replace('VEN', ''), 10) + 1}`,
        vendorName: '',
        phoneNumber: '',
        countryCode: '+91',
        email: '',
        companyName: '',
        gstin: '',
        billingAddress: '',
        shippingAddress: '',
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
      });
    } catch (error) {
      alertify.error('Error adding vendor. Please try again.');
    }
  };

  return (
    <>
      <Sidebar />
      <Container fluid className="add-vendor-form">
        <h2 className="my-4">Add New Vendor</h2>
        <hr />
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="vendorID">
                <Form.Label>Vendor ID</Form.Label>
                <Form.Control type="text" value={vendor.vendorID} readOnly />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="vendorName">
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control type="text" name="vendorName" value={vendor.vendorName} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <InputGroup>
                  <Form.Select name="countryCode" value={vendor.countryCode} onChange={handleChange}>
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={vendor.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
                {phoneNumberError && <small className="text-danger">{phoneNumberError}</small>}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={vendor.email} onChange={handleChange} required />
                {emailError && <small className="text-danger">{emailError}</small>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="companyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control type="text" name="companyName" value={vendor.companyName} onChange={handleChange} required />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="gstin">
                <Form.Label>GSTIN</Form.Label>
                <Form.Control type="text" name="gstin" value={vendor.gstin} onChange={handleChange} required />
                {gstinError && <small className="text-danger">{gstinError}</small>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="billingAddress">
                <Form.Label>Billing Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="billingAddress"
                  value={vendor.billingAddress}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="shippingAddress">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="shippingAddress"
                  value={vendor.shippingAddress}
                  onChange={handleChange}
                  required
                />
                <Form.Check
                  type="checkbox"
                  label="Same as billing address"
                  checked={copyBillingAddress}
                  onChange={handleCopyBillingAddress}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="accountHolderName">
                <Form.Label>Account Holder Name</Form.Label>
                <Form.Control
                  type="text"
                  name="accountHolderName"
                  value={vendor.accountHolderName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="bankName">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control type="text" name="bankName" value={vendor.bankName} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="accountNumber">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text"
                  name="accountNumber"
                  value={vendor.accountNumber}
                  onChange={handleChange}
                  required
                />
                {accountNumberError && <small className="text-danger">{accountNumberError}</small>}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="ifsc">
                <Form.Label>IFSC</Form.Label>
                <Form.Control type="text" name="ifsc" value={vendor.ifsc} onChange={handleChange} required />
                {ifscError && <small className="text-danger">{ifscError}</small>}
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-4 text-center">
            <Button variant="primary" type="submit">
              Add Vendor
            </Button>{' '}
            <Button variant="secondary" type="button" onClick={() => alertify.error('Cancelled')}>
              Cancel
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default AddVendor;
