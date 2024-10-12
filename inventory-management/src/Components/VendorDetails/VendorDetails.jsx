import React, { useState, useEffect } from 'react';
import './VendorDetails.css';
import { FaUserAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import axios from 'axios';

const VendorDetails = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/vendors');
        setVendors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        setError('Failed to fetch vendor data. Please try again later.');
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Sidebar />
      <div className="container mt-4 customer-details">
        <h2 className="text-center mb-4">Vendor Details</h2>

        <div className="row">
          {vendors.map((vendor) => (
            <div className="col-md-4" key={vendor._id}>
              <div className="card customer-card mb-4">
                <div className="card-body">
                  <div className="customer-icon">
                    <FaUserAlt className="customer-icon-img" />
                  </div>
                  <h5 className="card-title">{vendor.vendorName}</h5>
                  <p className="card-text">
                    <FaPhoneAlt /> {vendor.phoneNumber}
                  </p>
                  <p className="card-text">
                    <FaEnvelope /> {vendor.email}
                  </p>
                  <p className="card-text">Company: {vendor.companyName}</p>
                  <p className="card-text">GSTIN: {vendor.gstin}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-center mb-4 mt-5">Vendor List</h3>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Vendor ID</th>
                <th>Vendor Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Company Name</th>
                <th>GSTIN</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor._id}</td>
                  <td>{vendor.vendorName}</td>
                  <td>{vendor.phoneNumber}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.companyName}</td>
                  <td>{vendor.gstin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;