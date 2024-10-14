import React, { useState, useEffect } from 'react';
import './VendorDetails.css';
import { FaUserAlt, FaPhoneAlt, FaEnvelope, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa'; // Added FaTrash for delete icon
import Sidebar from '../Sidebar';
import alertify from 'alertifyjs';
import axios from 'axios';

const VendorDetails = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]); // To store the filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editVendorId, setEditVendorId] = useState(null);
  const [editedVendor, setEditedVendor] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // For search input

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/vendors');
        setVendors(response.data);
        setFilteredVendors(response.data); // Initially display all vendors
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
    setEditedVendor({ ...editedVendor, [name]: value });
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
      setEditVendorId(null); // Exit edit mode
    } catch (error) {
      console.error('Error saving vendor:', error);
      setError('Failed to save vendor details.');
    }
  };

  const handleCancel = () => {
    setEditVendorId(null); // Exit edit mode
  };

  const handleDeleteClick = async (vendorId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vendors/${vendorId}`);
      setVendors(vendors.filter((vendor) => vendor._id !== vendorId)); // Update state by removing the deleted vendor
      setFilteredVendors(filteredVendors.filter((vendor) => vendor._id !== vendorId)); // Update filtered results
      alertify.success('Vendor deleted successfully!');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alertify.error('Failed to delete vendor.');
    }
  };

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter vendors based on search input
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
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="phoneNumber"
                        value={editedVendor.phoneNumber}
                        onChange={handleInputChange}
                      />
                      <input
                        type="email"
                        className="form-control mb-2"
                        name="email"
                        value={editedVendor.email}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="companyName"
                        value={editedVendor.companyName}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        name="gstin"
                        value={editedVendor.gstin}
                        onChange={handleInputChange}
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
                    <div>
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
                      <p className="card-text">
                        <strong>GSTIN:</strong> {vendor.gstin}
                      </p>
                      <button className="btn btn-outline-primary btn-sm mr-2" onClick={() => handleEditClick(vendor)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteClick(vendor._id)}>
                        <FaTrash /> Delete
                      </button>
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
