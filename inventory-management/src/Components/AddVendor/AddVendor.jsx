import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './addVendor.css'; 
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import alertify from 'alertifyjs';


const AddVendor = () => {
  const [vendor, setVendor] = useState({
    vendorID: '', // Automatically generated
    vendorName: '',
    phoneNumber: '',
    email: '',
    companyName: '',
    gstin: '',
  });

  const [emailError, setEmailError] = useState('');
  const[gstinError, setGStINError] = useState('');
  const [lastVendorID, setLastVendorID] = useState(''); // To store the last Vendor ID

  // Fetch the latest vendor ID from the server
  useEffect(() => {
    const fetchLastVendorID = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vendors/latest'); // Assuming /latest returns the last vendor
        const lastVendor = response.data;

        // Extract the numeric part and increment it
        const lastIDNumber = parseInt(lastVendor.vendorID.replace('VEN', ''), 10);
        const newVendorID = `VEN${lastIDNumber + 1}`;

        setVendor((prevVendor) => ({
          ...prevVendor,
          vendorID: newVendorID,
        }));
      } catch (error) {
        console.error('Error fetching last vendor ID: ', error);
        alertify.error('Error fetching last vendor ID.');
      }
    };

    fetchLastVendorID();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({
      ...vendor,
      [name]: value,
    });
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const validateGSTIN = (gstin) => {
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinPattern.test(gstin)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(vendor.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    if (!validateGSTIN(vendor.gstin)) {
      setEmailError('Please enter a valid GST Identification Number');
      return;
    }
    setGStINError('');

    try {
      const response = await axios.post('http://localhost:5000/api/vendors', vendor);
      console.log('Vendor added successfully: ', response.data);

      // Show success alert
      alertify.success('Vendor added successfully!');

      // Optionally, reset the form with a new vendor ID
      const newVendorID = `VEN${parseInt(vendor.vendorID.replace('VEN', ''), 10) + 1}`;
      setVendor({
        vendorID: newVendorID,
        vendorName: '',
        phoneNumber: '',
        email: '',
        companyName: '',
        gstin: '',
      });

    } catch (error) {
      console.error('Error adding vendor: ', error);
      alertify.error('Error adding vendor. Please try again.');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="container add-vendor-form">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow p-4 mt-5">
              <h2 className="text-center mb-4">Add New Vendor</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="vendorID">Vendor ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vendorID"
                    name="vendorID"
                    value={vendor.vendorID}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="vendorName">Vendor Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="vendorName"
                    name="vendorName"
                    value={vendor.vendorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={vendor.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={vendor.email}
                    onChange={handleChange}
                    required
                  />
                  {emailError && <p className="text-danger">{emailError}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="companyName"
                    name="companyName"
                    value={vendor.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gstin">GSTIN</label>
                  <input
                    type="text"
                    className="form-control"
                    id="gstin"
                    name="gstin"
                    value={vendor.gstin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-4">
                  Add Vendor
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddVendor;
