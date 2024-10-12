import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './addVendor.css'; 
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import alertify from 'alertifyjs'


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
  const [vendorCount, setVendorCount] = useState(100); // Assuming starting vendor count is 100

  // Generate a Vendor ID when component mounts
  useEffect(() => {
    const generateVendorID = () => {
      const newVendorID = `VEN${vendorCount + 1}`; // Increment based on current count
      setVendor((prevVendor) => ({
        ...prevVendor,
        vendorID: newVendorID,
      }));
    };
    generateVendorID();
  }, [vendorCount]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(vendor.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    try {
      const response = await axios.post('http://localhost:5000/api/vendors', vendor);
      console.log('Vendor added successfully: ', response.data);

      // Show success alert
      alertify.success('Vendor added successfully!');

      // Increment the vendor count
      setVendorCount(prevCount => prevCount + 1); // Increment vendor count

      // Optionally, reset the form
      setVendor({
        vendorID: `VEN${vendorCount + 1}`, // Resetting vendorID for the next entry
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
