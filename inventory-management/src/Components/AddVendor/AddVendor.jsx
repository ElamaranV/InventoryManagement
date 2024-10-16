import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './addVendor.css'; 
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import alertify from 'alertifyjs';

const AddVendor = () => {
  const [vendor, setVendor] = useState({
    vendorID: '',
    vendorName: '',
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
  const [copyBillingAddress, setCopyBillingAddress] = useState(false);

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
      <div className="container-fluid add-vendor-form">
        <h2 className="my-4">Add New Vendor</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="vendorID">Vendor ID</label>
            <input type="text" className="form-control" id="vendorID" name="vendorID" value={vendor.vendorID} readOnly />
          </div>

          <div className="form-group">
            <label htmlFor="vendorName">Vendor Name</label>
            <input type="text" className="form-control" id="vendorName" name="vendorName" value={vendor.vendorName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={vendor.phoneNumber} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" name="email" value={vendor.email} onChange={handleChange} required />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input type="text" className="form-control" id="companyName" name="companyName" value={vendor.companyName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="gstin">GSTIN</label>
            <input type="text" className="form-control" id="gstin" name="gstin" value={vendor.gstin} onChange={handleChange} required />
            {gstinError && <small className="text-danger">{gstinError}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="billingAddress">Billing Address</label>
            <textarea className="form-control" id="billingAddress" name="billingAddress" value={vendor.billingAddress} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="shippingAddress">Shipping Address</label>
            <textarea className="form-control" id="shippingAddress" name="shippingAddress" value={vendor.shippingAddress} onChange={handleChange} required />
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" checked={copyBillingAddress} onChange={handleCopyBillingAddress} />
              <label className="form-check-label">Same as billing address</label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="accountHolderName">Account Holder Name</label>
            <input type="text" className="form-control" id="accountHolderName" name="accountHolderName" value={vendor.accountHolderName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input type="text" className="form-control" id="bankName" name="bankName" value={vendor.bankName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input type="text" className="form-control" id="accountNumber" name="accountNumber" value={vendor.accountNumber} onChange={handleChange} required />
            {accountNumberError && <small className="text-danger">{accountNumberError}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="ifsc">IFSC Code</label>
            <input type="text" className="form-control" id="ifsc" name="ifsc" value={vendor.ifsc} onChange={handleChange} required />
            {ifscError && <small className="text-danger">{ifscError}</small>}
          </div>

          <div className="button-container">
            <button type="submit" className="btn btn-primary">Add Vendor</button>
            <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>Cancel</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddVendor;
