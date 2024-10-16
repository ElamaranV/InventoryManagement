import React, { useState, useEffect } from 'react';
import './VendorDetails.css';
import { FaUserAlt, FaPhoneAlt, FaEnvelope, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import Sidebar from '../Sidebar';
import alertify from 'alertifyjs';
import axios from 'axios';

const VendorDetails = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editVendorId, setEditVendorId] = useState(null);
  const [editedVendor, setEditedVendor] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/vendors');
        setVendors(response.data);
        setFilteredVendors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        setError('Failed to fetch vendor data. Please try again later.');
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleEditClick = (vendor) => {
    setEditVendorId(vendor._id);
    setEditedVendor(vendor);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested bank details fields
    if (name.startsWith('bankDetails.')) {
      const bankField = name.split('.')[1];
      setEditedVendor({
        ...editedVendor,
        bankDetails: {
          ...editedVendor.bankDetails,
          [bankField]: value,
        },
      });
    } else {
      // Handle other fields
      setEditedVendor({
        ...editedVendor,
        [name]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/vendors/${editVendorId}`, editedVendor);
      setVendors((prev) =>
        prev.map((vendor) =>
          vendor._id === editVendorId ? editedVendor : vendor
        )
      );
      alertify.success('Vendor details updated successfully!');
      setEditVendorId(null);
    } catch (error) {
      console.error('Error saving vendor:', error);
      setError('Failed to save vendor details.');
    }
  };

  const handleCancel = () => {
    setEditVendorId(null);
  };

  const handleDeleteClick = async (vendorId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vendors/${vendorId}`);
      setVendors(vendors.filter((vendor) => vendor._id !== vendorId));
      setFilteredVendors(filteredVendors.filter((vendor) => vendor._id !== vendorId));
      alertify.success('Vendor deleted successfully!');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alertify.error('Failed to delete vendor.');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = vendors.filter((vendor) =>
      vendor.vendorName.toLowerCase().includes(value) ||
      vendor.phoneNumber.toLowerCase().includes(value) ||
      vendor.email.toLowerCase().includes(value) ||
      vendor.companyName.toLowerCase().includes(value) ||
      vendor.gstin.toLowerCase().includes(value)
    );
    setFilteredVendors(filtered);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <Sidebar />
      <div className="container mt-5 vendor-details">
        <h2 className="text-center mb-4">Vendor Details</h2>

        {/* Search Bar */}
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search for vendors by name, phone, email, company, or GSTIN..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="row">
          {filteredVendors.map((vendor) => (
            <div className="col-md-4" key={vendor._id}>
              <div className="card vendor-card shadow-sm mb-4">
                <div className="card-body">
                  <div className="vendor-icon">
                    <FaUserAlt className="vendor-icon-img" />
                  </div>
                  {editVendorId === vendor._id ? (
                    <div className="edit-mode">
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="vendorName"
                        value={editedVendor.vendorName}
                        onChange={handleInputChange}
                        placeholder="Vendor Name"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="phoneNumber"
                        value={editedVendor.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                      />
                      <input
                        type="email"
                        className="form-control mb-2"
                        name="email"
                        value={editedVendor.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="companyName"
                        value={editedVendor.companyName}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="gstin"
                        value={editedVendor.gstin}
                        onChange={handleInputChange}
                        placeholder="GSTIN"
                      />
                      {/* Additional fields for billing and shipping address */}
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="billingAddress"
                        value={editedVendor.billingAddress}
                        onChange={handleInputChange}
                        placeholder="Billing Address"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="shippingAddress"
                        value={editedVendor.shippingAddress}
                        onChange={handleInputChange}
                        placeholder="Shipping Address"
                      />
                      {/* Bank details fields */}
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="bankDetails.accountHolderName"
                        value={editedVendor.bankDetails?.accountHolderName || ''}
                        onChange={handleInputChange}
                        placeholder="Account Holder Name"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="bankDetails.bankName"
                        value={editedVendor.bankDetails?.bankName || ''}
                        onChange={handleInputChange}
                        placeholder="Bank Name"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="bankDetails.accountNumber"
                        value={editedVendor.bankDetails?.accountNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Account Number"
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="bankDetails.ifsc"
                        value={editedVendor.bankDetails?.ifsc || ''}
                        onChange={handleInputChange}
                        placeholder="IFSC Code"
                      />
                      <div className="edit-buttons">
                        <button className="btn btn-success btn-sm mr-2" onClick={handleSave}>
                          <FaSave /> Save
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="vendor-details-container">
                      <h5 className="card-title">{vendor.vendorName}</h5>
                      <p className="card-text">
                        <FaPhoneAlt /> {vendor.phoneNumber}
                      </p>
                      <p className="card-text">
                        <FaEnvelope /> {vendor.email}
                      </p>
                      <p className="card-text">
                        <strong>Company:</strong> {vendor.companyName}
                      </p>
                      <div className="vendor-more-details">
                        <p className="card-text">
                          <strong>Bank Details:</strong>
                          <br />
                          {`Account Holder: ${vendor.bankDetails?.accountHolderName || ''}`}
                          <br />
                          {`Bank Name: ${vendor.bankDetails?.bankName || ''}`}
                          <br />
                          {`Account Number: ${vendor.bankDetails?.accountNumber || ''}`}
                          <br />
                          {`IFSC: ${vendor.bankDetails?.ifsc || ''}`}
                        </p>
                        <div className="vendor-buttons">
                          <button className="btn btn-primary btn-sm " onClick={() => handleEditClick(vendor)}>
                            <FaEdit /> Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(vendor._id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
